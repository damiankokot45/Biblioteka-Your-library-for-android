package com.biblioteka.app.data

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.ImageDecoder
import android.net.Uri
import android.os.Build
import android.util.AtomicFile
import android.util.Base64
import java.io.File
import java.io.IOException
import java.util.UUID
import kotlin.math.max
import kotlin.math.roundToInt

/**
 * Persists the library in the app's private storage:
 * - `files/books.json` – the book list (written atomically),
 * - `files/covers/<uuid>.jpg` – downscaled cover images.
 *
 * All methods do blocking I/O and must be called off the main thread.
 */
class BookRepository(context: Context) {
    private val appContext = context.applicationContext
    private val booksFile = AtomicFile(File(appContext.filesDir, "books.json"))
    val coversDir: File = File(appContext.filesDir, "covers")

    fun hasStoredLibrary(): Boolean = booksFile.baseFile.exists()

    /** Returns the stored library, or null when the file exists but cannot be read. */
    fun load(): List<Book>? {
        if (!booksFile.baseFile.exists()) return emptyList()
        return try {
            BookJson.decodeStore(booksFile.readFully().toString(Charsets.UTF_8))
        } catch (e: Exception) {
            null
        }
    }

    /** @throws IOException when the data cannot be written (e.g. storage full). */
    fun save(books: List<Book>) {
        val bytes = BookJson.encodeStore(books).toByteArray(Charsets.UTF_8)
        val stream = booksFile.startWrite()
        try {
            stream.write(bytes)
            booksFile.finishWrite(stream)
        } catch (e: IOException) {
            booksFile.failWrite(stream)
            throw e
        }
    }

    // ------------------------------------------------------------------ covers

    fun coverFile(name: String): File = File(coversDir, name)

    /** Decodes, downscales (max 800 px) and re-encodes an image picked by the user as JPEG. */
    fun importCover(uri: Uri): String? = try {
        decodeScaled(uri)?.let { bitmap ->
            try {
                writeCover { out -> bitmap.compress(Bitmap.CompressFormat.JPEG, 85, out) }
            } finally {
                bitmap.recycle()
            }
        }
    } catch (e: Exception) {
        null
    }

    fun deleteCover(name: String?) {
        if (name.isNullOrBlank()) return
        coverFile(name).delete()
    }

    /** Removes cover files that no book references any more. */
    fun deleteOrphanCovers(books: List<Book>) {
        val referenced = books.mapNotNullTo(HashSet()) { it.coverFile }
        coversDir.listFiles()?.forEach { if (it.name !in referenced) it.delete() }
    }

    private fun writeCover(write: (java.io.OutputStream) -> Boolean): String? {
        coversDir.mkdirs()
        val name = "${UUID.randomUUID()}.jpg"
        val file = coverFile(name)
        val ok = file.outputStream().use(write)
        return if (ok) name else { file.delete(); null }
    }

    private fun decodeScaled(uri: Uri): Bitmap? {
        val resolver = appContext.contentResolver
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            // ImageDecoder honours EXIF orientation.
            val source = ImageDecoder.createSource(resolver, uri)
            return ImageDecoder.decodeBitmap(source) { decoder, info, _ ->
                decoder.allocator = ImageDecoder.ALLOCATOR_SOFTWARE
                val (w, h) = scaledSize(info.size.width, info.size.height)
                decoder.setTargetSize(w, h)
            }
        }
        val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        resolver.openInputStream(uri)?.use { BitmapFactory.decodeStream(it, null, bounds) }
        if (bounds.outWidth <= 0 || bounds.outHeight <= 0) return null
        var sample = 1
        while (max(bounds.outWidth, bounds.outHeight) / (sample * 2) >= MAX_COVER_DIM) sample *= 2
        val decoded = resolver.openInputStream(uri)?.use {
            BitmapFactory.decodeStream(it, null, BitmapFactory.Options().apply { inSampleSize = sample })
        } ?: return null
        val (w, h) = scaledSize(decoded.width, decoded.height)
        if (w == decoded.width && h == decoded.height) return decoded
        return Bitmap.createScaledBitmap(decoded, w, h, true).also { if (it !== decoded) decoded.recycle() }
    }

    private fun scaledSize(width: Int, height: Int): Pair<Int, Int> {
        val scale = minOf(1f, MAX_COVER_DIM.toFloat() / max(width, height))
        return max(1, (width * scale).roundToInt()) to max(1, (height * scale).roundToInt())
    }

    // ------------------------------------------------------------------ backups

    /** Serialises the library in the web-compatible backup format (covers embedded as base64). */
    fun exportBackup(books: List<Book>): File {
        val json = BookJson.encodeBackup(books) { book -> book.coverFile?.let(::coverToDataUrl) }
        val dir = File(appContext.cacheDir, "backups").apply { mkdirs() }
        dir.listFiles()?.forEach { it.delete() }
        val date = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.US).format(java.util.Date())
        return File(dir, "biblioteka_backup_$date.json").apply { writeText(json, Charsets.UTF_8) }
    }

    /** Converts imported books (covers as data URLs) into stored books (covers as files). */
    fun materialize(imported: List<ImportedBook>): List<Book> = imported.map { item ->
        item.book.copy(coverFile = item.coverDataUrl?.let(::dataUrlToCover))
    }

    private fun coverToDataUrl(name: String): String? {
        val file = coverFile(name)
        if (!file.exists()) return null
        return "data:image/jpeg;base64," + Base64.encodeToString(file.readBytes(), Base64.NO_WRAP)
    }

    private fun dataUrlToCover(dataUrl: String): String? {
        // Only inline images are supported: the app has no network access.
        if (!dataUrl.startsWith("data:image/")) return null
        val comma = dataUrl.indexOf(',')
        if (comma < 0 || !dataUrl.substring(0, comma).endsWith(";base64")) return null
        return try {
            val bytes = Base64.decode(dataUrl.substring(comma + 1), Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size) ?: return null
            try {
                writeCover { out -> bitmap.compress(Bitmap.CompressFormat.JPEG, 85, out) }
            } finally {
                bitmap.recycle()
            }
        } catch (e: IllegalArgumentException) {
            null
        }
    }

    // ------------------------------------------------------------------ reset

    fun clearAll() {
        booksFile.delete()
        coversDir.deleteRecursively()
    }

    private companion object {
        const val MAX_COVER_DIM = 800
    }
}

package com.biblioteka.app.data

import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

/** A book read from a backup / legacy store, with its cover still encoded as a `data:` URL. */
data class ImportedBook(val book: Book, val coverDataUrl: String?)

data class ImportResult(val books: List<ImportedBook>, val skipped: Int)

class InvalidBackupException(message: String, cause: Throwable? = null) : Exception(message, cause)

/**
 * JSON encoding of the library.
 *
 * Two flavours exist:
 * - the **internal store** (`books.json` in the app's private files) references covers by file name
 *   (`coverFile`);
 * - **backups** use the exact format of the former web/Capacitor app, where `coverImage` holds a
 *   base64 `data:` URL. This keeps old backups importable and new backups portable.
 */
object BookJson {
    /** Same limit as the web version: oversized cover strings are silently dropped on import. */
    const val MAX_COVER_CHARS = 2 * 1024 * 1024

    private const val KEY_COVER_FILE = "coverFile"
    private const val KEY_COVER_IMAGE = "coverImage"

    // ---------------------------------------------------------------- internal store

    fun encodeStore(books: List<Book>): String {
        val array = JSONArray()
        books.forEach { array.put(baseObject(it).putOpt(KEY_COVER_FILE, it.coverFile)) }
        return array.toString()
    }

    fun decodeStore(text: String): List<Book> {
        val array = try {
            JSONArray(text)
        } catch (e: JSONException) {
            throw InvalidBackupException("Corrupted library file", e)
        }
        return parseArray(array, coverKey = KEY_COVER_FILE).books.map { imported ->
            imported.book.copy(coverFile = imported.coverDataUrl)
        }
    }

    // ---------------------------------------------------------------- backups

    fun encodeBackup(books: List<Book>, coverDataUrl: (Book) -> String?): String {
        val array = JSONArray()
        books.forEach { array.put(baseObject(it).putOpt(KEY_COVER_IMAGE, coverDataUrl(it))) }
        return array.toString(2)
    }

    /**
     * Parses and validates a backup file. Invalid entries are skipped (and counted), unknown
     * keys are ignored.
     *
     * @throws InvalidBackupException when the text is not a JSON array or contains no valid book.
     */
    fun decodeBackup(text: String): ImportResult {
        val array = try {
            JSONArray(text.trim())
        } catch (e: JSONException) {
            throw InvalidBackupException("Not a JSON array", e)
        }
        val result = parseArray(array, coverKey = KEY_COVER_IMAGE)
        if (result.books.isEmpty()) throw InvalidBackupException("No valid books")
        return result
    }

    // ---------------------------------------------------------------- helpers

    private fun baseObject(book: Book): JSONObject = JSONObject().apply {
        put("id", book.id)
        put("title", book.title)
        put("author", book.author)
        put("status", book.status.name)
        put("addedAt", book.addedAt)
        putOpt("rating", book.rating)
        putOpt("notes", book.notes)
        putOpt("finishedAt", book.finishedAt)
        putOpt("isbn", book.isbn)
        putOpt("currentPage", book.currentPage)
    }

    private fun parseArray(array: JSONArray, coverKey: String): ImportResult {
        val books = ArrayList<ImportedBook>(array.length())
        val seenIds = HashSet<String>()
        var skipped = 0
        for (i in 0 until array.length()) {
            val parsed = (array.opt(i) as? JSONObject)?.let { parseBook(it, coverKey) }
            if (parsed == null || !seenIds.add(parsed.book.id)) {
                // Duplicate ids would break list keys, so they are treated as invalid entries.
                skipped++
                continue
            }
            books += parsed
        }
        return ImportResult(books, skipped)
    }

    private fun parseBook(item: JSONObject, coverKey: String): ImportedBook? {
        val id = item.string("id")?.trim()?.takeIf { it.isNotEmpty() } ?: return null
        val title = item.string("title")?.trim()?.takeIf { it.isNotEmpty() } ?: return null
        val author = item.string("author")?.trim() ?: return null
        val status = item.string("status")?.let { s -> BookStatus.entries.firstOrNull { it.name == s } } ?: return null
        val addedAt = item.number("addedAt")?.toLong() ?: return null

        val book = Book(
            id = id,
            title = title,
            author = author,
            status = status,
            addedAt = addedAt,
            rating = item.number("rating")?.toDouble()?.takeIf { it in 1.0..5.0 }?.toInt(),
            notes = item.string("notes")?.takeIf { it.isNotEmpty() },
            finishedAt = item.number("finishedAt")?.toLong(),
            isbn = item.string("isbn")?.takeIf { it.isNotEmpty() },
            currentPage = item.number("currentPage")?.toDouble()?.takeIf { it >= 0 }?.toInt(),
        )
        val cover = item.string(coverKey)?.takeIf { it.isNotEmpty() && it.length <= MAX_COVER_CHARS }
        return ImportedBook(book, cover)
    }

    private fun JSONObject.string(key: String): String? = opt(key) as? String
    private fun JSONObject.number(key: String): Number? = (opt(key) as? Number)?.takeIf { !it.toDouble().isNaN() }
}

package com.biblioteka.app.ui

import android.app.Application
import android.net.Uri
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.biblioteka.app.R
import com.biblioteka.app.data.Book
import com.biblioteka.app.data.BookDraft
import com.biblioteka.app.data.BookJson
import com.biblioteka.app.data.BookOperations
import com.biblioteka.app.data.BookRepository
import com.biblioteka.app.data.BookStatus
import com.biblioteka.app.data.InvalidBackupException
import com.biblioteka.app.data.LegacyData
import com.biblioteka.app.data.LegacyWebStorage
import com.biblioteka.app.data.AppSettings
import com.biblioteka.app.data.SettingsStore
import kotlinx.coroutines.NonCancellable
import kotlinx.coroutines.asCoroutineDispatcher
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File
import java.io.IOException
import java.util.UUID
import java.util.concurrent.Executors

/** A modal message (the web version used `window.alert`). */
data class UiMessage(val text: Int, val count: Int? = null, val skipped: Int = 0)

class LibraryViewModel(app: Application) : AndroidViewModel(app) {
    private val repository = BookRepository(app)
    private val settingsStore = SettingsStore(app)

    private val io get() = ioDispatcher

    var books by mutableStateOf<List<Book>>(emptyList())
        private set
    /** The UI is shown only once the library is loaded, so no edit can race the initial read. */
    var isLoaded by mutableStateOf(false)
        private set
    var settings by mutableStateOf(settingsStore.load())
        private set
    var readingStartedAt by mutableStateOf(validReadingStart())
        private set
    var message by mutableStateOf<UiMessage?>(null)
        private set

    val coversDir: File get() = repository.coversDir

    /** True when the legacy WebView storage should be checked (first launch of the native app). */
    val needsLegacyMigration: Boolean get() = !settingsStore.legacyMigrationDone

    init {
        viewModelScope.launch {
            val loaded = withContext(io) {
                // Only clean up covers when the library was read successfully.
                repository.load()?.also { repository.deleteOrphanCovers(it) }
            }
            books = loaded.orEmpty()
            isLoaded = true
        }
    }

    // ------------------------------------------------------------------ books

    fun saveBook(existing: Book?, draft: BookDraft) {
        val book = BookOperations.applyDraft(existing, draft, System.currentTimeMillis()) { UUID.randomUUID().toString() }
        val oldCover = existing?.coverFile
        update(BookOperations.upsert(books, book))
        if (oldCover != null && oldCover != book.coverFile) deleteCoverLater(oldCover)
    }

    fun deleteBook(book: Book) {
        update(books.filterNot { it.id == book.id })
        deleteCoverLater(book.coverFile)
    }

    fun moveBook(bookId: String, status: BookStatus, index: Int) {
        update(BookOperations.moveBook(books, bookId, status, index, System.currentTimeMillis()))
    }

    fun logReadingSession(bookId: String, page: Int) {
        update(BookOperations.logReadingSession(books, bookId, page))
    }

    private fun update(newBooks: List<Book>) {
        books = newBooks
        persist(newBooks)
    }

    private fun persist(snapshot: List<Book>) {
        viewModelScope.launch {
            // NonCancellable: a save must not be lost when the screen is closed right after an edit.
            val ok = withContext(io + NonCancellable) {
                try {
                    repository.save(snapshot); true
                } catch (e: IOException) {
                    false
                }
            }
            if (!ok) message = UiMessage(R.string.storage_full_error)
        }
    }

    // ------------------------------------------------------------------ covers

    fun importCover(uri: Uri, onResult: (String?) -> Unit) {
        viewModelScope.launch {
            onResult(withContext(io) { repository.importCover(uri) })
        }
    }

    /** Deletes a cover that was picked in the form but never saved. */
    fun discardCover(name: String?) = deleteCoverLater(name)

    private fun deleteCoverLater(name: String?) {
        if (name == null) return
        viewModelScope.launch(io + NonCancellable) { repository.deleteCover(name) }
    }

    // ------------------------------------------------------------------ backup

    fun exportBackup(onReady: (File) -> Unit) {
        val snapshot = books
        viewModelScope.launch {
            val file = withContext(io) {
                try {
                    repository.exportBackup(snapshot)
                } catch (e: IOException) {
                    null
                }
            }
            if (file != null) onReady(file) else message = UiMessage(R.string.storage_full_error)
        }
    }

    fun importBackup(uri: Uri) {
        val resolver = getApplication<Application>().contentResolver
        viewModelScope.launch {
            val result = withContext(io) {
                try {
                    val text = resolver.openInputStream(uri)?.use { it.readBytes().toString(Charsets.UTF_8) }
                        ?: throw IOException("Cannot open $uri")
                    val parsed = BookJson.decodeBackup(text)
                    val imported = repository.materialize(parsed.books)
                    repository.save(imported)
                    repository.deleteOrphanCovers(imported)
                    Result.success(imported to parsed.skipped)
                } catch (e: Exception) {
                    Result.failure(e)
                }
            }
            result.onSuccess { (imported, skipped) ->
                books = imported
                message = UiMessage(R.string.import_success, imported.size, skipped)
            }.onFailure { e ->
                message = UiMessage(if (e is InvalidBackupException) R.string.import_format_error else R.string.import_error)
            }
        }
    }

    fun clearAllData() {
        books = emptyList()
        readingStartedAt = null
        settingsStore.clearReadingState()
        viewModelScope.launch(io + NonCancellable) { repository.clearAll() }
    }

    fun dismissMessage() {
        message = null
    }

    // ------------------------------------------------------------------ legacy migration

    /** Imports the library of the former Capacitor build. Returns the legacy UI language, if any. */
    fun applyLegacyData(data: LegacyData?, onLanguage: (String) -> Unit) {
        settingsStore.legacyMigrationDone = true
        if (data == null) return
        val (mode, color, language) = LegacyWebStorage.parseSettings(data.settingsJson)
        if (mode != null || color != null) {
            updateSettings(settings.copy(themeMode = mode ?: settings.themeMode, colorTheme = color ?: settings.colorTheme))
        }
        language?.let(onLanguage)
        val booksJson = data.booksJson ?: return
        viewModelScope.launch {
            val migrated = withContext(io) {
                if (repository.hasStoredLibrary()) return@withContext null
                try {
                    repository.materialize(BookJson.decodeBackup(booksJson).books).also { repository.save(it) }
                } catch (e: Exception) {
                    null
                }
            }
            if (migrated != null && books.isEmpty()) books = migrated
        }
    }

    // ------------------------------------------------------------------ settings & timer

    fun updateSettings(newSettings: AppSettings) {
        settings = newSettings
        settingsStore.save(newSettings)
    }

    fun startReading() {
        val now = System.currentTimeMillis()
        readingStartedAt = now
        settingsStore.readingStartedAt = now
    }

    fun stopReading() {
        readingStartedAt = null
        settingsStore.readingStartedAt = null
    }

    /** Timers older than 6 hours are treated as abandoned (same as the web version). */
    private fun validReadingStart(): Long? {
        val start = settingsStore.readingStartedAt ?: return null
        val elapsed = System.currentTimeMillis() - start
        return if (elapsed in 0..MAX_SESSION_MS) start else {
            settingsStore.readingStartedAt = null
            null
        }
    }

    companion object {
        const val MAX_SESSION_MS = 6 * 60 * 60 * 1000L

        /** All disk I/O runs on one process-wide thread so writes are applied in order. */
        private val ioDispatcher = Executors.newSingleThreadExecutor { r ->
            Thread(r, "biblioteka-io").apply { isDaemon = true }
        }.asCoroutineDispatcher()
    }
}

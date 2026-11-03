package com.biblioteka.app.data

enum class BookStatus { TO_READ, READING, READ }

/**
 * A book in the library.
 *
 * [coverFile] is the file name of the cover inside the app's private `covers/` directory
 * (covers are stored as JPEG files rather than base64 strings; they are only converted to
 * base64 `data:` URLs inside JSON backups, which keeps backups compatible with the web version).
 */
data class Book(
    val id: String,
    val title: String,
    val author: String,
    val status: BookStatus,
    val addedAt: Long,
    val rating: Int? = null,
    val notes: String? = null,
    val finishedAt: Long? = null,
    val coverFile: String? = null,
    val isbn: String? = null,
    val currentPage: Int? = null,
)

/** Editable fields of a book, as produced by the add/edit form. */
data class BookDraft(
    val title: String,
    val author: String,
    val status: BookStatus,
    val rating: Int?,
    val notes: String,
    val coverFile: String?,
)

enum class SortOption { DATE, TITLE, AUTHOR, RATING }

package com.biblioteka.app.data

import java.text.Collator
import java.util.Calendar
import java.util.Locale

/** Pure, side-effect free operations on the book list (ported 1:1 from the web version). */
object BookOperations {

    /** Creates a new book or applies the form [draft] onto [existing]. */
    fun applyDraft(existing: Book?, draft: BookDraft, now: Long, newId: () -> String): Book {
        // finishedAt is stamped when a book becomes READ and cleared when it leaves READ.
        val finishedAt = when {
            draft.status != BookStatus.READ -> null
            existing?.status != BookStatus.READ -> now
            else -> existing.finishedAt
        }
        val rating = if (draft.status == BookStatus.READ) draft.rating?.takeIf { it in 1..5 } else null
        val notes = draft.notes.trim().ifEmpty { null }
        return existing?.copy(
            title = draft.title.trim(),
            author = draft.author.trim(),
            status = draft.status,
            rating = rating,
            notes = notes,
            coverFile = draft.coverFile,
            finishedAt = finishedAt,
        ) ?: Book(
            id = newId(),
            title = draft.title.trim(),
            author = draft.author.trim(),
            status = draft.status,
            addedAt = now,
            rating = rating,
            notes = notes,
            finishedAt = finishedAt,
            coverFile = draft.coverFile,
        )
    }

    /** Inserts or replaces [book] (matched by id), keeping the list order. */
    fun upsert(books: List<Book>, book: Book): List<Book> {
        val index = books.indexOfFirst { it.id == book.id }
        return if (index == -1) books + book else books.toMutableList().also { it[index] = book }
    }

    /**
     * Moves a book to [newStatus] at position [newIndex] among the books that already have
     * that status (the index is computed without the moved book itself).
     */
    fun moveBook(books: List<Book>, bookId: String, newStatus: BookStatus, newIndex: Int, now: Long): List<Book> {
        val bookIndex = books.indexOfFirst { it.id == bookId }
        if (bookIndex == -1) return books
        val old = books[bookIndex]
        val finishedAt = when {
            newStatus == BookStatus.READ && old.status != BookStatus.READ -> now
            newStatus != BookStatus.READ -> null
            else -> old.finishedAt
        }
        val moved = old.copy(status = newStatus, finishedAt = finishedAt)

        val result = books.toMutableList()
        result.removeAt(bookIndex)
        val targetStatusBooks = result.filter { it.status == newStatus }
        if (newIndex < 0 || newIndex >= targetStatusBooks.size) {
            result.add(moved)
        } else {
            val anchorId = targetStatusBooks[newIndex].id
            result.add(result.indexOfFirst { it.id == anchorId }, moved)
        }
        return result
    }

    /** Records the page reached in a reading session; the book becomes "Reading". */
    fun logReadingSession(books: List<Book>, bookId: String, page: Int): List<Book> =
        books.map {
            if (it.id == bookId) it.copy(status = BookStatus.READING, currentPage = page, finishedAt = null) else it
        }

    fun search(books: List<Book>, query: String): List<Book> {
        val q = query.trim().lowercase()
        if (q.isEmpty()) return books
        return books.filter {
            it.title.lowercase().contains(q) ||
                it.author.lowercase().contains(q) ||
                (it.isbn?.lowercase()?.contains(q) == true)
        }
    }

    fun filterAndSort(books: List<Book>, status: BookStatus, sort: SortOption, locale: Locale = Locale.getDefault()): List<Book> {
        val collator = Collator.getInstance(locale)
        val filtered = books.filter { it.status == status }
        return when (sort) {
            SortOption.TITLE -> filtered.sortedWith { a, b -> collator.compare(a.title, b.title) }
            SortOption.AUTHOR -> filtered.sortedWith { a, b -> collator.compare(a.author, b.author) }
            SortOption.RATING -> filtered.sortedByDescending { it.rating ?: 0 }
            SortOption.DATE -> filtered.sortedByDescending { it.addedAt }
        }
    }
}

data class ReadingStats(
    val readCount: Int,
    val addedCount: Int,
    val pagesRead: Int,
    val timeSpentHours: Int,
    /** Books finished in each month (January..December) of the current year. */
    val monthly: List<Int>,
) {
    companion object {
        // Same heuristics as the web version: ~320 pages per finished book, ~45 pages per hour.
        private const val PAGES_PER_BOOK = 320
        private const val PAGES_PER_HOUR = 45

        fun compute(books: List<Book>, now: Long = System.currentTimeMillis()): ReadingStats {
            val cal = Calendar.getInstance().apply { timeInMillis = now }
            val year = cal.get(Calendar.YEAR)
            fun startOf(y: Int, month: Int): Long = Calendar.getInstance().apply {
                clear()
                set(y, month, 1, 0, 0, 0)
            }.timeInMillis

            val yearStart = startOf(year, Calendar.JANUARY)
            val yearEnd = startOf(year + 1, Calendar.JANUARY)
            val inYear = { t: Long? -> t != null && t >= yearStart && t < yearEnd }

            val readThisYear = books.count { inYear(it.finishedAt) }
            val addedThisYear = books.count { inYear(it.addedAt) }
            val pagesFromCurrent = books.filter { it.status == BookStatus.READING }.sumOf { it.currentPage ?: 0 }
            val pagesRead = readThisYear * PAGES_PER_BOOK + pagesFromCurrent
            val monthly = (0 until 12).map { m ->
                val start = startOf(year, m)
                val end = if (m == 11) yearEnd else startOf(year, m + 1)
                books.count { val f = it.finishedAt; f != null && f >= start && f < end }
            }
            return ReadingStats(
                readCount = readThisYear,
                addedCount = addedThisYear,
                pagesRead = pagesRead,
                timeSpentHours = Math.round(pagesRead / PAGES_PER_HOUR.toDouble()).toInt(),
                monthly = monthly,
            )
        }
    }
}

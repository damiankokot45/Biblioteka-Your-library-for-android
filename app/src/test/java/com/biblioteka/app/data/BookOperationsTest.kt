package com.biblioteka.app.data

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test
import java.util.Calendar
import java.util.Locale

class BookOperationsTest {

    private fun book(id: String, status: BookStatus, title: String = id, addedAt: Long = 0, finishedAt: Long? = null) =
        Book(id = id, title = title, author = "A", status = status, addedAt = addedAt, finishedAt = finishedAt)

    @Test
    fun `new READ book gets finishedAt and rating`() {
        val draft = BookDraft("  Dune ", " Herbert ", BookStatus.READ, 4, "  ", null)
        val b = BookOperations.applyDraft(null, draft, now = 100, newId = { "x" })
        assertEquals("x", b.id)
        assertEquals("Dune", b.title)
        assertEquals("Herbert", b.author)
        assertEquals(100L, b.finishedAt)
        assertEquals(100L, b.addedAt)
        assertEquals(4, b.rating)
        assertNull(b.notes)
    }

    @Test
    fun `editing keeps finishedAt while READ and clears it otherwise`() {
        val read = book("1", BookStatus.READ, finishedAt = 5)
        val stillRead = BookOperations.applyDraft(read, BookDraft("t", "a", BookStatus.READ, 3, "", null), 99) { "n" }
        assertEquals(5L, stillRead.finishedAt)
        val back = BookOperations.applyDraft(read, BookDraft("t", "a", BookStatus.READING, 3, "", null), 99) { "n" }
        assertNull(back.finishedAt)
        assertNull(back.rating)
        assertEquals("1", back.id)
    }

    @Test
    fun `move inserts before the book at the target index of the destination shelf`() {
        val books = listOf(
            book("a", BookStatus.TO_READ), book("b", BookStatus.READ), book("c", BookStatus.TO_READ), book("d", BookStatus.READ),
        )
        val moved = BookOperations.moveBook(books, "a", BookStatus.READ, 1, now = 7)
        assertEquals(listOf("b", "c", "a", "d"), moved.map { it.id })
        assertEquals(BookStatus.READ, moved.first { it.id == "a" }.status)
        assertEquals(7L, moved.first { it.id == "a" }.finishedAt)

        val toEnd = BookOperations.moveBook(books, "b", BookStatus.TO_READ, 10, now = 7)
        assertEquals(listOf("a", "c", "d", "b"), toEnd.map { it.id })
        assertNull(toEnd.last().finishedAt)
    }

    @Test
    fun `reorder within the same shelf`() {
        val books = listOf(book("a", BookStatus.TO_READ), book("b", BookStatus.TO_READ), book("c", BookStatus.TO_READ))
        assertEquals(listOf("b", "c", "a"), BookOperations.moveBook(books, "a", BookStatus.TO_READ, 2, 0).map { it.id })
        assertEquals(listOf("c", "a", "b"), BookOperations.moveBook(books, "c", BookStatus.TO_READ, 0, 0).map { it.id })
    }

    @Test
    fun `reading session marks book as reading`() {
        val books = listOf(book("a", BookStatus.TO_READ))
        val r = BookOperations.logReadingSession(books, "a", 42).single()
        assertEquals(BookStatus.READING, r.status)
        assertEquals(42, r.currentPage)
    }

    @Test
    fun `search matches title author and isbn case-insensitively`() {
        val books = listOf(
            book("1", BookStatus.READ, title = "Solaris"),
            book("2", BookStatus.READ, title = "Other").copy(isbn = "978-83"),
        )
        assertEquals(listOf("1"), BookOperations.search(books, "sOLa").map { it.id })
        assertEquals(listOf("2"), BookOperations.search(books, "978").map { it.id })
        assertEquals(2, BookOperations.search(books, "  ").size)
    }

    @Test
    fun `sorting uses locale collation`() {
        val books = listOf(
            book("1", BookStatus.READ, title = "Żółw"),
            book("2", BookStatus.READ, title = "zebra"),
            book("3", BookStatus.READ, title = "Ala"),
        )
        val sorted = BookOperations.filterAndSort(books, BookStatus.READ, SortOption.TITLE, Locale.forLanguageTag("pl"))
        assertEquals(listOf("Ala", "zebra", "Żółw"), sorted.map { it.title })
    }

    @Test
    fun `stats count this year only`() {
        val cal = Calendar.getInstance().apply { clear(); set(2026, Calendar.MARCH, 10) }
        val march = cal.timeInMillis
        cal.set(2025, Calendar.DECEMBER, 31)
        val lastYear = cal.timeInMillis
        val books = listOf(
            book("1", BookStatus.READ, addedAt = march, finishedAt = march),
            book("2", BookStatus.READ, addedAt = lastYear, finishedAt = lastYear),
            book("3", BookStatus.READING, addedAt = march).copy(currentPage = 40),
        )
        val stats = ReadingStats.compute(books, now = march)
        assertEquals(1, stats.readCount)
        assertEquals(2, stats.addedCount)
        assertEquals(360, stats.pagesRead)
        assertEquals(8, stats.timeSpentHours)
        assertEquals(1, stats.monthly[Calendar.MARCH])
        assertEquals(1, stats.monthly.sum())
    }
}

package com.biblioteka.app.data

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertThrows
import org.junit.Test

class BookJsonTest {

    @Test
    fun `web backup is imported with validation`() {
        val json = """
            [
              {"id":"1","title":" Dune ","author":"Herbert","status":"READ","addedAt":1700000000000,
               "rating":5,"notes":"great","finishedAt":1700000001000,"coverImage":"data:image/jpeg;base64,AAAA",
               "isbn":"","currentPage":12,"unknown":true},
              {"id":"2","title":"No status","author":"x","addedAt":1},
              {"id":"3","title":"Bad rating","author":"x","status":"TO_READ","addedAt":1,"rating":9},
              {"id":"1","title":"Duplicate","author":"x","status":"TO_READ","addedAt":1},
              "garbage",
              {"id":"4","title":"","author":"x","status":"TO_READ","addedAt":1}
            ]
        """.trimIndent()
        val result = BookJson.decodeBackup(json)
        assertEquals(listOf("1", "3"), result.books.map { it.book.id })
        assertEquals(4, result.skipped)

        val dune = result.books[0]
        assertEquals("Dune", dune.book.title)
        assertEquals(5, dune.book.rating)
        assertEquals(12, dune.book.currentPage)
        assertNull(dune.book.isbn)
        assertEquals("data:image/jpeg;base64,AAAA", dune.coverDataUrl)
        assertNull(result.books[1].book.rating)
    }

    @Test
    fun `invalid backups are rejected`() {
        assertThrows(InvalidBackupException::class.java) { BookJson.decodeBackup("{\"books\":[]}") }
        assertThrows(InvalidBackupException::class.java) { BookJson.decodeBackup("not json") }
        assertThrows(InvalidBackupException::class.java) { BookJson.decodeBackup("[{\"id\":1}]") }
    }

    @Test
    fun `oversized covers are dropped`() {
        val big = "data:image/jpeg;base64," + "A".repeat(BookJson.MAX_COVER_CHARS)
        val json = """[{"id":"1","title":"t","author":"a","status":"TO_READ","addedAt":1,"coverImage":"$big"}]"""
        assertNull(BookJson.decodeBackup(json).books.single().coverDataUrl)
    }

    @Test
    fun `store and backup round-trip`() {
        val books = listOf(
            Book("1", "Solaris", "Lem", BookStatus.READ, 10, rating = 4, notes = "n", finishedAt = 20, coverFile = "c.jpg"),
            Book("2", "Ubik", "Dick", BookStatus.READING, 11, currentPage = 30),
        )
        assertEquals(books, BookJson.decodeStore(BookJson.encodeStore(books)))

        val backup = BookJson.encodeBackup(books) { b -> b.coverFile?.let { "data:image/jpeg;base64,QQ==" } }
        val restored = BookJson.decodeBackup(backup)
        assertEquals(books.map { it.copy(coverFile = null) }, restored.books.map { it.book })
        assertEquals("data:image/jpeg;base64,QQ==", restored.books[0].coverDataUrl)
        assertNull(restored.books[1].coverDataUrl)
    }

    @Test
    fun `seed palette generates distinct light and dark schemes`() {
        val seed = SeedPalette.parseHex("#e09b69")!!
        val light = SeedPalette.fromSeed(seed, isDark = false)
        val dark = SeedPalette.fromSeed(seed, isDark = true)
        assertNotEquals(light.surface, dark.surface)
        assertEquals("#e09b69", SeedPalette.toHex(seed))
        assertNull(SeedPalette.parseHex("#12345"))
        assertNull(SeedPalette.parseHex("zzzzzz"))
    }
}

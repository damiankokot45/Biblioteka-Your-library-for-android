package com.biblioteka.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGesturesAfterLongPress
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.boundsInRoot
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.positionInRoot
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.biblioteka.app.R
import com.biblioteka.app.data.Book
import com.biblioteka.app.data.BookStatus
import kotlin.math.abs
import kotlin.math.roundToInt

/** Visual density of the spines, which shrink as a shelf fills up. */
private data class SpineStyle(
    val width: Dp,
    val border: Dp,
    val padding: Dp,
    val titleSize: TextUnit,
    val titleLines: Int,
    val authorSize: TextUnit?,
    val heights: List<Dp>,
)

private fun spineStyleFor(count: Int): SpineStyle = when {
    count > 15 -> SpineStyle(64.dp, 3.dp, 4.dp, 8.sp, 2, null, listOf(80.dp, 96.dp, 112.dp, 80.dp, 96.dp))
    count > 10 -> SpineStyle(80.dp, 4.dp, 6.dp, 10.sp, 3, null, listOf(96.dp, 112.dp, 128.dp, 96.dp, 112.dp))
    count > 5 -> SpineStyle(96.dp, 6.dp, 8.dp, 11.sp, 3, 9.sp, listOf(112.dp, 128.dp, 144.dp, 112.dp, 128.dp))
    else -> SpineStyle(112.dp, 8.dp, 12.dp, 12.sp, 4, 10.sp, listOf(128.dp, 144.dp, 160.dp, 136.dp, 152.dp))
}

private data class DragState(
    val book: Book,
    val style: SpineStyle,
    /** Pointer position in root coordinates. */
    val pointer: Offset,
    /** Where inside the spine the book was grabbed. */
    val grab: Offset,
)

/**
 * The three bookshelves. Tap a spine to open the book, long-press and drag it to reorder it or
 * to move it onto another shelf.
 *
 * [onMoveBook] receives the target shelf and the id of the book the dragged one should be placed
 * before (`null` = at the end of the shelf).
 */
@Composable
fun BookShelf(
    books: List<Book>,
    onBookClick: (Book) -> Unit,
    onMoveBook: (bookId: String, status: BookStatus, beforeBookId: String?) -> Unit,
    modifier: Modifier = Modifier,
) {
    val currentBooks by rememberUpdatedState(books)
    val currentOnMove by rememberUpdatedState(onMoveBook)
    val haptics = LocalHapticFeedback.current

    var containerOrigin by remember { mutableStateOf(Offset.Zero) }
    val shelfBounds = remember { mutableStateMapOf<BookStatus, Rect>() }
    val spineBounds = remember { HashMap<String, Rect>() }
    var drag by remember { mutableStateOf<DragState?>(null) }

    fun targetShelf(pointer: Offset): BookStatus? =
        shelfBounds.entries.firstOrNull { pointer.y >= it.value.top && pointer.y <= it.value.bottom }?.key
            ?: shelfBounds.entries.minByOrNull { abs(it.value.center.y - pointer.y) }?.key

    fun drop(state: DragState) {
        val target = targetShelf(state.pointer) ?: return
        val others = currentBooks.filter { it.status == target && it.id != state.book.id }
        val before = others.firstOrNull { (spineBounds[it.id]?.center?.x ?: Float.MAX_VALUE) > state.pointer.x }
        if (target == state.book.status) {
            val shelf = currentBooks.filter { it.status == target }
            val nextInShelf = shelf.getOrNull(shelf.indexOfFirst { it.id == state.book.id } + 1)
            if (before?.id == nextInShelf?.id) return // dropped where it already was
        }
        currentOnMove(state.book.id, target, before?.id)
    }

    val dragModifier = { book: Book, style: SpineStyle ->
        Modifier
            .onGloballyPositioned { coords ->
                val pos = coords.positionInRoot()
                spineBounds[book.id] = Rect(pos, Size(coords.size.width.toFloat(), coords.size.height.toFloat()))
            }
            .pointerInput(book, style) {
                detectDragGesturesAfterLongPress(
                    onDragStart = { offset ->
                        spineBounds[book.id]?.let { bounds ->
                            haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                            drag = DragState(book, style, pointer = bounds.topLeft + offset, grab = offset)
                        }
                    },
                    onDrag = { change, amount ->
                        change.consume()
                        drag = drag?.let { it.copy(pointer = it.pointer + amount) }
                    },
                    onDragEnd = {
                        drag?.let(::drop)
                        drag = null
                    },
                    onDragCancel = { drag = null },
                )
            }
    }

    @Composable
    fun ShelfRow(status: BookStatus, label: String) {
        val shelfBooks = books.filter { it.status == status }
        val style = spineStyleFor(shelfBooks.size)
        val isHovered = drag?.let { targetShelf(it.pointer) } == status

        Column(Modifier.fillMaxWidth().padding(top = 16.dp, bottom = 8.dp)) {
            Row(
                Modifier.fillMaxWidth().padding(horizontal = 8.dp).padding(bottom = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Box(Modifier.size(width = 8.dp, height = 24.dp).clip(RoundedCornerShape(50)).background(MaterialTheme.colorScheme.primary))
                Spacer(Modifier.width(8.dp))
                Text(label, style = MaterialTheme.typography.titleMedium, modifier = Modifier.weight(1f))
                Surface(shape = RoundedCornerShape(50), color = MaterialTheme.colorScheme.secondaryContainer) {
                    Text(
                        shelfBooks.size.toString(),
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                    )
                }
            }

            Box(
                Modifier
                    .fillMaxWidth()
                    .heightIn(min = 160.dp)
                    .onGloballyPositioned { shelfBounds[status] = it.boundsInRoot() }
                    .clip(RoundedCornerShape(12.dp))
                    .background(if (isHovered) MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f) else Color.Transparent),
                contentAlignment = Alignment.BottomStart,
            ) {
                if (shelfBooks.isEmpty()) {
                    Text(
                        stringResource(R.string.empty_shelf_title),
                        modifier = Modifier.align(Alignment.Center),
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f),
                    )
                } else {
                    Row(
                        Modifier
                            .horizontalScroll(rememberScrollState())
                            .padding(horizontal = 16.dp)
                            .padding(bottom = 8.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalAlignment = Alignment.Bottom,
                    ) {
                        shelfBooks.forEach { book ->
                            key(book.id) {
                                Spine(
                                    book = book,
                                    style = style,
                                    modifier = dragModifier(book, style)
                                        .graphicsLayer { alpha = if (drag?.book?.id == book.id) 0.3f else 1f }
                                        .clickable { onBookClick(book) },
                                )
                            }
                        }
                        Spacer(Modifier.width(32.dp))
                    }
                }
            }

            // The shelf board.
            Box(
                Modifier
                    .fillMaxWidth()
                    .height(16.dp)
                    .background(MaterialTheme.colorScheme.surfaceVariant),
            )
            Box(
                Modifier
                    .fillMaxWidth(0.98f)
                    .height(8.dp)
                    .align(Alignment.CenterHorizontally)
                    .clip(RoundedCornerShape(bottomStart = 6.dp, bottomEnd = 6.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f)),
            )
        }
    }

    Box(modifier.onGloballyPositioned { containerOrigin = it.positionInRoot() }) {
        Column(Modifier.fillMaxWidth().padding(top = 8.dp, bottom = 16.dp)) {
            ShelfRow(BookStatus.TO_READ, stringResource(R.string.status_to_read))
            ShelfRow(BookStatus.READING, stringResource(R.string.status_reading))
            ShelfRow(BookStatus.READ, stringResource(R.string.status_read))
        }

        // The spine following the finger while dragging.
        drag?.let { state ->
            val density = LocalDensity.current
            val topLeft = state.pointer - state.grab - containerOrigin
            Spine(
                book = state.book,
                style = state.style,
                modifier = Modifier
                    .offset { IntOffset(topLeft.x.roundToInt(), topLeft.y.roundToInt()) }
                    .graphicsLayer {
                        scaleX = 1.05f
                        scaleY = 1.05f
                        alpha = 0.9f
                        shadowElevation = with(density) { 16.dp.toPx() }
                    },
            )
        }
    }
}

@Composable
private fun Spine(book: Book, style: SpineStyle, modifier: Modifier = Modifier) {
    val colors = MaterialTheme.colorScheme
    val palette = listOf(
        Triple(colors.primaryContainer, colors.onPrimaryContainer, colors.primary),
        Triple(colors.secondaryContainer, colors.onSecondaryContainer, colors.secondary),
        Triple(colors.tertiaryContainer, colors.onTertiaryContainer, colors.tertiary),
        Triple(colors.surfaceVariant, colors.onSurfaceVariant, colors.outline),
    )
    val (container, content, border) = palette[book.id.last().code % palette.size]
    val height = style.heights[book.id.first().code % style.heights.size]
    val cover = coverFileOf(book)
    val textColor = if (cover != null) Color.White else content
    val shadow = if (cover != null) Shadow(Color.Black.copy(alpha = 0.6f), Offset(0f, 1f), 4f) else null

    Box(
        modifier
            .size(width = style.width, height = height)
            .clip(RoundedCornerShape(topStart = 2.dp, bottomStart = 2.dp, topEnd = 6.dp, bottomEnd = 6.dp))
            .background(container),
    ) {
        if (cover != null) {
            CoverImage(file = cover, modifier = Modifier.matchParentSize(), alpha = 0.8f, contentDescription = book.title)
            Box(Modifier.matchParentSize().background(Color.Black.copy(alpha = 0.15f)))
        } else {
            Box(
                Modifier
                    .matchParentSize()
                    .background(Brush.horizontalGradient(listOf(Color.Black.copy(alpha = 0.10f), Color.Transparent))),
            )
        }
        Box(Modifier.width(style.border).fillMaxHeight().background(border))
        Column(
            Modifier
                .matchParentSize()
                .padding(start = style.border + style.padding, end = style.padding, top = style.padding, bottom = style.padding),
            verticalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(
                book.title,
                color = textColor,
                style = TextStyle(fontSize = style.titleSize, fontWeight = FontWeight.Bold, lineHeight = style.titleSize * 1.15f, shadow = shadow),
                maxLines = style.titleLines,
                overflow = TextOverflow.Ellipsis,
            )
            style.authorSize?.let { size ->
                Text(
                    book.author,
                    color = textColor.copy(alpha = 0.85f),
                    style = TextStyle(fontSize = size, shadow = shadow),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
    }
}

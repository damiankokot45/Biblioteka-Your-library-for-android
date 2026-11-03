package com.biblioteka.app.ui.sheets

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Check
import androidx.compose.material.icons.outlined.Close
import androidx.compose.material.icons.outlined.ExpandMore
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.biblioteka.app.R
import com.biblioteka.app.data.Book
import com.biblioteka.app.data.BookStatus
import com.biblioteka.app.ui.components.CoverImage
import com.biblioteka.app.ui.components.coverFileOf
import com.biblioteka.app.ui.theme.OnReadingAccent
import com.biblioteka.app.ui.theme.ReadingAccent
import kotlinx.coroutines.delay

// The session dialog keeps the warm dark look of the original regardless of the app theme.
private val DialogBg = Color(0xFF1F1E1B)
private val FieldBg = Color(0xFF2A2925)
private val MenuBg = Color(0xFF35332F)

@Composable
fun ReadingSessionDialog(books: List<Book>, onDismiss: () -> Unit, onSave: (bookId: String, page: Int) -> Unit) {
    val available = remember(books) { books.filter { it.status == BookStatus.TO_READ || it.status == BookStatus.READING } }
    var selectedId by rememberSaveable { mutableStateOf<String?>(null) }
    var page by rememberSaveable { mutableStateOf("") }
    var dropdownOpen by rememberSaveable { mutableStateOf(false) }
    var success by rememberSaveable { mutableStateOf(false) }
    val selected = available.firstOrNull { it.id == selectedId }

    LaunchedEffect(success) {
        if (success) {
            delay(1500)
            val id = selectedId
            val p = page.toIntOrNull()
            if (id != null && p != null) onSave(id, p)
        }
    }

    Dialog(onDismissRequest = onDismiss) {
        Surface(shape = RoundedCornerShape(32.dp), color = DialogBg, contentColor = Color.White) {
            Box {
                AnimatedContent(targetState = success, transitionSpec = { fadeIn() togetherWith fadeOut() }, label = "session") { done ->
                    if (done) {
                        SuccessContent(selected?.title.orEmpty())
                    } else {
                        Column(
                            Modifier.fillMaxWidth().heightIn(min = 400.dp).padding(32.dp),
                            verticalArrangement = Arrangement.spacedBy(28.dp, Alignment.CenterVertically),
                        ) {
                            Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                                Box(
                                    Modifier.size(80.dp).clip(CircleShape).background(ReadingAccent.copy(alpha = 0.1f)),
                                    contentAlignment = Alignment.Center,
                                ) {
                                    Icon(Icons.Outlined.Check, contentDescription = null, tint = ReadingAccent, modifier = Modifier.size(40.dp))
                                }
                                Spacer(Modifier.size(24.dp))
                                Text(
                                    stringResource(R.string.update_progress_message),
                                    fontSize = 21.sp,
                                    fontWeight = FontWeight.Medium,
                                    textAlign = TextAlign.Center,
                                )
                            }

                            if (available.isEmpty()) {
                                Text(
                                    stringResource(R.string.add_book_first),
                                    color = Color.White.copy(alpha = 0.6f),
                                    textAlign = TextAlign.Center,
                                    modifier = Modifier.fillMaxWidth(),
                                )
                            } else {
                                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                    SectionLabel(stringResource(R.string.what_book_reading))
                                    BookPicker(
                                        available = available,
                                        selected = selected,
                                        expanded = dropdownOpen,
                                        onToggle = { dropdownOpen = !dropdownOpen },
                                        onSelect = { book ->
                                            selectedId = book.id
                                            page = book.currentPage?.toString().orEmpty()
                                            dropdownOpen = false
                                        },
                                    )
                                }
                                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                    SectionLabel(stringResource(R.string.what_page_finished))
                                    OutlinedTextField(
                                        value = page,
                                        onValueChange = { v -> page = v.filter(Char::isDigit).take(6) },
                                        placeholder = { Text(stringResource(R.string.page_placeholder), color = Color.White.copy(alpha = 0.2f)) },
                                        singleLine = true,
                                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                        shape = RoundedCornerShape(24.dp),
                                        colors = OutlinedTextFieldDefaults.colors(
                                            focusedContainerColor = FieldBg,
                                            unfocusedContainerColor = FieldBg,
                                            focusedBorderColor = ReadingAccent.copy(alpha = 0.5f),
                                            unfocusedBorderColor = Color.White.copy(alpha = 0.05f),
                                            focusedTextColor = Color.White,
                                            unfocusedTextColor = Color.White,
                                            cursorColor = ReadingAccent,
                                        ),
                                        modifier = Modifier.fillMaxWidth(),
                                    )
                                }
                            }

                            val pageNumber = page.toIntOrNull()
                            Button(
                                onClick = { success = true },
                                enabled = selected != null && pageNumber != null && pageNumber >= 1,
                                shape = RoundedCornerShape(24.dp),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = ReadingAccent,
                                    contentColor = OnReadingAccent,
                                    disabledContainerColor = ReadingAccent.copy(alpha = 0.4f),
                                    disabledContentColor = OnReadingAccent.copy(alpha = 0.6f),
                                ),
                                contentPadding = androidx.compose.foundation.layout.PaddingValues(vertical = 16.dp),
                                modifier = Modifier.fillMaxWidth(),
                            ) {
                                Text(stringResource(R.string.log_progress), fontWeight = FontWeight.Medium)
                            }
                        }
                    }
                }
                IconButton(
                    onClick = onDismiss,
                    modifier = Modifier.align(Alignment.TopEnd).padding(16.dp).size(36.dp).clip(CircleShape).background(Color.White.copy(alpha = 0.05f)),
                ) {
                    Icon(Icons.Outlined.Close, contentDescription = stringResource(R.string.close), tint = Color.White.copy(alpha = 0.7f), modifier = Modifier.size(16.dp))
                }
            }
        }
    }
}

@Composable
private fun SectionLabel(text: String) {
    Text(
        text.uppercase(),
        fontSize = 12.sp,
        fontWeight = FontWeight.Medium,
        letterSpacing = 1.sp,
        color = Color.White.copy(alpha = 0.5f),
        modifier = Modifier.padding(start = 8.dp),
    )
}

@Composable
private fun BookPicker(
    available: List<Book>,
    selected: Book?,
    expanded: Boolean,
    onToggle: () -> Unit,
    onSelect: (Book) -> Unit,
) {
    val arrowRotation by animateFloatAsState(if (expanded) 180f else 0f, label = "arrow")
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Row(
            Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(24.dp))
                .background(FieldBg)
                .border(1.dp, Color.White.copy(alpha = 0.05f), RoundedCornerShape(24.dp))
                .clickable(onClick = onToggle)
                .padding(horizontal = 20.dp, vertical = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                selected?.title ?: stringResource(R.string.select_book),
                color = if (selected != null) Color.White else Color.White.copy(alpha = 0.4f),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.weight(1f),
            )
            Icon(Icons.Outlined.ExpandMore, contentDescription = null, tint = Color.White.copy(alpha = 0.4f), modifier = Modifier.rotate(arrowRotation))
        }
        AnimatedVisibility(visible = expanded, enter = expandVertically() + fadeIn(), exit = shrinkVertically() + fadeOut()) {
            LazyColumn(
                Modifier
                    .fillMaxWidth()
                    .heightIn(max = 240.dp)
                    .clip(RoundedCornerShape(24.dp))
                    .background(MenuBg)
                    .padding(8.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp),
            ) {
                items(available, key = { it.id }) { book ->
                    val isSelected = book.id == selected?.id
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (isSelected) ReadingAccent.copy(alpha = 0.2f) else Color.Transparent)
                            .clickable { onSelect(book) }
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        val cover = coverFileOf(book)
                        Box(Modifier.size(width = 32.dp, height = 48.dp).clip(RoundedCornerShape(4.dp)).background(Color.White.copy(alpha = 0.05f))) {
                            if (cover != null) CoverImage(cover, Modifier.matchParentSize())
                        }
                        Column(Modifier.weight(1f)) {
                            Text(
                                book.title,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Medium,
                                color = if (isSelected) ReadingAccent else Color.White,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                            Text(book.author, fontSize = 12.sp, color = Color.White.copy(alpha = 0.6f), maxLines = 1, overflow = TextOverflow.Ellipsis)
                        }
                        if (isSelected) Icon(Icons.Outlined.Check, contentDescription = null, tint = ReadingAccent)
                    }
                }
            }
        }
    }
}

@Composable
private fun SuccessContent(title: String) {
    var appeared by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) { appeared = true }
    val scale by animateFloatAsState(
        if (appeared) 1f else 0f,
        spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessLow),
        label = "check",
    )
    Column(
        Modifier.fillMaxWidth().heightIn(min = 400.dp).padding(40.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Box(
            Modifier.size(96.dp).scale(scale).clip(CircleShape).background(ReadingAccent),
            contentAlignment = Alignment.Center,
        ) {
            Icon(Icons.Outlined.Check, contentDescription = null, tint = OnReadingAccent, modifier = Modifier.size(48.dp))
        }
        Spacer(Modifier.size(32.dp))
        Text(stringResource(R.string.reading_logged), fontSize = 24.sp, fontWeight = FontWeight.Medium, textAlign = TextAlign.Center)
        Spacer(Modifier.size(8.dp))
        Text(stringResource(R.string.great_job_reading), color = Color.White.copy(alpha = 0.7f), fontSize = 14.sp, textAlign = TextAlign.Center)
        Text(title, color = ReadingAccent, fontStyle = FontStyle.Italic, fontSize = 14.sp, textAlign = TextAlign.Center)
    }
}

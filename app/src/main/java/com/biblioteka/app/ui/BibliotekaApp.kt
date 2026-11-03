package com.biblioteka.app.ui

import android.content.ActivityNotFoundException
import android.content.ClipData
import android.content.Intent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.MenuBook
import androidx.compose.material.icons.automirrored.outlined.MenuBook
import androidx.compose.material.icons.automirrored.outlined.Sort
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.LibraryAddCheck
import androidx.compose.material.icons.filled.LocalLibrary
import androidx.compose.material.icons.outlined.Add
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.BookmarkBorder
import androidx.compose.material.icons.outlined.Close
import androidx.compose.material.icons.outlined.LibraryAddCheck
import androidx.compose.material.icons.outlined.LocalLibrary
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.core.content.FileProvider
import androidx.core.os.ConfigurationCompat
import com.biblioteka.app.R
import com.biblioteka.app.data.Book
import com.biblioteka.app.data.BookOperations
import com.biblioteka.app.data.BookStatus
import com.biblioteka.app.data.SortOption
import com.biblioteka.app.ui.components.BookCard
import com.biblioteka.app.ui.components.BookShelf
import com.biblioteka.app.ui.components.ReaderHero
import com.biblioteka.app.ui.sheets.BookFormSheet
import com.biblioteka.app.ui.sheets.BookQuickViewSheet
import com.biblioteka.app.ui.sheets.ReadingSessionDialog
import java.util.Locale

private enum class AppTab(val label: Int, val icon: ImageVector, val selectedIcon: ImageVector, val status: BookStatus?) {
    SHELF(R.string.tab_shelf, Icons.Outlined.LocalLibrary, Icons.Filled.LocalLibrary, null),
    TO_READ(R.string.tab_to_read, Icons.Outlined.BookmarkBorder, Icons.Filled.Bookmark, BookStatus.TO_READ),
    READING(R.string.tab_reading, Icons.AutoMirrored.Outlined.MenuBook, Icons.AutoMirrored.Filled.MenuBook, BookStatus.READING),
    READ(R.string.tab_read, Icons.Outlined.LibraryAddCheck, Icons.Filled.LibraryAddCheck, BookStatus.READ),
    STATS(R.string.tab_stats, Icons.Outlined.BarChart, Icons.Filled.BarChart, null),
}

@Composable
fun BibliotekaApp(vm: LibraryViewModel) {
    val context = LocalContext.current
    var tab by rememberSaveable { mutableStateOf(AppTab.SHELF) }
    var searchQuery by rememberSaveable { mutableStateOf("") }
    var sort by rememberSaveable { mutableStateOf(SortOption.DATE) }

    var formOpen by rememberSaveable { mutableStateOf(false) }
    var editingId by rememberSaveable { mutableStateOf<String?>(null) }
    var viewingId by rememberSaveable { mutableStateOf<String?>(null) }
    var sessionOpen by rememberSaveable { mutableStateOf(false) }
    var settingsOpen by rememberSaveable { mutableStateOf(false) }
    var clearConfirmOpen by rememberSaveable { mutableStateOf(false) }

    val books = vm.books
    val viewingBook = books.firstOrNull { it.id == viewingId }
    val editingBook = books.firstOrNull { it.id == editingId }

    val importLauncher = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri != null) vm.importBackup(uri)
    }
    val shareTitle = stringResource(R.string.export_share_title)
    val onExport = {
        vm.exportBackup { file ->
            val uri = FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", file)
            val send = Intent(Intent.ACTION_SEND).apply {
                type = "application/json"
                putExtra(Intent.EXTRA_STREAM, uri)
                putExtra(Intent.EXTRA_SUBJECT, file.name)
                clipData = ClipData.newRawUri(file.name, uri)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            try {
                context.startActivity(Intent.createChooser(send, shareTitle))
            } catch (e: ActivityNotFoundException) {
                // Nothing can receive the file.
            }
        }
    }

    Box(Modifier.fillMaxSize()) {
        Scaffold(
            containerColor = MaterialTheme.colorScheme.background,
            topBar = { Header(onSettings = { settingsOpen = true }) },
            bottomBar = {
                NavigationBar(containerColor = MaterialTheme.colorScheme.surface) {
                    AppTab.entries.forEach { item ->
                        val selected = tab == item
                        NavigationBarItem(
                            selected = selected,
                            onClick = { tab = item },
                            icon = { Icon(if (selected) item.selectedIcon else item.icon, contentDescription = null) },
                            label = { Text(stringResource(item.label), maxLines = 1, overflow = TextOverflow.Ellipsis) },
                        )
                    }
                }
            },
            floatingActionButton = {
                FloatingActionButton(
                    onClick = {
                        editingId = null
                        formOpen = true
                    },
                    shape = RoundedCornerShape(24.dp),
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    contentColor = MaterialTheme.colorScheme.onPrimaryContainer,
                ) {
                    Icon(Icons.Outlined.Add, contentDescription = stringResource(R.string.add_book), modifier = Modifier.size(28.dp))
                }
            },
        ) { padding ->
            AnimatedContent(
                targetState = tab,
                transitionSpec = { (fadeIn() + slideInHorizontally { it / 30 }) togetherWith fadeOut() },
                modifier = Modifier.padding(padding),
                label = "tab",
            ) { current ->
                when (current) {
                    AppTab.SHELF -> ShelfTab(
                        vm = vm,
                        searchQuery = searchQuery,
                        onSearchChange = { searchQuery = it },
                        onBookClick = { viewingId = it.id },
                        onStopReading = {
                            vm.stopReading()
                            sessionOpen = true
                        },
                    )
                    AppTab.STATS -> Column(
                        Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp).padding(bottom = 80.dp),
                    ) { StatsScreen(books) }
                    else -> BookListTab(
                        books = books,
                        status = current.status!!,
                        sort = sort,
                        onSortChange = { sort = it },
                        onBookClick = { viewingId = it.id },
                    )
                }
            }
        }

        AnimatedVisibility(
            visible = settingsOpen,
            enter = slideInVertically { it } + fadeIn(),
            exit = slideOutVertically { it } + fadeOut(),
        ) {
            SettingsScreen(
                settings = vm.settings,
                onSettingsChange = vm::updateSettings,
                onClose = { settingsOpen = false },
                onExport = onExport,
                onImport = { importLauncher.launch(arrayOf("application/json", "text/*", "application/octet-stream")) },
                onClearData = { clearConfirmOpen = true },
            )
        }
    }

    // ------------------------------------------------------------------ sheets & dialogs

    if (viewingBook != null) {
        BookQuickViewSheet(
            book = viewingBook,
            onDismiss = { viewingId = null },
            onEdit = {
                viewingId = null
                editingId = viewingBook.id
                formOpen = true
            },
        )
    }

    if (formOpen) {
        BookFormSheet(
            book = editingBook,
            onSave = { draft ->
                vm.saveBook(editingBook, draft)
                formOpen = false
                editingId = null
            },
            onDelete = editingBook?.let { book ->
                {
                    vm.deleteBook(book)
                    formOpen = false
                    editingId = null
                }
            },
            onDismiss = {
                formOpen = false
                editingId = null
            },
            onPickCover = vm::importCover,
            onDiscardCover = vm::discardCover,
        )
    }

    if (sessionOpen) {
        ReadingSessionDialog(
            books = books,
            onDismiss = { sessionOpen = false },
            onSave = { id, page ->
                vm.logReadingSession(id, page)
                sessionOpen = false
            },
        )
    }

    if (clearConfirmOpen) {
        AlertDialog(
            onDismissRequest = { clearConfirmOpen = false },
            title = { Text(stringResource(R.string.clear_data)) },
            text = { Text(stringResource(R.string.confirm_clear_data)) },
            confirmButton = {
                TextButton(
                    onClick = {
                        vm.clearAllData()
                        clearConfirmOpen = false
                        settingsOpen = false
                    },
                    colors = ButtonDefaults.textButtonColors(contentColor = MaterialTheme.colorScheme.error),
                ) { Text(stringResource(R.string.clear_data)) }
            },
            dismissButton = { TextButton(onClick = { clearConfirmOpen = false }) { Text(stringResource(R.string.cancel)) } },
        )
    }

    vm.message?.let { message ->
        var text = stringResource(message.text)
        message.count?.let { text += " $it" }
        if (message.skipped > 0) text += " " + stringResource(R.string.import_skipped, message.skipped)
        AlertDialog(
            onDismissRequest = vm::dismissMessage,
            text = { Text(text) },
            confirmButton = { TextButton(onClick = vm::dismissMessage) { Text(stringResource(R.string.close)) } },
        )
    }
}

@Composable
private fun Header(onSettings: () -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.background)
            .statusBarsPadding()
            .padding(start = 24.dp, end = 16.dp, top = 16.dp, bottom = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            Modifier.clip(RoundedCornerShape(16.dp)).background(MaterialTheme.colorScheme.primary.copy(alpha = 0.2f)).padding(10.dp),
        ) {
            Icon(Icons.AutoMirrored.Outlined.MenuBook, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(24.dp))
        }
        Spacer(Modifier.size(12.dp))
        Text(stringResource(R.string.app_name), style = MaterialTheme.typography.headlineMedium, modifier = Modifier.weight(1f))
        IconButton(
            onClick = onSettings,
            colors = IconButtonDefaults.iconButtonColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)),
        ) {
            Icon(Icons.Outlined.Settings, contentDescription = stringResource(R.string.settings))
        }
    }
}

@Composable
private fun ShelfTab(
    vm: LibraryViewModel,
    searchQuery: String,
    onSearchChange: (String) -> Unit,
    onBookClick: (Book) -> Unit,
    onStopReading: () -> Unit,
) {
    val books = vm.books
    val searched = remember(books, searchQuery) { BookOperations.search(books, searchQuery) }
    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp)
            .padding(top = 8.dp, bottom = 96.dp),
    ) {
        TextField(
            value = searchQuery,
            onValueChange = onSearchChange,
            placeholder = { Text(stringResource(R.string.search_placeholder)) },
            leadingIcon = { Icon(Icons.Outlined.Search, contentDescription = null) },
            trailingIcon = {
                if (searchQuery.isNotEmpty()) {
                    IconButton(onClick = { onSearchChange("") }) { Icon(Icons.Outlined.Close, contentDescription = stringResource(R.string.close)) }
                }
            },
            singleLine = true,
            shape = RoundedCornerShape(28.dp),
            colors = TextFieldDefaults.colors(
                focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                focusedIndicatorColor = Color.Transparent,
                unfocusedIndicatorColor = Color.Transparent,
            ),
            modifier = Modifier.fillMaxWidth().padding(horizontal = 8.dp),
        )

        BookShelf(
            books = searched,
            onBookClick = onBookClick,
            onMoveBook = { id, status, beforeId ->
                // Indices are resolved against the full library, so moving works while searching too.
                val target = vm.books.filter { it.status == status && it.id != id }
                val index = beforeId?.let { b -> target.indexOfFirst { it.id == b } }?.takeIf { it >= 0 } ?: target.size
                vm.moveBook(id, status, index)
            },
            modifier = Modifier.padding(top = 16.dp),
        )

        ReaderHero(
            books = books,
            readingStartedAt = vm.readingStartedAt,
            onStart = vm::startReading,
            onStop = onStopReading,
            modifier = Modifier.padding(top = 8.dp),
        )
    }
}

@Composable
private fun BookListTab(
    books: List<Book>,
    status: BookStatus,
    sort: SortOption,
    onSortChange: (SortOption) -> Unit,
    onBookClick: (Book) -> Unit,
) {
    val locale = ConfigurationCompat.getLocales(LocalConfiguration.current)[0] ?: Locale.getDefault()
    // "Rating" is only offered on the Read tab.
    val effectiveSort = if (sort == SortOption.RATING && status != BookStatus.READ) SortOption.DATE else sort
    val list = remember(books, status, effectiveSort, locale) { BookOperations.filterAndSort(books, status, effectiveSort, locale) }

    Column(Modifier.fillMaxSize().padding(horizontal = 16.dp)) {
        Row(Modifier.fillMaxWidth().padding(vertical = 8.dp), horizontalArrangement = Arrangement.End) {
            SortMenu(effectiveSort, showRating = status == BookStatus.READ, onSortChange)
        }
        if (list.isEmpty()) {
            Column(
                Modifier.fillMaxWidth().padding(vertical = 80.dp, horizontal = 16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Box(
                    Modifier.size(96.dp).clip(RoundedCornerShape(32.dp)).background(MaterialTheme.colorScheme.surfaceVariant),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(Icons.AutoMirrored.Outlined.MenuBook, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                Spacer(Modifier.size(24.dp))
                Text(stringResource(R.string.empty_shelf_title), style = MaterialTheme.typography.titleMedium)
                Spacer(Modifier.size(8.dp))
                Text(
                    stringResource(R.string.empty_shelf_desc),
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.widthIn(max = 320.dp),
                )
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Adaptive(minSize = 280.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                contentPadding = PaddingValues(bottom = 96.dp),
            ) {
                items(list, key = { it.id }) { book ->
                    BookCard(book = book, onClick = { onBookClick(book) }, modifier = Modifier.animateItem())
                }
            }
        }
    }
}

@Composable
private fun SortMenu(sort: SortOption, showRating: Boolean, onChange: (SortOption) -> Unit) {
    var expanded by remember { mutableStateOf(false) }
    val labels = mapOf(
        SortOption.DATE to stringResource(R.string.sort_by_date),
        SortOption.TITLE to "${stringResource(R.string.sort_by_title)} (A-Z)",
        SortOption.AUTHOR to "${stringResource(R.string.sort_by_author)} (A-Z)",
        SortOption.RATING to "${stringResource(R.string.sort_by_rating)} ↓",
    )
    Box {
        OutlinedButton(onClick = { expanded = true }, shape = RoundedCornerShape(12.dp)) {
            Icon(Icons.AutoMirrored.Outlined.Sort, contentDescription = null, modifier = Modifier.size(16.dp))
            Spacer(Modifier.size(8.dp))
            Text(labels.getValue(sort))
        }
        DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            SortOption.entries.filter { it != SortOption.RATING || showRating }.forEach { option ->
                DropdownMenuItem(
                    text = { Text(labels.getValue(option)) },
                    onClick = {
                        onChange(option)
                        expanded = false
                    },
                )
            }
        }
    }
}

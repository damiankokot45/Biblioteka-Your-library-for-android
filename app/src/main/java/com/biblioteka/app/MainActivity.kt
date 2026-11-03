package com.biblioteka.app

import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.app.AppCompatDelegate
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Modifier
import androidx.core.os.LocaleListCompat
import com.biblioteka.app.data.LegacyWebStorage
import com.biblioteka.app.ui.BibliotekaApp
import com.biblioteka.app.ui.LibraryViewModel
import com.biblioteka.app.ui.components.LocalCoversDir
import com.biblioteka.app.ui.theme.BibliotekaTheme

// AppCompatActivity (rather than ComponentActivity) is required by the per-app language API
// on Android < 13.
class MainActivity : AppCompatActivity() {
    private val viewModel: LibraryViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        if (savedInstanceState == null && viewModel.needsLegacyMigration) {
            LegacyWebStorage.read(this) { data ->
                viewModel.applyLegacyData(data) { language ->
                    // Keep the language chosen in the old app, unless one is already set.
                    if (AppCompatDelegate.getApplicationLocales().isEmpty) {
                        AppCompatDelegate.setApplicationLocales(LocaleListCompat.forLanguageTags(language))
                    }
                }
            }
        }

        setContent {
            BibliotekaTheme(viewModel.settings) {
                CompositionLocalProvider(LocalCoversDir provides viewModel.coversDir) {
                    if (viewModel.isLoaded) {
                        BibliotekaApp(viewModel)
                    } else {
                        Box(Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background))
                    }
                }
            }
        }
    }
}

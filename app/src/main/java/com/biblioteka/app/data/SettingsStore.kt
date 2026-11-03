package com.biblioteka.app.data

import android.content.Context
import androidx.core.content.edit

enum class ThemeMode { SYSTEM, LIGHT, DARK }

data class AppSettings(
    val themeMode: ThemeMode = ThemeMode.DARK,
    /** Seed colour for the Material You palette, as `#rrggbb`. */
    val colorTheme: String = SeedPalette.DEFAULT_SEED,
)

/**
 * Small key/value settings (theme + reading timer). The UI language is handled by the
 * AndroidX per-app language API instead, so it integrates with the system settings.
 */
class SettingsStore(context: Context) {
    private val prefs = context.applicationContext.getSharedPreferences("biblioteka", Context.MODE_PRIVATE)

    fun load(): AppSettings = AppSettings(
        themeMode = prefs.getString(KEY_THEME_MODE, null)
            ?.let { v -> ThemeMode.entries.firstOrNull { it.name == v } } ?: ThemeMode.DARK,
        colorTheme = prefs.getString(KEY_COLOR, null)
            ?.takeIf { SeedPalette.parseHex(it) != null } ?: SeedPalette.DEFAULT_SEED,
    )

    fun save(settings: AppSettings) = prefs.edit {
        putString(KEY_THEME_MODE, settings.themeMode.name)
        putString(KEY_COLOR, settings.colorTheme)
    }

    /** Start of the running reading timer (epoch millis), or null when the timer is stopped. */
    var readingStartedAt: Long?
        get() = prefs.getLong(KEY_READING_START, -1L).takeIf { it > 0 }
        set(value) = prefs.edit {
            if (value == null) remove(KEY_READING_START) else putLong(KEY_READING_START, value)
        }

    var legacyMigrationDone: Boolean
        get() = prefs.getBoolean(KEY_LEGACY_MIGRATED, false)
        set(value) = prefs.edit { putBoolean(KEY_LEGACY_MIGRATED, value) }

    fun clearReadingState() = prefs.edit { remove(KEY_READING_START) }

    private companion object {
        const val KEY_THEME_MODE = "theme_mode"
        const val KEY_COLOR = "color_theme"
        const val KEY_READING_START = "reading_started_at"
        const val KEY_LEGACY_MIGRATED = "legacy_webview_migrated"
    }
}

package com.biblioteka.app.ui

import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.activity.compose.BackHandler
import androidx.appcompat.app.AppCompatDelegate
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.automirrored.outlined.MenuBook
import androidx.compose.material.icons.automirrored.outlined.KeyboardArrowRight
import androidx.compose.material.icons.outlined.BugReport
import androidx.compose.material.icons.outlined.Check
import androidx.compose.material.icons.outlined.Code
import androidx.compose.material.icons.outlined.Colorize
import androidx.compose.material.icons.outlined.DarkMode
import androidx.compose.material.icons.outlined.DeleteOutline
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.Download
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material.icons.outlined.Language
import androidx.compose.material.icons.outlined.LightMode
import androidx.compose.material.icons.outlined.Mail
import androidx.compose.material.icons.outlined.Palette
import androidx.compose.material.icons.outlined.Save
import androidx.compose.material.icons.outlined.SettingsBrightness
import androidx.compose.material.icons.outlined.Upload
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Slider
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringArrayResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.biblioteka.app.BuildConfig
import com.biblioteka.app.R
import com.biblioteka.app.data.AppSettings
import com.biblioteka.app.data.SeedPalette
import com.biblioteka.app.data.ThemeMode
import androidx.core.os.LocaleListCompat

private enum class SettingsPage(val parent: SettingsPage?) {
    MAIN(null), APPEARANCE(MAIN), LANGUAGE(MAIN), BACKUP(MAIN), ABOUT(MAIN),
    THIRD_PARTY_LICENSES(ABOUT), TERMS(ABOUT), PRIVACY(ABOUT),
}

private val COLOR_OPTIONS = listOf(
    "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#84cc16",
    "#06b6d4", "#64748b", "#795548", "#ef4444", "#f97316", "#14b8a6",
)

private val LANGUAGES = listOf(
    "en" to "English", "pl" to "Polski", "fr" to "Français", "de" to "Deutsch", "es" to "Español",
    "hu" to "Magyar", "ro" to "Română", "cs" to "Čeština", "fi" to "Suomi", "sv" to "Svenska",
    "no" to "Norsk", "da" to "Dansk", "nl" to "Nederlands", "lb" to "Lëtzebuergesch", "pt" to "Português",
    "it" to "Italiano", "hr" to "Hrvatski", "sk" to "Slovenčina", "et" to "Eesti", "lv" to "Latviešu",
    "lt" to "Lietuvių", "bg" to "Български", "tr" to "Türkçe", "ko" to "한국어", "ja" to "日本語",
    "is" to "Íslenska", "kl" to "Kalaallisut", "sl" to "Slovenščina", "el" to "Ελληνικά",
)

private data class License(val name: String, val license: String, val copyright: String, val url: String)

private val THIRD_PARTY_LIBS = listOf(
    License("Kotlin & kotlinx.coroutines", "Apache 2.0", "© JetBrains s.r.o.", "https://kotlinlang.org"),
    License("Jetpack Compose (UI, Foundation, Material 3)", "Apache 2.0", "© The Android Open Source Project", "https://developer.android.com/jetpack/compose"),
    License("AndroidX (Core, AppCompat, Activity, Lifecycle)", "Apache 2.0", "© The Android Open Source Project", "https://developer.android.com/jetpack/androidx"),
    License("Material Icons", "Apache 2.0", "© Google LLC", "https://fonts.google.com/icons"),
    License("MaterialKolor – material-color-utilities", "MIT", "© Jordon de Hoog", "https://github.com/jordond/MaterialKolor"),
    License("Material Color Utilities", "Apache 2.0", "© Google LLC", "https://github.com/material-foundation/material-color-utilities"),
)

private const val CONTACT_EMAIL = "biblioteka@damiankokot.eu"
private const val REPO_URL = "https://github.com/damiankokot45/Biblioteka-Your-library-for-android"

@Composable
fun SettingsScreen(
    settings: AppSettings,
    onSettingsChange: (AppSettings) -> Unit,
    onClose: () -> Unit,
    onExport: () -> Unit,
    onImport: () -> Unit,
    onClearData: () -> Unit,
) {
    var page by rememberSaveable { mutableStateOf(SettingsPage.MAIN) }
    BackHandler { page.parent?.let { page = it } ?: onClose() }

    Surface(Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.surface) {
        Column(Modifier.fillMaxSize().statusBarsPadding()) {
            Row(
                Modifier.fillMaxWidth().padding(horizontal = 8.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(onClick = { page.parent?.let { page = it } ?: onClose() }) {
                    Icon(Icons.AutoMirrored.Outlined.ArrowBack, contentDescription = stringResource(R.string.close))
                }
                Spacer(Modifier.width(4.dp))
                Text(stringResource(page.titleRes()), style = MaterialTheme.typography.titleLarge)
            }
            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)

            AnimatedContent(
                targetState = page,
                transitionSpec = {
                    val forward = targetState.parent == initialState
                    (slideInHorizontally { if (forward) it / 5 else -it / 5 } + fadeIn()) togetherWith
                        (slideOutHorizontally { if (forward) -it / 5 else it / 5 } + fadeOut())
                },
                label = "settingsPage",
            ) { current ->
                Column(
                    Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                        .padding(horizontal = 20.dp, vertical = 16.dp)
                        .navigationBarsPadding(),
                ) {
                    when (current) {
                        SettingsPage.MAIN -> MainPage(onNavigate = { page = it })
                        SettingsPage.APPEARANCE -> AppearancePage(settings, onSettingsChange)
                        SettingsPage.LANGUAGE -> LanguagePage()
                        SettingsPage.BACKUP -> BackupPage(onExport, onImport, onClearData)
                        SettingsPage.ABOUT -> AboutPage(onNavigate = { page = it })
                        SettingsPage.THIRD_PARTY_LICENSES -> LicensesPage()
                        SettingsPage.TERMS -> LegalPage(R.array.terms_titles, R.array.terms_bodies, disclaimer = false)
                        SettingsPage.PRIVACY -> LegalPage(R.array.privacy_titles, R.array.privacy_bodies, disclaimer = true)
                    }
                }
            }
        }
    }
}

private fun SettingsPage.titleRes(): Int = when (this) {
    SettingsPage.MAIN -> R.string.settings
    SettingsPage.APPEARANCE -> R.string.appearance
    SettingsPage.LANGUAGE -> R.string.language
    SettingsPage.BACKUP -> R.string.backup
    SettingsPage.ABOUT -> R.string.about_app
    SettingsPage.THIRD_PARTY_LICENSES -> R.string.third_party_licenses
    SettingsPage.TERMS -> R.string.terms_conditions
    SettingsPage.PRIVACY -> R.string.privacy_policy
}

// ---------------------------------------------------------------------------------------------- pages

@Composable
private fun MainPage(onNavigate: (SettingsPage) -> Unit) {
    val languageLabel = currentLanguageCode()?.let { code -> LANGUAGES.firstOrNull { it.first == code }?.second }
        ?: stringResource(R.string.theme_system)
    SettingItem(
        icon = Icons.Outlined.Palette,
        title = stringResource(R.string.appearance),
        subtitle = "${stringResource(R.string.theme)}, ${stringResource(R.string.accent_color)}",
        accent = Color(0xFFE09B69),
        onClick = { onNavigate(SettingsPage.APPEARANCE) },
        showArrow = true,
    )
    SettingItem(
        icon = Icons.Outlined.Language,
        title = stringResource(R.string.language),
        subtitle = languageLabel,
        accent = Color(0xFF6B8C96),
        onClick = { onNavigate(SettingsPage.LANGUAGE) },
        showArrow = true,
    )
    SettingItem(
        icon = Icons.Outlined.Save,
        title = stringResource(R.string.backup),
        subtitle = "${stringResource(R.string.export_data)}, ${stringResource(R.string.import_data)}",
        accent = Color(0xFFA37C82),
        onClick = { onNavigate(SettingsPage.BACKUP) },
        showArrow = true,
    )
    HorizontalDivider(Modifier.padding(vertical = 8.dp), color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f))
    SettingItem(
        icon = Icons.Outlined.Info,
        title = stringResource(R.string.about_app),
        subtitle = "${stringResource(R.string.version)}, ${stringResource(R.string.source_code)}, ${stringResource(R.string.licenses)}",
        accent = Color(0xFF7D8A6C),
        onClick = { onNavigate(SettingsPage.ABOUT) },
        showArrow = true,
    )
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun AppearancePage(settings: AppSettings, onChange: (AppSettings) -> Unit) {
    var showPicker by remember { mutableStateOf(false) }
    SectionHeader(stringResource(R.string.theme))
    listOf(
        Triple(ThemeMode.SYSTEM, R.string.theme_system, Icons.Outlined.SettingsBrightness),
        Triple(ThemeMode.LIGHT, R.string.theme_light, Icons.Outlined.LightMode),
        Triple(ThemeMode.DARK, R.string.theme_dark, Icons.Outlined.DarkMode),
    ).forEach { (mode, label, icon) ->
        val selected = settings.themeMode == mode
        SettingItem(
            icon = icon,
            title = stringResource(label),
            accent = if (selected) MaterialTheme.colorScheme.primary else null,
            onClick = { onChange(settings.copy(themeMode = mode)) },
            trailing = { if (selected) CheckBadge(filled = true) },
        )
    }
    HorizontalDivider(Modifier.padding(vertical = 16.dp), color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f))
    SectionHeader(stringResource(R.string.accent_color))
    val current = settings.colorTheme.lowercase()
    val isCustom = COLOR_OPTIONS.none { it == current }
    FlowRow(
        Modifier.padding(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        COLOR_OPTIONS.forEach { hex ->
            ColorDot(
                color = Color(SeedPalette.parseHex(hex)!!),
                selected = hex == current,
                onClick = { onChange(settings.copy(colorTheme = hex)) },
            )
        }
        // Custom colour
        Box(
            Modifier
                .size(40.dp)
                .clip(CircleShape)
                .background(if (isCustom) Color(SeedPalette.parseHex(current) ?: 0) else Color.Transparent)
                .border(2.dp, MaterialTheme.colorScheme.outline, CircleShape)
                .clickable { showPicker = true },
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                Icons.Outlined.Colorize,
                contentDescription = null,
                tint = if (isCustom) Color.White else MaterialTheme.colorScheme.outline,
                modifier = Modifier.size(18.dp),
            )
        }
    }
    if (showPicker) {
        ColorPickerDialog(
            initial = SeedPalette.parseHex(settings.colorTheme) ?: SeedPalette.parseHex(SeedPalette.DEFAULT_SEED)!!,
            onDismiss = { showPicker = false },
            onPick = { argb ->
                showPicker = false
                onChange(settings.copy(colorTheme = SeedPalette.toHex(argb)))
            },
        )
    }
}

@Composable
private fun LanguagePage() {
    val current = currentLanguageCode()
    val options = listOf<Pair<String?, String>>(null to stringResource(R.string.theme_system)) + LANGUAGES
    options.forEach { (code, label) ->
        SettingItem(
            icon = Icons.Outlined.Language,
            title = label,
            accent = null,
            onClick = {
                // Recreates the activity with the new locale (and persists it, also on Android < 13).
                AppCompatDelegate.setApplicationLocales(
                    if (code == null) LocaleListCompat.getEmptyLocaleList() else LocaleListCompat.forLanguageTags(code),
                )
            },
            trailing = { if (code == current) CheckBadge(filled = false) },
        )
    }
}

@Composable
private fun BackupPage(onExport: () -> Unit, onImport: () -> Unit, onClearData: () -> Unit) {
    SettingItem(
        icon = Icons.Outlined.Download,
        title = stringResource(R.string.export_data),
        accent = Color(0xFF6B8C96),
        onClick = onExport,
    )
    SettingItem(
        icon = Icons.Outlined.Upload,
        title = stringResource(R.string.import_data),
        accent = Color(0xFFA37C82),
        onClick = onImport,
    )
    HorizontalDivider(Modifier.padding(vertical = 8.dp), color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f))
    SettingItem(
        icon = Icons.Outlined.DeleteOutline,
        title = stringResource(R.string.clear_data),
        subtitle = stringResource(R.string.clear_data_desc),
        accent = MaterialTheme.colorScheme.error,
        textColor = MaterialTheme.colorScheme.error,
        onClick = onClearData,
    )
}

@Composable
private fun AboutPage(onNavigate: (SettingsPage) -> Unit) {
    val context = LocalContext.current
    Column(
        Modifier.fillMaxWidth().padding(top = 24.dp, bottom = 32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Box(
            Modifier.size(80.dp).clip(CircleShape).background(MaterialTheme.colorScheme.primary.copy(alpha = 0.2f)),
            contentAlignment = Alignment.Center,
        ) {
            Icon(Icons.AutoMirrored.Outlined.MenuBook, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(40.dp))
        }
        Text(stringResource(R.string.app_name), style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Surface(
            shape = RoundedCornerShape(50),
            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.8f),
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
        ) {
            Text(
                "${stringResource(R.string.version)} ${BuildConfig.VERSION_NAME}",
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.Bold,
                letterSpacing = 2.sp,
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
            )
        }
    }
    SettingItem(
        icon = Icons.Outlined.Info,
        title = stringResource(R.string.licenses),
        subtitle = stringResource(R.string.mit_license),
        accent = Color(0xFFBDA17E),
    )
    SettingItem(
        icon = Icons.Outlined.Mail,
        title = stringResource(R.string.email),
        subtitle = CONTACT_EMAIL,
        accent = Color(0xFFD18471),
        onClick = { context.startSafely(Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:$CONTACT_EMAIL"))) },
    )
    SettingItem(
        icon = Icons.Outlined.Code,
        title = stringResource(R.string.source_code),
        subtitle = stringResource(R.string.on_github),
        accent = Color(0xFF996E51),
        onClick = { context.openUrl(REPO_URL) },
    )
    SettingItem(
        icon = Icons.Outlined.BugReport,
        title = stringResource(R.string.create_issue),
        subtitle = stringResource(R.string.on_github),
        accent = Color(0xFFA68C67),
        onClick = { context.openUrl("$REPO_URL/issues") },
    )
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f)),
        modifier = Modifier.fillMaxWidth().padding(top = 24.dp, bottom = 32.dp),
    ) {
        Column(Modifier.padding(4.dp)) {
            listOf(
                R.string.third_party_licenses to SettingsPage.THIRD_PARTY_LICENSES,
                R.string.terms_conditions to SettingsPage.TERMS,
                R.string.privacy_policy to SettingsPage.PRIVACY,
            ).forEachIndexed { index, (label, target) ->
                if (index > 0) HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f))
                SettingItem(
                    icon = Icons.Outlined.Description,
                    title = stringResource(label),
                    accent = null,
                    onClick = { onNavigate(target) },
                    showArrow = true,
                )
            }
        }
    }
}

@Composable
private fun LicensesPage() {
    val context = LocalContext.current
    Text(
        stringResource(R.string.third_party_intro),
        style = MaterialTheme.typography.bodyMedium,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        modifier = Modifier.padding(start = 4.dp, bottom = 12.dp),
    )
    THIRD_PARTY_LIBS.forEach { lib ->
        Surface(
            onClick = { context.openUrl(lib.url) },
            shape = RoundedCornerShape(16.dp),
            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f)),
            modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp),
        ) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Row(verticalAlignment = Alignment.Top) {
                    Text(lib.name, style = MaterialTheme.typography.titleSmall, modifier = Modifier.weight(1f))
                    Spacer(Modifier.width(8.dp))
                    Surface(shape = RoundedCornerShape(50), color = MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)) {
                        Text(
                            lib.license,
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                        )
                    }
                }
                Text(lib.copyright, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}

@Composable
private fun LegalPage(titlesRes: Int, bodiesRes: Int, disclaimer: Boolean) {
    if (disclaimer) {
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = MaterialTheme.colorScheme.primary.copy(alpha = 0.1f),
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.2f)),
            modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
        ) {
            Column(Modifier.padding(16.dp)) {
                Text(
                    stringResource(R.string.privacy_disclaimer_title),
                    style = MaterialTheme.typography.titleSmall,
                    color = MaterialTheme.colorScheme.primary,
                )
                Text(
                    stringResource(R.string.privacy_disclaimer_body),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 4.dp),
                )
            }
        }
    }
    val titles = stringArrayResource(titlesRes)
    val bodies = stringArrayResource(bodiesRes)
    titles.zip(bodies).forEach { (title, body) ->
        Column(Modifier.padding(bottom = 16.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(title, style = MaterialTheme.typography.titleSmall)
            Text(body, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
    Text(
        stringResource(R.string.last_updated),
        style = MaterialTheme.typography.labelSmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
        modifier = Modifier.padding(top = 8.dp, bottom = 32.dp),
    )
}

// ---------------------------------------------------------------------------------------------- building blocks

@Composable
private fun SettingItem(
    icon: ImageVector,
    title: String,
    accent: Color?,
    subtitle: String? = null,
    textColor: Color = MaterialTheme.colorScheme.onSurface,
    onClick: (() -> Unit)? = null,
    showArrow: Boolean = false,
    trailing: @Composable () -> Unit = {},
) {
    val iconTint = accent ?: MaterialTheme.colorScheme.onSurfaceVariant
    val iconBg = accent?.copy(alpha = 0.2f) ?: MaterialTheme.colorScheme.surfaceVariant
    Row(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier)
            .padding(horizontal = 8.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Box(Modifier.size(44.dp).clip(CircleShape).background(iconBg), contentAlignment = Alignment.Center) {
            Icon(icon, contentDescription = null, tint = iconTint, modifier = Modifier.size(22.dp))
        }
        Column(Modifier.weight(1f)) {
            Text(title, style = MaterialTheme.typography.titleMedium, color = textColor)
            if (subtitle != null) {
                Text(
                    subtitle,
                    style = MaterialTheme.typography.bodyMedium,
                    color = if (textColor == MaterialTheme.colorScheme.error) textColor.copy(alpha = 0.8f) else MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
        trailing()
        if (showArrow) {
            Icon(
                Icons.AutoMirrored.Outlined.KeyboardArrowRight,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
            )
        }
    }
}

@Composable
private fun SectionHeader(text: String) {
    Text(
        text.uppercase(),
        style = MaterialTheme.typography.labelLarge,
        fontWeight = FontWeight.SemiBold,
        letterSpacing = 1.sp,
        color = MaterialTheme.colorScheme.primary,
        modifier = Modifier.padding(start = 8.dp, bottom = 8.dp),
    )
}

@Composable
private fun CheckBadge(filled: Boolean) {
    Box(
        Modifier
            .size(24.dp)
            .clip(CircleShape)
            .background(if (filled) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.primary.copy(alpha = 0.2f)),
        contentAlignment = Alignment.Center,
    ) {
        Icon(
            Icons.Outlined.Check,
            contentDescription = null,
            tint = if (filled) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(16.dp),
        )
    }
}

@Composable
private fun ColorDot(color: Color, selected: Boolean, onClick: () -> Unit) {
    val ring = MaterialTheme.colorScheme.primary
    Box(
        Modifier
            .size(40.dp)
            .then(if (selected) Modifier.border(2.dp, ring, CircleShape).padding(4.dp) else Modifier)
            .clip(CircleShape)
            .background(color)
            .clickable(onClick = onClick),
    )
}

/** Minimal HSV colour picker replacing the browser's `<input type="color">`. */
@Composable
private fun ColorPickerDialog(initial: Int, onDismiss: () -> Unit, onPick: (Int) -> Unit) {
    val hsv = remember { FloatArray(3).also { android.graphics.Color.colorToHSV(initial, it) } }
    var hue by remember { mutableFloatStateOf(hsv[0]) }
    var saturation by remember { mutableFloatStateOf(hsv[1]) }
    var value by remember { mutableFloatStateOf(hsv[2]) }
    val color = Color.hsv(hue, saturation, value)

    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = { TextButton(onClick = { onPick(color.toArgb()) }) { Text(stringResource(R.string.save)) } },
        dismissButton = { TextButton(onClick = onDismiss) { Text(stringResource(R.string.cancel)) } },
        title = { Text(stringResource(R.string.accent_color)) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Box(
                    Modifier
                        .fillMaxWidth()
                        .height(56.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(color),
                )
                Slider(value = hue, onValueChange = { hue = it }, valueRange = 0f..360f)
                Slider(value = saturation, onValueChange = { saturation = it }, valueRange = 0f..1f)
                Slider(value = value, onValueChange = { value = it }, valueRange = 0f..1f)
                Text(SeedPalette.toHex(color.toArgb()), style = MaterialTheme.typography.labelMedium)
            }
        },
    )
}

// ---------------------------------------------------------------------------------------------- helpers

/** Language code of the per-app locale, or null when the app follows the system language. */
private fun currentLanguageCode(): String? {
    val locales = AppCompatDelegate.getApplicationLocales()
    return if (locales.isEmpty) null else locales[0]?.language?.let { if (it == "nb") "no" else it }
}

private fun Context.openUrl(url: String) = startSafely(Intent(Intent.ACTION_VIEW, Uri.parse(url)))

private fun Context.startSafely(intent: Intent) {
    try {
        startActivity(intent)
    } catch (e: ActivityNotFoundException) {
        // No browser / mail client installed – nothing sensible to do.
    }
}

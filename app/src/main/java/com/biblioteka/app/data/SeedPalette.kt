package com.biblioteka.app.data

import com.materialkolor.hct.Hct
import com.materialkolor.scheme.DynamicScheme
import com.materialkolor.scheme.SchemeTonalSpot

/** ARGB values of every Material 3 colour role, generated from a single seed colour. */
data class SeedPalette(
    val primary: Int,
    val onPrimary: Int,
    val primaryContainer: Int,
    val onPrimaryContainer: Int,
    val inversePrimary: Int,
    val secondary: Int,
    val onSecondary: Int,
    val secondaryContainer: Int,
    val onSecondaryContainer: Int,
    val tertiary: Int,
    val onTertiary: Int,
    val tertiaryContainer: Int,
    val onTertiaryContainer: Int,
    val background: Int,
    val onBackground: Int,
    val surface: Int,
    val onSurface: Int,
    val surfaceVariant: Int,
    val onSurfaceVariant: Int,
    val surfaceTint: Int,
    val inverseSurface: Int,
    val inverseOnSurface: Int,
    val error: Int,
    val onError: Int,
    val errorContainer: Int,
    val onErrorContainer: Int,
    val outline: Int,
    val outlineVariant: Int,
    val scrim: Int,
    val surfaceBright: Int,
    val surfaceDim: Int,
    val surfaceContainer: Int,
    val surfaceContainerHigh: Int,
    val surfaceContainerHighest: Int,
    val surfaceContainerLow: Int,
    val surfaceContainerLowest: Int,
) {
    companion object {
        const val DEFAULT_SEED = "#e09b69"

        /** Parses `#RRGGBB` (or `RRGGBB`) into an opaque ARGB int, or null when malformed. */
        fun parseHex(hex: String): Int? {
            val clean = hex.trim().removePrefix("#")
            if (clean.length != 6 || !clean.all { it.isDigit() || it.lowercaseChar() in 'a'..'f' }) return null
            return (0xFF000000.toInt()) or clean.toInt(16)
        }

        fun toHex(argb: Int): String = "#%06x".format(argb and 0xFFFFFF)

        fun fromSeed(seedArgb: Int, isDark: Boolean): SeedPalette =
            from(SchemeTonalSpot(Hct.fromInt(seedArgb), isDark, 0.0))

        private fun from(s: DynamicScheme) = SeedPalette(
            primary = s.primary,
            onPrimary = s.onPrimary,
            primaryContainer = s.primaryContainer,
            onPrimaryContainer = s.onPrimaryContainer,
            inversePrimary = s.inversePrimary,
            secondary = s.secondary,
            onSecondary = s.onSecondary,
            secondaryContainer = s.secondaryContainer,
            onSecondaryContainer = s.onSecondaryContainer,
            tertiary = s.tertiary,
            onTertiary = s.onTertiary,
            tertiaryContainer = s.tertiaryContainer,
            onTertiaryContainer = s.onTertiaryContainer,
            background = s.background,
            onBackground = s.onBackground,
            surface = s.surface,
            onSurface = s.onSurface,
            surfaceVariant = s.surfaceVariant,
            onSurfaceVariant = s.onSurfaceVariant,
            surfaceTint = s.surfaceTint,
            inverseSurface = s.inverseSurface,
            inverseOnSurface = s.inverseOnSurface,
            error = s.error,
            onError = s.onError,
            errorContainer = s.errorContainer,
            onErrorContainer = s.onErrorContainer,
            outline = s.outline,
            outlineVariant = s.outlineVariant,
            scrim = s.scrim,
            surfaceBright = s.surfaceBright,
            surfaceDim = s.surfaceDim,
            surfaceContainer = s.surfaceContainer,
            surfaceContainerHigh = s.surfaceContainerHigh,
            surfaceContainerHighest = s.surfaceContainerHighest,
            surfaceContainerLow = s.surfaceContainerLow,
            surfaceContainerLowest = s.surfaceContainerLowest,
        )
    }
}

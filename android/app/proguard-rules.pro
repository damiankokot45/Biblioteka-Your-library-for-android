# Add project specific ProGuard rules here.
# For more details, see https://developer.android.com/guide/developing/tools/proguard.html

# Preserve line numbers in stack traces for debugging release builds
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ── Capacitor core ────────────────────────────────────────────────────────────
# Keep all Capacitor plugin classes and their public members so the JS bridge
# can call them by reflection.
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keep @com.getcapacitor.annotation.Permission class * { *; }

# Keep plugin bridge methods (annotated with @PluginMethod)
-keepclassmembers class * extends com.getcapacitor.Plugin {
    @com.getcapacitor.annotation.PluginMethod public *;
}

# ── WebView JS interface ───────────────────────────────────────────────────────
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ── AndroidX / Jetpack ────────────────────────────────────────────────────────
-keep class androidx.core.app.CoreComponentFactory { *; }

# ── App classes ───────────────────────────────────────────────────────────────
-keep class com.biblioteka.app.** { *; }

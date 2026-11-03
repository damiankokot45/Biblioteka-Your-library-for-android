package com.biblioteka.app.data

import android.annotation.SuppressLint
import android.content.Context
import android.os.Handler
import android.os.Looper
import android.webkit.WebView
import android.webkit.WebViewClient
import org.json.JSONArray
import org.json.JSONObject

/** Data the former Capacitor/WebView build of the app kept in `localStorage`. */
data class LegacyData(val booksJson: String?, val settingsJson: String?)

/**
 * Reads the library saved by the previous (Capacitor) version of the app, which shipped under
 * the same application id and kept everything in the WebView's `localStorage` for the
 * `https://localhost` origin. Loading an empty document with that base URL gives access to the
 * very same storage, so users upgrading in place keep their books.
 *
 * Must be called on the main thread. [onResult] is always invoked exactly once.
 */
object LegacyWebStorage {
    private const val ORIGIN = "https://localhost/"
    private const val TIMEOUT_MS = 5_000L

    @SuppressLint("SetJavaScriptEnabled")
    fun read(context: Context, onResult: (LegacyData?) -> Unit) {
        // A fresh install has no WebView profile at all – skip creating one.
        val webViewDir = java.io.File(context.applicationInfo.dataDir, "app_webview")
        if (!webViewDir.exists()) {
            onResult(null)
            return
        }

        val webView = try {
            WebView(context.applicationContext)
        } catch (e: Exception) {
            // No WebView provider installed / updating.
            onResult(null)
            return
        }

        var finished = false
        val handler = Handler(Looper.getMainLooper())
        fun finish(data: LegacyData?) {
            if (finished) return
            finished = true
            handler.removeCallbacksAndMessages(null)
            onResult(data)
            webView.destroy()
        }

        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView, url: String?) {
                view.evaluateJavascript(
                    "(function(){try{return JSON.stringify({" +
                        "b:localStorage.getItem('biblioteka_books')," +
                        "s:localStorage.getItem('biblioteka_settings')});}catch(e){return null;}})()",
                ) { raw -> finish(parse(raw)) }
            }
        }
        handler.postDelayed({ finish(null) }, TIMEOUT_MS)
        webView.loadDataWithBaseURL(ORIGIN, "<html><body></body></html>", "text/html", "utf-8", null)
    }

    /** `evaluateJavascript` returns the result JSON-encoded (here: a JSON string literal or `null`). */
    private fun parse(raw: String?): LegacyData? = try {
        if (raw == null || raw == "null") {
            null
        } else {
            val inner = JSONArray("[$raw]").getString(0)
            val obj = JSONObject(inner)
            LegacyData(
                booksJson = obj.optStringOrNull("b"),
                settingsJson = obj.optStringOrNull("s"),
            )
        }
    } catch (e: Exception) {
        null
    }

    private fun JSONObject.optStringOrNull(key: String): String? = opt(key) as? String

    /** Extracts theme settings from the legacy `biblioteka_settings` JSON. */
    fun parseSettings(json: String?): Triple<ThemeMode?, String?, String?> {
        if (json == null) return Triple(null, null, null)
        return try {
            val obj = JSONObject(json)
            val mode = when (obj.opt("themeMode")) {
                "light" -> ThemeMode.LIGHT
                "dark" -> ThemeMode.DARK
                "system" -> ThemeMode.SYSTEM
                else -> null
            }
            val color = (obj.opt("colorTheme") as? String)?.takeIf { SeedPalette.parseHex(it) != null }
            val language = (obj.opt("language") as? String)?.takeIf { it.length in 2..3 }
            Triple(mode, color, language)
        } catch (e: Exception) {
            Triple(null, null, null)
        }
    }
}

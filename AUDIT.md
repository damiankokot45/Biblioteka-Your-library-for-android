# Biblioteka — Pre-Release Security & Privacy Audit

**Audit date:** 8 May 2026
**Scope:** React/TypeScript front-end (`src/`), Capacitor configuration, Android project (`android/`), build pipeline, dependencies and Google Play readiness.
**Verdict:** The application is **architecturally privacy-respecting and close to publishable**, but **must NOT be uploaded to Google Play in its current state**. There are 4 hard blockers, several high-severity issues and a number of cleanups to address first. After they are fixed, the project will satisfy Google Play and EU privacy requirements.

---

## 1. Hard blockers (fix before any publication)

### 1.1 Home-screen widget is dead code
`ReadingWidget.java` (an `AppWidgetProvider`) exists, but `<receiver>` is **not declared** in `AndroidManifest.xml`. The widget will never appear on the user's home screen, the deep-link intents (`biblioteka://action/start|stop`) cannot be triggered, and there is no JS-side listener (`App.addListener('appUrlOpen', …)`) to react to them anyway.

**Fix:**

```xml
<receiver
    android:name=".ReadingWidget"
    android:exported="false">
    <intent-filter>
        <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
    </intent-filter>
    <meta-data
        android:name="android.appwidget.provider"
        android:resource="@xml/reading_widget_info" />
</receiver>
```

…and add a Capacitor `App.addListener('appUrlOpen', …)` that dispatches the start/stop logic. Otherwise **remove `ReadingWidget.java` entirely**, the layout files, and the second `<intent-filter>` in `MainActivity` — shipping unreachable code is a Play review red flag.

### 1.2 `AndroidManifest` declares `INTERNET` but no traffic is sent
The application is fully offline (verified — no `fetch`, `XMLHttpRequest`, no SDK with telemetry). Declaring `android.permission.INTERNET` while the privacy policy states *"data never leaves the device"* is contradictory and will be flagged by Google Play's Data Safety reviewers.

**Fix:** remove the permission, or, if WebView asset loading on some OEM ROMs requires it (Capacitor 8 does **not** require it for local assets), keep it and update the privacy policy to disclose it.

### 1.3 `android:allowBackup="true"` with no backup rules
Android Auto Backup is **enabled by default**. Books, notes, and `localStorage` end up on Google Drive, again contradicting the in-app privacy disclaimer ("Your data stays on your device").

**Fix one of:**

- Set `android:allowBackup="false"` on `<application>` (simplest, matches the privacy promise).
- OR add `android:dataExtractionRules="@xml/data_extraction_rules"` and `android:fullBackupContent="@xml/backup_rules"`, declare in `xml/data_extraction_rules.xml` exactly what is excluded, and update the privacy policy to mention it.

### 1.4 No release signing & `minifyEnabled false`
`android/app/build.gradle` ships a release build that is unsigned, unobfuscated, and unshrunk. Google Play will reject the AAB.

**Fix:**

```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        signingConfig signingConfigs.release
    }
}
```

…and add a `signingConfigs.release` block reading credentials from `~/.gradle/gradle.properties` or Play App Signing. ProGuard rules currently are empty — keep Capacitor's required `-keep` rules from the official template (the project's current rules will not break Capacitor since they are commented out, but minify will require them).

---

## 2. High-severity issues

### 2.1 Server-side dependencies in a client-only app
`package.json` lists `express`, `dotenv`, `@types/express` and `@google/genai`. None of them are imported anywhere in `src/`. They were almost certainly added by an AI Studio scaffold. They:

- Inflate `node_modules` from ~250 MB,
- Pull in transitive packages with their own CVE history (`express` → `path-to-regexp`, `body-parser`),
- Make the licence credits screen (`SettingsModal.tsx`) lie about what the app contains.

**Fix:** remove them with `npm uninstall express dotenv @types/express @google/genai`. Re-build, confirm bundle size drops, then run `npm audit`.

### 2.2 `html5-qrcode` is declared but never imported
Same pattern. Remove it or actually wire up the ISBN scanner mentioned in the licence list.

### 2.3 `<access origin="*" />` in Cordova `config.xml`
Legacy Cordova allowlist that grants **any** origin permission to load resources into the WebView. Not actively exploited (Capacitor 8 bridge controls the WebView and the app does not load remote URLs), but it is still a finding any external auditor will mention.

**Fix:** scope it down to `<access origin="content://*" />` (Capacitor) and `<access origin="https://*.localhost/*" />`, or delete the file — Capacitor doesn't need it.

### 2.4 `vite.config.ts` injects `process.env.GEMINI_API_KEY` into the bundle
Currently harmless because the key is undefined at build time and `@google/genai` is unused. **But** if a developer ever sets `GEMINI_API_KEY` in `.env` and runs `vite build`, the key will be hard-coded into the production JS bundle and shipped inside the APK/AAB. This is a classic mobile secret-leak.

**Fix:** remove the `define` block in `vite.config.ts` together with the unused `@google/genai` dependency.

### 2.5 Privacy policy / actual permissions mismatch
Every translation of the privacy policy says: *"On Android, the app may request storage permissions for backups."* The manifest does **not** request any storage permission, and the `Filesystem` plugin writes to `Directory.Cache` which never needs runtime permission. Statement is misleading — Google Play scanners cross-check this.

**Fix:** rewrite the "Permissions" section to: *"Biblioteka does not request any runtime Android permission. Backups are written to the app's private cache and shared only when you explicitly tap Share."*

### 2.6 Imported JSON is not validated beyond `Array.isArray(parsed)`
`SettingsModal.handleImport` accepts any array. A malicious backup file can re-write the user's library with arbitrary fields. Practical risk is low (React auto-escapes text, `<img src>` blocks `javascript:` URLs), but a tampered `coverImage` could be a multi-megabyte data URL that fills `localStorage` and softlocks the app.

**Fix:** validate each item against the `Book` shape, cap `coverImage` length (e.g. 2 MB), drop unknown fields.

### 2.7 Test files reference the wrong package
`android/app/src/(androidTest|test)/java/com/getcapacitor/myapp/Example*.java` were never renamed from the Capacitor template. They will not run (different package than `applicationId`) and they hint to reviewers that the project was not customised. Move them to `com/biblioteka/app/` or delete them.

---

## 3. Medium-severity / hygiene

| # | Finding | Recommendation |
|---|---|---|
| M1 | `dist/` and `android/app/build/intermediates/…` are committed to the repo | Add `dist/` and `android/app/build/` to `.gitignore`, then `git rm -r --cached` them |
| M2 | `package.json` has `"name": "react-example"`, `"version": "0.0.0"`, no `"license"`, no `"description"`, no `"repository"` | Replace with proper metadata; add `"license": "MIT"` |
| M3 | No `LICENSE` file at repo root despite README/Terms claiming MIT | Add a real `LICENSE` file with the MIT template + `Copyright (c) 2026 Damian Kokot` |
| M4 | App-widget strings hard-coded in Polish (`Czas na lekturę?`, `Zanurz się w opowieści…`, button captions) | Move to `strings.xml` with `values-en/`, `values-pl/`, etc. so the widget honours the device locale |
| M5 | `index.html` has `<html lang="pl">` even when the user picks English | Set `lang` attribute dynamically from settings |
| M6 | `appwidget-provider` declares `android:updatePeriodMillis="0"` — fine, but no `android:configure`, no `android:previewImage`, no `targetCellWidth/Height` (Android 12+) | Add a preview image and Android-12 layout sizes for a polished store listing |
| M7 | Vite dev server binds to `0.0.0.0` (LAN-exposed by default) | Switch default to `127.0.0.1` and use `--host` only when explicitly needed |
| M8 | `confirm()` for destructive *"Clear all data"* | Replace with the existing modal style — confirm dialogs look broken inside a Capacitor WebView |
| M9 | The `ReaderHero` timer keeps running across app restarts via `localStorage.biblioteka_readingStartTime`. There is no upper bound — if the user forgets to stop, the next session starts with a multi-day duration | Cap the resumed duration at e.g. 6 h or prompt user on re-open |
| M10 | `crypto.randomUUID()` requires a secure context. On pre-Chromium WebView devices (Android 7 with stock WebView) it can throw | Add a tiny polyfill fallback (`Math.random` based) |
| M11 | `selection:bg-primary-container selection:text-on-primary-container` in `App.tsx` — fine, but no `<meta name="referrer" content="no-referrer">` and no CSP | Add a strict CSP `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'">` to harden the WebView |

---

## 4. Google Play Store readiness checklist

What you still need to provide *outside* the code, in the Play Console:

- [ ] **Hosted Privacy Policy URL** (Play requires a publicly reachable URL — the in-app screen is not enough). Host the same text on `https://damiankokot.eu/biblioteka/privacy`.
- [ ] **Data Safety form** declaring "No data collected, no data shared". Matches reality once §1.2 and §1.3 are fixed.
- [ ] **Content rating questionnaire** (IARC). For a reading-tracker the result will be PEGI 3 / Everyone.
- [ ] **App category & tags** — Books & Reference / Tools.
- [ ] **Target audience and content** — set "13+" unless you opt into the *Designed for Families* programme.
- [ ] **Ads declaration** — "Contains ads: No".
- [ ] **Screenshots** — at least 2 phone screenshots, 1 7-inch tablet, 1 10-inch tablet (recommended).
- [ ] **Feature graphic** 1024×500.
- [ ] **App icon** 512×512 (already exists in `icons/`).
- [ ] **Signed AAB** built with Play App Signing enabled.
- [ ] **Tested release** on a physical device (Capacitor file-system + share path differs between emulators and OEM ROMs).

EU/UK extras:

- [ ] **DSA contact** — provide an email and a postal address in the listing (the same `biblioteka@damiankokot.eu` works as a contact).
- [ ] **GDPR Art. 13 information** is already in the in-app privacy policy; just mirror it on the hosted URL.

---

## 5. Bottom line

After the four blockers in §1 and the seven items in §2 are fixed, **Biblioteka complies with Google Play, GDPR and the App Defects policy**. The codebase itself is small, clean, free of remote network calls, free of analytics, and stores user data only locally — exactly what the privacy disclaimer claims.

A reasonable order of operations:

1. **Code cleanup:** remove server-side deps, register the widget, fix backup flag, drop `INTERNET`, drop unused `process.env.GEMINI_API_KEY`. (≈ 1 hour)
2. **Release config:** signing keystore, `minifyEnabled true`, ProGuard rules, version bump. (≈ 1 hour)
3. **Documentation:** new English README (provided), `LICENSE` file, hosted privacy policy. (≈ 30 min)
4. **Closed-track upload** to Play Console — internal testing release. Iterate based on the pre-launch report.

Once those are green, the app is publishable.

<div align="center">
   <img src="preview/readme_app_icon.svg" alt="Biblioteka icon" width="150px">
</div>

<h1 align="center">Biblioteka</h1>

<div align="center">
   <img src="https://img.shields.io/github/license/damiankokot/Biblioteka-Your-library-for-android?style=for-the-badge&color=cba6f7&labelColor=302D41">
   <img src="https://img.shields.io/github/last-commit/damiankokot/Biblioteka-Your-library-for-android?style=for-the-badge&color=b1d18a&labelColor=1f3701">
   <img src="https://img.shields.io/github/v/release/damiankokot/Biblioteka-Your-library-for-android?style=for-the-badge&color=dbc66e&labelColor=3a3000">
   <br>
   <img src="https://img.shields.io/github/stars/damiankokot/Biblioteka-Your-library-for-android?style=for-the-badge&color=ffb5a0&labelColor=561f0f">
   <img src="https://img.shields.io/github/downloads/damiankokot/Biblioteka-Your-library-for-android/total?label=Downloads&style=for-the-badge&color=aac7ff&labelColor=0a305f">
</div>

<div align="center">
   <h3>Your private, offline-first reading tracker for Android and the web.</h3>
</div>

<div align="center">

[Features](#-features) • [Privacy](#-privacy) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Contributing](#-contributing) • [License](#%EF%B8%8F-license)

</div>

<br>

---

## ✨ Features

- **Three-shelf model** — *To Read*, *Reading*, *Read* — with drag-and-drop re-ordering
- **Reading session timer** — log how long you spent with a book and the page you reached
- **Statistics dashboard** — monthly progress charts, average rating and completion streaks powered by Recharts
- **Quick view & rich edit** — cover image, ISBN, rating (1–5 ★), private notes
- **Material You theming** — twelve seed colours with dynamic tonal palettes generated on-the-fly
- **Light, dark and system themes**, persisted per device
- **29 first-class languages** — English, Polish, French, German, Spanish, Italian, Portuguese, Dutch, Czech, Slovak, Slovenian, Croatian, Hungarian, Romanian, Bulgarian, Greek, Turkish, all Nordic, Baltic, Luxembourgish, Korean, Japanese and Greenlandic
- **JSON backup & restore** — one tap, using the Android share sheet or a browser file download
- **PWA-ready** — installable on any modern browser, fully offline via Workbox service worker
- **Animated, accessible UI** built with `motion/react` and `lucide-react`

---

## 🔒 Privacy

Biblioteka is built around one principle: **your data is yours alone.**

- Everything lives in `localStorage` or, on Android, in the app's private sandbox
- **No** account · **No** server · **No** analytics · **No** crash reporter · **No** ads
- The Android build requests **no runtime permissions**
- The app makes **zero network requests** — no `INTERNET` permission declared

The full privacy policy is available in-app under *Settings → About*, translated into all 29 supported languages.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19, TypeScript 5.8, Tailwind CSS v4 |
| Animation | Motion v12 (formerly Framer Motion) |
| Icons | lucide-react |
| Charts | Recharts 3 |
| Theming | @material/material-color-utilities |
| Drag & Drop | @hello-pangea/dnd |
| Build | Vite 6 + vite-plugin-pwa (Workbox) |
| Mobile shell | Capacitor 8 |
| Android | minSdk 24 (Android 7.0), targetSdk 36, Java 21 |

---

## 🚀 Getting Started

### Prerequisites

- Node.js **20 LTS** or newer
- npm 10+
- For Android: Android Studio Hedgehog+, Android SDK 36, JDK 21

### Install & run

```bash
git clone https://github.com/damiankokot/Biblioteka-Your-library-for-android.git
cd Biblioteka-Your-library-for-android
npm install
npm run dev        # dev server at http://localhost:5173
```

### Build the Android app

```bash
npm run build
npx cap sync android
npx cap open android   # then Build → Generate Signed Bundle in Android Studio
```

#### Release signing

Store credentials in `~/.gradle/gradle.properties` — **never commit keystores to the repo:**

```properties
BIBLIOTEKA_STORE_FILE=/path/to/your.jks
BIBLIOTEKA_STORE_PASSWORD=…
BIBLIOTEKA_KEY_ALIAS=biblioteka
BIBLIOTEKA_KEY_PASSWORD=…
```

---

## 🌐 Internationalisation

All strings live in `src/lib/i18n.ts`. To add a new language:

1. Extend the `Language` union in `src/types.ts`
2. Add an entry to `LANGUAGES` in `SettingsModal.tsx`
3. Translate all keys in `i18n.ts`
4. Translate the legal screens in `SettingsModal.tsx`

---

## 🗺 Roadmap

- [ ] Home-screen widget
- [ ] Open Library / ISBN cover lookup (opt-in)
- [ ] iOS target via Capacitor
- [ ] WebDAV / Nextcloud sync (opt-in)
- [ ] CSV import / Goodreads migration

---

## 🤝 Contributing

Issues and pull requests are welcome!

1. Open an issue describing the bug or proposal
2. Fork and create a feature branch
3. Run `npm run lint` — make sure type-check passes
4. Update translations if you touch user-facing strings
5. Submit a PR referencing the issue

---

## ✉️ Contact

For questions or feedback, open an issue on GitHub or reach out at
[biblioteka@damiankokot.eu](mailto:biblioteka@damiankokot.eu)

---

## ©️ License

This project is licensed under the **MIT License**. See the [`LICENSE`](LICENSE) file for details.

---

<div align="center">
   Designed and built with ❤️ by <strong>Damian Kokot</strong>
</div>

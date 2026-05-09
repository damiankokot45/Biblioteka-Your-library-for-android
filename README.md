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

[Features](#-features) • [Privacy](#-privacy) • [Tech Stack](#-tech-stack) • [Contact](#%EF%B8%8F-contact) • [License](#%EF%B8%8F-license)

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

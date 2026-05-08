<div align="center">

# Biblioteka

**Your private, offline-first library for Android and the web.**

A beautifully crafted reading tracker that lives entirely on your device — no accounts, no analytics, no cloud, no compromises.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Android%20%7C%20Web-success)]()
[![Made with Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF)](https://capacitorjs.com/)
[![Made with React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6)](https://www.typescriptlang.org/)

</div>

---

## Overview

Biblioteka (Polish for *library*) is a hand-crafted, privacy-first reading companion. It helps you organise your books, track your progress, capture your private notes and visualise your reading habits — all without ever sending a single byte to a remote server. The application is delivered both as a Progressive Web App and as a native Android shell built with Capacitor, sharing the same React 19 / TypeScript codebase.

The traditional library name *Biblioteka* is intentionally preserved across all 29 supported languages, in homage to the universal idea of a personal book collection.

## Highlights

- **Three-shelf model** — *To Read*, *Reading*, *Read* — with drag-and-drop re-ordering.
- **Reading session timer** to log how long you actually spent with a book and the page you reached.
- **Statistics dashboard** with monthly progress charts, average rating, completion streaks and more, powered by Recharts.
- **Quick view & rich edit** for every book: cover image, ISBN, rating (1–5 ★), private notes.
- **Material 3 / Material You theming** — twelve seed colours plus dynamic tonal palettes generated on-the-fly via Google's `material-color-utilities`.
- **Light, dark and system themes**, persisted per device.
- **29 first-class languages** including English, Polish, French, German, Spanish, Italian, Portuguese, Dutch, Czech, Slovak, Slovenian, Croatian, Hungarian, Romanian, Bulgarian, Greek, Turkish, all Nordic languages (Swedish, Norwegian, Danish, Finnish, Icelandic), Baltic languages (Estonian, Latvian, Lithuanian), Luxembourgish, Korean, Japanese and Greenlandic (Kalaallisut).
- **JSON backup & restore** with one tap, using the Android share sheet on device or a file download in the browser.
- **PWA-ready** — installable on any modern browser, fully usable offline thanks to a Workbox service worker.
- **Animated, accessible UI** built with `motion/react` and `lucide-react` icons.

## Privacy

Biblioteka is engineered around a single principle: **your data is yours alone**.

- All books, ratings, notes and settings are stored exclusively in the browser's `localStorage` or, on Android, in the app's private sandbox.
- **No** account, **no** sign-up, **no** server.
- **No** analytics SDK, **no** crash reporter, **no** advertising library, **no** third-party tracker.
- The Android build does not request any runtime permission. Backups are written to the app's private cache and only leave the device when *you* explicitly invoke the system share sheet.
- The app makes no network requests. The `INTERNET` declaration in `AndroidManifest.xml` is reserved for future optional features (e.g. ISBN cover lookup) and is currently unused; it can be removed entirely if a tighter policy is desired — see [`AUDIT.md`](AUDIT.md).
- The full privacy policy and terms of use are available in-app under *Settings → About* and are translated into every supported language.

If you are auditing the project, the relevant entry-points are `src/App.tsx`, `src/components/SettingsModal.tsx` (privacy & backup logic) and `vite.config.ts`.

## Tech stack

| Layer | Technology |
|---|---|
| UI | React 19, TypeScript 5.8, Tailwind CSS v4 |
| Animation | Motion (formerly Framer Motion) v12 |
| Icons | lucide-react |
| Charts | Recharts 3 |
| Theming | @material/material-color-utilities |
| Drag & Drop | @hello-pangea/dnd |
| Build | Vite 6 + vite-plugin-pwa (Workbox) |
| Mobile shell | Capacitor 8 (`@capacitor/app`, `@capacitor/filesystem`, `@capacitor/share`) |
| Android | minSdk 24 (Android 7.0), targetSdk 36, AGP 8.13, Java 21 |

## Project structure

```
.
├── src/
│   ├── App.tsx                    # root component, state, persistence
│   ├── main.tsx                   # React entry-point
│   ├── types.ts                   # Book / UserSettings / Language types
│   ├── components/
│   │   ├── BookCard.tsx
│   │   ├── BookForm.tsx
│   │   ├── BookQuickView.tsx
│   │   ├── BookShelf.tsx
│   │   ├── ReaderHero.tsx         # reading session timer
│   │   ├── ReadingSessionModal.tsx
│   │   ├── SettingsModal.tsx      # appearance, language, backup, legal
│   │   └── StatsDashboard.tsx
│   ├── lib/
│   │   └── i18n.ts                # 29-language translation table
│   └── index.css
├── android/                       # Capacitor Android project
│   └── app/src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/biblioteka/app/
│       │   ├── MainActivity.java
│       │   └── ReadingWidget.java
│       └── res/                   # icons, splash, widget, strings
├── public/                        # static assets shipped to dist/
├── capacitor.config.ts
├── vite.config.ts
└── package.json
```

## Getting started

### Prerequisites

- Node.js **20 LTS** or newer
- npm 10+
- For Android: Android Studio Hedgehog (or newer), Android SDK 36, JDK 21

### 1. Install

```bash
git clone https://github.com/<your-username>/biblioteka.git
cd biblioteka
npm install
```

### 2. Run the web build

```bash
npm run dev          # vite dev server on http://localhost:3000
npm run build        # production bundle in dist/
npm run preview      # serve the production bundle locally
npm run lint         # tsc --noEmit type-check
```

### 3. Build the Android app

```bash
npm run build                       # generate dist/
npx cap sync android                # copy web assets into the native project
npx cap open android                # opens Android Studio
```

In Android Studio choose *Build → Build Bundle / Generate Signed Bundle*.
Before producing a release AAB make sure to enable code shrinking and supply a keystore — see [`AUDIT.md §1.4`](AUDIT.md) for the exact `build.gradle` snippet.

## Data backup

Biblioteka persists everything to `localStorage` under the following keys:

| Key | Purpose |
|---|---|
| `biblioteka_books` | JSON-serialised array of `Book` objects |
| `biblioteka_settings` | Theme mode, accent colour and language |
| `biblioteka_isReading` / `biblioteka_readingStartTime` | Reading-session timer state |

Use **Settings → Backup → Export library** to obtain a portable JSON file. The same screen offers an *Import* action; imported files are validated before being merged into the application state.

## Internationalisation

All user-facing strings live in `src/lib/i18n.ts`. The `useTranslation()` hook returns a `t(key)` function bound to the current `Language` from settings.
Adding a new language is a matter of:

1. Extending the `Language` union in `src/types.ts`.
2. Adding the language entry to `LANGUAGES` in `SettingsModal.tsx`.
3. Translating every key inside `i18n.ts`.
4. Translating the legal screens (`PRIVACY_DISCLAIMER`, `PRIVACY_ITEMS`, `TERMS_ITEMS`, `LAST_UPDATED`) in `SettingsModal.tsx`.

## Roadmap

- [ ] Goodreads / Open Library ISBN lookup (opt-in, single request)
- [ ] Home-screen widget (groundwork present in `ReadingWidget.java`, see [`AUDIT.md §1.1`](AUDIT.md))
- [ ] iOS target via the same Capacitor configuration
- [ ] WebDAV / Nextcloud sync (opt-in)
- [ ] CSV import / Goodreads migration

## Contributing

Issues and pull requests are very welcome. Please:

1. Open an issue describing the bug or proposal first.
2. Fork the repository and create a feature branch.
3. Run `npm run lint` and make sure the type-check passes.
4. Add or update translations if you touch user-facing strings.
5. Submit a PR referencing the issue.

When in doubt about scope, take a look at [`AUDIT.md`](AUDIT.md) — it lists the items that are explicitly being worked towards a 1.0 release.

## Security

If you find a vulnerability, please **do not** open a public issue. Email the maintainer at `biblioteka@damiankokot.eu` with a clear description and, if possible, a proof-of-concept. You will receive an acknowledgement within 72 hours.

## License

Biblioteka is released under the [MIT License](LICENSE).

```
Copyright (c) 2026 Damian Kokot

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions: …
```

## Credits

Designed and built by **Damian Kokot**.
Contact: [`biblioteka@damiankokot.eu`](mailto:biblioteka@damiankokot.eu)

> *Designed with care for every detail of a reader's passion.*

# Biblioteka

Biblioteka to elegancka, nowoczesna aplikacja webowa do zarządzania swoimi książkami, śledzenia postępów w czytaniu oraz notowania kluczowych myśli i cytatów. Projekt zbudowano w oparciu o React, z dbałością o detale wizualne i z wykorzystaniem interfejsu inspirowanego Material Design.

## 🌟 Główne Funkcje

* **Półka z książkami:** Podział na trzy główne kategorie (Będę czytać, Czytam, Przeczytane).
* **Śledzenie postępu:** Intuicyjny timer "Czas na lekturę", który pozwala mierzyć czas poświęcony na czytanie oraz rejestrować postęp stron.
* **Rozbudowane statystyki:** Wizualizacja nawyków czytelniczych za pomocą pięknych wykresów z użyciem bibliteki Recharts.
* **Szybki podgląd i edycja:** Błyskawiczny dostęp do najważniejszych informacji o książce, ocenie i notatkach prywatnych.
* **Personalizacja:** Wygląd aplikacji dostosowujący się do Twoich preferencji (jasny/ciemny motyw) oraz dynamiczne motywy kolorystyczne (Material You).
* **Dane zawsze z Tobą:** 100% prywatności. Dane są przechowywane tylko w Twojej przeglądarce za pomocą LocalStorage (dostępna opcja eksportu/importu bazy danych do pliku JSON).
* **Internacjonalizacja (i18n):** Pełna obsługa wielu języków (w tym polski, angielski, francuski, niemiecki, hiszpański itp.). Tradycyjna kategoria nazwy "Biblioteka" pozostaje niezmienna we wszystkich językach.
* **Nowoczesny design:** Przejrzysty interfejs, atrakcyjne animacje z wykorzystaniem biblioteki Framer Motion.

## 🛠 Technologie

* **React 18** (z użyciem Vite)
* **TypeScript**
* **Tailwind CSS**
* **Framer Motion** (Motion) - używane dla płynnych i przemyślanych animacji
* **Material Color Utilities** - dla dynamicznego i responsywnego generowania palet barw (tzw. Tonal Palettes)
* **Recharts** - dla wizualizacji danych.
* **Lucide React** - zbiór pięknych, spójnych ikon.

## 🚀 Uruchomienie lokalnie

Aby uruchomić aplikację w swoim lokalnym środowisku, upewnij się, że masz zainstalowane środowisko Node.js.

1. Sklonuj repozytorium na swój dysk.
2. Zainstaluj zależności:
   ```bash
   npm install
   ```
3. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   ```
4. Otwórz w przeglądarce podany w terminalu adres (zazwyczaj `http://localhost:3000`).

## 📦 Zarządzanie Danymi (Kopie Zapasowe)

Ponieważ Biblioteka opiera się całkowicie o lokalne przechowywanie danych (bez zewnętrznej bazy danych w chmurze), zalecamy regularne korzystanie z wbudowanej funkcji **Archiwizacji Danych** dostępnej w ustawieniach. 
Możesz zapisać pełen plik JSON ze wszystkimi swoimi książkami na bezpiecznym nośniku, a w przyszłości łatwo go wczytać.

---
Zaprojektowano z dbałością o każdy szczegół czytelniczych pasji.

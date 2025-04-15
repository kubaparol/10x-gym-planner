# Specyfikacja modułu autentykacji

## 1. Architektura interfejsu użytkownika

### Opis zmian i struktura stron

- Wprowadzenie dedykowanych stron dla rejestracji (`/register`), logowania (`/login`) oraz resetowania hasła (`/reset-password`).
- Użytkownicy nie zalogowani korzystają z publicznego layoutu (np. `Layout_Public.astro`) skoncentrowanego na prostym interfejsie i łatwej nawigacji.
- Użytkownicy zalogowani korzystają z autoryzowanego layoutu (`Layout.astro`), który zawiera elementy umożliwiające wylogowanie i dostęp do zabezpieczonych funkcjonalności.
- Strony Astro odpowiadają za rendering, nawigację oraz integrację z backendem poprzez wykonywanie zapytań do API endpointów.
- Komponenty React (np. dynamiczne formularze) są wykorzystywane do obsługi interakcji użytkownika, walidacji danych na bieżąco, wyświetlania komunikatów błędów i sukcesu.

### Walidacja i komunikaty błędów

- Walidacja danych wejściowych realizowana jest zarówno po stronie klienta (z natychmiastowym feedbackiem, wykorzystując np. React Hook Form i Zod/Yup) jak i po stronie serwera.
- Scenariusze walidacji:
  - **Rejestracja:**
    - Weryfikacja poprawności formatu email.
    - Sprawdzenie złożoności hasła (min. 8 znaków, przynajmniej jedna cyfra i jeden znak specjalny).
    - Walidacja zgodności hasła z potwierdzeniem.
    - Komunikaty błędów: np. "Hasło powinno mieć co najmniej 8 znaków, zawierać cyfrę oraz znak specjalny.".
  - **Logowanie:**
    - Walidacja poprawności podanego emaila i hasła.
    - Komunikat błędu: "Niepoprawny email lub hasło.".
  - **Resetowanie hasła:**
    - Weryfikacja ważności tokena resetującego.
    - Sprawdzenie złożoności nowego hasła.
    - Komunikat błędu: "Link resetujący wygasł lub hasło nie spełnia wymagań bezpieczeństwa.".
- Obsługa stanów: wskaźniki ładowania, alerty dla sukcesu operacji oraz czytelne komunikaty o błędach.

## 2. Logika backendowa

### Struktura API endpointów

- Endpointy umieszczone w katalogu `src/pages/api/auth/`:
  - `POST /api/auth/register` – rejestracja użytkownika. Przyjmuje dane: { imię, nazwisko, email, password, potwierdzenie password }.
  - `POST /api/auth/login` – logowanie użytkownika. Przyjmuje dane: { email, password }.
  - `POST /api/auth/forgot-password` – wysyłanie linku do resetowania hasła. Przyjmuje: { email }.
  - `POST /api/auth/reset-password` – resetowanie hasła. Przyjmuje: { token, newPassword, confirmPassword }.
- Każdy endpoint integruje się z Supabase Auth oraz realizuje dodatkową walidację danych.

### Modele danych i walidacja

- Modele danych definiowane w `src/types.ts`, obejmujące typy `User`, `UserProfile` oraz DTO dla rejestracji, logowania i resetowania hasła.
- Weryfikacja danych wejściowych odbywa się przy użyciu bibliotek takich jak Zod lub Yup, co zapewnia spójność typów i walidację (np. format email, złożoność hasła, zgodność potwierdzenia hasła).
- Centralny middleware do obsługi wyjątków, który zwraca standardowe kody błędów (np. 400, 401, 500) wraz z czytelnymi komunikatami błędów.
- Aktualizacja sposobu renderowania stron server-side zgodnie z konfiguracją w `astro.config.mjs`, aby wspierać integrację z Supabase oraz utrzymywanie sesji użytkownika.

## 3. System autentykacji

### Wykorzystanie Supabase Auth

- Implementacja oparta na Supabase Auth, korzystającej z metod dostępnych w SDK Supabase:
  - **Rejestracja:** Użycie metody `signUp` do tworzenia nowego użytkownika oraz przesłania emaila weryfikacyjnego.
  - **Logowanie:** Użycie metody `signIn` do logowania i ustanowienia sesji użytkownika.
  - **Wylogowanie:** Użycie metody `signOut` do zdezaktywowania sesji.
  - **Resetowanie hasła:** Użycie metody (np. `resetPasswordForEmail`) do generowania tokena resetującego i wysłania odpowiedniego emaila.
- Serwis autentykacji umieszczony w `src/lib/authService.ts` opakowuje wywołania Supabase i zapewnia dodatkową logikę walidacyjną oraz obsługę wyjątków.

### Kontrakty i interfejsy

- Definicje typów i interfejsów w `src/types.ts`, opisujące strukturę danych użytkownika i DTO wymienionych endpointów.
- Kontrakty API endpointów zapewniają spójność komunikacji między frontendem a backendem.

### Bezpieczeństwo i zarządzanie sesją

- Bezpieczne przechowywanie tokenów oraz zarządzanie sesjami zgodnie z wytycznymi Supabase.
- Weryfikacja tokenów sesji przy każdym zapytaniu do zabezpieczonych endpointów.
- Implementacja mechanizmów zabezpieczeń przeciwko atakom typu CSRF oraz innym powszechnym zagrożeniom.

## Podsumowanie

Niniejsza specyfikacja modułu autentykacji zapewnia:

- Jasne rozdzielenie warstwy prezentacji (Astro + React) od logiki backendowej.
- Spójną integrację z Supabase Auth przy wykorzystaniu standardowych metod SDK oraz własnych walidacji i middleware.
- Elastyczne podejście do integracji w ramach istniejącej struktury projektu, z uwzględnieniem aspektów bezpieczeństwa, użyteczności oraz skalowalności.

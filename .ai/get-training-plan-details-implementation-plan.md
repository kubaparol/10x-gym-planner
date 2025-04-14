# API Endpoint Implementation Plan: Get Training Plan Details

## 1. Przegląd punktu końcowego

Endpoint "Get Training Plan Details" służy do pobierania szczegółowych informacji o wybranym planie treningowym, w tym jego dni treningowych. Umożliwia on autoryzowany dostęp do danych treningowych użytkownika, co pozwala na wyświetlenie pełnych informacji o planie treningowym.

## 2. Szczegóły żądania

- **Metoda HTTP:** GET
- **Struktura URL:** `/training-plans/{plan_id}`
- **Parametry:**
  - **Wymagane:**
    - `plan_id` – identyfikator planu treningowego (UUID).
  - **Opcjonalne:** Brak
- **Request Body:** Brak

## 3. Wykorzystywane typy

- **DTO:**
  - `TrainingPlanDetailsDTO` (źródło: `src/types.ts`) zawiera pola:
    - `id` (UUID)
    - `name` (string)
    - `description` (string lub null)
    - `is_active` (boolean)
    - `training_days` (lista obiektów typu definiowanego np. przez `TrainingDayDTO`)

## 4. Szczegóły odpowiedzi

- **Struktura odpowiedzi:**
  ```json
  {
    "id": "UUID",
    "name": "string",
    "description": "string",
    "is_active": "boolean",
    "training_days": [ { "...day details..." } ]
  }
  ```
- **Kody statusu:**
  - `200` – powodzenie, dane planu zwrócone poprawnie
  - `401` – nieautoryzowany dostęp (brak lub nieważny token JWT)
  - `404` – plan treningowy o podanym `plan_id` nie został znaleziony

## 5. Przepływ danych

1. Użytkownik wysyła żądanie GET na endpoint `/training-plans/{plan_id}` z odpowiednim `plan_id` w URL.
2. Middleware uwierzytelniający weryfikuje ważność tokena JWT (Supabase Auth) i sprawdza uprawnienia użytkownika zgodnie z RLS.
3. Kontroler odbiera żądanie i wywołuje serwis (np. `TrainingPlanService.getDetails(planId)`), który:
   - Waliduje format `plan_id` (UUID).
   - Pobiera z bazy danych plan treningowy wraz z powiązanymi rekordami dni treningowych.
4. Wynik przekształcany jest do struktury `TrainingPlanDetailsDTO` i zwracany jako odpowiedź 200.
5. W przypadku braku planu treningowego lub niewłaściwych uprawnień, kontroler zwraca odpowiednio błąd 404 lub 401.

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie:** Wymagany jest poprawny token JWT (Supabase Auth).
- **Autoryzacja:** Wykorzystanie RLS (Row Level Security) na poziomie bazy danych, aby upewnić się, że użytkownik uzyskuje dostęp tylko do swoich planów treningowych.
- **Walidacja:** Walidacja formatu `plan_id` (UUID) oraz sprawdzenie uprawnień dostępu poprzez mechanizmy autoryzacyjne i polityki RLS.
- **Dodatkowe środki:** Logowanie prób nieautoryzowanego dostępu i błędów walidacji.

## 7. Obsługa błędów

- **401 Unauthorized:** Brak lub nieważny token JWT.
- **404 Not Found:** Plan treningowy o podanym `plan_id` nie istnieje.
- **500 Internal Server Error:** Nieoczekiwane błędy serwera z możliwością logowania szczegółów błędu.

## 8. Rozważania dotyczące wydajności

- Wykorzystanie indeksów na kolumnach `id` oraz kluczy obcych w tabelach `training_plans` i `training_days` (zgodnie z `db-plan.md`).
- Optymalizacja zapytań SQL (JOIN) w celu pobierania danych planu treningowego wraz z powiązanymi dniami treningowymi.
- Możliwość implementacji mechanizmów cache'owania w przypadku dużego obciążenia lub częstego dostępu do tych danych.

## 9. Etapy wdrożenia

1. **Definicja routingu:** Dodanie nowego endpointu do systemu routingu zgodnie z wytycznymi projektu.
2. **Implementacja middleware:** Zapewnienie, że każdy request przechodzi walidację tokena JWT i autoryzację.
3. **Serwis:** Implementacja metody `getDetails(planId)` w warstwie serwisowej (np. w `src/lib/services/TrainingPlanService.ts`), która pobiera dane z bazy danych.
4. **Logika bazy danych:** Użycie zapytań SQL lub ORM do pobierania planu treningowego wraz z powiązanymi dniami, z uwzględnieniem RLS.
5. **Walidacja:** Dodanie walidacji dla wejściowego `plan_id` oraz obsługi błędu, gdy plan nie zostanie znaleziony.
6. **Serializacja:** Konwersja danych z bazy do struktury `TrainingPlanDetailsDTO`.
7. **Obsługa błędów:** Implementacja mechanizmu zwracania odpowiednich błędów (401, 404, 500) z logowaniem błędów.

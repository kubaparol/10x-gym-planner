# API Endpoint Implementation Plan: Delete Training Plan

## 1. Przegląd punktu końcowego

Ten endpoint umożliwia usunięcie treningowego planu z systemu, wraz z usunięciem powiązanych rekordów (np. dni treningowych, ćwiczeń i zestawów ćwiczeń). Operacja jest dostępna tylko dla użytkownika, któremu należy dany plan.

## 2. Szczegóły żądania

- **Metoda HTTP:** DELETE
- **Struktura URL:** `/training-plans/{plan_id}`
- **Parametry:**
  - **Wymagane:** `plan_id` (UUID treningowego planu)
  - **Opcjonalne:** Brak
- **Request Body:** Brak (identyfikator planu przekazywany jest w URL)

## 3. Wykorzystywane typy

- `UUID` (zdefiniowany w `src/types.ts`)
- `DeleteResponseDTO`:
  ```typescript
  export interface DeleteResponseDTO {
    message: string;
  }
  ```

## 4. Szczegóły odpowiedzi

- **Sukces:**
  - Kod statusu: 200
  - Treść odpowiedzi (JSON):
    ```json
    {
      "message": "Training plan deleted successfully"
    }
    ```
- **Błędy:**
  - 401 Unauthorized – użytkownik nie jest uwierzytelniony lub nie ma uprawnień.
  - 404 Not Found – plan treningowy o podanym `plan_id` nie istnieje lub nie należy do użytkownika.
  - 500 Internal Server Error – błąd serwera podczas operacji usuwania.

## 5. Przepływ danych

1. Użytkownik wysyła żądanie DELETE na `/training-plans/{plan_id}`.
2. Middleware weryfikuje autentykację i autoryzację użytkownika (np. przez Supabase Auth i polityki RLS).
3. Endpoint pobiera `plan_id` z URL i waliduje jego format (UUID).
4. System weryfikuje, czy treningowy plan o danym `plan_id` istnieje i należy do zalogowanego użytkownika.
5. W przypadku potwierdzenia istnienia planu, wykonywana jest operacja usunięcia, wykorzystująca mechanizm kaskadowych usunięć (ON DELETE CASCADE) w bazie danych.
6. Po pomyślnym usunięciu, zwracana jest odpowiedź `DeleteResponseDTO` z potwierdzeniem powodzenia operacji.

## 6. Względy bezpieczeństwa

- Weryfikacja tokena autoryzacyjnego oraz upewnienie się, że użytkownik ma prawo do usunięcia danego planu (polityki RLS w Supabase).
- Walidacja formatu `plan_id` jako UUID.
- Ograniczenie ilości ujawnianych informacji w przypadku błędów, aby nie wyciekły szczegóły wewnętrzne systemu.

## 7. Obsługa błędów

- **401 Unauthorized:** Zwracany, gdy użytkownik nie jest uwierzytelniony lub nie ma odpowiednich uprawnień.
- **404 Not Found:** Zwracany, gdy plan treningowy o podanym `plan_id` nie istnieje lub nie jest przypisany do użytkownika.
- **500 Internal Server Error:** Zwracany w przypadku nieoczekiwanych błędów podczas próby usunięcia planu.
- Dodatkowo, błędy mogą być rejestrowane w dedykowanym systemie logowania błędów.

## 8. Rozważania dotyczące wydajności

- Wykorzystanie kaskadowego usuwania rekordów w bazie danych minimalizuje potrzebę wykonywania wielu oddzielnych zapytań.
- Upewnienie się, że wszystkie klucze obce są odpowiednio indeksowane, aby przyspieszyć wyszukiwanie i weryfikację planu.
- W przypadku bardzo dużej liczby powiązanych rekordów, rozważyć implementację mechanizmów optymalizacji lub operacji asynchronicznych.

## 9. Etapy wdrożenia

1. Utworzenie nowego endpointu w katalogu `/src/pages/api/training-plans/[plan_id].ts`.
2. Implementacja middleware do weryfikacji autentykacji i autoryzacji użytkownika.
3. Walidacja `plan_id` pobranego z URL (sprawdzenie poprawności formatu UUID).
4. Weryfikacja istnienia planu treningowego przypisanego do użytkownika.
5. Wykonanie operacji usunięcia planu z bazy danych, wykorzystując transakcję i kaskadowe usuwanie rekordów.
6. Zwrócenie odpowiedzi `DeleteResponseDTO` z odpowiednim komunikatem.
7. Implementacja obsługi błędów dla kodów 401, 404 oraz 500.

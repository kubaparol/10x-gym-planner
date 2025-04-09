# API Endpoint Implementation Plan: Create Training Plan

## 1. Przegląd punktu końcowego

Endpoint służy do tworzenia nowego planu treningowego dla autoryzowanego użytkownika. Jego celem jest umożliwienie użytkownikowi utworzenia planu treningowego z podaniem niezbędnych danych, przy jednoczesnym zapewnieniu, że operacja jest przeprowadzona właściwie i bezpiecznie. Należy pamiętać, że plan treningowy jest ściśle powiązany z dalszym uzupełnieniem go o strukturę treningowych tygodni, w obrębie których definiowane są dni treningowe oraz przypisywane ćwiczenia. Endpoint ten inicjuje proces, który zostanie rozwinięty poprzez dedykowane endpointy do zarządzania treningowymi dniami i ćwiczeniami.

## 2. Szczegóły żądania

- **Metoda HTTP**: POST
- **Struktura URL**: `/training-plans`
- **Parametry**:
  - **Wymagane**:
    - `name` (string): Nazwa planu treningowego.
    - `description` (string): Opis planu treningowego.
  - **Opcjonalne**:
    - `is_active` (boolean): Flaga oznaczająca, czy plan treningowy ma być aktywny (domyślnie false, jeśli nie podano).
- **Request Body** (JSON):

```json
{
  "name": "string",
  "description": "string",
  "is_active": true
}
```

## 3. Wykorzystywane typy

- **DTO i Command Modele**:
  - `CreateTrainingPlanCommand`: zawiera pola: `name`, `description`, oraz opcjonalnie `is_active`.
  - `CreateTrainingPlanResponseDTO`: zawiera pola: `id` (UUID) i `message` (string).
- **Inne typy**:
  - `UUID` (string), `Timestamp` (string) zdefiniowane w `src/types.ts`.

## 4. Szczegóły odpowiedzi

- **Sukces**:
  - Kod: 201
  - Treść odpowiedzi (JSON):
    ```json
    {
      "id": "UUID",
      "message": "Training plan created successfully"
    }
    ```
- **Błędy**:
  - 400: Nieprawidłowe dane wejściowe (np. brak wymaganych pól, błędny format danych).
  - 401: Nieautoryzowany dostęp (użytkownik niezalogowany lub bez wymaganych uprawnień).
  - 500: Błąd wewnętrzny serwera (np. problem z bazą danych).

## 5. Przepływ danych

1. Żądanie trafia na endpoint `/training-plans`.
2. Middleware autoryzacji (oparty na Supabase Auth) weryfikuje tożsamość użytkownika.
3. Warstwa walidacji (przy użyciu Zod lub podobnego narzędzia) sprawdza dane wejściowe zgodnie z `CreateTrainingPlanCommand`.
4. Logika biznesowa, wydzielona do serwisu (np. `trainingPlanService` w `src/lib/services`), wykonuje następujące kroki:
   - Pobiera identyfikator użytkownika z kontekstu autoryzacji.
   - Wykonuje operację INSERT do tabeli `training_plans`, ustawiając `user_id`, `name`, `description`, opcjonalnie `is_active` oraz domyślnie `source` na "manual".
5. Po udanej operacji, serwis zwraca nowo utworzony `id` planu treningowego.
6. Kontroler przesyła odpowiedź do klienta z kodem 201 i strukturą `CreateTrainingPlanResponseDTO`.
7. Następnie proces uzupełniania planu treningowego rozpoczyna się poprzez wykorzystanie dedykowanych endpointów do tworzenia treningowych tygodni, dni treningowych oraz przypisywania ćwiczeń, uzupełniających strukturę planu.

## 6. Względy bezpieczeństwa

- **Autoryzacja**: Weryfikacja użytkownika za pomocą Supabase Auth. Dostęp do tworzenia planów mają tylko autoryzowani użytkownicy.
- **RLS**: Tabela `training_plans` posiada polityki RLS, które pozwalają na tworzenie rekordów tylko przez właściciela (autora).
- **Walidacja**: Szczegółowa walidacja danych wejściowych (np. długość ciągów, obecność wymaganych pól) przy użyciu Zod.
- **Ochrona przed atakami**: Użycie parametrów zapytań w celu ochrony przed SQL Injection. Monitorowanie nieudanych prób operacji.

## 7. Obsługa błędów

- **400 (Bad Request)**: Odpowiedź z informacjami o błędach walidacji (np. brak `name` lub `description`).
- **401 (Unauthorized)**: Odpowiedź gdy użytkownik nie jest zalogowany lub nie posiada odpowiednich uprawnień.
- **500 (Internal Server Error)**: W przypadku problemów na poziomie bazy danych lub niespodziewanych błędów serwera. Wszystkie błędy należy logować i monitorować.

## 8. Rozważania dotyczące wydajności

- **Indeksy**: Upewnienie się, że tabela `training_plans` posiada indeks na `user_id` dla przyspieszenia wyszukiwania i operacji INSERT.
- **Optymalizacja zapytań**: Wykorzystywanie zoptymalizowanych zapytań do bazy danych, aby minimalizować obciążenie.
- **Monitoring**: Śledzenie obciążenia serwera i bazy danych, aby w razie potrzeby przeprowadzić skalowanie pionowe lub poziome.

## 9. Etapy wdrożenia

1. **Przygotowanie szkieletu endpointa**: Utworzenie pliku np. `src/pages/api/training-plans.ts` w projekcie Astro.
2. **Integracja middleware**: Dodanie middleware autoryzacyjnego opartego na Supabase, które weryfikuje token JWT i ustawia użytkownika w kontekście.
3. **Implementacja walidacji**: Wdrożenie walidacji danych wejściowych przy użyciu Zod, zgodnie z wymaganiami `CreateTrainingPlanCommand`.
4. **Logika biznesowa**: Wydzielenie logiki tworzenia planu do serwisu (np. `trainingPlanService`) w `src/lib/services`, zawierającego funkcję:
   - `async createTrainingPlan(command: CreateTrainingPlanCommand, userId: string): Promise<CreateTrainingPlanResponseDTO>`
5. **Integracja z bazą danych**: Wykonanie operacji INSERT do tabeli `training_plans` korzystając z klienta Supabase (pobranym z `context.locals`), zapewniając przypisanie `user_id` oraz ustawienie domyślnych wartości.
6. **Implementacja rozszerzonej struktury planu**: Zaprojektowanie i implementacja dodatkowych endpointów do zarządzania strukturą planu treningowego, obejmujących:
   - Endpoint do tworzenia treningowych tygodni
   - Endpoint do tworzenia dni treningowych powiązanych z danym tygodniem lub planem
   - Endpoint do dodawania ćwiczeń do konkretnego dnia treningowego
     Upewnienie się, że relacje między tabelami (`training_plans`, `training_days`, `training_day_exercises`) są poprawnie implementowane.
7. **Obsługa błędów i logowanie**: Dodanie mechanizmu obsługi błędów (try-catch) oraz logowania (np. przy użyciu winston lub innego loggera).
8. **Testy**: Przeprowadzenie testów jednostkowych oraz integracyjnych (np. za pomocą Postmana) w celu weryfikacji poprawności działania endpointa.
9. **Dokumentacja**: Uaktualnienie dokumentacji API (np. Swagger/OpenAPI) oraz wewnętrznych instrukcji dla zespołu.
10. **Deployment i monitoring**: Wdrożenie endpointa na środowisko produkcyjne oraz skonfigurowanie monitoringu wydajności i alertów dla operacji tworzenia planu treningowego i jego uzupełniania o szczegółowe moduły.

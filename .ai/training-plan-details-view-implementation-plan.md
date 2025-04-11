# Plan implementacji widoku Podgląd planu treningowego

## 1. Przegląd

Widok ma za zadanie prezentację szczegółowych informacji o wybranym planie treningowym. Użytkownik widzi nazwę, opis, listę treningowych dni wraz z przykładami ćwiczeń oraz możliwość rozpoczęcia treningu. Celem jest umożliwienie użytkownikowi szybkiego zapoznania się z zawartością planu oraz łatwe przejście do rozpoczęcia treningu.

## 2. Routing widoku

Widok będzie dostępny pod ścieżką: `/training-plans/:id`.

## 3. Struktura komponentów

- **TrainingPlanDetails** – główny kontener widoku, odpowiedzialny za pobranie danych planu oraz dystrybucję stanu do komponentów podrzędnych.
- **Header** – sekcja nagłówka zawierająca nazwę planu, opis oraz przycisk powrotu do listy planów.
- **TrainingDayList** – komponent listujący wszystkie dni treningowe planu.
- **TrainingDayItem** – pojedynczy element reprezentujący jeden dzień treningowy, wyświetlający m.in. listę ćwiczeń z ich szczegółami (serie, powtórzenia, czas przerwy).
- **StartTrainingButton** – przycisk umożliwiający rozpoczęcie treningu z wybranego planu.

## 4. Szczegóły komponentów

### TrainingPlanDetails

- **Opis:** Główny komponent widoku, który pobiera dane planu za pomocą API i zarządza stanem ładowania, błędami oraz danymi.
- **Główne elementy:** Header, TrainingDayList, StartTrainingButton.
- **Obsługiwane interakcje:** Pobranie danych przy montowaniu, wyświetlanie komunikatu błędu w przypadku niepowodzenia, przekazywanie danych do podrzędnych komponentów.
- **Walidacja:** Sprawdzenie czy odpowiedź zawiera wymagane pola: `id`, `name`, `description` oraz `training_days`.
- **Typy:** Korzysta z DTO `TrainingPlanDetailsDTO` pobranego z API, ewentualnie z własnym modelem widoku.
- **Propsy:** Jeśli występuje, może otrzymywać `planId` przekazany przez routing.

### Header

- **Opis:** Komponent wyświetlający nagłówek widoku z nazwą planu, opisem oraz przyciskiem powrotu.
- **Główne elementy:** Elementy HTML (np. `<h1>` dla nazwy, `<p>` dla opisu), przycisk "Powrót".
- **Obsługiwane interakcje:** Kliknięcie przycisku powrotu powoduje nawigację do listy planów.
- **Walidacja:** Brak dodatkowej walidacji, jedynie sprawdzenie czy `name` i `description` są niepuste.
- **Typy:** Prosty typ widoku: `{ name: string; description: string; }`
- **Propsy:** `name`, `description`, funkcja `onBack`.

### TrainingDayList

- **Opis:** Komponent odpowiedzialny za wyświetlenie listy dni treningowych z podziałem na ćwiczenia.
- **Główne elementy:** Lista elementów `TrainingDayItem` generowanych na podstawie tablicy dni treningowych.
- **Obsługiwane interakcje:** Kliknięcie na dany dzień może rozwijać szczegóły ćwiczeń (opcjonalnie).
- **Walidacja:** Sprawdzenie czy lista `training_days` nie jest pusta.
- **Typy:** Używa DTO z API dla listy dni, ewentualnie mapowanego do: `{ id: string; weekday: number; exercises: ExerciseViewModel[] }`.
- **Propsy:** `trainingDays: TrainingDayViewModel[]`

### TrainingDayItem

- **Opis:** Reprezentuje pojedynczy dzień treningowy wraz z listą ćwiczeń.
- **Główne elementy:** Informacja o dniu (np. nazwa dnia tygodnia), lista ćwiczeń (np. nazwa ćwiczenia, liczba serii, powtórzeń, czas przerwy).
- **Obsługiwane interakcje:** Możliwość klikania w dzień w celu rozwinięcia/pokazania dodatkowych szczegółów ćwiczeń.
- **Walidacja:** Weryfikacja dostępności danych ćwiczeń.
- **Typy:** Model widoku np. `TrainingDayViewModel` zawierający: `id: string; weekday: number; exercises: ExerciseViewModel[]`.
- **Propsy:** `day: TrainingDayViewModel`

### StartTrainingButton

- **Opis:** Przycisk umożliwiający rozpoczęcie wykonania treningu z wybranego planu.
- **Główne elementy:** Przycisk, który po kliknięciu inicjuje akcję nawigacji do widoku treningu.
- **Obsługiwane interakcje:** Kliknięcie przycisku.
- **Walidacja:** Aktywowany tylko, gdy plan spełnia minimalne wymagania (posiada co najmniej jeden dzień treningowy z ćwiczeniami).
- **Typy:** Prosty typ: `{ onStart: () => void; disabled?: boolean; }`
- **Propsy:** `onStart`, opcjonalnie `disabled`.

## 5. Typy

### DTO i modele widoku

- **TrainingPlanDetailsDTO** – dane pobierane z API:

  - `id: string`
  - `name: string`
  - `description: string | null`
  - `is_active: boolean`
  - `training_days: TrainingDayDTO[]`

- **TrainingDayDTO** – dane dnia treningowego:

  - `id: string`
  - `weekday: number`
  - `exercises: TrainingDayExerciseDTO[]`

- **TrainingDayExerciseDTO** – dane ćwiczenia w kontekście dnia treningowego:
  - `id: string`
  - `exercise: { id: string; name: string; }`
  - `order_index: number`
  - `sets: number`
  - `repetitions: number`
  - `rest_time_seconds: number`

### Modele widoku (ViewModel)

- **TrainingPlanViewModel** – model wykorzystywany w komponencie:

  - `id: string`
  - `name: string`
  - `description: string`
  - `trainingDays: TrainingDayViewModel[]`

- **TrainingDayViewModel** – model dnia treningowego:

  - `id: string`
  - `weekday: number`
  - `exercises: ExerciseViewModel[]`

- **ExerciseViewModel** – model ćwiczenia:
  - `id: string`
  - `name: string`
  - `orderIndex: number`
  - `sets: number`
  - `repetitions: number`
  - `restTimeSeconds: number`

## 6. Zarządzanie stanem

- Użycie hooka `useState` do przechowywania danych planu, stanu ładowania oraz błędów.
- Użycie `useEffect` do pobrania danych z API po montażu komponentu.
- Opcjonalnie stworzenie customowego hooka `useTrainingPlanDetails(planId: string)` zwracającego { data, loading, error }.

## 7. Integracja API

- Wywołanie endpointu GET `/training-plans/{plan_id}` przy użyciu fetch lub biblioteki takiej jak axios.
- Oczekiwany format odpowiedzi: JSON zawierający pola: `id`, `name`, `description`, `is_active`, `training_days`.
- Weryfikacja poprawności odpowiedzi: sprawdzenie obecności wymaganych pól i obsługa błędów (np. 401, 404).
- Aktualizacja stanu za pomocą pobranych danych lub wyświetlenie komunikatu błędu.

## 8. Interakcje użytkownika

- Kliknięcie przycisku powrotu przenosi użytkownika z powrotem na listę planów treningowych.
- Kliknięcie poszczególnego dnia treningowego może rozwijać lub przełączać widok szczegółów ćwiczeń danego dnia (opcjonalnie jako dodatkowa funkcjonalność).
- Kliknięcie przycisku "Rozpocznij trening" inicjuje akcję nawigacyjną do widoku treningu, przekazując informacje o planie.

## 9. Warunki i walidacja

- Walidacja odpowiedzi z API: sprawdzenie, czy wszystkie wymagane pola są obecne.
- Sprawdzenie, czy lista `training_days` nie jest pusta, zanim zostanie aktywowany przycisk rozpoczęcia treningu.
- Walidacja danych wejściowych przy ewentualnej edycji lub interakcji, np. potwierdzenie wybory przez użytkownika.

## 10. Obsługa błędów

- Prezentacja komunikatu błędu w przypadku nieudanego pobrania danych z API.
- Logowanie błędów do konsoli lub systemu zbierania logów.
- Wyświetlenie użytkownikowi przyjaznej informacji o problemie wraz z możliwością ponownej próby.

## 11. Kroki implementacji

1. Stworzenie nowego widoku i dodanie odpowiedniej ścieżki w systemie routingu (`/training-plans/:id`).
2. Implementacja głównego komponentu `TrainingPlanDetails` odpowiedzialnego za pobranie danych z API przy użyciu custom hooka (np. `useTrainingPlanDetails`).
3. Utworzenie komponentu `Header` prezentującego nazwę planu, opis oraz przycisk powrotu.
4. Implementacja komponentu `TrainingDayList` oraz `TrainingDayItem` do wyświetlania dni treningowych i szczegółów ćwiczeń.
5. Dodanie komponentu `StartTrainingButton` oraz logiki nawigacyjnej umożliwiającej rozpoczęcie treningu.
6. Integracja z API GET `/training-plans/{plan_id}`, walidacja odpowiedzi i obsługa stanu ładowania oraz błędów.
7. Dodanie responsywności i dostosowanie stylów zgodnie z Tailwind 4 oraz wytycznymi Shadcn/ui.

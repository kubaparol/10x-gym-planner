# Plan implementacji widoku Kreatora Planu Treningowego

## 1. Przegląd

Widok "Kreator Planu Treningowego" umożliwia użytkownikom tworzenie nowych planów treningowych w aplikacji Gym Planner. Oferuje dwa tryby: manualne wprowadzanie danych oraz import struktury planu z pliku PDF przy użyciu AI. Użytkownik może dynamicznie dodawać i usuwać dni treningowe oraz ćwiczenia, a następnie zapisać kompletny plan w systemie. Widok ten realizuje historyjki użytkownika US-005 i US-006.

## 2. Routing widoku

Widok powinien być dostępny pod ścieżką `/create-training-plan`. Implementacja w Astro (`src/pages/create-training-plan.astro`).

## 3. Struktura komponentów

Hierarchia komponentów React z wykorzystaniem Shadcn/ui:

## 4. Szczegóły komponentów

### `CreateTrainingPlanView`

- **Opis:** Główny komponent React zarządzający logiką widoku. Przełącza między trybami, zarządza stanem formularza (`planData`), obsługuje wywołania API (konwersja PDF, zapis planu), zarządza stanami ładowania i błędów, renderuje odpowiednie sub-komponenty (`PlanModeSelector`, `ManualPlanForm`, `PdfPlanImporter`) oraz modal potwierdzenia.
- **Główne elementy:** `PlanModeSelector`, `ManualPlanForm` (warunkowo/zawsze), `PdfPlanImporter` (warunkowo), `ConfirmationModal` (warunkowo), przycisk "Zapisz".
- **Obsługiwane interakcje:** Zmiana trybu, obsługa wyniku uploadu PDF, inicjacja zapisu planu, potwierdzenie/anulowanie zapisu.
- **Obsługiwana walidacja:** Koordynuje ogólną walidację przed zapisem (czy plan ma >0 dni, każdy dzień >0 ćwiczeń).
- **Typy:** `TrainingPlanFormViewModel` (stan wewnętrzny), `CreateCompleteTrainingPlanCommand` (do API), `PdfTrainingPlanImportResponseDTO` (z API), `mode: "manual" | "pdf"`, `isLoading: boolean`, `error: string | null`, `isConfirmModalOpen: boolean`.
- **Propsy:** Brak (jest komponentem najwyższego poziomu w ramach widoku React).

### `PlanModeSelector`

- **Opis:** Umożliwia wybór trybu tworzenia planu: "Manualny" lub "Import PDF".
- **Główne elementy:** Komponent `Tabs` lub `RadioGroup` z Shadcn/ui.
- **Obsługiwane interakcje:** Kliknięcie na opcję trybu.
- **Obsługiwana walidacja:** Brak.
- **Typy:** `mode: "manual" | "pdf"`.
- **Propsy:** `currentMode: "manual" | "pdf"`, `onModeChange: (mode: "manual" | "pdf") => void`.

### `PdfPlanImporter`

- **Opis:** Obsługuje proces importu PDF. Zawiera input pliku, logikę wywołania API konwersji i wyświetlanie statusu/błędów.
- **Główne elementy:** `Input type="file"`, wskaźnik ładowania, `Alert` do błędów.
- **Obsługiwane interakcje:** Wybór pliku PDF, (automatyczny) upload.
- **Obsługiwana walidacja:** Sprawdzenie typu pliku (`.pdf`).
- **Typy:** `File | null`, `isUploading: boolean`, `uploadError: string | null`.
- **Propsy:** `onUploadSuccess: (data: PdfTrainingPlanImportResponseDTO) => void`, `onUploadError: (error: string) => void`, `setIsLoading: (loading: boolean) => void`.

### `ManualPlanForm`

- **Opis:** Główny formularz do wprowadzania/edycji danych planu. Zawiera `PlanMetadataForm` i `TrainingDaysList`. Może być używany zarówno w trybie manualnym, jak i do edycji danych po imporcie PDF. Zarządzany przez `react-hook-form` z resolverem `zod`.
- **Główne elementy:** Komponent `Form` z Shadcn/ui, `PlanMetadataForm`, `TrainingDaysList`.
- **Obsługiwane interakcje:** Wprowadzanie danych w polach, dodawanie/usuwanie dni/ćwiczeń (delegowane do list).
- **Obsługiwana walidacja:** Przekazuje walidację do pól podrzędnych za pomocą `react-hook-form`.
- **Typy:** `TrainingPlanFormViewModel` (jako wartości formularza).
- **Propsy:** `planData: TrainingPlanFormViewModel`, `onPlanChange: (updatedData: TrainingPlanFormViewModel) => void` (lub zarządzane przez `react-hook-form` context).

### `PlanMetadataForm`

- **Opis:** Sekcja formularza dla nazwy i opisu planu.
- **Główne elementy:** `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` (Shadcn/ui), `Input` (dla nazwy), `Textarea` (dla opisu).
- **Obsługiwane interakcje:** Wpisywanie tekstu.
- **Obsługiwana walidacja:**
  - `name`: Wymagane, `string`, max 100 znaków.
  - `description`: Wymagane, `string`, max 500 znaków.
- **Typy:** Pola `name` i `description` z `TrainingPlanFormViewModel`.
- **Propsy:** Kontrolki formularza przekazane z `react-hook-form`.

### `TrainingDaysList`

- **Opis:** Zarządza listą dni treningowych (`TrainingDayCard`). Umożliwia dodawanie nowych dni.
- **Główne elementy:** Kontener listy, mapowanie `planData.training_days` do `TrainingDayCard`, przycisk "Dodaj dzień" (`Button` z Shadcn/ui).
- **Obsługiwane interakcje:** Kliknięcie "Dodaj dzień", obsługa zdarzeń z `TrainingDayCard` (usunięcie dnia, zmiana danych dnia).
- **Obsługiwana walidacja:** Plan musi zawierać co najmniej 1 dzień (walidacja na poziomie `CreateTrainingPlanView` przed zapisem lub w schemacie Zod).
- **Typy:** `TrainingDayFormViewModel[]`.
- **Propsy:** Kontrolki formularza dla tablicy `training_days` (`useFieldArray` z `react-hook-form`), `removeDay: (index: number) => void`, `updateDay: (index: number, data: TrainingDayFormViewModel) => void`.

### `TrainingDayCard`

- **Opis:** Reprezentuje pojedynczy dzień treningowy w formularzu. Zawiera wybór dnia tygodnia i listę ćwiczeń (`ExercisesList`). Umożliwia usunięcie dnia.
- **Główne elementy:** `Card`, `CardHeader` (z `Select` dla dnia tygodnia i przyciskiem usuwania), `CardContent` (z `ExercisesList`).
- **Obsługiwane interakcje:** Wybór dnia tygodnia, kliknięcie "Usuń dzień", obsługa zdarzeń z `ExercisesList`.
- **Obsługiwana walidacja:**
  - `weekday`: Wymagane, `number`, 0-6. Powinien być unikalny w ramach planu (walidacja na poziomie schemy Zod lub `CreateTrainingPlanView`).
- **Typy:** `TrainingDayFormViewModel`.
- **Propsy:** Kontrolki formularza dla obiektu dnia (`react-hook-form`), `index: number`, `removeDay: (index: number) => void`.

### `ExercisesList`

- **Opis:** Zarządza listą ćwiczeń (`ExerciseForm`) w ramach dnia treningowego. Umożliwia dodawanie nowych ćwiczeń.
- **Główne elementy:** Kontener listy, mapowanie `dayData.exercises` do `ExerciseForm`, przycisk "Dodaj ćwiczenie" (`Button` z Shadcn/ui).
- **Obsługiwane interakcje:** Kliknięcie "Dodaj ćwiczenie", obsługa zdarzeń z `ExerciseForm` (usunięcie ćwiczenia, zmiana danych ćwiczenia).
- **Obsługiwana walidacja:** Dzień musi zawierać co najmniej 1 ćwiczenie (walidacja na poziomie schemy Zod lub `CreateTrainingPlanView`).
- **Typy:** `ExerciseFormViewModel[]`.
- **Propsy:** Kontrolki formularza dla tablicy `exercises` (`useFieldArray` z `react-hook-form`), `removeExercise: (index: number) => void`, `updateExercise: (index: number, data: ExerciseFormViewModel) => void`.

### `ExerciseForm`

- **Opis:** Formularz dla pojedynczego ćwiczenia (nazwa, serie, powtórzenia, odpoczynek). Umożliwia usunięcie ćwiczenia.
- **Główne elementy:** Kontener (np. `div` z flex), `FormField` dla każdego pola (`Input`), przycisk "Usuń ćwiczenie".
- **Obsługiwane interakcje:** Wprowadzanie danych, kliknięcie "Usuń ćwiczenie".
- **Obsługiwana walidacja:**
  - `exercise_name`: Wymagane, `string`.
  - `sets`: Wymagane, `number` (całkowite), min 1.
  - `repetitions`: Wymagane, `number` (całkowite), min 1.
  - `rest_time_seconds`: Wymagane, `number` (całkowite), min 1.
- **Typy:** `ExerciseFormViewModel`.
- **Propsy:** Kontrolki formularza dla obiektu ćwiczenia (`react-hook-form`), `index: number`, `removeExercise: (index: number) => void`.

### `ConfirmationModal`

- **Opis:** Generyczny modal do potwierdzania akcji (np. zapisu planu).
- **Główne elementy:** `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `Button` (Potwierdź), `Button` (Anuluj).
- **Obsługiwane interakcje:** Kliknięcie "Potwierdź", kliknięcie "Anuluj", zamknięcie modala.
- **Obsługiwana walidacja:** Brak.
- **Typy:** Brak specyficznych dla danych planu.
- **Propsy:** `isOpen: boolean`, `onClose: () => void`, `onConfirm: () => void`, `title: string`, `description: string`.

## 5. Typy

- **API DTOs (z `src/types.ts`):**
  - `CreateCompleteTrainingPlanCommand`: Struktura danych wysyłana do `POST /training-plans`.
  - `CreateTrainingDayCommand`: Część `CreateCompleteTrainingPlanCommand`.
  - `CreateTrainingDayExerciseCommand`: Część `CreateTrainingDayCommand`.
  - `PdfTrainingPlanImportResponseDTO`: Odpowiedź z `POST /training-plans/pdf/convert`, zawiera pole `plan` o strukturze `CreateCompleteTrainingPlanCommand`.
  - `CreateTrainingPlanResponseDTO`: Odpowiedź z `POST /training-plans`.
- **ViewModel (dla stanu formularza React):**
  - `TrainingPlanFormViewModel`:
    - `id`: `string` (tymczasowe ID dla React key, np. `uuidv4()`)
    - `name`: `string`
    - `description`: `string`
    - `training_days`: `TrainingDayFormViewModel[]`
    - `source`: `"manual" | "pdf_import"`
  - `TrainingDayFormViewModel`:
    - `id`: `string` (tymczasowe ID dla React key)
    - `weekday`: `number | null` (lub `string` dla Select, konwersja przed zapisem)
    - `exercises`: `ExerciseFormViewModel[]`
  - `ExerciseFormViewModel`:
    - `id`: `string` (tymczasowe ID dla React key)
    - `exercise_name`: `string`
    - `order_index`: `number` (ustalane przed wysłaniem do API)
    - `sets`: `string` (lub `number`, `react-hook-form` może obsłużyć `valueAsNumber`)
    - `repetitions`: `string` (lub `number`)
    - `rest_time_seconds`: `string` (lub `number`)
- **Funkcja konwertująca:** Potrzebna funkcja `convertViewModelToCommand(viewModel: TrainingPlanFormViewModel): CreateCompleteTrainingPlanCommand`, która przed wysłaniem do API:
  - Waliduje cały obiekt.
  - Konwertuje typy (np. `string` -> `number`).
  - Usuwa tymczasowe `id`.
  - Oblicza `order_index` dla ćwiczeń na podstawie ich kolejności w tablicy `exercises`.
  - Zwraca obiekt zgodny z `CreateCompleteTrainingPlanCommand`.

## 6. Zarządzanie stanem

- **Główny stan:** W komponencie `CreateTrainingPlanView`.
  - `mode: "manual" | "pdf"` (`useState`)
  - `planData: TrainingPlanFormViewModel` (zarządzane przez `react-hook-form`)
  - `isLoading: boolean` (dla API calls, `useState`)
  - `error: string | null` (dla błędów API, `useState`)
  - `isConfirmModalOpen: boolean` (`useState`)
- **Stan formularza:** Zarządzany za pomocą `react-hook-form`.
  - `useForm` w `CreateTrainingPlanView` z `TrainingPlanFormViewModel` jako typem generycznym i resolverem Zod.
  - `useFieldArray` używany w `TrainingDaysList` (dla `training_days`) i `ExercisesList` (dla `exercises`).
  - Stan poszczególnych pól jest zarządzany przez `react-hook-form` i przekazywany do komponentów `Input`, `Select`, `Textarea` za pomocą propsów `control` i `register` lub `<Controller>`.
- **Stan importu PDF:** W `PdfPlanImporter`.
  - `isUploading: boolean` (`useState`)
  - `uploadError: string | null` (`useState`)
- **Custom Hook:** `useTrainingPlanForm` nie jest konieczny przy użyciu `react-hook-form`, ponieważ biblioteka ta dostarcza własne hooki (`useForm`, `useFieldArray`).

## 7. Integracja API

- **Konwersja PDF:**
  - Komponent: `PdfPlanImporter`
  - Trigger: Wybór pliku PDF.
  - Akcja: Wywołanie `POST /api/training-plans/pdf/convert`.
  - Żądanie: `FormData` z polem `file` (plik PDF).
  - Odpowiedź (Sukces): `PdfTrainingPlanImportResponseDTO`. Aktualizacja stanu formularza (`react-hook-form` `reset`) danymi z `response.plan`, ustawienie `mode` na `manual`, ustawienie `source` na `pdf_import`.
  - Odpowiedź (Błąd): Wyświetlenie komunikatu błędu.
- **Zapis Planu:**
  - Komponent: `CreateTrainingPlanView`
  - Trigger: Kliknięcie "Potwierdź" w `ConfirmationModal`.
  - Akcja:
    1.  Pobranie danych z `react-hook-form` (`getValues`).
    2.  Konwersja `TrainingPlanFormViewModel` do `CreateCompleteTrainingPlanCommand` (w tym obliczenie `order_index`).
    3.  Wywołanie `POST /api/training-plans`.
  - Żądanie: Ciało JSON typu `CreateCompleteTrainingPlanCommand`.
  - Odpowiedź (Sukces, 201): `CreateTrainingPlanResponseDTO`. Wyświetlenie komunikatu sukcesu (np. `Toast`), przekierowanie do listy planów (`/training-plans`).
  - Odpowiedź (Błąd, 400/500): Wyświetlenie komunikatu błędu (np. `Toast`).

## 8. Interakcje użytkownika

- **Wybór trybu:** Zmienia widoczne komponenty (uploader PDF vs formularz manualny).
- **Upload PDF:** Użytkownik wybiera plik. Pokazuje się stan ładowania. Po sukcesie formularz (`ManualPlanForm`) jest wypełniany danymi z API. W razie błędu pojawia się komunikat.
- **Wprowadzanie danych:** Pola formularza aktualizują stan (`react-hook-form`). Walidacja `onBlur` lub `onChange`. Komunikaty błędów pojawiają się przy polach.
- **Dodaj/Usuń Dzień/Ćwiczenie:** Dynamiczne dodawanie/usuwanie odpowiednich sekcji formularza (`useFieldArray`).
- **Wybór dnia tygodnia:** Aktualizacja stanu pola `weekday`.
- **Kliknięcie "Zapisz":**
  - Uruchomienie walidacji całego formularza (`react-hook-form` `trigger`).
  - Jeśli są błędy, zostają wyświetlone, przycisk może być zablokowany lub akcja przerwana.
  - Jeśli brak błędów, otwiera się `ConfirmationModal`.
- **Potwierdzenie w modalu:** Rozpoczyna się proces zapisu (wywołanie API), pokazywany jest stan ładowania. Po sukcesie następuje przekierowanie. Po błędzie - komunikat.
- **Anulowanie w modalu:** Modal jest zamykany, stan formularza pozostaje bez zmian.

## 9. Warunki i walidacja

Walidacja realizowana przy użyciu `react-hook-form` i `zod-resolver`. Schemat Zod (`createCompleteTrainingPlanSchema` - podobny do backendowego, ale dostosowany do ViewModel) definiuje wszystkie warunki:

- `name`: Wymagane (`min(1)`), max 100 znaków (`max(100)`).
- `description`: Wymagane (`min(1)`), max 500 znaków (`max(500)`).
- `training_days`: Tablica, wymagane co najmniej 1 element (`min(1)`).
  - `weekday`: Wymagane, `number`, 0-6 (`min(0).max(6)`). Powinien być unikalny - walidacja przez `.refine` na tablicy `training_days`.
  - `exercises`: Tablica, wymagane co najmniej 1 element (`min(1)`).
    - `exercise_name`: Wymagane (`min(1)`), `string`.
    - `sets`: Wymagane, `number` (całkowite, dodatnie - `.positive().int()`), min 1 (`min(1)`). Konwersja z `string` (`z.coerce.number()`).
    - `repetitions`: Wymagane, `number` (całkowite, dodatnie), min 1. Konwersja.
    - `rest_time_seconds`: Wymagane, `number` (całkowite, dodatnie), min 1. Konwersja.
- `source`: Opcjonalne (`optional`), enum `"manual" | "pdf_import"`.
- Walidacja PDF: Sprawdzenie rozszerzenia pliku (`.pdf`) przed uploadem.

Komunikaty błędów wyświetlane są przy użyciu komponentu `FormMessage` z Shadcn/ui, powiązanego z `react-hook-form`. Przycisk "Zapisz" powinien być deaktywowany (`disabled`), jeśli formularz jest niepoprawny (`!formState.isValid`).

## 10. Obsługa błędów

- **Błędy walidacji frontendowej:** Obsługiwane przez `react-hook-form` i `zod`, komunikaty wyświetlane przy polach.
- **Błędy API (Konwersja PDF / Zapis Planu):**
  - Wyświetlanie komunikatu błędu za pomocą komponentu `Toast` (Shadcn/ui) lub `Alert`.
  - Logowanie szczegółów błędu do konsoli deweloperskiej.
  - W przypadku błędu zapisu, stan formularza powinien zostać zachowany, aby użytkownik mógł spróbować ponownie.
  - Rozróżnienie błędów sieciowych od błędów serwera (np. 400 Bad Request - problem z danymi, 500 Internal Server Error - problem po stronie serwera). W przypadku 400 można spróbować wyświetlić bardziej szczegółowy komunikat z odpowiedzi API, jeśli jest dostępny.
- **Błąd uploadu PDF (np. zły typ pliku):** Komunikat w `PdfPlanImporter`.
- **Stan ładowania:** Użycie wskaźników ładowania (np. `Loader2` z `lucide-react` w przyciskach) podczas operacji API.

## 11. Kroki implementacji

1.  **Utworzenie struktury plików:**
    - Strona Astro: `src/pages/create-training-plan.astro`.
    - Główny komponent React: `src/components/views/CreateTrainingPlanView.tsx`.
    - Komponenty podrzędne w `src/components/create-plan/`.
    - Ewentualny schemat Zod w `src/lib/validators/training-plan.schema.ts`.
2.  **Implementacja strony Astro:** Stworzenie pliku `.astro`, import i renderowanie komponentu `CreateTrainingPlanView` jako `client:load` lub `client:visible`.
3.  **Implementacja `CreateTrainingPlanView`:**
    - Podstawowy layout.
    - Implementacja `useState` dla `mode`, `isLoading`, `error`, `isConfirmModalOpen`.
    - Konfiguracja `react-hook-form` z `useForm` i resolverem Zod.
    - Renderowanie `PlanModeSelector`.
4.  **Implementacja `PlanModeSelector`:** Prosty komponent Tabs/RadioGroup.
5.  **Implementacja `PdfPlanImporter`:**
    - Input pliku, walidacja typu.
    - Logika wywołania API `POST /api/training-plans/pdf/convert` (np. przy użyciu `fetch` lub biblioteki typu `axios`/`tanstack-query`).
    - Obsługa stanu ładowania i błędów. Wywołanie `onUploadSuccess`/`onUploadError`.
6.  **Implementacja `ManualPlanForm`:**
    - Struktura z komponentem `Form` Shadcn/ui.
    - Integracja z `react-hook-form` context.
    - Renderowanie `PlanMetadataForm` i `TrainingDaysList`.
7.  **Implementacja `PlanMetadataForm`:** Pola Input/Textarea zintegrowane z `react-hook-form`.
8.  **Implementacja `TrainingDaysList`:**
    - Użycie `useFieldArray` dla `training_days`.
    - Mapowanie dni do `TrainingDayCard`.
    - Przycisk "Dodaj dzień" (`append`).
9.  **Implementacja `TrainingDayCard`:**
    - Komponent `Card`.
    - Select dla `weekday` zintegrowany z `react-hook-form`.
    - Przycisk "Usuń dzień" (`remove`).
    - Renderowanie `ExercisesList`.
10. **Implementacja `ExercisesList`:**
    - Użycie `useFieldArray` dla `exercises`.
    - Mapowanie ćwiczeń do `ExerciseForm`.
    - Przycisk "Dodaj ćwiczenie" (`append`).
11. **Implementacja `ExerciseForm`:** Pola Input zintegrowane z `react-hook-form`, przycisk "Usuń ćwiczenie" (`remove`).
12. **Implementacja logiki zapisu w `CreateTrainingPlanView`:**
    - Funkcja `onSubmit` dla `react-hook-form`.
    - Otwarcie `ConfirmationModal`.
    - Funkcja `handleConfirmSave`: konwersja ViewModel -> DTO, wywołanie API `POST /api/training-plans`.
    - Obsługa odpowiedzi API (sukces/błąd), aktualizacja `isLoading`, `error`.
    - Przekierowanie po sukcesie (`Astro.redirect` lub `window.location.href`).
13. **Implementacja `ConfirmationModal`:** Standardowy modal Shadcn/ui.
14. **Styling:** Użycie Tailwind CSS i komponentów Shadcn/ui do stylizacji.
15. **Testowanie:** Manualne testowanie obu przepływów (manualny, PDF), walidacji, obsługi błędów i responsywności.


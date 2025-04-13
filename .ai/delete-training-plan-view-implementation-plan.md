# Plan implementacji widoku usuwania planu treningowego

## 1. Przegląd

Ten plan opisuje implementację funkcjonalności usuwania planu treningowego w widoku listy planów (`/training-plans`). Użytkownik będzie mógł wybrać plan do usunięcia, potwierdzić swoją decyzję w oknie dialogowym, a następnie plan zostanie usunięty z systemu za pośrednictwem wywołania API. Widok poinformuje użytkownika o wyniku operacji.

## 2. Routing widoku

Funkcjonalność usuwania będzie częścią istniejącego widoku listy planów treningowych, dostępnego pod ścieżką:

- `/training-plans`

## 3. Struktura komponentów

Implementacja będzie wymagała modyfikacji istniejących komponentów i potencjalnie dodania komponentu dialogowego. Główna struktura:

```
/src/pages/training-plans.astro       // Strona Astro hostująca listę
└── /src/components/TrainingPlanList.tsx // Komponent React wyświetlający listę i zarządzający logiką
    ├── /src/components/TrainingPlanCard.tsx // Komponent React dla pojedynczej karty planu (dodanie przycisku Usuń)
    │   └── Button (Shadcn/ui) // Przycisk "Usuń"
    └── AlertDialog (Shadcn/ui) // Komponent dialogowy do potwierdzenia usunięcia (wykorzystanie AlertDialog z Shadcn)
    └── Toast (Shadcn/ui)         // Komponent do wyświetlania powiadomień (sukces/błąd)
```

## 4. Szczegóły komponentów

### `TrainingPlanList.tsx`

- **Opis komponentu:** Komponent React odpowiedzialny za pobieranie listy planów treningowych, renderowanie `TrainingPlanCard` dla każdego planu oraz zarządzanie logiką usuwania, w tym wyświetlanie dialogu potwierdzającego i obsługę wywołań API. Wykorzystuje `client:load` lub `client:visible` w Astro.
- **Główne elementy:** Kontener listy, mapowanie stanu `plans` na komponenty `TrainingPlanCard`, warunkowe renderowanie wskaźnika ładowania/błędu, implementacja `AlertDialog` (Shadcn) i `Toast` (Shadcn).
- **Obsługiwane interakcje:**
  - Pobieranie listy planów przy montowaniu komponentu.
  - Obsługa zdarzenia `onDelete` z `TrainingPlanCard`: ustawienie stanu do otwarcia dialogu potwierdzającego.
  - Obsługa potwierdzenia z `AlertDialog`: wywołanie API `DELETE /training-plans/{plan_id}`.
  - Obsługa anulowania z `AlertDialog`: zamknięcie dialogu.
  - Aktualizacja stanu `plans` po pomyślnym usunięciu.
  - Wyświetlanie powiadomień (Toast) o sukcesie lub błędzie operacji.
- **Obsługiwana walidacja:** Sprawdzenie, czy `plan_id` do usunięcia jest dostępne przed otwarciem dialogu/wywołaniem API (logika wewnętrzna komponentu). Weryfikacja stanu autentykacji przed próbą usunięcia.
- **Typy:** `TrainingPlanListDTO[]`, `DeleteResponseDTO`, `UUID`.
- **Propsy:** Brak (komponent prawdopodobnie zarządza własnym stanem pobierania danych lub otrzymuje dane z kontekstu/hooka).

### `TrainingPlanCard.tsx`

- **Opis komponentu:** Komponent React wyświetlający informacje o pojedynczym planie treningowym. **Wymaga modyfikacji**, aby dodać przycisk "Usuń".
- **Główne elementy:** Elementy wyświetlające nazwę, opis planu. Przycisk "Szczegóły" (istniejący). **Nowy przycisk "Usuń"** (np. ikona kosza z `Button` Shadcn/ui).
- **Obsługiwane interakcje:**
  - `onClick` na przycisku "Usuń": wywołanie funkcji zwrotnej `onDelete` przekazanej jako prop, z `plan.id` jako argumentem.
- **Obsługiwana walidacja:** Brak bezpośredniej walidacji w tym komponencie.
- **Typy:** `TrainingPlanListDTO` (jako prop `plan`).
- **Propsy:**
  - `plan: TrainingPlanListDTO`
  - `onDelete: (planId: UUID) => void` (nowy prop do obsługi kliknięcia usuń)
  - `onViewDetails: (planId: UUID) => void` (istniejący prop)

### `AlertDialog` (Shadcn/ui)

- **Opis komponentu:** Wykorzystanie wbudowanego komponentu `AlertDialog` z biblioteki Shadcn/ui do wyświetlenia modalnego okna dialogowego z prośbą o potwierdzenie usunięcia. Będzie zintegrowany wewnątrz `TrainingPlanList`.
- **Główne elementy:** `AlertDialogTrigger` (powiązany z przyciskiem "Usuń" w `TrainingPlanCard` lub zarządzany stanem w `TrainingPlanList`), `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogCancel`, `AlertDialogAction`.
- **Obsługiwane interakcje:**
  - `onConfirm` (na `AlertDialogAction`): wywołuje funkcję zwrotną potwierdzającą usunięcie.
  - `onCancel` (na `AlertDialogCancel`): wywołuje funkcję zwrotną anulującą usunięcie.
- **Obsługiwana walidacja:** Brak.
- **Typy:** Brak specyficznych typów DTO/ViewModel; wykorzystuje standardowe propsy React i Shadcn.
- **Propsy:** Konfigurowane wewnątrz `TrainingPlanList` (np. `open`, `onOpenChange`, tekst tytułu/opisu, funkcje zwrotne dla akcji).

## 5. Typy

- **Istniejące (z `src/types.ts`):**
  - `UUID`: `string` - Typ dla identyfikatorów.
  - `TrainingPlanListDTO`:
    ```typescript
    export interface TrainingPlanListDTO {
      id: UUID;
      name: string;
      description: string | null;
      is_active: boolean;
      created_at: Timestamp;
    }
    ```
  - `DeleteResponseDTO`:
    ```typescript
    export interface DeleteResponseDTO {
      message: string;
    }
    ```
- **Nowe typy/ViewModele:** Na potrzeby tej funkcjonalności nie przewiduje się tworzenia nowych dedykowanych typów ViewModel. Będziemy operować na istniejących `TrainingPlanListDTO` i `DeleteResponseDTO`.

## 6. Zarządzanie stanem

Stan będzie zarządzany głównie w komponencie `TrainingPlanList.tsx` przy użyciu hooków React (`useState`, `useEffect`).

- `plans: TrainingPlanListDTO[]`: Lista planów treningowych.
- `isLoading: boolean`: Status ładowania (zarówno dla pobierania listy, jak i operacji usuwania).
- `error: string | null`: Komunikat błędu (dla pobierania lub usuwania).
- `planToDelete: UUID | null`: Przechowuje ID planu wybranego do usunięcia, gdy dialog jest aktywny.
- `isConfirmDeleteDialogOpen: boolean`: Kontroluje widoczność `AlertDialog`.

Rozważenie **Custom Hooka** (`useTrainingPlans`):

- **Cel:** Zamknięcie logiki pobierania listy planów (`GET /training-plans`) oraz logiki usuwania (`DELETE /training-plans/{id}`) wraz z zarządzaniem stanem (`plans`, `isLoading`, `error`) w jednym miejscu.
- **Struktura:** Hook zwracałby `{ plans, isLoading, error, deletePlan }`. Funkcja `deletePlan(planId: UUID)` wewnętrznie obsługiwałaby otwarcie dialogu, wywołanie API i aktualizację stanu.
- **Korzyści:** Lepsza separacja logiki, reużywalność, czystszy komponent `TrainingPlanList`. **Rekomendowane podejście.**

## 7. Integracja API

- **Endpoint:** `DELETE /training-plans/{plan_id}`
- **Metoda:** `DELETE`
- **URL Parametry:** `plan_id` (UUID) - ID planu do usunięcia.
- **Request Body:** Brak.
- **Autentykacja:** Wymagany token JWT (obsługiwany przez Supabase client/fetch wrapper).
- **Wywołanie:** Po potwierdzeniu przez użytkownika w `AlertDialog`, funkcja (np. `deletePlan` z hooka `useTrainingPlans` lub bezpośrednio w `TrainingPlanList`) wyśle żądanie DELETE.
- **Obsługa odpowiedzi:**
  - **Sukces (200 OK):**
    - Oczekiwany typ odpowiedzi: `DeleteResponseDTO`.
    - Akcja: Usunięcie planu z lokalnego stanu `plans`, wyświetlenie komunikatu sukcesu (`response.message`) za pomocą `Toast`.
  - **Błąd (401 Unauthorized):**
    - Akcja: Wyświetlenie błędu "Brak autoryzacji" za pomocą `Toast`.
  - **Błąd (404 Not Found):**
    - Akcja: Wyświetlenie błędu "Nie znaleziono planu" za pomocą `Toast`. Odświeżenie listy planów.
  - **Błąd (500 Internal Server Error / Inne):**
    - Akcja: Wyświetlenie generycznego komunikatu błędu "Wystąpił błąd serwera" lub "Błąd sieci" za pomocą `Toast`.

## 8. Interakcje użytkownika

1. Użytkownik widzi listę planów w `/training-plans`.
2. Użytkownik klika przycisk "Usuń" na karcie wybranego planu.
3. Pojawia się `AlertDialog` z pytaniem "Czy na pewno chcesz usunąć plan '[Nazwa Planu]'?". Dostępne są opcje "Anuluj" i "Potwierdź".
4. **Scenariusz 1:** Użytkownik klika "Anuluj".
   - Dialog znika, lista planów pozostaje bez zmian.
5. **Scenariusz 2:** Użytkownik klika "Potwierdź".
   - Przycisk "Potwierdź" może pokazać stan ładowania.
   - Wykonywane jest żądanie `DELETE` do API.
   - **Wynik A (Sukces):** Dialog znika, karta usuniętego planu znika z listy, pojawia się `Toast` z komunikatem "Plan treningowy został pomyślnie usunięty".
   - **Wynik B (Błąd):** Dialog znika, lista planów pozostaje bez zmian (lub jest odświeżana w przypadku 404), pojawia się `Toast` z odpowiednim komunikatem błędu (np. "Nie znaleziono planu", "Błąd serwera").

## 9. Warunki i walidacja

- **Autentykacja:** Użytkownik musi być zalogowany, aby zobaczyć listę i mieć możliwość usunięcia planu. Logika API (RLS) zapewni, że użytkownik może usunąć tylko własne plany. Frontend powinien obsłużyć błąd 401.
- **Istnienie Planu:** API zwróci 404, jeśli plan nie istnieje lub nie należy do użytkownika. Frontend powinien obsłużyć ten błąd, informując użytkownika i ewentualnie odświeżając listę.
- **Potwierdzenie:** Krok potwierdzenia w `AlertDialog` jest kluczowy, aby zapobiec przypadkowemu usunięciu.

## 10. Obsługa błędów

- **Błędy sieciowe:** Obsługa błędów fetch (np. brak połączenia) przez wyświetlenie generycznego komunikatu w `Toast`.
- **Błędy API (4xx, 5xx):** Jak opisano w sekcji "Integracja API" i "Interakcje użytkownika", błędy powinny być komunikowane użytkownikowi za pomocą `Toast`.
- **Stan ładowania:** Wskaźniki ładowania powinny być używane podczas pobierania listy i podczas operacji usuwania (np. dezaktywacja przycisku "Potwierdź" w dialogu i pokazanie spinnera).
- **Pusta lista:** Jeśli lista planów jest pusta (po pobraniu lub po usunięciu ostatniego planu), należy wyświetlić odpowiedni komunikat (np. "Nie masz jeszcze żadnych planów treningowych.").

## 11. Kroki implementacji

1.  **Aktualizacja `TrainingPlanCard.tsx`:**
    - Dodaj nowy prop `onDelete: (planId: UUID) => void`.
    - Dodaj przycisk "Usuń" (np. `<Button variant="destructive" size="icon">...</Button>`) obok przycisku "Szczegóły".
    - Podłącz zdarzenie `onClick` przycisku "Usuń" do wywołania `props.onDelete(props.plan.id)`.
2.  **(Opcjonalnie, ale zalecane) Utworzenie hooka `useTrainingPlans`:**
    - Zaimplementuj logikę pobierania planów (`GET /training-plans`).
    - Zaimplementuj funkcję `deletePlan(planId: UUID)` która będzie wywoływać `DELETE /training-plans/{planId}`.
    - Zarządzaj stanami `plans`, `isLoading`, `error`.
    - Zwróć `{ plans, isLoading, error, deletePlan }`.
3.  **Aktualizacja `TrainingPlanList.tsx`:**
    - Zintegruj hook `useTrainingPlans` lub zaimplementuj logikę pobierania danych bezpośrednio.
    - Dodaj stany `planToDelete: UUID | null` i `isConfirmDeleteDialogOpen: boolean`.
    - Zaimplementuj funkcję `handleDeleteClick(planId: UUID)`, która ustawi `planToDelete` i `isConfirmDeleteDialogOpen = true`. Przekaż tę funkcję jako prop `onDelete` do `TrainingPlanCard`.
    - Zintegruj komponent `AlertDialog` z Shadcn/ui.
      - Powiąż jego stan `open` z `isConfirmDeleteDialogOpen`, a `onOpenChange` z funkcją zamykającą dialog i resetującą `planToDelete`.
      - W `AlertDialogTitle` i `AlertDialogDescription` wyświetl dynamicznie nazwę planu do usunięcia (można ją znaleźć w stanie `plans` używając `planToDelete`).
      - Podłącz funkcję obsługującą potwierdzenie (`handleConfirmDelete`) do `AlertDialogAction`.
      - Podłącz funkcję zamykającą dialog do `AlertDialogCancel`.
    - Zaimplementuj funkcję `handleConfirmDelete`:
      - Ustaw `isLoading = true`.
      - Wywołaj `deletePlan(planToDelete)` (z hooka) lub bezpośrednio API `DELETE`.
      - W bloku `then/catch` lub `try/catch` obsłuż sukces (aktualizacja stanu `plans`, pokazanie `Toast` sukcesu) i błędy (pokazanie `Toast` błędu).
      - Niezależnie od wyniku, zamknij dialog (`isConfirmDeleteDialogOpen = false`) i zresetuj `planToDelete = null`, `isLoading = false`.
    - Zintegruj system `Toast` z Shadcn/ui do wyświetlania powiadomień.
4.  **Styling:** Użyj Tailwind i konwencji Shadcn/ui do stylowania przycisku i dialogu.
5.  **Testowanie:** Przetestuj przepływ usuwania, w tym potwierdzenie, anulowanie, przypadki sukcesu i różne scenariusze błędów (401, 404, 500, błąd sieci). Sprawdź responsywność i dostępność.

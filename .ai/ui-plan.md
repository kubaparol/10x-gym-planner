# Architektura UI dla Gym Planner

## 1. Przegląd struktury UI

Aplikacja Gym Planner dzieli interfejs użytkownika na kilka kluczowych sekcji, które odpowiadają głównym funkcjonalnościom opisanym w PRD i planie API. UI zostało zaprojektowane z myślą o responsywności, dostępności (WCAG AA) oraz bezpieczeństwie danych użytkownika. Architekturę oparto o komponenty React, Tailwind CSS oraz shadcn/ui, zapewniając spójny wygląd na wszystkich urządzeniach.

## 2. Lista widoków

### 2.1. Ekran autoryzacji

- **Ścieżka widoku:** `/login` lub `/signup`
- **Główny cel:** Umożliwić użytkownikowi logowanie lub rejestrację.
- **Kluczowe informacje:** Formularz logowania/rejestracji, walidacja emaila i hasła, komunikaty błędów inline.
- **Kluczowe komponenty:** Formularz, pola input (email, hasło), przyciski akcji, link do odzyskiwania hasła.
- **UX, dostępność i bezpieczeństwo:** Dostępność przez etykiety ARIA, responsywność, szyfrowanie danych wprowadzanych przez użytkownika.

### 2.2. Ekran uzupełniania profilu

- **Ścieżka widoku:** `/profile-setup`
- **Główny cel:** Uzupełnienie danych fitness użytkownika po rejestracji; ekran obowiązkowy.
- **Kluczowe informacje:** Formularz z danymi osobowymi (wiek, płeć, waga, wzrost, poziom doświadczenia) z walidacją.
- **Kluczowe komponenty:** Pola formularza, przycisk zapisu, komunikaty walidacyjne.
- **UX, dostępność i bezpieczeństwo:** Jasne wskazówki walidacji, komunikaty błędów, wsparcie dla użytkowników korzystających z czytników ekranu.

### 2.3. Dashboard

- **Ścieżka widoku:** `/dashboard`
- **Główny cel:** Prezentacja statystyk oraz szybkiego dostępu do ostatnio wykonywanego planu.
- **Kluczowe informacje:** Liczba planów treningowych (manualnych i importowanych z PDF), ostatnio wykonywany plan, powiadomienia.
- **Kluczowe komponenty:** Karty statystyk, wykresy (opcjonalnie), przyciski nawigacyjne, sekcja alertów/toastów.
- **UX, dostępność i bezpieczeństwo:** Intuicyjne rozmieszczenie informacji, kontrastowe kolory, obsługa błędów pobierania danych.

### 2.4. Lista planów treningowych

- **Ścieżka widoku:** `/training-plans`
- **Główny cel:** Wyświetlenie listy wszystkich stworzonych planów treningowych użytkownika.
- **Kluczowe informacje:** Nazwa planu, opis, oznaczenie źródła planu (manualny vs pdf_import), przykładowe dni/ćwiczenia.
- **Kluczowe komponenty:** Lista (card list), przyciski do podglądu detali, filtry (jeśli będą wdrożone w przyszłości).
- **UX, dostępność i bezpieczeństwo:** Czytelne formatowanie listy, wsparcie dla nawigacji klawiaturowej, responsywność.

### 2.5. Podgląd planu treningowego

- **Ścieżka widoku:** `/training-plans/:id`
- **Główny cel:** Prezentacja szczegółów wybranego planu treningowego.
- **Kluczowe informacje:** Nazwa, opis, lista dni treningowych z przykładowymi ćwiczeniami.
- **Kluczowe komponenty:** Sekcja nagłówka, lista dni, przycisk do rozpoczęcia treningu.
- **UX, dostępność i bezpieczeństwo:** Przejrzysty layout, możliwość powrotu do listy, czytelne oznaczenia kluczowych informacji.

### 2.6. Kreator planu treningowego

- **Ścieżka widoku:** `/create-training-plan`
- **Główny cel:** Umożliwić użytkownikowi stworzenie nowego planu treningowego, z dynamicznym dodawaniem dni i ćwiczeń.
- **Kluczowe informacje:** Formularz tworzenia planu, opcja wyboru trybu (manualny lub import PDF), dynamiczne dodawanie treningowych dni i ćwiczeń.
- **Kluczowe komponenty:** Formularz, przyciski dodawania/usuwania sekcji, walidacja danych, modal potwierdzenia akcji.
- **UX, dostępność i bezpieczeństwo:** Intuicyjny interfejs, szybka walidacja, potwierdzenie operacji zapisu/ anulowania.

### 2.7. Widok aktualnego treningu / ćwiczenia

- **Ścieżka widoku:** `/workout`
- **Główny cel:** Prowadzenie użytkownika przez aktualnie wykonywany trening z możliwością nawigacji między ćwiczeniami.
- **Kluczowe informacje:** Kolejność ćwiczeń, przyciski nawigacyjne („wstecz”, „następne”, „poprzednie”), status wykonania ćwiczenia, opcja potwierdzenia zakończenia treningu.
- **Kluczowe komponenty:** Komponent nawigacji, przyciski akcji, licznik serii/ powtórzeń, wskaźnik postępu.
- **UX, dostępność i bezpieczeństwo:** Duże, czytelne przyciski, minimalny czas reakcji interfejsu, wyraźne komunikaty błędów.

### 2.8. Widok podsumowania treningu

- **Ścieżka widoku:** `/workout/summary`
- **Główny cel:** Prezentacja szczegółowych statystyk i informacji o zakończonej sesji treningowej.
- **Kluczowe informacje:** Czas trwania treningu, liczba wykonanych serii, progres ćwiczeń, podsumowanie wyników.
- **Kluczowe komponenty:** Karty statystyk, wykresy (opcjonalnie), przyciski nawigacyjne do powrotu do dashboardu lub listy planów.
- **UX, dostępność i bezpieczeństwo:** Zwięzłe informacje, wysoki kontrast, czytelne podsumowania oraz odpowiednie komunikaty sukcesu i błędów.

## 3. Mapa podróży użytkownika

1. **Start – Autoryzacja**:

   - Użytkownik wchodzi na stronę logowania/rejestracji.
   - Po pomyślnym zalogowaniu następuje przekierowanie na ekran uzupełniania profilu.

2. **Uzupełnienie profilu**:

   - Użytkownik wprowadza wymagane dane i zapisuje profil.
   - Następuje przekierowanie do dashboardu.

3. **Dashboard**:

   - Użytkownik widzi statystyki i szybki dostęp do ostatniego planu treningowego.
   - Wybiera opcję: stworzenia nowego planu (kreator) lub przeglądania istniejących planów.

4. **Lista planów treningowych**:

   - Użytkownik przegląda listę planów, wybiera jeden do podglądu.

5. **Podgląd planu treningowego**:

   - Użytkownik widzi szczegóły wybranego planu i ma możliwość rozpoczęcia treningu.

6. **Kreator planu treningowego** (jeśli użytkownik decyduje się stworzyć nowy plan):

   - Użytkownik dynamicznie dodaje dni i ćwiczenia, zatwierdza lub anuluje operację.

7. **Widok aktualnego treningu / ćwiczenia**:

   - Użytkownik przechodzi przez ćwiczenia, korzysta z nawigacji między ćwiczeniami, potwierdza zakończenie treningu.

8. **Widok podsumowania treningu**:
   - Po zakończeniu treningu użytkownik otrzymuje szczegółowe podsumowanie wyników i statystyk.

## 4. Układ i struktura nawigacji

- **Globalne Menu (Topbar):**

  - Zawiera linki do Dashboardu, Listy planów treningowych oraz opcję wylogowania.
  - Widoczne na każdej stronie, zapewnia spójność nawigacyjną.

- **Lokalna Nawigacja:**

  - W widokach szczegółowych (np. podgląd planu, widok treningu) dostępne są przyciski „wstecz”, „następne” oraz „poprzednie”, pozwalające na łatwą nawigację między sekcjami.

- **Komunikaty i Toasty:**
  - Krytyczne informacje wyświetlane inline, mniej ważne komunikaty prezentowane jako toast notifications.

## 5. Kluczowe komponenty

- **Formularze:** Komponenty formularzy wykorzystywane w ekranach autoryzacji, uzupełniania profilu oraz kreatora planu; zawierają walidację, komunikaty o błędach i wsparcie dla dostępności.

- **Karty i Listy:** Karty statystyk w dashboardzie, listy planów treningowych oraz karty podsumowania treningu; zapewniają czytelne przedstawienie informacji.

- **Nawigacja:** Globalny topbar oraz lokalne przyciski nawigacyjne w widokach szczegółowych.

- **Alerty i Toasty:** System komunikatów informacyjnych, które wyświetlają sukces, ostrzeżenia i błędy.

- **Dynamiczne Sekcje:** Komponenty umożliwiające dynamiczne dodawanie/usuwanie pól w kreatorze planu treningowego.

- **Wskaźniki Postępu:** Elementy UI prezentujące aktualny status treningu (np. licznik serii, powtórzeń, progress bar).

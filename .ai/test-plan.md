# Plan Testów

## 1. Wprowadzenie

### Cel planu testów

- Zapewnienie wysokiej jakości aplikacji poprzez systematyczne i kompleksowe testowanie wszystkich jej elementów.
- Wykrycie potencjalnych błędów i niedociągnięć na wczesnym etapie, aby zminimalizować ryzyko awarii w środowisku produkcyjnym.
- Weryfikacja zgodności implementacji z wymaganiami funkcjonalnymi i niefunkcjonalnymi.

### Zakres testów

- Testy jednostkowe dla logiki biznesowej, komponentów i funkcji pomocniczych.
- Testy integracyjne dla API, połączeń z bazą danych Supabase oraz interakcji między komponentami.
- Testy end-to-end dla przepływów użytkownika (renderowanie stron, interakcje z komponentami React, komunikacja z API).
- Testy regresji wizualnej (w szczególności interfejs użytkownika oparty na Shadcn/ui i stylach Tailwind) w celu zapewnienia spójności wyglądu.
- Testy dostępności dla zapewnienia zgodności z wytycznymi WCAG.
- Testy wydajności dla monitorowania szybkości ładowania stron i ogólnej responsywności aplikacji.

---

## 2. Strategia testowania

### Rodzaje testów

- **Testy jednostkowe:**  
  Testowanie pojedynczych funkcjonalności i logiki:

  - Komponenty React.
  - Funkcje pomocnicze w katalogu `src/lib`.
  - Walidatory i funkcje przetwarzające dane.

- **Testy integracyjne:**  
  Sprawdzenie współpracy między modułami:

  - Integracja API (handler'y w `src/pages/api`) z logiką biznesową.
  - Interakcje między komponentami Astro i React.
  - Komunikacja z bazą danych Supabase (moduły w `src/db`).

- **Testy end-to-end (e2e):**  
  Symulacja rzeczywistych scenariuszy użytkownika:

  - Przepływy na stronie głównej i stronach wewnętrznych.
  - Procesy logowania, rejestracji i operacje na danych.
  - Testowanie krytycznych interakcji użytkownika (nawigacja, formularze, przyciski).

- **Testy regresji wizualnej:**  
  Weryfikacja spójności stylistycznej w oparciu o Tailwind i Shadcn/ui:

  - Porównanie zrzutów ekranu przy kolejnych wdrożeniach.
  - Wykrywanie niezamierzonych zmian w interfejsie.

- **Testy dostępności:**  
  Walidacja zgodności z wytycznymi WCAG:

  - Sprawdzenie kontrastu, alternatywnych tekstów, nawigacji klawiaturą.
  - Weryfikacja struktury semantycznej HTML.

- **Testy wydajności:**  
  Monitorowanie metryk wydajnościowych:
  - Czas ładowania strony i poszczególnych komponentów.
  - Optymalizacja obrazów i zasobów.
  - Wydajność renderowania komponentów React.

### Narzędzia i środowiska testowe

- **Testy jednostkowe i integracyjne:**

  - Frameworki: Vitest (zamiast Jest), React Testing Library.
  - Testing Library dla Astro do testowania komponentów Astro.
  - MSW (Mock Service Worker) do mockowania API.
  - Środowiska symulujące API oraz lokalna instancja Supabase.

- **Testy e2e:**

  - Narzędzia: Playwright (preferowany nad Cypress).
  - Playwright Component Testing do testowania izolowanych komponentów w rzeczywistej przeglądarce.
  - Wykorzystywanie środowisk stagingowych odzwierciedlających środowisko produkcyjne.

- **Testy regresji wizualnej:**

  - Narzędzia: Storybook z Percy lub Chromatic.
  - Automatyczne porównywanie stanów komponentów UI.

- **Testy dostępności:**

  - Narzędzia: axe-core zintegrowane z Playwright i React Testing Library.
  - Weryfikacja zgodności z WCAG 2.1 AA.

- **Testy wydajności:**
  - Narzędzia: Lighthouse CI dla metryk wydajnościowych.
  - Web Vitals dla monitorowania Core Web Vitals.

---

## 3. Harmonogram testów

1. **Przygotowanie środowiska testowego:**

   - Konfiguracja narzędzi testowych (Vitest, Playwright, MSW, narzędzia do testów wizualnych, axe-core, Lighthouse CI).
   - Utworzenie dedykowanych baz danych/mocking API.

2. **Opracowanie i implementacja testów jednostkowych oraz integracyjnych:**

   - Pokrycie krytycznych modułów (komponentów, API, logiki biznesowej).
   - Zadanie: pierwsza runda testów – 2-3 tygodnie.

3. **Realizacja testów e2e, dostępności i regresji wizualnej:**

   - Implementacja scenariuszy e2e dla kluczowych przepływów użytkownika.
   - Integracja testów wizualnych i dostępności w CI/CD.
   - Zadanie: równolegle z testami jednostkowymi/integracyjnymi – 2-3 tygodnie.

4. **Implementacja testów wydajności:**

   - Konfiguracja Lighthouse CI.
   - Ustalenie progów wydajnościowych.
   - Zadanie: 1-2 tygodnie.

5. **Analiza wyników, raportowanie oraz poprawki:**

   - Priorytetyzacja błędów.
   - Weryfikacja poprawek poprzez regresję.

6. **Testy końcowe przed wdrożeniem:**
   - Pełny cykl testowy na środowisku stagingowym.
   - Finalna walidacja krytycznych funkcjonalności.

---

## 4. Przypadki testowe

### A. Komponenty Astro (Layouty, Strony)

1. **Test poprawnego renderowania strony głównej:**

   - Sprawdzenie, czy wszystkie kluczowe elementy (nagłówek, stopka, treść) są widoczne.
   - Weryfikacja responsywności na różnych urządzeniach.
   - Testy z użyciem Testing Library dla Astro.

2. **Test integracji layoutu z komponentami:**
   - Walidacja wstrzykiwania komponentów React do layoutu Astro.
   - Sprawdzenie poprawnego działania nawigacji między stronami.

### B. Komponenty React (Interaktywne Komponenty, Shadcn/ui)

1. **Test obsługi zdarzeń:**

   - Weryfikacja kliknięć, zmian stanu oraz interakcji użytkownika.
   - Sprawdzenie, czy przyciski i elementy interaktywne reagują zgodnie z oczekiwaniami.
   - Użycie Playwright Component Testing do testowania w rzeczywistej przeglądarce.

2. **Test poprawności renderowania:**

   - Porównanie zrzutów ekranu (regresja wizualna) w przypadku komponentów UI z Percy.
   - Weryfikacja zgodności z wytycznymi projektowymi.

3. **Test komunikacji między komponentami:**
   - Sprawdzenie przepływu danych i wywołań callback'ów.
   - Walidacja przekazywania właściwości (props) i stanu.

### C. API Endpoints (używane w `src/pages/api`)

1. **Test poprawności odpowiedzi API:**

   - Sprawdzenie statusu odpowiedzi (np. 200, 400, 500) dla poprawnych i niepoprawnych zapytań.
   - Weryfikacja struktury danych zwracanych przez API.
   - Wykorzystanie MSW do mockowania odpowiedzi API.

2. **Test walidacji wejściowej:**

   - Próby wywołania API z niekompletnymi lub błędnymi danymi.
   - Sprawdzenie mechanizmu obsługi błędów.

3. **Test integracji z Supabase:**
   - Symulacja zapytań do bazy i weryfikacja poprawności operacji (odczyt, zapis, aktualizacja).
   - Test obsługi sytuacji awaryjnych (np. utrata połączenia).

### D. Funkcjonalności związane z Supabase (Integracja danych)

1. **Test zapytań do bazy:**

   - Walidacja poprawności pobierania i zapisywania danych.
   - Testy na realistycznych danych użytkownika.

2. **Test obsługi błędów i wyjątków:**
   - Symulacja błędów komunikacji i weryfikacja odpowiednich komunikatów dla użytkownika.
   - Test ścieżek awaryjnych.

### E. Testy dostępności

1. **Weryfikacja zgodności z WCAG:**

   - Sprawdzenie kontrastu kolorów.
   - Poprawność struktur semantycznych HTML.
   - Testy nawigacji klawiaturą.

2. **Weryfikacja dla różnych urządzeń wspomagających:**
   - Testy z czytnikami ekranu.
   - Symulacja różnych urządzeń wejściowych.

### F. Testy wydajności

1. **Pomiar Core Web Vitals:**

   - Largest Contentful Paint (LCP).
   - First Input Delay (FID) / Interaction to Next Paint (INP).
   - Cumulative Layout Shift (CLS).

2. **Optymalizacja zasobów:**
   - Weryfikacja czasu ładowania zasobów (obrazy, CSS, JS).
   - Sprawdzenie zastosowania kodów leniwie ładowanych.

---

## 5. Kryteria akceptacji

- Wszystkie krytyczne funkcjonalności są pokryte testami jednostkowymi, integracyjnymi oraz e2e.
- Testy muszą przechodzić zgodnie z przyjętym progiem jakości (np. pokrycie kodu powyżej 80%).
- Wszystkie zgłoszone błędy klasy krytycznej i wysokiego priorytetu muszą zostać naprawione przed wdrożeniem na produkcję.
- Zgodność interfejsu użytkownika z wymaganiami projektowymi (poprzez testy regresji wizualnej).
- Osiągnięcie wyniku co najmniej 90 punktów w testach Lighthouse dla wydajności, dostępności i najlepszych praktyk.
- Brak krytycznych błędów dostępności wykrytych przez axe-core.

---

## 6. Raportowanie błędów i zarządzanie nimi

- Każdy błąd jest zgłaszany w systemie zarządzania zgłoszeniami (np. Jira, GitHub Issues).
- Raporty błędów powinny zawierać:
  - Opis problemu,
  - Kroki do reprodukcji,
  - Oczekiwane oraz zaobserwowane zachowanie,
  - Załączniki (logi, zrzuty ekranu).
- Prioritetyzacja błędów:
  - Krytyczne – blokujące funkcjonalność,
  - Wysokie – wpływające na główne przepływy użytkownika,
  - Średnie/niski – dotyczące szczegółów lub rzadko występujących problemów.
- Regularne spotkania zespołu QA i deweloperów w celu omawiania statusu testów i priorytetów naprawy błędów.

---

## 7. Zasoby i odpowiedzialności

- **Zespół QA:**  
  Odpowiedzialny za implementację, wykonywanie testów oraz raportowanie wyników.
- **Deweloperzy:**  
  Współpraca przy definiowaniu przypadków testowych, rozwiązywaniu wykrytych problemów oraz utrzymaniu wysokiego poziomu pokrycia testami.
- **Product Owner/Manager:**  
  Zapewnienie, że kryteria akceptacji są zgodne z wymaganiami biznesowymi oraz priorytetyzacja funkcjonalności.
- **Infrastruktura CI/CD:**  
  Automatyzacja uruchamiania testów przy każdym wdrożeniu na środowisko integracyjne/stagingowe oraz przed produkcyjnymi wdrożeniami.
  Integracja Lighthouse CI i Percy/Chromatic w pipeline CI/CD.

# Dokument wymagań produktu (PRD) - Gymzy

## 1. Przegląd produktu

Gymzy to webowa aplikacja umożliwiająca użytkownikom efektywne zarządzanie planami treningowymi oraz śledzenie postępów treningowych. Głównym wyróżnikiem aplikacji jest możliwość konwersji planów treningowych z formatu PDF do formatu interaktywnego przy pomocy sztucznej inteligencji, co znacząco ułatwia korzystanie z planów podczas treningu oraz monitorowanie postępów.

Aplikacja w wersji MVP skupia się na podstawowych funkcjonalnościach, które rozwiązują kluczowy problem użytkowników - trudności w praktycznym wykorzystaniu planów treningowych udostępnianych w formacie PDF.

## 2. Problem użytkownika

Trenerzy personalni udostępniają plany treningowe w formacie PDF, co utrudnia podopiecznym (zwłaszcza niedoświadczonym) efektywne korzystanie z tych planów i śledzenie postępów. Szczególnie problematyczne jest:

- Wyszukiwanie konkretnych ćwiczeń podczas treningu, co wymaga scrollowania dokumentu PDF na urządzeniu mobilnym
- Brak możliwości łatwego zapisywania wykonanych ćwiczeń i używanych ciężarów
- Trudności w monitorowaniu postępu treningowego w czasie
- Brak struktury danych, która pozwalałaby na analizę i wizualizację postępów

## 3. Wymagania funkcjonalne

### 3.1. System kont użytkowników

- Rejestracja użytkownika z danymi: imię, nazwisko, email, hasło
- Rozszerzony profil użytkownika zawierający: wiek, płeć, wagę, wzrost i poziom doświadczenia
- Logowanie przy użyciu emaila i hasła
- Bezterminowe przechowywanie danych użytkowników w bazie danych

### 3.2. Zarządzanie planami treningowymi

- Dodawanie planów manualnie przez formularz
- Konwersja planów z PDF przy pomocy AI
- Przeglądanie planów treningowych w formie prostej listy (bez filtrowania, sortowania i wyszukiwania)
- Usuwanie planów treningowych
- Brak możliwości modyfikacji planów po ich dodaniu do systemu

### 3.3. Struktura planu treningowego

- Organizacja według tygodni i dni
- Każde ćwiczenie zawiera: nazwę, ilość serii, ilość powtórzeń, czas przerwy
- Baza ćwiczeń zawierająca tylko nazwy ćwiczeń (bez opisów, zdjęć czy filmów instruktażowych)

### 3.4. Śledzenie postępów

- Możliwość zapisania postępu dla każdego ćwiczenia (używany ciężar i wykonane powtórzenia)
- Podgląd historii wykonanych ćwiczeń z progresem w czasie
- Brak automatycznych sugestii progresji ciężarów na podstawie poprzednich treningów

### 3.5. Konwersja PDF przy pomocy AI

- Skanowanie plików PDF i wyodrębnianie struktury treningowej
- Prezentacja skonwertowanego planu jako "kandydata" do recenzji
- Możliwość ręcznej edycji przed finalnym zapisem w bazie
- Funkcje edycji planów skonwertowanych przez AI identyczne jak przy manualnym dodawaniu planów

### 3.6. Interfejs użytkownika

- Interfejs z myślą o użyciu na siłowni - duże przyciski, czytelne czcionki, minimalna liczba kliknięć
- Widok "dzisiejszy trening" na stronie głównej aplikacji
- Opcje szybkiego wprowadzania danych treningowych

## 4. Granice produktu

Poniższe funkcjonalności NIE są częścią MVP:

- Import formatów innych niż PDF
- Aplikacje mobilne (na początek tylko web)
- Funkcje społecznościowe
- Płatne plany (na początek wszystkie darmowe)
- Filtrowanie, sortowanie i wyszukiwanie planów treningowych
- Modyfikacja planów po ich dodaniu do systemu
- Opisy, zdjęcia czy filmy instruktażowe dla ćwiczeń
- Automatyczne sugestie progresji ciężarów
- Eksport danych treningowych

## 5. Historyjki użytkowników

### US-001: Rejestracja użytkownika

- Jako nowy użytkownik, chcę się zarejestrować w aplikacji, aby móc korzystać z jej funkcjonalności.
- Kryteria akceptacji:
  - Użytkownik może wypełnić formularz rejestracyjny z polami: imię, nazwisko, email, hasło, potwierdzenie hasła
  - System weryfikuje unikalność adresu email
  - System weryfikuje poprawność formatu adresu email
  - System weryfikuje złożoność hasła (min. 8 znaków, zawierające cyfrę i znak specjalny)
  - Po pomyślnej rejestracji użytkownik jest przekierowywany na stronę uzupełnienia profilu
  - W przypadku błędu system wyświetla odpowiedni komunikat

### US-002: Uzupełnienie profilu użytkownika

- Jako nowo zarejestrowany użytkownik, chcę uzupełnić swój profil o dane fitness, aby system mógł lepiej dostosować się do moich potrzeb.
- Kryteria akceptacji:
  - Użytkownik może wypełnić formularz z polami: wiek, płeć, waga, wzrost, poziom doświadczenia
  - System waliduje poprawność wprowadzonych danych (np. wiek w zakresie 13-100 lat)
  - Użytkownik może pominąć uzupełnienie profilu i zrobić to później
  - Po zapisaniu profilu system przekierowuje użytkownika na stronę główną

### US-003: Logowanie do aplikacji

- Jako zarejestrowany użytkownik, chcę się zalogować do aplikacji, aby uzyskać dostęp do moich planów treningowych i danych.
- Kryteria akceptacji:
  - Użytkownik może wprowadzić email i hasło
  - System weryfikuje poprawność danych logowania
  - W przypadku poprawnych danych użytkownik jest logowany i przekierowywany na stronę główną
  - W przypadku błędnych danych system wyświetla odpowiedni komunikat
  - System oferuje opcję "Zapomniałem hasła"

### US-004: Odzyskiwanie hasła

- Jako użytkownik, który zapomniał hasła, chcę zresetować moje hasło, aby móc ponownie zalogować się do aplikacji.
- Kryteria akceptacji:
  - Użytkownik może wprowadzić adres email
  - System wysyła link do resetowania hasła na podany adres
  - Link jest ważny przez 24 godziny
  - Po kliknięciu w link użytkownik może wprowadzić nowe hasło
  - System waliduje złożoność nowego hasła
  - Po pomyślnej zmianie hasła użytkownik może zalogować się przy użyciu nowego hasła

### US-005: Manualne dodawanie planu treningowego

- Jako zalogowany użytkownik, chcę manualnie dodać plan treningowy, aby móc z niego korzystać podczas treningów.
- Kryteria akceptacji:
  - Użytkownik może utworzyć nowy plan podając jego nazwę i opis
  - Użytkownik może dodać tygodnie treningowe
  - Dla każdego tygodnia użytkownik może dodać dni treningowe
  - Dla każdego dnia użytkownik może dodać ćwiczenia
  - Dla każdego ćwiczenia użytkownik może określić: nazwę, ilość serii, ilość powtórzeń, czas przerwy
  - Użytkownik może zapisać plan
  - Po zapisaniu plan jest widoczny na liście planów użytkownika

### US-006: Konwersja planu treningowego z PDF

- Jako zalogowany użytkownik, chcę zaimportować plan treningowy z pliku PDF, aby zaoszczędzić czas na manualnym wprowadzaniu danych.
- Kryteria akceptacji:
  - Użytkownik może przesłać plik PDF do systemu
  - System analizuje plik przy pomocy AI i ekstrahuje strukturę planu treningowego
  - System prezentuje użytkownikowi wynik konwersji
  - Użytkownik może zweryfikować i edytować wynik konwersji
  - Użytkownik może zatwierdzić plan lub odrzucić konwersję
  - Po zatwierdzeniu plan jest zapisywany i widoczny na liście planów użytkownika

### US-007: Przeglądanie listy planów treningowych

- Jako zalogowany użytkownik, chcę przeglądać listę moich planów treningowych, aby wybrać ten, z którego chcę skorzystać.
- Kryteria akceptacji:
  - System wyświetla listę planów treningowych użytkownika
  - Lista zawiera podstawowe informacje o każdym planie (nazwa, krótki opis)
  - Użytkownik może wybrać plan z listy, aby zobaczyć jego szczegóły

### US-008: Przeglądanie szczegółów planu treningowego

- Jako zalogowany użytkownik, chcę przeglądać szczegóły wybranego planu treningowego, aby zobaczyć zaplanowane ćwiczenia.
- Kryteria akceptacji:
  - System wyświetla strukturę planu (tygodnie, dni)
  - Użytkownik może wybrać konkretny dzień treningowy
  - System wyświetla listę ćwiczeń dla wybranego dnia wraz z detalami (ilość serii, powtórzeń, czas przerwy)

### US-009: Usuwanie planu treningowego

- Jako zalogowany użytkownik, chcę usunąć plan treningowy, którego już nie potrzebuję.
- Kryteria akceptacji:
  - Użytkownik może wybrać opcję usunięcia planu
  - System wymaga potwierdzenia decyzji o usunięciu
  - Po potwierdzeniu plan jest usuwany z listy planów użytkownika
  - System wyświetla komunikat potwierdzający usunięcie planu

### US-010: Rozpoczęcie treningu

- Jako zalogowany użytkownik, chcę rozpocząć trening według wybranego planu, aby śledzić moje postępy.
- Kryteria akceptacji:
  - Użytkownik może wybrać plan treningowy z listy
  - Użytkownik może wybrać dzień treningowy
  - System prezentuje listę ćwiczeń do wykonania w danym dniu
  - Interfejs jest przystosowany do używania podczas treningu (duże przyciski, czytelne czcionki)

### US-011: Zapisywanie wyników treningu

- Jako użytkownik w trakcie treningu, chcę zapisywać wyniki poszczególnych ćwiczeń, aby śledzić moje postępy.
- Kryteria akceptacji:
  - Dla każdego ćwiczenia użytkownik może wprowadzić używany ciężar dla każdej serii
  - Dla każdego ćwiczenia użytkownik może wprowadzić liczbę wykonanych powtórzeń dla każdej serii
  - System automatycznie zapisuje datę wykonania treningu
  - Użytkownik może oznaczyć trening jako zakończony

### US-012: Przeglądanie historii treningów

- Jako zalogowany użytkownik, chcę przeglądać historię moich treningów, aby monitorować moje postępy.
- Kryteria akceptacji:
  - System wyświetla listę zrealizowanych treningów
  - Użytkownik może wybrać konkretny trening, aby zobaczyć jego szczegóły
  - System prezentuje dla każdego ćwiczenia używane ciężary i wykonane powtórzenia
  - System wyświetla datę wykonania treningu

### US-013: Wyświetlanie postępów w czasie

- Jako zalogowany użytkownik, chcę zobaczyć moje postępy treningowe w czasie, aby ocenić efektywność treningu.
- Kryteria akceptacji:
  - Użytkownik może wybrać konkretne ćwiczenie
  - System prezentuje historię wykonania wybranego ćwiczenia w czasie
  - System pokazuje progres używanych ciężarów i/lub wykonanych powtórzeń w czasie

### US-014: Wyświetlanie "dzisiejszego treningu"

- Jako zalogowany użytkownik, chcę zobaczyć mój dzisiejszy trening na stronie głównej, aby szybko rozpocząć trening.
- Kryteria akceptacji:
  - System identyfikuje aktywny plan treningowy użytkownika
  - System określa, który dzień treningowy przypada na dziś
  - Na stronie głównej system prezentuje szczegóły dzisiejszego treningu
  - Użytkownik może jednym kliknięciem rozpocząć dzisiejszy trening

### US-015: Szybkie wprowadzanie danych treningowych

- Jako użytkownik w trakcie treningu, chcę szybko wprowadzać dane treningowe, aby nie tracić czasu między seriami.
- Kryteria akceptacji:
  - Interfejs umożliwia szybkie wprowadzanie ciężarów (np. poprzez przyciski +/-, predefiniowane wartości)
  - Interfejs umożliwia szybkie wprowadzanie liczby powtórzeń
  - System automatycznie przechodzi do następnej serii po wprowadzeniu danych
  - System wizualnie oznacza wykonane serie

### US-016: Wylogowanie z aplikacji

- Jako zalogowany użytkownik, chcę wylogować się z aplikacji, aby zabezpieczyć moje dane.
- Kryteria akceptacji:
  - Użytkownik może wybrać opcję wylogowania
  - Po wylogowaniu użytkownik traci dostęp do funkcji wymagających logowania
  - System przekierowuje użytkownika na stronę logowania

## 6. Metryki sukcesu

### 6.1. Metryki przyjęcia produktu

- 75% użytkowników dodaje jeden lub więcej planów w tygodniu
- 75% planów treningowych powstaje poprzez konwersje z PDF
- Wskaźnik rejestracji nowych użytkowników (liczba nowych użytkowników dziennie/tygodniowo)
- Wskaźnik retencji (procent użytkowników powracających do aplikacji po 1, 7, 30 dniach)

### 6.2. Metryki zaangażowania

- Średnia liczba treningów na użytkownika tygodniowo
- Średni czas spędzony w aplikacji podczas treningu
- Procent użytkowników korzystających z funkcji historii treningów
- Procent użytkowników przeglądających swoje postępy

### 6.3. Metryki techniczne

- Średni czas konwersji planu z PDF przez AI
- Dokładność konwersji planów PDF (procent poprawnie zidentyfikowanych elementów)
- Średni czas ładowania strony
- Liczba błędów/crashów aplikacji

### 6.4. Sposób pomiaru

- Implementacja śledzenia wydarzeń w aplikacji
- Regularna analiza logów aplikacji
- Okresowe badania satysfakcji użytkowników
- Monitoring wydajności serwera i aplikacji

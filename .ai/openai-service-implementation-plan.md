# Przewodnik Implementacji: Usługa OpenAI

## 1. Opis usługi

Usługa OpenAI umożliwia integrację z interfejsem API OpenAI w celu:

1. Uzupełnienia czatów opartych na dużych modelach językowych (LLM), umożliwiając dynamiczne generowanie odpowiedzi w konwersacjach.
2. Wgrywania plików PDF, tak aby ich zawartość mogła być wykorzystana w rozmowie z użytkownikiem.
3. Usuwania wgranych plików z systemu OpenAI, co pozwala na zarządzanie danymi w sposób responsywny i bezpieczny.

## 2. Opis konstruktora

Konstruktor usługi (np. klasa `OpenAIService`) będzie odpowiedzialny za:

1. Inicjalizację konfiguracji i ustawień, takich jak:
   - Klucz API (`OPENAI_API_KEY`), adres endpointa oraz inne zmienne środowiskowe.
   - Parametry domyślne modelu (np. nazwa modelu, temperatura, maksymalna liczba tokenów, itp.).
2. Konfigurację połączenia z OpenAI API, z uwzględnieniem opcji dotyczących komunikatu systemowego, komunikatu użytkownika oraz schematu odpowiedzi.

## 3. Publiczne metody i pola

Przykładowe metody i pola dostępne publicznie:

1. `chatCompletion(systemMessage: string, userMessage: string, jsonSchema?: object): Promise<Response>`

   - Wysyła zapytanie do OpenAI API, łącząc komunikat systemowy i użytkownika oraz zwracając ustrukturyzowaną odpowiedź zgodnie ze schematem JSON.

2. `uploadPDF(filePath: string): Promise<FileUploadResponse>`

   - Wysyła plik PDF do OpenAI przy użyciu endpointu do wgrywania plików. Zapewnia walidację rozmiaru i formatu pliku.

3. `deleteFile(fileId: string): Promise<DeleteResponse>`

   - Usuwa wcześniej wgrany plik z systemu OpenAI, identyfikując go poprzez unikalny identyfikator.

4. Pola konfiguracyjne:
   - `apiKey`: Przechowuje klucz API (pozyskany z zmiennych środowiskowych).
   - `modelName`: Domyślna nazwa modelu wykorzystywana przez API (np. "gpt-4" lub "gpt-3.5-turbo").
   - `modelParams`: Obiekt zawierający parametry modelu, takie jak temperatura, top_p, max_tokens, itp.

## 4. Prywatne metody i pola

Przykłady metod i pól ukrytych w implementacji:

1. `_formatRequest(systemMessage: string, userMessage: string): object`

   - Łączy oraz formatuje komunikaty systemowy i użytkownika w jeden spójny payload dla API.

2. `_handleResponse(response: any): any`

   - Przetwarza odpowiedź z OpenAI API, weryfikuje zgodność z dostarczonym schematem JSON i identyfikuje potencjalne błędy.

3. `_retryRequest(requestPayload: object): Promise<any>`

   - Implementuje mechanizm ponawiania zapytań (retry) w przypadku wystąpienia błędów typu rate limit lub problemów sieciowych.

4. Pola pomocnicze, np. logger lub cache odpowiedzi, aby zoptymalizować wydajność i ułatwić debugowanie.

## 5. Obsługa błędów

Potencjalne scenariusze błędów i proponowane rozwiązania:

1. Błąd autoryzacji lub brak klucza API.

   - (1) Weryfikacja wstępna konfiguracji przy uruchomieniu usługi.
   - (2) Rzucenie przejrzystego komunikatu błędu wraz z instrukcją uzupełnienia konfiguracji.

2. Przekroczenie limitu zapytań (rate limiting) lub timeout.

   - (1) Implementacja mechanizmu ponawiania zapytań z eksponencjalnym opóźnieniem.
   - (2) Logowanie błędów i informowanie użytkownika o konieczności ponowienia próby.

3. Błędy związane z wgrywaniem plików (nieprawidłowy format, przekroczenie rozmiaru).

   - (1) Walidacja pliku przed wysłaniem na serwer.
   - (2) Rzucenie szczegółowego błędu i sugestii naprawczych (np. zmniejszenie rozmiaru pliku).

4. Nieprawidłowa struktura odpowiedzi z API.
   - (1) Weryfikacja odpowiedzi za pomocą schematu JSON.
   - (2) Mechanizm fallback lub ponowne zapytanie przy niespełnieniu wymagań strukturalnych.

## 6. Kwestie bezpieczeństwa

1. Przechowywanie wrażliwych danych (kluczy API) w zmiennych środowiskowych.
2. Ograniczenie uprawnień oraz stosowanie zasad least privilege przy udostępnianiu endpointów API.
3. Monitorowanie i logowanie działań w celu szybkiej identyfikacji potencjalnych naruszeń.

## 7. Plan wdrożenia krok po kroku

1. **Implementacja API Clienta**

   - Utwórz moduł lub klasę `OpenAIService` w obrębie `./src/lib`.
   - Skonfiguruj podstawowe metody dla komunikacji z OpenAI API (w tym ustawienia modelu i parametrów).

2. **Implementacja funkcjonalności obsługi plików**

   - Utwórz endpointy w `OpenAIService` dla wgrywania i usuwania plików.
   - Przy wgrywaniu PDF:
     - Waliduj typ i rozmiar pliku
     - Wykorzystaj API OpenAI do przesłania pliku (zgodnie z dokumentacją: https://platform.openai.com/docs/api-reference/files/create)
   - Przy usuwaniu plików:
     - Wymagaj unikalnego identyfikatora pliku
     - Zaimplementuj sprawdzanie uprawnień przed wykonaniem operacji usunięcia

3. **Implementacja obsługi błędów**

   - Wprowadź mechanizmy try/catch w kluczowych częściach kodu.
   - Loguj błędy oraz zwracaj przejrzyste komunikaty do klienta.
   - Zaimplementuj mechanizm ponawiania zapytań dla niektórych typów błędów (np. timeout, rate limiting).

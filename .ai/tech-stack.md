Frontend - Astro z React dla komponentów interaktywnych:

- Astro 5 pozwala na tworzenie szybkich, wydajnych stron i aplikacji z minimalną ilością JavaScript
- React 19 zapewni interaktywność tam, gdzie jest potrzebna
- TypeScript 5 dla statycznego typowania kodu i lepszego wsparcia IDE
- Tailwind 4 pozwala na wygodne stylowanie aplikacji
- Shadcn/ui zapewnia bibliotekę dostępnych komponentów React, na których oprzemy UI

Backend - Supabase jako kompleksowe rozwiązanie backendowe:

- Zapewnia bazę danych PostgreSQL
- Zapewnia SDK w wielu językach, które posłużą jako Backend-as-a-Service
- Jest rozwiązaniem open source, które można hostować lokalnie lub na własnym serwerze
- Posiada wbudowaną autentykację użytkowników

AI - Komunikacja z modelami przez usługę Openrouter.ai:

- Dostęp do szerokiej gamy modeli (OpenAI, Anthropic, Google i wiele innych), które pozwolą nam znaleźć rozwiązanie zapewniające wysoką efektywność i niskie koszta
- Pozwala na ustawianie limitów finansowych na klucze API

CI/CD i Hosting:

- Github Actions do tworzenia pipeline'ów CI/CD
- DigitalOcean do hostowania aplikacji za pośrednictwem obrazu docker

Narzędzia testowe:

- Testy jednostkowe i integracyjne:

  - Vitest - szybki framework testów jednostkowych, kompatybilny z Jest
  - React Testing Library - testowanie komponentów React
  - Testing Library dla Astro - testowanie komponentów Astro
  - MSW (Mock Service Worker) - mockowanie API

- Testy End-to-End:

  - Playwright - automatyzacja przeglądarki i testy E2E
  - Playwright Component Testing - testowanie komponentów w rzeczywistej przeglądarce

- Testy wizualne i wydajnościowe:
  - axe-core - silnik testów dostępności
  - Percy/Chromatic - testy regresji wizualnej
  - Lighthouse CI - testy wydajności
  - Web Vitals - monitorowanie Core Web Vitals

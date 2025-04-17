# E2E Testing with Playwright

This directory contains end-to-end tests using Playwright, following the Page Object Model pattern.

## Directory Structure

```
e2e/
├── fixtures/          # Test data and fixtures
├── pages/             # Page Object Models
│   └── home.page.ts   # Example: Home page POM
├── *.spec.ts          # Test files
└── README.md          # This file
```

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI debugging
npm run test:e2e:debug

# View test reports
npm run test:e2e:report
```

## Creating New Tests

1. For new pages, create a Page Object in the `pages` directory
2. Create a test file with the `.spec.ts` extension
3. Use the Page Objects in your tests for better maintainability

## Best Practices

- Initialize browser contexts for isolating test environments
- Use Playwright locators for resilient element selection
- Add visual comparison with `expect(page).toHaveScreenshot()`
- Use the trace viewer (`npx playwright show-trace`) for debugging failures

## Example Page Object Usage

```typescript
import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/home.page";

test("should navigate to about page", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickNavigationLink("About");

  await expect(page).toHaveURL(/.*about/);
});
```

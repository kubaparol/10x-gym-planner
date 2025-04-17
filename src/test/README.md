# Testing Guidelines

This project uses a comprehensive testing strategy with both unit tests and end-to-end (E2E) tests.

## Unit Testing with Vitest

We use Vitest as our unit testing framework, along with React Testing Library for testing React components.

### Running Unit Tests

```bash
# Run all tests once
npm test

# Watch mode for development
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test File Structure

- Unit tests should be placed in `__tests__` folders next to the files they test
- File naming should follow the pattern: `component-name.test.tsx` or `function-name.test.ts`

### Best Practices

- Use the React Testing Library's user-event for simulating user interactions
- Test component behavior, not implementation details
- Use `vi.fn()` for function mocks and `vi.spyOn()` to monitor existing functions
- Leverage Type-Level Testing with `expectTypeOf()`
- Prefer `toMatchInlineSnapshot()` for readable assertions

## E2E Testing with Playwright

We use Playwright for end-to-end testing with the Page Object Model (POM) pattern.

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with debugging
npm run test:e2e:debug

# View test reports
npm run test:e2e:report
```

### Test Structure

- E2E tests are located in the `e2e` directory
- Page Objects are in `e2e/pages` directory
- Test fixtures are in `e2e/fixtures` directory

### Best Practices

- Use the Page Object Model for maintainable tests
- Leverage Playwright's locators for resilient element selection
- Use browser contexts for isolating test environments
- Implement visual comparison with `expect(page).toHaveScreenshot()`
- Use the trace viewer for debugging test failures

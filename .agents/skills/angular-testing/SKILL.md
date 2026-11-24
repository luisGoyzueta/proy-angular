---
name: angular-testing
description: Angular 21 testing using the project installed Vitest and Playwright, focused on regression prevention.
---

# Angular Testing
- Inspect package.json and current test setup before writing tests; never install or replace runners without permission.
- Use the existing Vitest configuration for unit/component tests and Playwright for E2E where present.
- Write characterization tests before risky refactors, including PrimeNG PickList transfers, forms, validation and keyboard behavior.
- Cover success, errors, empty state, loading, permissions and cleanup of subscriptions where relevant.
- Avoid fragile implementation-detail assertions, fixed delays and real network calls in unit tests.
- Mock HTTP and dependencies consistently with the project patterns.
- Run targeted tests first, then full tests and build when feasible.
- Report exact commands, pass/fail and untested paths; never claim success without execution.

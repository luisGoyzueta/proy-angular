---
name: code-review
description: Senior Angular and TypeScript code review for correctness, security, maintainability and regressions.
---

# Code Review
- Review changes against actual code and project versions; distinguish confirmed bugs from hypotheses.
- Prioritize correctness, security, data loss, race conditions, API compatibility, accessibility, performance and maintainability.
- Give findings with severity, file and line, evidence, impact and minimal suggested fix.
- Check strict typing, subscription lifetimes, signals, form validation, state ownership, error handling and tests.
- Avoid aesthetic-only rewrites and generic advice not supported by the diff.
- Do not modify code during a review unless the user explicitly requests implementation.
- Summarize tests actually run, missing coverage and residual risks.
- Respect Angular 21 and PrimeNG 21 installed versions.

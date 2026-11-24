---
name: accessibility-wcag
description: WCAG 2.2 AA accessibility review for Angular and PrimeNG forms, dialogs and interactive tables.
---

# Accessibility WCAG 2.2 AA
- Audit semantics, accessible names, labels, descriptions, errors, keyboard support, focus order, focus visibility and contrast.
- For Angular Reactive Forms, link error text via aria-describedby and set aria-invalid when invalid; use unique IDs.
- For dialogs, verify initial focus, focus containment where appropriate, Escape behavior and focus restoration.
- Inspect PrimeNG built-in accessibility before adding ARIA or custom focus traps.
- Test keyboard-only interaction, screen-reader semantics and zoom/responsive reflow.
- Check WCAG 2.2 AA criteria and report criterion, file/line, reproduction and suggested fix.
- Do not equate an automated axe pass with complete WCAG compliance.
- Preserve appearance unless changes are needed for accessibility or requested.

---
name: primeng-ui
description: PrimeNG 21 UI patterns for Angular 21 tables, picklists, dialogs, selects and forms.
---

# PrimeNG UI
- Read installed package versions and relevant PrimeNG 21 component APIs before changing code.
- Follow existing theme tokens, design system, Angular standalone imports and typed forms.
- For p-picklist, verify event payload semantics and source/target behavior before modifying signals; never assume event.items is a full list.
- For p-table, preserve filtering, sorting, pagination, track identity and empty/loading states.
- For p-dialog, verify close handling, focus management and accessible labels.
- Avoid brittle ::ng-deep selectors or overrides of internal markup where a public API/token exists.
- Prefer small, compatible changes and add regression tests for affected interactions.
- Never upgrade PrimeNG or Angular without explicit authorization.

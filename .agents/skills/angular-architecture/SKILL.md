---
name: angular-architecture
description: Angular 21 architecture for standalone features, signals stores, services and maintainable boundaries.
---

# Angular Architecture
- Inspect package.json, routes, core, shared, layout and features before recommending changes.
- Keep Angular 21 standalone components and lazy-loaded feature routes.
- Separate UI components, domain models, API services and feature stores only when responsibilities justify it.
- Prefer inject(), signals for synchronous local state, computed() for derivation and RxJS for async streams.
- Preserve API contracts, authentication guards, interceptors and behavior.
- Avoid speculative abstractions, unnecessary NgModules, circular dependencies and duplicate state.
- Present a small migration plan and request approval before broad refactors.
- Validate with existing build and tests; report what was actually executed.

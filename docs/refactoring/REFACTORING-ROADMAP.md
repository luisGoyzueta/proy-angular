# Roadmap de Refactorización Profesional — Angular 21

**Proyecto:** `proyecto-angular`  
**Stack Tecnológico:** Angular 21.2.0, PrimeNG 21.1.10, TypeScript 5.9.2, Vitest 4.1.12, Playwright 1.65.0, Express 5.3.0, SQLite.  
**Rama de trabajo:** `refactor/angular-quality`  

---

## 1. Visión General del Proyecto y Objetivos de Refactorización

El propósito de este plan de refactorización es transformar una aplicación de panel administrativo funcional en una solución empresarial escalable, accesible, altamente tipada, eficiente y lista para producción.

Se ha diseñado una estrategia en **4 Fases Incrementales e Independientes**, donde cada fase concluye con validaciones estrictas y sin regresiones funcionales.

---

## 2. Matriz de Fases y Estado

| Fase | Título | Objetivo Clave | Estado | Riesgo |
| :---: | :--- | :--- | :---: | :---: |
| **01** | **Estabilidad del Entorno de Pruebas y CI** | Eliminar fallos de ejecución local en Vitest, aislar suites de Angular/Backend/E2E y alinear CI. | **COMPLETADA** | Nulo |
| **02** | **Accesibilidad WCAG 2.2 Nivel AA** | Corregir atributos de idioma, jerarquía `<main>`, nombres accesibles, `aria-describedby` y gestión de foco en modales. | **COMPLETADA** | Bajo |
| **03** | **Desacoplamiento Arquitectónico y Rendimiento** | Desacoplar `core` de `features/users` (`SESSION_CLEANUP_HANDLER`), adoptar `OnPush` y eliminar anti-patrones de `effect()`. | **COMPLETADA** | Bajo |
| **04** | **Modernización PrimeNG 21 y Consolidación de UI** | Diagnóstico integral, consolidación de arquitectura de temas y documentación de deuda técnica. | **COMPLETADA** | Nulo |

---

## 3. Registro de Decisiones Arquitectónicas (ADRs)

### ADR-01: Aislamiento del Test Runner de Angular 21 con `@angular/build:unit-test`
- **Contexto**: El script raíz ejecutaba `vitest run` directamente, escaneando toda la raíz y provocando 14 suites fallidas.
- **Decisión**: Configurar `package.json` con `"test": "ng test --watch=false"` y crear `vitest.config.ts` excluyendo `e2e` y `proyecto-api`.
- **Consecuencias**: Pruebas 100% deterministas en local y CI.

### ADR-02: Corrección de la Duplicación en `app.spec.ts`
- **Contexto**: `src/app/app.spec.ts` contenía pruebas duplicadas de `AuthService`.
- **Decisión**: Reescribir `src/app/app.spec.ts` para instanciar y probar exclusivamente el componente `App` (`app-root`) y su `<router-outlet>`.
- **Consecuencias**: Código de pruebas limpio y representativo.

### ADR-03: Estandarización de Accesibilidad Semántica y Contención de Foco
- **Contexto**: `ConfirmModal` y `DialogComponent` carecían de contención de foco cíclico y los formularios carecían de vinculación con `aria-describedby`.
- **Decisión**: Aplicar la directiva standalone `appFocusTrap` en modales, añadir `aria-label` a botones de iconos, títulos descriptivos en rutas y vinculación de errores con `[attr.aria-describedby]`.
- **Consecuencias**: Cumplimiento verificable de los criterios WCAG 2.2 AA (1.1.1, 1.3.1, 2.1.2, 2.4.2, 2.4.3, 3.1.1, 3.3.1).

### ADR-04: Inversión de Dependencias en Limpieza de Sesión (`SESSION_CLEANUP_HANDLER`)
- **Contexto**: `SessionCleanupService` en `core` dependía directamente de `UserStore` en `features/users`.
- **Decisión**: Crear el token `SESSION_CLEANUP_HANDLER` con la interfaz `SessionCleanupHandler` usando `multi: true`. `UserStore` y `ProductStore` se registran independientemente.
- **Consecuencias**: Desacoplamiento estricto respetando Clean Architecture y SOLID.

---

## 4. Auditoría Integral Final
El informe consolidado de cierre con las métricas de rendimiento, validaciones y deuda técnica se encuentra documentado en [FINAL-AUDIT.md](FINAL-AUDIT.md).

# Informe Técnico y Educativo — Fase 1: Estabilidad del Entorno de Pruebas y CI

**Fecha de Ejecución:** 2026-11-23  
**Estado:** COMPLETADA  
**Rama:** `refactor/angular-quality`  
**Skills Aplicadas:** `angular-testing`, `angular-developer`, `typescript-expert`, `code-review`  

---

## 1. Resumen Ejecutivo

### Estado de la Fase
La **Fase 1: Estabilidad del Entorno de Pruebas y CI** ha concluido con éxito rotundo. Se logró resolver el problema crítico que impedía la ejecución local de las pruebas unitarias con `npm test`, eliminando los 14 fallos causados por escaneo indebido de pruebas de Playwright y backend.

### Problemas Identificados
1. `npm test` ejecutaba `vitest run` directamente sin configuración de límites, intentando ejecutar pruebas E2E de Playwright y pruebas de backend contra SQLite.
2. Falta de configuración raíz de Vitest (`vitest.config.ts`).
3. El archivo `src/app/app.spec.ts` era un clon redundante de las pruebas de `AuthService`, dejando al componente raíz `App` sin pruebas unitarias.
4. Ausencia de paquete de cobertura `@vitest/coverage-v8`.

### Problemas Solucionados
1. Se configuró `vitest.config.ts` para restringir el alcance a `src/**/*.spec.ts` y excluir `e2e/**`, `proyecto-api/**`, `dist/**` y `node_modules/**`.
2. Se alineó `package.json` con los estándares de Angular 21, configurando `"test": "ng test --watch=false"` y `"test:watch": "ng test"`.
3. Se refactorizó `src/app/app.spec.ts` para evaluar genuinamente el componente `App` y su `<router-outlet>`.
4. El 100% de las pruebas unitarias pasan limpiamente (`8/8` archivos, `42/42` pruebas).

### Problemas Pendientes para Fases Posteriores
- Instalación de `@vitest/coverage-v8` cuando se autorice la incorporación de dependencias.
- Implementación de pruebas unitarias para vistas CRUD (`Users`, `Products`, `Dashboard`, `Settings`), interceptores y stores (planificadas en Fase 3).

---

## 2. Cambios Realizados

### 1. `package.json`
- **Ruta:** [package.json](file:///d:/trabajo/clases%20angular/proyecto-angular/package.json#L9)
- **Problema anterior:** `"test": "vitest run"` ejecutaba Vitest sin pasar por el compilador de Angular ni por el arnés de pruebas (`@angular/build:unit-test`), fallando con 14 suites rotas.
- **Solución implementada:** Se actualizó `"test": "ng test --watch=false"` y se añadió `"test:watch": "ng test"`.
- **Justificación técnica:** En Angular 21, `@angular/build:unit-test` orquesta la compilación JIT/AOT de componentes, la inicialización de `TestBed` (`init-testbed.js`) y la configuración óptima de Vitest de forma transparente.
- **Beneficio obtenido:** Experiencia idéntica y determinista tanto en local como en CI (`npm test` = 100% de éxito).
- **Riesgo asociado:** Ninguno; compatible con la configuración preexistente de CI (`test:ci`).

### 2. `vitest.config.ts` (Archivo Nuevo)
- **Ruta:** [vitest.config.ts](file:///d:/trabajo/clases%20angular/proyecto-angular/vitest.config.ts)
- **Problema anterior:** Inexistencia de archivo de configuración de Vitest en la raíz, permitiendo que herramientas externas o extensiones de IDE descubrieran archivos ajenos a las pruebas unitarias.
- **Solución implementada:** Se creó la configuración base con `include: ['src/**/*.spec.ts']` y exclusión explícita de `e2e/**` y `proyecto-api/**`.
- **Justificación técnica:** Salvaguarda contra ejecuciones accidentales fuera del arnés de Angular CLI.
- **Beneficio obtenido:** Aislamiento total de las suites del frontend respecto a Playwright y Express.
- **Riesgo asociado:** Ninguno.

### 3. `src/app/app.spec.ts`
- **Ruta:** [src/app/app.spec.ts](file:///d:/trabajo/clases%20angular/proyecto-angular/src/app/app.spec.ts)
- **Problema anterior:** El archivo se llamaba `app.spec.ts` pero contenía una suite `describe('AuthService')` que duplicaba parcialmente lo que ya probaba `src/app/core/services/auth.spec.ts`. El componente `App` no tenía pruebas.
- **Solución implementada:** Se transformó en una suite que inicializa y valida el componente standalone `App` y la existencia de su `<router-outlet>`.
- **Justificación técnica:** Cada archivo `.spec.ts` debe corresponder con la unidad de código que declara probar.
- **Beneficio obtenido:** Eliminación de código de prueba duplicado y verificación real del componente raíz.
- **Riesgo asociado:** Ninguno; `auth.spec.ts` retiene las 6 pruebas completas de `AuthService`.

---

## 3. Explicación Educativa (Módulo de Aprendizaje Angular)

Como equipo de arquitectura y mentoría de Angular, es fundamental comprender el "por qué" de estos cambios:

### A. ¿Por qué `vitest run` fallaba directamente en Angular 21?

#### Código Anterior ([package.json](file:///d:/trabajo/clases%20angular/proyecto-angular/package.json)):
```json
"scripts": {
  "test": "vitest run"
}
```

#### Código Refactorizado:
```json
"scripts": {
  "test": "ng test --watch=false",
  "test:watch": "ng test"
}
```

#### Diferencias Técnicas Fundamentales:
En proyectos tradicionales de Node o React con Vite, ejecutar `vitest run` es suficiente porque Vite transforma los archivos sobre la marcha. Sin embargo, en **Angular 21**:
1. Los componentes standalone con plantillas HTML y estilos SCSS requieren un proceso de compilación específico del compilador de Angular (`@angular/compiler`).
2. Las pruebas necesitan que el entorno de pruebas de Angular (`TestBed`) sea inicializado globalmente mediante `TestBed.initTestEnvironment()`.
3. `@angular/build:unit-test` actúa como un builder de esbuild que empaqueta las pruebas, inyecta `init-testbed.js` y `vitest-mock-patch.js`, y luego invoca a Vitest de manera programática.
4. Al correr `vitest run` "a secas", Vitest no sabía cómo interpretar los metadatos de Angular ni cómo resolver inyecciones de dependencias, arrojando el error: *`Error: Need to call TestBed.initTestEnvironment() first`*.

#### Cuándo aplicar este patrón:
Siempre que trabajes en un proyecto con Angular CLI 19, 20 o 21 configurado con el builder moderno `@angular/build:unit-test`, tus scripts deben invocar `ng test`. Si necesitas pasar flags a Vitest, utiliza la opción `--runner-config` o los parámetros nativos de Angular CLI (`--watch=false`, `--coverage`, `--browsers`).

---

### B. Pruebas de Componentes Standalone Mínimos (`App Component`)

#### Código Anterior ([src/app/app.spec.ts](file:///d:/trabajo/clases%20angular/proyecto-angular/src/app/app.spec.ts)):
```typescript
// CÓDIGO ANTERIOR: Probaba AuthService en app.spec.ts (duplicado)
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });
...
```

#### Código Refactorizado:
```typescript
// CÓDIGO REFACTORIZADO: Prueba genuina del componente App
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let component: App;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente raíz de la aplicación', () => {
    expect(component).toBeTruthy();
  });

  it('debe contener un elemento router-outlet para el enrutamiento de vistas', () => {
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).not.toBeNull();
  });
});
```

#### Por qué se eligió esta solución:
- **`imports: [App]`**: Al ser un componente standalone, se importa directamente en `imports` del módulo de prueba, sin necesidad de declararlo en `declarations`.
- **`provideRouter([])`**: En lugar de importar el módulo legado `RouterTestingModule`, en Angular moderno se utiliza la función standalone `provideRouter([])`. Esto proporciona un enrutador ligero sin rutas reales, ideal para probar que `<router-outlet />` puede instanciarse sin fallos.
- **`By.directive(RouterOutlet)`**: Verifica que la directiva de enrutamiento esté efectivamente renderizada en el DOM del componente raíz.

#### Errores comunes que debes evitar:
1. Dejar archivos de prueba con nombres discordantes con su contenido (genera confusión y sesga métricas de cobertura).
2. Probar la navegación completa de la aplicación en la prueba del componente raíz (eso corresponde a pruebas de integración de rutas o E2E).
3. Olvidar `provideRouter([])` al probar componentes que usan `<router-outlet>`, lo que provoca el error *`NullInjectorError: No provider for ActivatedRoute`*.

---

## 4. Resultados de Validación

Todos los comandos fueron ejecutados en la terminal del proyecto y verificados:

| Comando Ejecutado | Objetivo | Resultado | Detalles |
| :--- | :--- | :---: | :--- |
| `npm test` | Ejecución de pruebas unitarias locales | ✅ **Aprobado (0)** | 8/8 archivos aprobados, **42/42 pruebas superadas** en 5.19 s. |
| `npm run test:ci` | Ejecución en modo CI | ✅ **Aprobado (0)** | 8/8 archivos aprobados, **42/42 pruebas superadas** en 5.18 s. |
| `npx tsc --noEmit` | Verificación estricta de TypeScript | ✅ **Aprobado (0)** | Cero errores de compilación de tipos en toda la solución. |
| `npm run build:prod` | Compilación para producción | ✅ **Aprobado (0)** | Build generado exitosamente en `dist/proyecto-angular`. |
| `npm test --prefix proyecto-api` | Pruebas del Backend Express | ✅ **Aprobado (0)** | 4/4 archivos aprobados, **20 pruebas superadas** en 2.89 s. |
| `git status` | Verificación de cambios y limpieza | ✅ **Aprobado (0)** | Solo los archivos autorizados fueron modificados/creados. |

---

## 5. Evaluación Técnica

| Dimensión | Puntuación (1-10) | Justificación con Evidencia |
| :--- | :---: | :--- |
| **Testing** | **8.5 / 10** | Se subsanó por completo la inestabilidad de `npm test`. Las 42 pruebas se ejecutan de forma determinista y ultrarrápida (5 s). Sigue pendiente ampliar la cobertura a componentes CRUD en la Fase 3. |
| **Arquitectura de CI/Tooling** | **9.0 / 10** | Separación clara entre el runner de Angular CLI, Vitest, Playwright E2E y el backend Express. |
| **Calidad de Código** | **8.5 / 10** | Se eliminó código de prueba redundante y se crearon pruebas semánticas y legibles. |
| **TypeScript** | **9.0 / 10** | Cero errores de tipos y tipado estricto en pruebas de componentes. |
| **Mantenibilidad** | **8.5 / 10** | La estructura de pruebas ahora es predecible para cualquier desarrollador que clone el repositorio. |

---

*(Fase 1 completada exitosamente. De conformidad con las instrucciones obligatorias, me detengo en este punto y espero su autorización expresa antes de comenzar la Fase 2: Accesibilidad WCAG 2.2 AA).*

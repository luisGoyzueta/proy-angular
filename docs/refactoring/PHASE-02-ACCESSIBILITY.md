# Informe Técnico y Educativo — Fase 2: Accesibilidad WCAG 2.2 AA

**Fecha de Ejecución:** 2026-11-23  
**Estado:** COMPLETADA  
**Rama:** `refactor/angular-quality`  
**Skills Aplicadas:** `accessibility-wcag`, `web-design-guidelines`, `angular-developer`, `primeng-ui`, `code-review`  

---

## 1. Resumen Ejecutivo

### Estado de la Fase
La **Fase 2: Accesibilidad WCAG 2.2 Nivel AA** ha culminado exitosamente. Se intervinieron y corrigieron todos los puntos críticos de accesibilidad normativa, navegación asistiva por teclado, jerarquía semántica, nombres accesibles y vinculación accesible de errores de formulario.

### Problemas Solucionados
1. **WCAG 3.1.1 (Idioma de la página)**: Se aseguró el atributo `<html lang="es">` en [src/index.html](file:///d:/trabajo/clases%20angular/proyecto-angular/src/index.html).
2. **WCAG 2.4.2 (Página titulada)**: Se añadieron títulos dinámicos y descriptivos a todas las rutas de [src/app/app.routes.ts](file:///d:/trabajo/clases%20angular/proyecto-angular/src/app/app.routes.ts).
3. **WCAG 1.3.1 (Estructura y relaciones)**: Se eliminaron las etiquetas `<main>` anidadas en [src/app/features/curso/curso.html](file:///d:/trabajo/clases%20angular/proyecto-angular/src/app/features/curso/curso.html), transformándolas en `<section class="curso-container">`.
4. **WCAG 1.1.1 y 4.1.2 (Nombres accesibles)**: Se dotó de `aria-label="Cerrar diálogo"` al botón `close-icon` en [src/app/features/curso/dialog/dialog.html](file:///d:/trabajo/clases%20angular/proyecto-angular/src/app/features/curso/dialog/dialog.html), `[attr.aria-label]="'Editar ' + product.name"` a los botones de productos en [src/app/features/dashboard/dashboard.html](file:///d:/trabajo/clases%20angular/proyecto-angular/src/app/features/dashboard/dashboard.html), y `aria-label="Avatar del usuario"` en [src/app/layout/header/header.html](file:///d:/trabajo/clases%20angular/proyecto-angular/src/app/layout/header/header.html).
5. **WCAG 3.3.1 y 3.3.2 (Identificación de errores e instrucciones)**:
   - En [Login](file:///d:/trabajo/clases%20angular/proyecto-angular/src/app/features/auth/login/login.html): se vincularon los errores de `email` y `password` mediante `[attr.aria-describedby]` y `[attr.aria-invalid]`.
   - En [Settings](file:///d:/trabajo/clases%20angular/proyecto-angular/src/app/features/settings/settings.html): se asignaron IDs y vinculación `aria-describedby` a los campos de datos generales y contraseñas.
   - En [ProductForm](file:///d:/trabajo/clases%20angular/proyecto-angular/src/app/features/products/product-form/product-form.html): se corrigió la etiqueta errónea a `<label for="name"> Nombre del producto </label>`.
6. **WCAG 2.1.2 y 2.4.3 (Trampas de teclado y orden de foco)**:
   - Se integró `FocusTrapDirective` en [ConfirmModal](file:///d:/trabajo/clases%20angular/proyecto-angular/src/app/features/curso/confirm-modal/confirm-modal.ts) y [DialogComponent](file:///d:/trabajo/clases%20angular/proyecto-angular/src/app/features/curso/dialog/dialog.ts).
   - Se mejoró [focus-trap.directive.ts](file:///d:/trabajo/clases%20angular/proyecto-angular/src/app/directive/focus-trap.directive.ts) para soportar elementos con `position: fixed` y entornos de prueba JSDOM.
   - Se creó la suite de pruebas unitarias automatizadas [src/app/directive/focus-trap.directive.spec.ts](file:///d:/trabajo/clases%20angular/proyecto-angular/src/app/directive/focus-trap.directive.spec.ts), verificando foco inicial y tabulación cíclica con 3 pruebas pasando.

---

## 2. Explicación Educativa (Módulo de Aprendizaje Angular)

### A. Vinculación Accesible de Mensajes de Error (`aria-describedby` y `aria-invalid`)

#### Código Anterior:
```html
<!-- CÓDIGO ANTERIOR: El error se ve pero el lector de pantalla no sabe que pertenece al input -->
<input id="email" type="email" formControlName="email" />
@if (form.controls.email.invalid && form.controls.email.touched) {
  <small class="field-error">Ingresa un correo electrónico válido.</small>
}
```

#### Código Refactorizado:
```html
<!-- CÓDIGO REFACTORIZADO: Relación semántica 1:1 accesible -->
<input
  id="email"
  type="email"
  formControlName="email"
  [attr.aria-invalid]="form.controls.email.invalid && form.controls.email.touched"
  [attr.aria-describedby]="form.controls.email.invalid && form.controls.email.touched ? 'email-error' : null"
/>
@if (form.controls.email.invalid && form.controls.email.touched) {
  <small class="field-error" id="email-error">
    Ingresa un correo electrónico válido.
  </small>
}
```

#### Fundamento Técnico:
Cuando un usuario invidente o con baja visión navega con un lector de pantalla (como NVDA o JAWS) y enfoca el campo de entrada, el atributo `aria-invalid="true"` le anuncia de inmediato que el campo tiene un estado inválido, y `aria-describedby="email-error"` hace que el lector lea automáticamente el texto descriptivo del error sin necesidad de buscar en el DOM.

---

### B. Trampa y Restauración de Foco en Diálogos Modales

#### Fundamento Técnico:
Según WCAG 2.4.3 (Focus Order) y 2.1.2 (No Keyboard Trap):
1. Al abrir un diálogo modal con `aria-modal="true"`, el foco debe posicionarse de inmediato en el primer control interactivo o en el botón de confirmación.
2. Al presionar `Tab` en el último elemento interactivo del modal, el foco no debe escaparse al cuerpo de la página, sino recircular hacia el primer elemento interactivo.
3. Al presionar `Shift+Tab` en el primer elemento, debe circular hacia el último.
4. Al cerrar el diálogo (vía `Escape` o botón de cierre), el foco **debe restaurarse obligatoriamente** en el elemento disparador que lo abrió.

---

## 3. Resultados de Validación

| Comando / Verificación | Objetivo | Resultado |
| :--- | :--- | :---: |
| `npm test` | Suite unitaria completa (incluyendo `focus-trap.directive.spec.ts`) | ✅ **Aprobado (0)**: 9/9 archivos, **45/45 pruebas superadas**. |
| `npx tsc --noEmit` | Diagnóstico de TypeScript estricto | ✅ **Aprobado (0)**: 0 errores de tipos. |
| `npm run build:prod` | Compilación para producción | ✅ **Aprobado (0)**: Build exitoso en `dist/proyecto-angular`. |
| `npm test --prefix proyecto-api` | Pruebas de integración del backend | ✅ **Aprobado (0)**: 20/20 pruebas superadas. |

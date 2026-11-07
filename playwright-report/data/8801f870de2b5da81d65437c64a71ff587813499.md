# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> Accesibilidad WCAG 2.2 >> Modal de usuario accesible
- Location: e2e\accessibility.spec.ts:33:3

# Error details

```
Error: Se encontraron problemas de accesibilidad

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 93

- Array []
+ Array [
+   Object {
+     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
+     "help": "Elements must meet minimum color contrast ratio thresholds",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=playwright",
+     "id": "color-contrast",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#177f62",
+               "contrastRatio": 4.36,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#e9f3f0",
+               "fontSize": "12.0pt (16px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.36 (foreground color: #e9f3f0, background color: #177f62, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button pripple=\"\" class=\"p-ripple p-button p-button-outlined p-button-secondary p-component\" type=\"button\" data-p=\"outlined\" data-p-severity=\"secondary\" data-pc-name=\"button\" pc111=\"\" data-pc-section=\"root\" autofocus=\"true\" pc113=\"\" pc114=\"\">",
+                 "target": Array [
+                   ".p-button-outlined",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.36 (foreground color: #e9f3f0, background color: #177f62, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"p-button-label\" aria-hidden=\"false\" data-p=\"\" data-pc-section=\"label\">Cancelar</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".p-button-outlined > .p-button-label[aria-hidden=\"false\"][data-pc-section=\"label\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#177f62",
+               "contrastRatio": 4.36,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#e9f3f0",
+               "fontSize": "12.0pt (16px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.36 (foreground color: #e9f3f0, background color: #177f62, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button pripple=\"\" class=\"p-ripple p-button p-component save-user-button\" type=\"button\" data-p=\"\" data-pc-name=\"button\" pc112=\"\" data-pc-section=\"root\" autofocus=\"true\" pc115=\"\" pc116=\"\">",
+                 "target": Array [
+                   ".save-user-button",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.36 (foreground color: #e9f3f0, background color: #177f62, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"p-button-label\" aria-hidden=\"false\" data-p=\"\" data-pc-section=\"label\">Guardar usuario</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".save-user-button > .p-button-label[aria-hidden=\"false\"][data-pc-section=\"label\"]",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.color",
+       "wcag2aa",
+       "wcag143",
+       "TTv5",
+       "TT13.c",
+       "EN-301-549",
+       "EN-9.1.4.3",
+       "ACT",
+       "RGAAv4",
+       "RGAA-3.2.1",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [ref=f1e4]:
  - complementary [ref=f1e6]:
    - generic [ref=f1e7]:
      - generic [aria-hidden] [ref=f1e8]: 
      - generic [ref=f1e9]: AdminPanel
    - navigation "Navegación principal" [ref=f1e10]:
      - paragraph [ref=f1e11]: MENÚ PRINCIPAL
      - link "Dashboard" [ref=f1e12] [cursor=pointer]:
        - /url: /dashboard
        - generic [aria-hidden] [ref=f1e13]: 
      - link "Usuarios" [ref=f1e15] [cursor=pointer]:
        - /url: /users
        - generic [aria-hidden] [ref=f1e16]: 
      - link "Configuración" [ref=f1e18] [cursor=pointer]:
        - /url: /settings
        - generic [aria-hidden] [ref=f1e19]: 
  - generic [ref=f1e21]:
    - banner [ref=f1e23]:
      - generic [ref=f1e24]:
        - generic: 
        - generic [ref=f1e25]:
          - heading "Panel administrativo" [level=2] [ref=f1e26]
          - text: Bienvenido a tu espacio de trabajo
      - generic [ref=f1e27]:
        - generic [ref=f1e28]: AD
        - generic [ref=f1e30]:
          - strong [ref=f1e31]: Administrador
          - generic [ref=f1e32]: Admin
        - button "Cerrar sesión" [ref=f1e33] [cursor=pointer]:
          - generic [aria-hidden] [ref=f1e34]: 
    - main [ref=f1e36]:
      - generic [ref=f1e37]:
        - generic [ref=f1e38]:
          - generic [ref=f1e39]:
            - generic [ref=f1e40]:
              - heading "Gestión de usuarios" [level=1] [ref=f1e41]
              - paragraph [ref=f1e42]: Administra los usuarios registrados en el sistema
            - button " Nuevo usuario" [ref=f1e44] [cursor=pointer]:
              - generic [ref=f1e45]: 
              - generic [ref=f1e46]: Nuevo usuario
          - generic [ref=f1e48]:
            - generic [ref=f1e51]:
              - generic [ref=f1e52]: Buscar usuario
              - searchbox "Buscar usuario" [ref=f1e53]
            - table [ref=f1e55]:
              - rowgroup [ref=f1e56]:
                - row [ref=f1e57]:
                  - columnheader "Nombre" [ref=f1e58] [cursor=pointer]
                  - columnheader "Correo electrónico" [ref=f1e66] [cursor=pointer]
                  - columnheader "Rol" [ref=f1e74] [cursor=pointer]
                  - columnheader "Estado" [ref=f1e82] [cursor=pointer]
                  - columnheader "Acciones" [ref=f1e90]
              - rowgroup [ref=f1e91]:
                - row [ref=f1e92]:
                  - cell "Usuario Editado 1794032024458" [ref=f1e93]:
                    - generic [ref=f1e94]:
                      - generic [aria-hidden] [ref=f1e95]: 
                      - generic [ref=f1e96]: Usuario Editado 1794032024458
                  - cell "e2e-1794032024458@example.com" [ref=f1e97]
                  - cell "Usuario" [ref=f1e98]
                  - cell "Activo" [ref=f1e99]
                  - cell [ref=f1e102]:
                    - generic [ref=f1e103]:
                      - button "Editar usuario" [ref=f1e105] [cursor=pointer]:
                        - generic [ref=f1e106]: 
                      - button "Eliminar usuario" [ref=f1e108] [cursor=pointer]:
                        - generic [ref=f1e109]: 
                - row [ref=f1e110]:
                  - cell "Usuario E2E 1794031600230" [ref=f1e111]:
                    - generic [ref=f1e112]:
                      - generic [aria-hidden] [ref=f1e113]: 
                      - generic [ref=f1e114]: Usuario E2E 1794031600230
                  - cell "e2e-1794031600230@example.com" [ref=f1e115]
                  - cell "Usuario" [ref=f1e116]
                  - cell "Activo" [ref=f1e117]
                  - cell [ref=f1e120]:
                    - generic [ref=f1e121]:
                      - button "Editar usuario" [ref=f1e123] [cursor=pointer]:
                        - generic [ref=f1e124]: 
                      - button "Eliminar usuario" [ref=f1e126] [cursor=pointer]:
                        - generic [ref=f1e127]: 
                - row [ref=f1e128]:
                  - cell "Usuario E2E 1794031289629" [ref=f1e129]:
                    - generic [ref=f1e130]:
                      - generic [aria-hidden] [ref=f1e131]: 
                      - generic [ref=f1e132]: Usuario E2E 1794031289629
                  - cell "e2e-1794031289629@example.com" [ref=f1e133]
                  - cell "Usuario" [ref=f1e134]
                  - cell "Activo" [ref=f1e135]
                  - cell [ref=f1e138]:
                    - generic [ref=f1e139]:
                      - button "Editar usuario" [ref=f1e141] [cursor=pointer]:
                        - generic [ref=f1e142]: 
                      - button "Eliminar usuario" [ref=f1e144] [cursor=pointer]:
                        - generic [ref=f1e145]: 
                - row [ref=f1e146]:
                  - cell "Editor de prueba" [ref=f1e147]:
                    - generic [ref=f1e148]:
                      - generic [aria-hidden] [ref=f1e149]: 
                      - generic [ref=f1e150]: Editor de prueba
                  - cell "editor@demo.com" [ref=f1e151]
                  - cell "Editor" [ref=f1e152]
                  - cell "Activo" [ref=f1e153]
                  - cell [ref=f1e156]:
                    - generic [ref=f1e157]:
                      - button "Editar usuario" [ref=f1e159] [cursor=pointer]:
                        - generic [ref=f1e160]: 
                      - button "Eliminar usuario" [ref=f1e162] [cursor=pointer]:
                        - generic [ref=f1e163]: 
                - row [ref=f1e164]:
                  - cell "Shiriam Araujo" [ref=f1e165]:
                    - generic [ref=f1e166]:
                      - generic [aria-hidden] [ref=f1e167]: 
                      - generic [ref=f1e168]: Shiriam Araujo
                  - cell "shiriamaraujo@gmail.com" [ref=f1e169]
                  - cell "Editor" [ref=f1e170]
                  - cell "Activo" [ref=f1e171]
                  - cell [ref=f1e174]:
                    - generic [ref=f1e175]:
                      - button "Editar usuario" [ref=f1e177] [cursor=pointer]:
                        - generic [ref=f1e178]: 
                      - button "Eliminar usuario" [ref=f1e180] [cursor=pointer]:
                        - generic [ref=f1e181]: 
                - row [ref=f1e182]:
                  - cell "LUIS GOYZUETA" [ref=f1e183]:
                    - generic [ref=f1e184]:
                      - generic [aria-hidden] [ref=f1e185]: 
                      - generic [ref=f1e186]: LUIS GOYZUETA
                  - cell "goyzueta.luis@gmail.com" [ref=f1e187]
                  - cell "Administrador" [ref=f1e188]
                  - cell "Activo" [ref=f1e189]
                  - cell [ref=f1e192]:
                    - generic [ref=f1e193]:
                      - button "Editar usuario" [ref=f1e195] [cursor=pointer]:
                        - generic [ref=f1e196]: 
                      - button "Eliminar usuario" [ref=f1e198] [cursor=pointer]:
                        - generic [ref=f1e199]: 
                - row [ref=f1e200]:
                  - cell "Carlos Perez" [ref=f1e201]:
                    - generic [ref=f1e202]:
                      - generic [aria-hidden] [ref=f1e203]: 
                      - generic [ref=f1e204]: Carlos Perez
                  - cell "carlos@example.com" [ref=f1e205]
                  - cell "Usuario" [ref=f1e206]
                  - cell "Inactivo" [ref=f1e207]
                  - cell [ref=f1e210]:
                    - generic [ref=f1e211]:
                      - button "Editar usuario" [ref=f1e213] [cursor=pointer]:
                        - generic [ref=f1e214]: 
                      - button "Eliminar usuario" [ref=f1e216] [cursor=pointer]:
                        - generic [ref=f1e217]: 
            - generic [ref=f1e218]:
              - button "First Page"
              - button "Previous Page" [disabled]
              - button "1" [ref=f1e220] [cursor=pointer]
              - button "Next Page" [disabled]
              - button "Last Page" [disabled]
              - generic [ref=f1e221] [cursor=pointer]:
                - combobox "Rows per page" [ref=f1e222]: "10"
                - button "dropdown trigger" [ref=f1e223]
        - dialog "Nuevo usuario" [ref=f1e227]:
          - generic [ref=f1e229]:
            - generic [ref=f1e230]: Nuevo usuario
            - button "Cerrar formulario" [ref=f1e233] [cursor=pointer]
          - generic [ref=f1e237]:
            - generic [ref=f1e238]:
              - generic [ref=f1e239]: Nombre completo *
              - textbox "Nombre completo *" [active] [ref=f1e240]:
                - /placeholder: Ingresa el nombre completo
            - generic [ref=f1e241]:
              - generic [ref=f1e242]: Correo electrónico *
              - textbox "Correo electrónico *" [ref=f1e243]:
                - /placeholder: ejemplo@empresa.com
            - generic [ref=f1e244]:
              - generic [ref=f1e245]:
                - generic [ref=f1e246]: Rol *
                - generic [ref=f1e247] [cursor=pointer]:
                  - combobox "Usuario" [ref=f1e248]
                  - button "dropdown trigger" [ref=f1e249]
              - generic [ref=f1e252]:
                - generic [ref=f1e253]: Estado *
                - generic [ref=f1e254] [cursor=pointer]:
                  - combobox "Activo" [ref=f1e255]
                  - button "dropdown trigger" [ref=f1e256]
          - generic [ref=f1e260]:
            - button " Cancelar" [ref=f1e262] [cursor=pointer]:
              - generic [ref=f1e263]: 
              - generic [ref=f1e264]: Cancelar
            - button " Guardar usuario" [ref=f1e266] [cursor=pointer]:
              - generic [ref=f1e267]: 
              - generic [ref=f1e268]: Guardar usuario
        - generic:
          - alertdialog
```

# Test source

```ts
  1  | import AxeBuilder from '@axe-core/playwright';
  2  | import { expect, type Page } from '@playwright/test';
  3  | 
  4  | export async function checkAccessibility(page: Page, selector?: string): Promise<void> {
  5  |   let analyzer = new AxeBuilder({ page }).withTags([
  6  |     'wcag2a',
  7  |     'wcag2aa',
  8  |     'wcag21a',
  9  |     'wcag21aa',
  10 |     'wcag22aa',
  11 |   ]);
  12 | 
  13 |   if (selector) {
  14 |     analyzer = analyzer.include(selector);
  15 |   }
  16 | 
  17 |   const results = await analyzer.analyze();
  18 | 
  19 |   if (results.violations.length > 0) {
  20 |     console.log(
  21 |       JSON.stringify(
  22 |         results.violations.map((violation) => ({
  23 |           id: violation.id,
  24 |           impact: violation.impact,
  25 |           description: violation.description,
  26 |           nodes: violation.nodes.map((node) => ({
  27 |             target: node.target,
  28 |             failureSummary: node.failureSummary,
  29 |           })),
  30 |         })),
  31 |         null,
  32 |         2,
  33 |       ),
  34 |     );
  35 |   }
  36 | 
> 37 |   expect(results.violations, 'Se encontraron problemas de accesibilidad').toEqual([]);
     |                                                                           ^ Error: Se encontraron problemas de accesibilidad
  38 | }
  39 | 
```
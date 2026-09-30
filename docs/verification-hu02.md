# Evidencia de verificación — HU-02

Fecha: 2026-09-30. Alcance: P-01, P-02, P-03A y P-03B. El usuario autorizó explícitamente la implementación de esta historia. La secuencia de trabajo escribió las pruebas antes de implementar sus funcionalidades; al finalizar, se volvió a ejecutar la comprobación completa después de los últimos cambios de cobertura.

## Resultado

`pnpm check` finalizó con código 0 usando Node 22.23.3, dentro del rango declarado por el proyecto. Pasaron la comprobación de tipos, ESLint, Stylelint, 51 pruebas de Vitest en 13 archivos y 8 pruebas de Chromium. La compilación generó los bundles del navegador. Opengrep ejecutó 6 reglas sobre 25 archivos y no informó hallazgos.

## Propiedades comprobadas con fast-check

Se añadieron propiedades de backend y frontend además de las pruebas por ejemplos:

- **Normalización estable:** al normalizar dos veces datos válidos con espacios, Unicode y tecnologías repetidas, el segundo resultado es idéntico al primero. Esto detecta cambios acumulativos al guardar o validar.
- **Límites y protocolos:** longitudes generadas se aceptan hasta los límites normalizados; esquemas como `javascript`, `data`, `file`, `ftp` y `vbscript` se rechazan. Esto comprueba rangos más amplios que una lista manual de ejemplos.
- **Persistencia fiel:** la propiedad de `tests/pbt/project-persistence.test.ts` guarda y lee valores generados con Unicode, tecnologías, enlaces opcionales y contenido escapable en SQLite; el registro coincide con el valor normalizado. Cada caso usa una base en memoria aislada.
- **Formulario observable:** valores generados sin título bloquean el envío del DOM y muestran el error asociado; enlaces HTTP/HTTPS generados permiten enviar. Así se prueba la interacción del formulario además del validador compartido.

Las propiedades detectan fallos generalizables; los casos fijados siguen cubriendo límites exactos, migración, accesos, tokens y manejo seguro del texto.

## Cobertura por criterios de aceptación

| Criterios | Evidencia ejecutada |
| --- | --- |
| AC-01 y AC-02: rutas protegidas y creación normalizada | `tests/integration/projects.test.ts`: sesión, token CSRF, redirección, campos guardados y enlaces opcionales. |
| AC-03: entradas inválidas sin afectar datos previos | La prueba de integración compara todos los campos de proyectos existentes antes y después del envío inválido. Pruebas unitarias verifican límites y entradas mal formadas. |
| AC-04: mensajes y corrección en navegador | Integración y Chromium comprueban errores, asociación a campos y retención del dato; PBT inspecciona el DOM. |
| AC-05 y AC-08: lectura y migración | Integración comprueba listado/detalle, identificador inexistente, migración de perfil y administrador, migración repetida, reapertura de SQLite y guardado en la base reabierta. PBT comprueba la ida y vuelta de datos. |
| AC-06: salida segura | Integración comprueba escape de marcado, protocolos no permitidos y rutas públicas sin proyectos privados. |
| AC-07: flujo completo | Chromium crea, abre, refresca y vuelve al listado; otra prueba crea con JavaScript desactivado. |
| AC-09: adaptación y teclado | Chromium verifica ausencia de desbordamiento a 390 y 1280 píxeles y recorre los campos y acciones con Tab, incluyendo foco visible. |

Las capturas generadas por Playwright se guardan en `test-results/` y no se versionan. No se hizo despliegue al dominio. Editar o eliminar proyectos, imágenes, publicación pública y demás historias continúan fuera de HU-02.

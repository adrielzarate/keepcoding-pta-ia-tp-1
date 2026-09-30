# Verificación de la primera entrega

Fecha: 2026-09-28. Historia: HU-01, presentación editable con acceso privado.

## Resultado

`pnpm check` completó correctamente la comprobación de tipos, ESLint y Stylelint, 22 pruebas distribuidas en ocho archivos, la construcción y tres recorridos en Chromium. OpenGrep ejecutó seis reglas locales sobre 20 archivos de código y plantillas sin hallazgos. Este resultado se limita a esas reglas y al alcance implementado.

## Comportamientos comprobados

- Inicio y cierre de sesión, cambio del identificador al autenticar, cookies protegidas y rechazo de una sesión revocada.
- Rechazo de cambios sin autorización o con un token de formulario incorrecto.
- Límites ante intentos de inicio de sesión fallidos y errores que no revelan si existe un usuario.
- Actualización de presentación, datos inválidos que no sobrescriben contenido y salida escapada frente a HTML introducido en la biografía.
- Persistencia de datos y sesiones al cerrar y reabrir SQLite; expiración que no se revierte renovando una sesión vencida.
- Propiedades del backend: conservación de texto al guardar y recuperar, normalización idempotente y preservación del contenido ante campos demasiado largos.
- Propiedades del frontend: nombres en blanco siempre impiden enviar y nombres válidos permiten la entrega normal del formulario. Cinco propiedades generan 440 casos por ejecución: cuatro con 100 casos y una con 40.
- Edición completa desde navegador, mensajes de validación, cierre de sesión, uso sin JavaScript y ausencia de desbordamiento horizontal a 390 píxeles.
- Creación del administrador con contraseña oculta, almacenamiento de hash y revocación de sesiones. Copia de seguridad de una base abierta, reapertura de esa copia y rechazo de sobrescrituras.

## Revisión visual

Se revisaron las capturas de la página pública en escritorio y móvil y el panel en escritorio: tipografía, separación de secciones, formulario y mensajes de guardado legibles. Las capturas se regeneran en `test-results/` al ejecutar las pruebas de navegador. El texto utilizado en esas capturas pertenece a pruebas aisladas.

## Límites y trabajo posterior

La aplicación no está desplegada en el alojamiento del usuario. La compatibilidad y configuración del servidor final siguen pendientes de inspección. El contenido inicial es provisional y el acceso personal se crea con `pnpm admin:setup`.

La creación y consulta privada de proyectos se implementó después como HU-02; ver `docs/verification-hu02.md`. La edición de proyectos, imágenes, experiencia, blog y contacto todavía no están implementados. Las comprobaciones de publicación de artículos y mensajes se añadirán con esas historias. Las pruebas de navegador usan Chromium; no se ha comprobado Safari ni Firefox.

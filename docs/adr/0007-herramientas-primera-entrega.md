# ADR-0007: Herramientas y límites de la primera entrega

- Estado: aceptada durante la implementación autorizada.
- Fecha: 2026-09-28.
- Complementa: ADR-0001, ADR-0002, ADR-0003 y ADR-0006.

## Contexto

La primera historia necesita resolver presentación, acceso privado y pruebas completas. La máquina utiliza Node 14 por defecto y tenía una revisión de Node 22 incompatible con herramientas actuales. Se necesita un conjunto compatible y reproducible, manteniendo una única aplicación y pnpm.

## Decisión

- Fijar Node 22.23.3 y pnpm 10.17.1. Usar una copia local de Node para esta máquina, sin cambiar el entorno global. Conservar versiones de dependencias en `pnpm-lock.yaml`. TypeScript 5.9.3 es compatible con el analizador de ESLint instalado; no usar la versión más reciente si rompe esa compatibilidad.
- Acceder a SQLite mediante `better-sqlite3`, consultas parametrizadas y migraciones transaccionales con `user_version`. No introducir un sistema de mapeo de objetos para cuatro tablas pequeñas.
- Utilizar `express-session` y un adaptador SQLite limitado a guardar, recuperar, renovar y borrar sesiones. Probar expiración y persistencia. La biblioteca `better-sqlite3-session-store` evaluada no respeta la desactivación de su temporizador y no permite cerrarlo; no forma parte de las dependencias finales.
- Derivar contraseñas con scrypt de Node, sal aleatoria y comparación en tiempo constante. Crear o recuperar el único administrador mediante un comando interactivo; al cambiarlo revocar todas las sesiones. Añadir token contra solicitudes falsificadas, cookies protegidas y límite de intentos de acceso.
- Usar Vitest para pruebas unitarias e integración, jsdom para el comportamiento del frontend, fast-check para propiedades, Supertest para peticiones HTTP y Playwright con Chromium para recorridos completos.
- Usar ESLint, typescript-eslint, Stylelint y el compilador TypeScript. Instalar OpenGrep 1.30.0 localmente verificando su suma SHA256; mantener seis reglas de análisis locales y un comando conjunto que falle ante errores.
- Construir el pequeño módulo del navegador con esbuild. Mantener plantillas EJS y CSS sin framework de frontend.
- Nombre obligatorio de hasta 100 unidades UTF-16, título profesional de hasta 160 y biografía de hasta 5000, normalizando espacios exteriores y finales de línea. Nombre y título ocupan una sola línea. La biografía es texto plano y admite párrafos; se escapa al mostrarla. Estas longitudes coinciden con el comportamiento de `maxlength` del navegador.

## Alternativas consideradas

- Cambiar Node globalmente: puede afectar otros proyectos; se usa una instalación local.
- TypeScript más reciente sin comprobar compatibilidad: produjo advertencias de dependencias incompatibles; se fijó una versión soportada por el linter.
- Almacenamiento de sesiones en memoria: no conserva sesiones entre reinicios.
- Temporizadores no cerrables para limpiar sesiones: dificultan un apagado limpio. El adaptador limpia sesiones vencidas al escribir y al arrancar.
- Incorporar todo el blog y Tiptap ahora: queda fuera de la primera historia. La elección de Tiptap se mantiene, pero se instalará con esa funcionalidad.

## Consecuencias

El proyecto tiene comandos de verificación y pruebas reales desde la primera historia. El adaptador de sesiones es código propio pequeño y debe mantenerse con sus pruebas. El módulo nativo de SQLite puede requerir compilación en una plataforma nueva. Node 22 debe permanecer en una revisión con soporte y parches; habrá que confirmar su disponibilidad en el alojamiento antes de desplegar.

La configuración del administrador real y el contenido definitivo requieren intervención del propietario, sin bloquear pruebas aisladas ni desarrollo. La aplicación no se publica automáticamente.

## Referencias consultadas

- [Calendario oficial de Node.js](https://github.com/nodejs/Release).
- [Express session: contrato del almacén](https://github.com/expressjs/session).
- [API de better-sqlite3](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md).
- [Vitest](https://vitest.dev/guide/), [Playwright](https://playwright.dev/docs/intro) y [OpenGrep](https://github.com/opengrep/opengrep/blob/main/INSTALL.md).

# Porfolio de Adriel Zarate

Entrega actual: presentación pública editable y creación/consulta privada de proyectos desde el panel. Web en inglés, diseño claro y adaptable a móvil. La edición de proyectos, imágenes, experiencia, blog y contacto siguen en el plan; todavía no están implementados.

## Requisitos

- Node.js 22.23.3, indicado en `.nvmrc`, y pnpm 10.17.1.
- Herramientas de compilación para `better-sqlite3` si no existe un binario compatible con la plataforma.
- Chromium para las pruebas de navegador y OpenGrep para el análisis estático.

En esta máquina hay una copia local de Node en `.tools/node`. Para usarla sin cambiar la configuración global:

```bash
cd /path/to/portfolio
export PATH="$PWD/.tools/node/bin:$PATH"
```

En otra máquina, instalar la versión de `.nvmrc` con el gestor habitual. `.tools/` no forma parte del código versionado.

## Primer arranque

```bash
pnpm install --frozen-lockfile
pnpm run env:init
pnpm admin:setup
pnpm dev
```

`env:init` crea `.env` con un secreto aleatorio y permisos privados, sin sobrescribir uno existente. `admin:setup` solicita usuario y contraseña en la terminal; la contraseña no se muestra ni se pasa como argumento. No hay credenciales predeterminadas. Ejecútalo solo para crear o cambiar el acceso: repetir ese comando reemplaza el único administrador e invalida todas las sesiones existentes.

Abrir `http://127.0.0.1:3000` y acceder al panel en `/admin`. El modo de desarrollo recompila el TypeScript del navegador y reinicia el servidor al cambiar sus fuentes. La biografía inicial está identificada como texto de ejemplo.

## Comprobaciones

Preparar las herramientas una vez:

```bash
pnpm test:e2e:install
pnpm security:install
```

Ejecutar todo:

```bash
pnpm check
```

| Comando | Verifica |
| --- | --- |
| `pnpm typecheck` | Tipos TypeScript en aplicación, pruebas y configuración. |
| `pnpm lint` | ESLint para TypeScript/JavaScript y Stylelint para CSS. |
| `pnpm test:unit` | Reglas de presentación, contraseñas, sesiones e interacción del frontend. |
| `pnpm test:pbt` | Propiedades del frontend y backend mediante fast-check. |
| `pnpm test:integration` | Autenticación, persistencia, protección contra solicitudes falsificadas y límites de acceso. |
| `pnpm test` | Todas las pruebas anteriores. |
| `pnpm test:e2e` | Construcción y recorridos completos con Chromium, incluidos edición sin JavaScript y vista móvil. |
| `pnpm security` | OpenGrep con reglas locales sobre código y plantillas. |
| `pnpm build` | Código del servidor y módulo del navegador listos para ejecutar. |

Las pruebas crean bases de datos aisladas; no acceden a `data/portfolio.sqlite`. Las capturas de navegador se guardan en `test-results/`. Los fallos de fast-check informan la semilla y la ruta del caso reducido; pueden reproducirse, seleccionando la prueba concreta:

```bash
FC_SEED=123 FC_PATH='0:1' pnpm exec vitest run tests/pbt/backend.test.ts -t 'nombre de la prueba'
```

Sustituir los valores por los del fallo. No cambiar arbitrariamente la semilla para ocultarlo.

OpenGrep se instala en `.tools/opengrep` desde una versión oficial fijada, con verificación SHA256. Sus seis reglas locales detectan ejecución de cadenas como código, SQL interpolado, HTML inseguro en el navegador o plantillas, ejecución de comandos mediante shell y desactivación de validación TLS. Es una base ampliable, no una auditoría exhaustiva. Para usar una instalación equivalente existente, definir `OPENGREP_BIN`. No se descargan reglas durante el análisis.

## Operación

```bash
pnpm build
pnpm start
```

Las variables se cargan desde `.env`; las definidas por el entorno tienen prioridad. Para producción configurar `NODE_ENV=production`, `SESSION_SECRET` aleatorio y una ruta absoluta persistente en `DATABASE_PATH`. Servir mediante HTTPS: en producción la cookie solo viaja por conexiones seguras. Si existe un proxy inverso, configurar `TRUST_PROXY_HOPS` con el número exacto de saltos de confianza. El host predeterminado es `127.0.0.1`; no se publica en otras interfaces sin configurar `HOST`.

Las migraciones de SQLite se ejecutan al abrir la base, dentro de una transacción, usando `user_version`. La biografía de esta entrega es texto plano escapado al renderizar. No se interpreta como HTML.

### Copias y recuperación

```bash
pnpm backup
# O elegir un archivo nuevo:
pnpm backup /ruta/privada/copia.sqlite
```

Se usa la API de copia en línea de SQLite, que conserva consistencia con el modo WAL. El comando no sobrescribe un archivo existente. Mantener una copia fuera del servidor y con permisos privados: contiene credenciales cifradas mediante hash y sesiones. La periodicidad y ubicación externa se concretarán con el alojamiento.

Para restaurar: detener la aplicación, conservar la base actual y sus archivos auxiliares como resguardo, colocar la copia en la ruta indicada por `DATABASE_PATH` sin reutilizar archivos WAL o SHM anteriores y ejecutar `pnpm admin:setup` para renovar el acceso y revocar sesiones restauradas. Reiniciar y comprobar la página pública y el panel. Esta entrega no maneja imágenes; su futura copia se documentará al añadir proyectos.

## Documentación

- [Requisitos, estado y tareas](docs/PRD.md).
- [Decisiones de arquitectura](docs/adr/README.md).
- [Resultado de la primera entrega](docs/verification.md).

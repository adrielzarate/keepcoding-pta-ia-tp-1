# ADR-0003: Administrador único y autenticación por sesiones

- Estado: aceptada.
- Fecha: 2026-09-28.
- Base: decisiones expresamente aprobadas por el usuario durante la definición del proyecto.

## Contexto

Solo Adriel tendrá acceso al panel. No se requiere registro de usuarios y no existe un servicio de correo para recuperar contraseñas.

## Decisión

Usar un único administrador con usuario y contraseña y sesiones almacenadas en SQLite. Proteger en el servidor todas las lecturas privadas y modificaciones; el cierre de sesión deberá invalidar la sesión.

Durante la implementación se concretarán la biblioteca de sesiones, el almacenamiento seguro de contraseñas y el procedimiento de creación y recuperación del acceso sin correo. No habrá credenciales predeterminadas publicadas en el repositorio.

## Alternativas consideradas

- Registro público o múltiples roles: no forman parte del producto acordado.
- Proveedor externo de identidad: añade una integración innecesaria para el alcance actual.
- Tokens administrados por el navegador: no se necesitan para el flujo de una aplicación con páginas y formularios propios.

## Consecuencias

El acceso depende de la gestión segura de contraseñas, cookies y sesiones, y de la protección de operaciones de escritura. La recuperación del administrador requiere un procedimiento operativo documentado. Se probará la autorización en el servidor, además del recorrido visual de inicio y cierre de sesión.

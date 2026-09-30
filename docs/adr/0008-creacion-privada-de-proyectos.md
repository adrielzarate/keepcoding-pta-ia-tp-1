# ADR-0008: Crear y consultar proyectos desde el panel privado

- Estado: aceptada con la autorización de HU-02.
- Fecha: 2026-09-30.
- Complementa: ADR-0001, ADR-0002, ADR-0003 y ADR-0006.

## Contexto

La siguiente historia aprobada permite preparar contenido de proyectos desde el panel antes de publicarlo. El usuario aprobó título, descripción en texto plano, tecnologías y enlaces opcionales; SQLite persiste entre despliegues y solo el propietario entra al panel.

## Decisión

- Añadir proyectos a la misma aplicación Express/EJS y a la base SQLite, mediante una migración versionada y consultas parametrizadas.
- Proteger listado, formulario, creación y detalle con la sesión de administrador; proteger la escritura con el token CSRF existente.
- Validar los mismos límites y reglas en TypeScript compartido por servidor y navegador. El servidor siempre es la autoridad y acepta la creación también sin JavaScript.
- Guardar primero y mostrar los proyectos solo en el panel. Esta historia no crea rutas públicas ni implementa edición, borrado o imágenes.
- Normalizar textos y tecnologías antes de guardar; conservar la primera tecnología repetida, su orden y mayúsculas. Mostrar texto escapado por EJS y admitir únicamente enlaces HTTP o HTTPS válidos.

## Alternativas consideradas

- Crear una API separada o introducir un framework de frontend: se descarta porque estas operaciones no necesitan otra aplicación cliente ni una capa de servicio.
- Publicar cada proyecto inmediatamente: se descarta para esta entrega; la consulta privada hace útil el flujo de administración sin adelantar el diseño público.
- Incorporar imágenes y edición junto con la creación: se pospone para mantener esta historia verificable y dejar el almacenamiento de archivos para su propia decisión y tarea.

## Consecuencias

La estructura de datos queda disponible para futuras historias de edición, imágenes y publicación sin exponer ahora borradores de proyectos. La tabla se versiona en SQLite. Los criterios concretos, límites y cobertura de pruebas están en el [PRD de HU-02](../stories/HU-02.md) y su [registro de verificación](../verification-hu02.md).

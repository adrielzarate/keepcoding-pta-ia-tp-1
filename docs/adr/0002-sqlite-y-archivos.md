# ADR-0002: Persistencia con SQLite e imágenes en el alojamiento

- Estado: aceptada.
- Fecha: 2026-09-28.
- Base: decisiones expresamente aprobadas por el usuario durante la definición del proyecto.

## Contexto

El porfolio tendrá un solo administrador. El usuario ha elegido SQLite y ha confirmado que su archivo persiste entre despliegues. Los proyectos necesitan imágenes; los artículos inicialmente solo texto.

## Decisión

Almacenar en SQLite la presentación, los proyectos, la experiencia, los artículos, los mensajes y las sesiones. Guardar los archivos de imágenes de proyectos en almacenamiento persistente del alojamiento y sus referencias en la base de datos.

Preparar migraciones y copias de seguridad consistentes de base de datos e imágenes. La biblioteca de acceso, las rutas y el mecanismo de copia se concretarán después de examinar el entorno.

## Alternativas consideradas

- PostgreSQL o MySQL: posibles alternativas, pero añaden un servicio que no forma parte del alcance aprobado.
- Archivos Markdown para el contenido: no corresponden al flujo elegido de edición desde un panel.
- Almacenamiento externo de imágenes: se reconsideraría si el alojamiento no ofrece la persistencia necesaria para esos archivos.

## Consecuencias

El despliegue inicial se organiza alrededor de una instancia con datos persistentes. La persistencia de SQLite no sustituye las copias de seguridad. Debe confirmarse también la ruta persistente de las imágenes y probarse la restauración. Si aparecen varias instancias o una carga de escritura elevada, habrá que revisar la decisión.

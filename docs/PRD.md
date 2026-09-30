# Porfolio personal de Adriel Zarate

Creado: 2026-09-28. Actualizado: 2026-09-30. Revisión documental: 3.1.
Estado: HU-01 y la entrega acotada de HU-02 están implementadas y verificadas al 2026-09-30. Las demás fases permanecen planificadas; no se ha desplegado en el dominio. Ver [registro de revisión y evidencia](prd-review.md).

## Objetivo y destinatarios

Presentar a Adriel como desarrollador fullstack y permitir que visitantes conozcan su perfil, proyectos, experiencia y artículos, y puedan contactarlo. Adriel será el único administrador y podrá mantener el contenido desde un panel privado.

La primera entrega debe demostrar un recorrido completo: iniciar sesión, editar la presentación, guardarla y verla en la página pública. El resto del alcance se desarrolla después.

## Alcance acordado

| Área | Requisitos |
| --- | --- |
| Idioma y diseño | Web en inglés, estilo minimalista y tema claro. El panel también se plantea en inglés para mantener coherencia. Documentación del proyecto en español. |
| Presentación | Nombre, título profesional y biografía, editables desde el panel. |
| Proyectos | Título, descripción, tecnologías, enlaces al código y a una demostración, e imágenes; contenido editable desde el panel. |
| Experiencia | Empresa, puesto, fechas y descripción, editables desde el panel. |
| Blog | Editor visual, artículos de texto, borradores y publicación manual. |
| Contacto | Nombre, correo y mensaje. Almacenamiento y consulta en el panel, marcado como leído y eliminación. Sin envío de correo. |
| Administración | Un único administrador, autenticación con usuario y contraseña y sesiones. Inicio y cierre de sesión. |
| Alojamiento | Dominio y alojamiento existentes, ejecución de Node.js y almacenamiento persistente para SQLite confirmados por el usuario. |

## Fuera del alcance inicial

Registro público, múltiples administradores, comentarios, envío de correo, publicación programada, imágenes en artículos, otros idiomas y tema oscuro. El blog admite formato de texto mediante el editor visual; las imágenes sí forman parte de los proyectos.

## Primera historia aprobada: presentación editable

**HU-01.** Como propietario del porfolio, quiero acceder a un panel privado y editar mi presentación para que los visitantes vean información actualizada sobre mí.

### Criterios de aceptación acordados

1. El propietario puede iniciar y cerrar sesión.
2. Solo el propietario autenticado puede modificar la presentación; la autorización se comprueba en el servidor.
3. El panel permite editar nombre, título profesional y biografía.
4. Tras guardar, los datos se conservan y aparecen en la web pública, también después de reiniciar la aplicación.
5. Los datos inválidos muestran mensajes claros y no se guardan; la presentación válida anterior permanece intacta.

### Verificación prevista

- Pruebas unitarias de validaciones y reglas de actualización.
- Pruebas basadas en propiedades con fast-check sobre entradas válidas, inválidas y límites; comprobar que rechazar una actualización preserva los datos anteriores.
- Pruebas de integración contra una base de datos SQLite de prueba para comprobar persistencia y autorización.
- Prueba en navegador: iniciar sesión, editar, guardar, comprobar la página pública y cerrar sesión. Comprobar además que una petición sin sesión no permite modificar datos.
- Pruebas del código del frontend que gestione validación o interacción. Evitar crear lógica artificial solo para aumentar la cantidad de pruebas.

## Siguiente historia elegida: crear un proyecto

**HU-02:** crear y consultar un proyecto en el panel, con título, descripción, tecnologías y enlaces. El [PRD de HU-02](stories/HU-02.md) contiene las reglas aprobadas, criterios AC-01 a AC-09 y su evidencia T-01 a T-09. Se excluyen de esta entrega edición, imágenes y publicación pública, que siguen planificadas.

## Criterios de aceptación del resto del producto

Estos criterios concretan el alcance para preparar las siguientes historias; la primera historia es la única priorizada para la primera entrega.

- **Proyectos:** el administrador puede mantener los campos acordados y las imágenes; el visitante puede consultar el contenido y seguir sus enlaces. Las cargas inválidas se rechazan sin modificar el proyecto existente.
- **Experiencia:** los cambios guardados desde el panel se reflejan en la página pública.
- **Blog:** un artículo puede guardarse como borrador sin hacerse público. La publicación exige una acción explícita. Los listados y las direcciones públicas no exponen borradores. El formato permitido del editor se muestra de manera segura.
- **Contacto:** un envío válido se conserva y puede consultarse en el panel. El administrador puede marcarlo como leído y eliminarlo. Los mensajes y los datos de contacto no se exponen públicamente. Los envíos inválidos no se guardan.
- **Acceso:** cerrar sesión invalida el acceso privado; proteger la página del panel no sustituye la autorización de cada operación del servidor.

## Requisitos de calidad y operación

- Mantener una aplicación sencilla, tecnologías maduras y pocas dependencias. Usar versiones estables compatibles con el alojamiento y fijarlas al iniciar la implementación.
- Usar pnpm para dependencias y scripts; conservar pnpm-lock.yaml.
- Tener herramientas para pruebas unitarias y pruebas basadas en propiedades tanto en frontend como en backend, pruebas de integración y pruebas completas en navegador.
- Utilizar fast-check para las pruebas basadas en propiedades. Conservar semilla y ruta de reproducción de los fallos; aislar y restablecer los datos entre casos.
- Disponer de linters, comprobación de tipos TypeScript y OpenGrep para análisis estático. Su instalación y reglas deberán quedar documentadas y ser reproducibles.
- Ofrecer comandos de pnpm para cada comprobación y un comando conjunto. Documentar los requisitos externos de OpenGrep; un comando de pnpm puede invocar esa herramienta sin convertirla en una dependencia JavaScript.
- Validar entradas en el servidor, almacenar contraseñas mediante una función de hash adecuada y proteger sesiones y operaciones de escritura. Tratar el contenido enriquecido como entrada no confiable.
- Preparar protección básica frente al abuso del formulario de contacto y del inicio de sesión.
- Diseñar páginas adaptables a móvil y escritorio, formularios con etiquetas y navegación mediante teclado. Servir contenido público como HTML desde el servidor.
- Mantener la base de datos y las imágenes fuera de directorios reemplazados al desplegar. Documentar copias de seguridad y restauración de ambos recursos, usando un método consistente para SQLite.
- No guardar secretos, mensajes reales ni bases de datos de producción en el repositorio ni utilizarlos en pruebas.

## Arquitectura aprobada y registros

Una sola aplicación Node.js con TypeScript y Express, páginas con EJS, CSS y TypeScript en el navegador, SQLite, editor Tiptap y autenticación por sesiones. Consultar [el índice de decisiones](adr/README.md).

Las herramientas y versiones seleccionadas durante la fase autorizada se documentan en [ADR-0007](adr/0007-herramientas-primera-entrega.md).

## Preparación técnica y decisiones pendientes

La primera entrega utiliza Node 22.23.3, pnpm 10.17.1, better-sqlite3, express-session, Vitest, fast-check, Playwright, ESLint, Stylelint y OpenGrep. El administrador se crea o recupera con un comando local; las sesiones persisten en SQLite. La biografía es texto plano. Los límites implementados son 100 caracteres para nombre, 160 para título y 5000 para biografía, medidos como el navegador.

La copia en línea de SQLite y su reapertura están probadas. Quedan para las siguientes fases los límites de imágenes y el formato persistido del editor del blog. Antes de desplegar se debe confirmar la versión de Node del alojamiento, rutas persistentes, proxy y destino externo de las copias. El agente investigará esos datos cuando disponga del entorno; solo delegará información o accesos que no pueda obtener por sus herramientas.

Consultar [el resultado de verificación](verification.md) y [las instrucciones de arranque](../README.md).

## Reglas de ejecución y cierre

Cada tarea nueva tiene un resultado acotado, dependencias y una correspondencia explícita entre criterio y prueba. Las pruebas futuras aquí descritas son especificaciones: no afirmar que existen ni que han pasado hasta implementarlas y ejecutarlas.

Antes del código, escribir las pruebas y ejecutar su fallo esperado por comportamiento ausente. Explicar las propiedades de fast-check y su finalidad. Restablecer SQLite y estado del navegador entre casos; conservar semilla y ruta de fallos. Usar pruebas unitarias, de integración o navegador según el criterio, sin repetir artificialmente la misma prueba.

Para cerrar cualquier tarea, ejecutar `pnpm check` completo (tipos, linters, todas las pruebas, construcción, navegador y OpenGrep), corregir también fallos previos o ajenos y registrar el resultado sobre el estado final. Una prueba no ejecutada no cuenta como aprobada. Para tareas documentales y humanas añadir las verificaciones manuales reproducibles indicadas; no forzar PBT donde no existe una propiedad útil.

Ordenar primero las tareas del agente por dependencias; insertar nuevas tareas en su posición y continuar con trabajo independiente autorizado. Mantener todas las intervenciones humanas en la sección final. Una tarea bloqueada queda «En espera de intervención humana», no completada, con lo hecho, intentos y resultados, archivos, motivo del bloqueo, intervención vinculada y paso de reanudación. Antes de delegar, comprobar qué puede resolver el agente. Pedir solo lo que no pueda obtener o decidir legítimamente.

## Historial de la primera entrega

A-01 a A-06 conservan su estado histórico de completadas el 2026-09-28; no se afirma retrospectivamente que se desarrollaron con pruebas primero ni que el PRD ya hubiera pasado por Sol. Las nuevas reglas se aplican desde esta adaptación. Todos los responsables de esta sección son el agente.

| Tarea histórica | Dependencias | Criterio observable → evidencia o prueba existente |
| --- | --- | --- |
| A-01 Documentación inicial | Acuerdos iniciales | Alcance y decisiones documentados → lectura de este PRD y `docs/adr/`; la revisión independiente nueva se registra en D-01. |
| A-02 Preparación técnica | H-01 | Entorno y herramientas reproducibles documentados → README y ADR-0007; comparar sus comandos y versiones con package.json. El alojamiento remoto sigue pendiente en O-01. |
| A-03 Herramientas de calidad | A-02 | Comando conjunto ejecuta herramientas acordadas → `pnpm check` y `docs/verification.md`. |
| A-04 Persistencia y acceso | A-03 | Acceso privado, cierre, expiración y recuperación → `tests/integration/app.test.ts`, `tests/unit/session-store.test.ts`, `tests/unit/password.test.ts`, `tests/integration/operations.test.ts`. |
| A-05 Presentación editable | A-04 | Guardado válido y visualización; rechazo de datos inválidos → `tests/unit/profile.test.ts`, `tests/unit/frontend.test.ts`, `tests/pbt/backend.test.ts`, `tests/pbt/frontend.test.ts`, `tests/e2e/presentation.spec.ts`. |
| A-06 Verificación de HU-01 | A-05 | Recorrido completo, persistencia y comprobaciones aprobadas → pruebas anteriores y registro fechado `docs/verification.md`. |

## Plan de ejecución: tareas del agente

Los antiguos bloques A-07 a A-11 se sustituyen por las tareas siguientes: A-07 → P/E; A-08 → B; A-09 → C; A-10 → Q/O; A-11 → F. No se borra su alcance. Todas las tareas de esta sección tienen responsable **Agente**. El estado de cada tarea se indica junto a sus dependencias; una dependencia técnica satisfecha no implica autorización.

### D-01. Adaptar y revisar este PRD

- **Estado:** completada el 2026-09-30; autorizada en esta conversación. Evidencia: [registro de revisión](prd-review.md).
- **Dependencias:** documentación y acuerdos existentes.
- **Resultado:** revisión 2.1 con tareas acotadas y revisión independiente.
- **D-01.1 → verificación documental:** cada tarea tiene estado, responsable, dependencias y criterios vinculados a pruebas; inspeccionar también referencias, identificadores y ausencia de ciclos.
- **D-01.2 → revisión:** `gpt-6-sol` analiza esta versión y se registra la resolución de sus hallazgos en `docs/prd-review.md` antes de validarla.
- **D-01.3 → ejecución:** `pnpm check` completo aprobado; registrar salida resumida y fecha. No modifica funcionalidades.

### D-02. Preparar y revisar HU-02

- **Estado:** completada el 2026-09-30; preparación documental autorizada.
- **Dependencias:** D-01 y elección de la siguiente historia en la conversación.
- **Resultado:** PRD de HU-02 listo para presentar y justificar.
- **D-02.1 → verificación documental:** criterios, pruebas y tareas consistentes con el plan maestro; enlaces y dependencias comprobados.
- **D-02.2 → revisión independiente:** Sol revisa PRD general 3.1 y HU-02 v1.1; único hallazgo corregido y confirmado; ver `docs/prd-review.md`.
- **D-02.3 → ejecución:** `pnpm check` finalizó con código 0 el 2026-09-30; ver evidencia en `docs/prd-review.md`.

### P-01. Reglas de creación de un proyecto

- **Responsable:** Agente. **Estado:** completada el 2026-09-30. **Dependencias:** A-06 y autorización de HU-02 (H-04).
- **Resultado:** contrato y validador de textos, tecnologías y enlaces del [PRD HU-02](stories/HU-02.md).
- **P-01.1 → unitarias:** T-02/03/06 cubren límites y tipos antes de implementar el validador.
- **P-01.2 → PBT backend:** se comprueban normalización idempotente, límites de texto y rechazo de esquemas peligrosos.
- **Evidencia:** [`verification-hu02.md`](verification-hu02.md).

### P-02. Persistir y consultar proyectos en SQLite

- **Responsable:** Agente. **Estado:** completada el 2026-09-30. **Dependencias:** P-01.
- **Resultado:** migración y repositorio para crear, listar y consultar; sin edición.
- **P-02.1 → integración:** T-08 migra preservando datos anteriores y prueba repetición segura.
- **P-02.2 → integración y PBT backend:** T-02/03/05 conservan datos válidos y rechazan entradas inválidas sin alterar registros; una propiedad generativa verifica la ida y vuelta en SQLite.
- **Evidencia:** [`verification-hu02.md`](verification-hu02.md).

### P-03A. Rutas privadas de creación y consulta

- **Responsable:** Agente. **Estado:** completada el 2026-09-30. **Dependencias:** P-02.
- **Resultado:** operaciones de HU-02 protegidas por sesión y token donde corresponda.
- **P-03A.1 → integración HTTP:** T-01/02/03 verifican autorización de todas las rutas, validación de entradas y efectos sobre SQLite.
- **P-03A.2 → integración HTTP:** T-05/06 comprueban consulta, inexistentes, escape y redirección tras crear. No hay publicación pública.
- **Evidencia:** [`verification-hu02.md`](verification-hu02.md).

### P-03B. Interfaz para crear y consultar proyectos

- **Responsable:** Agente. **Estado:** completada el 2026-09-30. **Dependencias:** P-03A.
- **Resultado:** formulario, listado y detalle navegables desde el panel.
- **P-03B.1 → navegador:** T-04/07/09 cubren errores, recorrido con/sin JavaScript, refresco sin nueva inserción y ausencia de desbordamiento a 390 y 1280 píxeles.
- **P-03B.2 → PBT frontend:** entradas generadas verifican el envío real del formulario del DOM.
- **Evidencia:** [`verification-hu02.md`](verification-hu02.md).

### P-08. Editar proyectos existentes

- **Dependencias:** P-03B, H-04 para edición de proyectos.
- **Resultado:** actualizar textos, lista de tecnologías y enlaces; fuera de HU-02.
- **P-08.1 → integración y PBT backend:** sesión y token obligatorios; actualización válida conserva cambios, inválida conserva el registro anterior; inexistentes producen error sin inserción.
- **P-08.2 → navegador y PBT frontend:** reabrir, editar e incorporar o quitar tecnologías refleja lo guardado; errores muestran los datos para corregir y no alteran persistencia.

### P-04. Definir y verificar archivos de imagen permitidos

- **Dependencias:** P-01.
- **Resultado:** contrato y validador de archivos de imágenes de proyectos.
- **P-04.1 → unitarias:** definir formatos raster, cantidad por proyecto, tamaño máximo y validación del contenido real; aceptar archivos permitidos y rechazar falsificaciones y excesos.
- **P-04.2 → PBT backend:** nombres y rutas generados no permiten escapar del directorio permitido; entradas inválidas se rechazan antes de escribir. Importa para impedir que una carga modifique archivos ajenos.

### P-05. Guardar y vincular imágenes de proyectos

- **Dependencias:** P-02, P-04.
- **Resultado:** operación privada de almacenamiento persistente de varias imágenes por proyecto.
- **P-05.1 → integración:** guardar y recuperar dos imágenes distintas conserva sus vínculos y textos alternativos; un fallo de escritura no deja una referencia rota ni altera imágenes anteriores.
- **P-05.2 → integración:** sesión y token son obligatorios; imágenes rechazadas o identificadores inexistentes no modifican SQLite ni archivos. Verificar con errores simulados y una base temporal.

### P-06. Gestionar imágenes desde el panel

- **Dependencias:** P-03B, P-05.
- **Resultado:** interfaz de carga y edición de textos alternativos de varias imágenes.
- **P-06.1 → navegador:** cargar dos imágenes en el mismo proyecto, editar sus textos alternativos y reabrir el formulario conserva ambas y sus datos.
- **P-06.2 → navegador:** sustituir una imagen explícitamente conserva las demás; una sustitución inválida muestra el error y conserva el archivo anterior. Verificar también la operación de sustitución por integración con fallos simulados.

### P-07. Mostrar los proyectos públicamente

- **Dependencias:** P-06.
- **Resultado:** sección pública con textos, tecnologías, enlaces y todas las imágenes vinculadas.
- **P-07.1 → integración:** solo se renderizan campos públicos; contenido hostil se muestra escapado y enlaces solo usan protocolos permitidos.
- **P-07.2 → navegador:** proyecto guardado aparece con su lista de tecnologías, enlaces y dos imágenes con sus textos alternativos; lista vacía muestra un estado claro y no rompe la página.

### E-01. Reglas y persistencia de experiencia

- **Dependencias:** A-06, H-04 para proyectos/experiencia.
- **Resultado:** guardar y editar empresa, puesto, fechas y descripción.
- **E-01.1 → unitarias y PBT backend:** fechas imposibles o fin anterior al inicio se rechazan; documentar representación de un puesto actual sin fecha final; conservar datos previos ante entrada inválida.
- **E-01.2 → integración:** crear, recuperar y actualizar conserva los campos; migración preserva presentación y proyectos si existen.

### E-02. Editar experiencia desde el panel

- **Dependencias:** E-01.
- **Resultado:** formulario privado con validación accesible.
- **E-02.1 → integración:** sin sesión o token no hay cambios.
- **E-02.2 → navegador y PBT frontend:** crear/editar funciona; intervalos generados inválidos muestran errores y no se envían; mantener el puesto actual sin fecha final funciona.

### E-03. Mostrar experiencia públicamente

- **Dependencias:** E-02.
- **Resultado:** experiencia visible en inglés.
- **E-03.1 → navegador:** lo guardado aparece con empresa, puesto, fechas y descripción; un puesto actual se distingue correctamente.
- **E-03.2 → integración:** contenido escapado y lista vacía renderizada sin errores. No se necesita PBT adicional si estos casos cubren la representación.

### B-01. Persistir artículos como borradores

- **Dependencias:** A-06, H-04 para blog.
- **Resultado:** contrato y almacenamiento de título, dirección pública estable, contenido y estado.
- **B-01.1 → unitarias e integración:** documentar formato persistido y límites; crear un artículo siempre produce un borrador; migrar conserva datos existentes.
- **B-01.2 → PBT backend:** guardado/lectura conserva contenido válido y rechaza estructuras inválidas sin cambiar lo anterior; direcciones públicas son únicas, con colisiones verificadas por integración.

### B-02. Editar borradores con Tiptap

- **Dependencias:** B-01.
- **Resultado:** editor visual privado para texto, sin carga de imágenes.
- **B-02.1 → navegador:** crear, guardar y reabrir conserva texto y formato permitido; guardar nunca publica por sí solo.
- **B-02.2 → integración:** exigir sesión y token; rechazar formatos o nodos fuera del conjunto documentado.
- **B-02.3 → PBT frontend:** documentos generados dentro del esquema se serializan y recuperan conservando su significado; importa para no perder formato al editar. Añadir casos con texto hostil que nunca se ejecute.

### B-03. Publicación manual

- **Dependencias:** B-02.
- **Resultado:** acción explícita de publicación de un artículo válido.
- **B-03.1 → integración y navegador:** guardar mantiene el borrador; publicar cambia el estado solo tras acción autenticada válida; un fallo de validación no publica.
- **B-03.2 → PBT backend:** secuencias de guardados sin acción de publicación mantienen el estado borrador. Publicar de nuevo no duplica el artículo ni altera su dirección.

### B-04. Listado público del blog

- **Dependencias:** B-03.
- **Resultado:** listado de artículos publicados con enlace a su dirección.
- **B-04.1 → integración y PBT backend:** para conjuntos generados de artículos, el listado contiene exactamente los publicados; los borradores nunca aparecen.
- **B-04.2 → navegador:** mostrar estado vacío y títulos/enlaces escapados. El enlace al detalle se comprueba al completar B-05.

### B-05. Lectura pública segura de artículos

- **Dependencias:** B-04.
- **Resultado:** página de artículo con el formato permitido.
- **B-05.1 → integración:** una dirección inexistente o de un borrador no revela contenido; un artículo publicado es legible.
- **B-05.2 → integración y navegador:** contenido y enlaces hostiles no ejecutan scripts; el formato autorizado se conserva y las direcciones del listado llevan al artículo correcto.

### B-06. Editar artículos publicados

- **Dependencias:** B-05.
- **Resultado:** actualizar texto y título de un artículo publicado mediante una acción manual explícita.
- **B-06.1 → navegador e integración:** reabrir un artículo publicado conserva su contenido; la acción «Save and publish changes» aplica la actualización únicamente con sesión, token y contenido válidos. Cancelar o una entrada inválida conserva la versión pública anterior.
- **B-06.2 → integración:** la dirección permanece estable y no se duplica el artículo; los borradores mantienen su flujo independiente de guardado y publicación. No se incorpora historial de versiones ni publicación programada.

### C-01. Validación y persistencia de mensajes

- **Dependencias:** A-06, H-04 para contacto.
- **Resultado:** almacenamiento de nombre, correo, mensaje y estado de lectura.
- **C-01.1 → unitarias y PBT backend:** documentar límites y formato de correo; entrada inválida no crea mensajes, texto válido conserva su significado al recuperarse.
- **C-01.2 → integración:** cada mensaje nuevo está sin leer y una migración no afecta datos existentes.

### C-02. Formulario público de contacto

- **Dependencias:** C-01.
- **Resultado:** envío persistido con confirmación y protección básica frente al abuso.
- **C-02.1 → navegador e integración:** datos válidos se guardan; inválidos muestran errores y se conservan para corregir; ningún mensaje ni correo anterior aparece en respuestas públicas.
- **C-02.2 → integración:** definir y probar límite de frecuencia y tamaño; al excederlo no se inserta otro mensaje. No se envía correo.
- **C-02.3 → PBT frontend:** entradas generadas inválidas bloquean envío y las válidas lo permiten; la comprobación del servidor sigue siendo obligatoria.

### C-03. Consultar la bandeja privada

- **Dependencias:** C-02.
- **Resultado:** listado y detalle privado de mensajes.
- **C-03.1 → integración:** sin sesión no se obtiene ningún campo privado; abrir el listado o detalle no cambia por sí solo el estado de lectura.
- **C-03.2 → navegador:** se ve el mensaje enviado con su estado; contenido hostil se muestra como texto seguro y la lista vacía se representa correctamente.

### C-04. Marcar mensajes como leídos

- **Dependencias:** C-03.
- **Resultado:** acción privada explícita para cambiar el estado de lectura.
- **C-04.1 → integración y navegador:** solo sesión y token válidos permiten la acción; el estado actualizado se conserva al reabrir la bandeja.
- **C-04.2 → PBT backend:** marcar leído repetidamente es idempotente y no altera nombre, correo ni texto; evita corrupción durante cambios de estado.

### C-05. Eliminar mensajes

- **Dependencias:** C-04.
- **Resultado:** acción privada de eliminación explícita.
- **C-05.1 → integración:** sin sesión o token no se elimina; el identificador seleccionado desaparece sin afectar otros mensajes.
- **C-05.2 → navegador:** eliminar retira el mensaje de bandeja y detalle; cancelar la confirmación conserva el mensaje.

### Q-01. Integrar la navegación

- **Dependencias:** P-07, P-08, E-03, B-06, C-05, H-04 para integración final.
- **Resultado:** acceso a las secciones implementadas desde la navegación pública y privada.
- **Q-01.1 → navegador:** cada enlace lleva a la sección correcta; rutas privadas siguen protegidas y el recorrido de regreso funciona.
- **Q-01.2 → inspección:** etiquetas y mensajes visibles están en inglés; registrar y corregir cualquier texto accidental en otro idioma.

### Q-02. Verificar diseño claro y adaptable

- **Dependencias:** Q-01.
- **Resultado:** páginas integradas legibles en móvil y escritorio.
- **Q-02.1 → navegador:** a 390 y 1280 píxeles no hay desbordamiento horizontal en páginas públicas ni formularios privados.
- **Q-02.2 → inspección visual:** guardar capturas de cada sección y comprobar tema claro, contraste legible, espacios y ausencia de superposiciones; registrar y corregir defectos.

### Q-03. Verificar uso mediante teclado

- **Dependencias:** Q-02.
- **Resultado:** navegación, formularios y editor operables por teclado.
- **Q-03.1 → navegador e inspección reproducible:** recorrer cada control por teclado; comprobar orden de foco, foco visible, etiquetas y errores asociados; poder operar el editor y enviar formularios sin ratón.
- **Q-03.2 → evidencia:** documentar recorrido y resultado por página; corregir fallos antes del cierre. No se necesita PBT adicional para esta inspección.

### O-01. Confirmar configuración del alojamiento

- **Dependencias:** A-06, H-04 para preparación del despliegue.
- **Resultado:** inventario de versión Node, arranque, proxy, rutas persistentes y permisos necesarios.
- **O-01.1 → comprobación operativa:** inspeccionar configuración y accesos disponibles; verificar compatibilidad con las dependencias fijadas, sin desplegar ni cambiar servicios reales.
- **O-01.2 → registro:** documentar comandos de inspección y resultados sin secretos. Si faltan datos o acceso, crear una intervención humana concreta y dejar esta tarea en espera; no fingir confirmación remota.

### O-02. Copias consistentes de datos e imágenes

- **Dependencias:** P-06, O-01.
- **Resultado:** procedimiento que conserva base e imágenes vinculadas.
- **O-02.1 → integración:** generar copia de base e imágenes y restaurarla en un directorio aislado; todas las referencias restauradas existen y los campos coinciden.
- **O-02.2 → prueba operativa:** documentar y comprobar coordinación frente a cargas concurrentes, destino externo y frecuencia; no ejecutar una restauración destructiva sobre producción. Si la instalación externa requiere acceso inexistente, separar y registrar esa intervención.

### O-03. Ensayar arranque y reinicio de la versión construida

- **Dependencias:** O-01, Q-03, O-02.
- **Resultado:** instrucciones verificadas de operación, sin publicar el dominio.
- **O-03.1 → integración operativa:** construir e iniciar en entorno aislado compatible; crear contenido de prueba, reiniciar y comprobar persistencia de contenido, imágenes y sesiones.
- **O-03.2 → prueba operativa:** comprobar cookies seguras bajo configuración HTTPS/proxy equivalente a la del alojamiento y recuperación del administrador; documentar variables requeridas sin secretos.

### F-01. Integrar contenido personal confirmado

- **Dependencias:** P-07, E-03, H-02, H-04 para integración final.
- **Resultado:** presentación, proyectos y experiencia reales en inglés.
- **F-01.1 → revisión documental:** contrastar cada dato con el material del usuario, sin inventar trayectoria; pedir confirmación solo sobre ambigüedades que el agente no pueda resolver.
- **F-01.2 → navegador:** comprobar que cada dato aprobado aparece, sus enlaces funcionan y las imágenes tienen textos alternativos; no quedan textos de ejemplo en las secciones publicadas.

### F-02. Preparar entrega final revisable

- **Dependencias:** F-01, O-03.
- **Resultado:** documentos y evidencia final listos para aprobación.
- **F-02.1 → verificación documental:** README, PRD y ADR reflejan lo implementado; revisar enlaces y estado de tareas. Revisar con Sol cualquier cambio sustancial del PRD surgido durante el trabajo.
- **F-02.2 → ejecución:** `pnpm check` completo aprobado y evidencia de Q/O enlazada; preparar instrucciones de publicación y reversión concretas. Publicar el dominio queda fuera de esta tarea y requiere autorización explícita posterior.

## Tareas humanas — agrupadas al final

### H-01. Autorización de la primera entrega

- **Responsable:** Adriel. **Estado:** completada el 2026-09-28. **Dependencias:** A-01 histórica.
- **Motivo:** el usuario reservó la aprobación de cada fase; el agente no puede concedérsela.
- **Hecho y evidencia:** autorización explícita recibida en la conversación; desbloqueó A-02 a A-06. No implica autorización del resto ni publicación.
- **Criterio → comprobación:** existe aprobación explícita de la primera entrega → contrastar el mensaje de autorización con su alcance. No hay nuevos pasos pendientes.

### H-04. Autorizar las siguientes fases

- **Responsable:** Adriel. **Estado:** completada para HU-02 el 2026-09-30; vigente para las demás fases. **Dependencias:** D-01; D-02 para HU-02.
- **Motivo:** el usuario pidió aprobar antes de continuar. Adaptar este documento no autoriza implementar todo el porfolio.
- **Hecho:** Adriel autorizó explícitamente iniciar la implementación de HU-02 y aprobó el alcance de esa historia. Esto desbloqueó P-01, P-02, P-03A y P-03B; no autoriza las demás fases ni publicar el dominio.
- **Criterio → comprobación:** aprobación explícita registrada y limitada a las tareas autorizadas → cumplido para HU-02; las demás fases conservan aprobación pendiente.

### H-03. Elegir el acceso personal al panel

- **Responsable:** Adriel. **Estado:** pendiente; no bloquea pruebas aisladas. **Dependencias:** A-04 completada.
- **Motivo:** el agente puede crear cuentas, y lo ha probado; falta únicamente la elección privada de la contraseña personal.
- **Hecho:** comando de creación y recuperación probado; configuración local con secreto aleatorio; sin credenciales de prueba en la base de uso normal.
- **Pasos:** abrir una terminal en la carpeta del proyecto, activar Node según README, ejecutar `pnpm admin:setup` solo para crear o cambiar el acceso, elegir usuario y contraseña de 12 a 256 caracteres y repetirla. Entrar en `/admin` de la aplicación local. No compartir la contraseña en la conversación.
- **Criterio → prueba manual:** iniciar sesión con ese acceso, abrir el formulario de presentación y cerrar sesión → el panel deja de ser accesible sin volver a iniciar sesión. Registrar confirmación sin contraseñas.

### H-02. Aportar contenido personal real

- **Responsable:** Adriel. **Estado:** pendiente; no bloquea desarrollo con ejemplos identificados. **Dependencias:** ninguna.
- **Motivo:** el agente puede traducir y organizar contenido, pero no inventar datos biográficos que no posee.
- **Hecho:** definidos los campos; solo se conocen nombre y profesión. No se ha recibido la trayectoria ni los proyectos reales.
- **Pasos:** proporcionar título profesional y biografía; proyectos con descripción, tecnologías, enlaces e imágenes; empresas, puestos, fechas y descripciones. Puede indicar una ubicación accesible con esa información. El agente preparará el texto en inglés y preguntará solo por dudas concretas.
- **Criterio → comprobación:** material suficiente para cada sección → contrastar campos con la lista anterior y registrar qué datos se recibieron o qué omisiones fueron expresamente aceptadas. Desbloquea F-01.

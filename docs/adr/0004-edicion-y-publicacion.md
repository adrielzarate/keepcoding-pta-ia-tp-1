# ADR-0004: Editor visual Tiptap y publicación manual del blog

- Estado: aceptada.
- Fecha: 2026-09-28.
- Base: decisiones expresamente aprobadas por el usuario durante la definición del proyecto.

## Contexto

El propietario quiere editar artículos desde el panel mediante un editor visual. El blog necesita borradores y publicación manual; las imágenes de artículos quedan fuera del alcance inicial.

## Decisión

Usar Tiptap para editar texto enriquecido. Guardar artículos como borradores y publicarlos únicamente mediante una acción explícita del propietario. Excluir borradores de listados y consultas públicas, incluidas las peticiones directas a sus direcciones.

Concretar al implementar el formato persistido y el conjunto de formatos de texto permitidos. Validar el contenido y mostrarlo de forma segura.

## Alternativas consideradas

- Markdown desde el repositorio: descartado por la preferencia explícita de un panel con editor visual.
- Un área de texto sin formato: no satisface la edición visual aprobada.
- Un gestor de contenido externo: incorpora otro sistema para un alcance que puede resolver la aplicación.

## Consecuencias

El editor introduce dependencias de navegador y requiere una representación persistida estable. Debe controlarse qué formato se acepta y cómo se muestra. Las pruebas deben verificar la privacidad de los borradores independientemente de lo que muestre el panel.

# Planificación y bloqueos

## PRD y tareas comprobables

El documento de requisitos del producto (PRD) describe destinatarios, objetivos, funcionalidades, límites y criterios de aceptación, además del plan de ejecución. No reducirlo a una lista de tareas.

Cada tarea produce un resultado concreto. Dividir las que mezclen resultados independientes o sean demasiado amplias para comprobarlas con claridad. Autocontenida no significa libre de dependencias: declararlas y distinguir trabajo autorizado de propuestas.

Transformar todos los criterios de aceptación en pruebas y mantener su correspondencia en la tarea. Para documentación o intervención humana, definir también una comprobación concreta del resultado. Si no es automatizable, describir un procedimiento reproducible con resultado esperado y registrar la evidencia real.

Aplicar el orden del archivo principal al incorporar tareas o cambiar dependencias. La posición de una tarea en el documento no elimina sus dependencias: señalar las intervenciones necesarias y trabajar en lo que pueda avanzar.

## Cuándo revisar el PRD con GPT-6 Sol

Requerir revisión para el PRD inicial y cuando cambie cualquiera de estos elementos:

- Objetivos, destinatarios, alcance o funcionalidades incluidas o excluidas.
- Comportamiento esperado, criterios de aceptación o cobertura de pruebas exigida.
- Arquitectura o restricciones que alteren la viabilidad o la ejecución del plan.
- Dependencias, responsabilidades o tamaño de tareas de forma que cambien qué se entregará, cómo se comprobará o qué lo bloquea.

No requieren por sí solos nueva revisión las correcciones ortográficas, enlaces, formato, registro de resultados, cambios de estado ni reordenaciones o divisiones mecánicas que preserven íntegramente alcance, criterios, cobertura y dependencias. Evaluar el efecto acumulado de varios cambios menores para no eludir la revisión mediante fragmentación.

Crear un subagente independiente con el modelo exacto `gpt-6-sol`. Proporcionarle el PRD, los requisitos acordados y las decisiones relevantes. Pedir que revise alcance, omisiones, contradicciones, tamaño de tareas, dependencias, criterios, correspondencia con pruebas y orden de responsables.

Registrar el modelo, la versión del documento revisada, los hallazgos y su resolución. Corregir problemas antes de declarar validado el PRD y devolver las correcciones sustanciales al revisor para confirmar su resolución. Esta revisión está autorizada como parte del flujo del proyecto.

Si el modelo no está disponible, dejar la revisión pendiente y comunicarlo. No sustituirlo silenciosamente ni declarar validado el documento. Continuar con trabajo independiente ya autorizado que no dependa de esa validación.

## Procedimiento ante bloqueos

1. Investigar la causa y probar alternativas razonables dentro del alcance y los permisos. No repetir indefinidamente el mismo intento sin evidencia nueva.
2. Completar la parte independiente. Comprobar las capacidades disponibles antes de delegar; si solo falta una autorización, solicitarla y ejecutar después la tarea. No eludir restricciones ni intentar obtener secretos para evitar una intervención necesaria.
3. Si hace falta una persona, crear una tarea solo para su intervención, explicar por qué y vincularla con la tarea afectada. Marcar esta última «En espera de intervención humana»: es un cierre temporal, no una finalización.
4. Registrar en la tarea afectada qué se hizo, qué se intentó y su resultado, los archivos o resultados producidos, qué falta, por qué depende del usuario y el siguiente paso para retomarla.
5. Continuar con la siguiente tarea independiente autorizada. Si no queda ninguna viable, comunicar el impedimento y pedir únicamente la intervención necesaria.
6. Cuando se resuelva, reabrir la tarea, actualizar dependencias y posición y conservar el historial del trabajo previo.

Redactar las tareas humanas con contexto, pasos concretos y resultado esperado, sin abreviaturas ni términos raros. Explicar cualquier término técnico imprescindible. Indicar qué debe proporcionar o confirmar la persona y qué desbloquea. Ordenarlas dentro de su sección por dependencias y por el trabajo que permiten continuar.

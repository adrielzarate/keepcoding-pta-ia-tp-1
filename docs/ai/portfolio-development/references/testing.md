# Pruebas y cierre

## Antes de implementar

Vincular cada criterio de aceptación con una prueba. Escribir las pruebas y preparar las verificaciones antes del código de la tarea; ejecutarlas para comprobar que detectan el comportamiento ausente. Distinguir un fallo esperado de comportamiento de un fallo de configuración. Después implementar y volver a verificar.

Planificar verificaciones tan amplias como sea razonable: casos normales, inválidos y límites, permisos, persistencia, integración y recorridos de navegador cuando correspondan. Evitar pruebas redundantes o que solo reproduzcan la implementación.

## Propiedades en frontend y backend

Utilizar `fast-check` en ambos ámbitos cuando existan invariantes útiles. Antes de implementar, explicar brevemente al usuario qué propiedades se comprobarán, qué entradas se generarán y por qué importan. Si una tarea concreta no se beneficia de PBT, justificarlo y cubrir sus criterios mediante otras pruebas apropiadas; esto no elimina el requisito de PBT del proyecto.

Derivar las propiedades de requisitos y reglas del dominio. Los generadores deben cubrir entradas válidas, inválidas y casos límite. Ejemplos según la funcionalidad implementada:

- Frontend: entradas inválidas impiden enviar formularios y muestran errores; entradas válidas permiten la interacción prevista.
- Backend: validación de contenido y mensajes, conservación de datos válidos al persistir y exclusión de borradores de las consultas públicas.

Aislar pruebas de datos reales. Restablecer el estado entre casos generados, tanto del navegador o sus simulaciones como de SQLite, usando una base de prueba. Conservar la semilla y la ruta de reproducción de los fallos de fast-check, corregir su causa y volver a ejecutar las pruebas afectadas.

Integrar PBT en los comandos habituales de pruebas de cada ámbito. Complementar con pruebas de ejemplos, integración o navegador para comportamientos no verificados por las propiedades. Incluir el trabajo de pruebas en las tareas del agente del PRD.

## Evidencia y fallos al cerrar

Ejecutar la comprobación completa exigida en el archivo principal sobre el estado final del proyecto y registrar comandos y resultados. No reutilizar resultados anteriores a cambios que puedan invalidarlos.

Si una comprobación falla, investigar y corregir, aunque el fallo sea anterior o parezca ajeno. Insertar cualquier tarea de reparación necesaria en el PRD según sus dependencias. Esto no amplía por sí solo permisos ni autoriza trabajo fuera del proyecto: si se requiere intervención humana, seguir el procedimiento de bloqueos y dejar la tarea en espera, nunca completada.

No omitir suites, desactivar reglas ni debilitar expectativas para obtener un resultado favorable. Las comprobaciones que no pudieron ejecutarse siguen pendientes. Conservar evidencia real de las comprobaciones manuales cuando las haya.

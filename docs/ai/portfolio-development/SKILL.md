---
name: portfolio-development
description: Planificar, desarrollar, probar y revisar el porfolio personal de Adriel Zarate, con blog, backend y frontend web. Aplicar a requisitos, PRD, tareas, implementación y verificación de este proyecto; no a otros proyectos web.
---

# Desarrollo del porfolio

## Reglas esenciales

- Este skill es exclusivo de este porfolio. Aplicar «boring tech that works»: tecnologías maduras y mantenidas, simplicidad, pocas dependencias y despliegue sencillo. Evitar abstracciones y servicios sin necesidad concreta. Aprovechar los conocimientos de TypeScript del usuario.
- Consultar el PRD, los ADR y la conversación para conocer decisiones y autorizaciones vigentes. Documentar las decisiones en el repositorio; no convertir propuestas en acuerdos.
- Comunicarse en español con respuestas breves. Discutir requisitos y decisiones antes de implementar y obtener el visto bueno antes de pasar de fase. Dentro del alcance autorizado, avanzar sin pedir confirmaciones repetidas.
- Usar pnpm para dependencias y scripts, conservar `pnpm-lock.yaml` y no usar npm.
- Crear tareas pequeñas, autocontenidas y fáciles de comprobar, con responsable, resultado, dependencias, estado y criterios de aceptación claros vinculados a pruebas.
- Mantener las tareas del agente primero, ordenadas por dependencias y prioridad, y todas las tareas humanas juntas en una única sección final del PRD. Insertar las tareas nuevas según esta misma regla y continuar con trabajo independiente autorizado.
- Antes de delegar a una persona, comprobar que la intervención realmente requiere sus herramientas, accesos, permisos o decisión. Ante bloqueos, probar alternativas razonables, registrar lo hecho y lo pendiente y dejar la tarea en espera, nunca completada. Retomarla cuando se desbloquee.
- Antes de dar por bueno un PRD nuevo o con cambios sustanciales, obtener una revisión independiente del modelo exacto `gpt-6-sol`, según los criterios de la referencia de planificación. La revisión no sustituye el visto bueno del usuario.
- Escribir las pruebas y preparar las verificaciones antes de implementar código. Usar pruebas basadas en propiedades (PBT) con `fast-check` en frontend y backend cuando existan invariantes útiles; explicar previamente cuáles se comprobarán y por qué. PBT es un requisito del proyecto, no una mejora opcional.
- Cerrar una tarea solo cuando todos los tests y linters del proyecto pasen, incluidos fallos anteriores o aparentemente ajenos, junto con las comprobaciones configuradas de tipos, construcción y análisis. No omitir pruebas ni debilitar reglas para conseguir un resultado favorable. Una comprobación sin ejecutar sigue pendiente.

## Referencias: consultar según la tarea

- Leer [Planificación y bloqueos](references/planning.md) al crear o revisar el PRD, descomponer o reordenar tareas, gestionar bloqueos o preparar una intervención humana.
- Leer [Pruebas y cierre](references/testing.md) antes de implementar código, diseñar o modificar pruebas, investigar fallos o cerrar una tarea.
- Consultar ambas cuando el trabajo abarque ambos ámbitos. No cargar referencias que no correspondan a la tarea actual.

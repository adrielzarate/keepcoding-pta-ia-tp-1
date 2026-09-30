# ADR-0006: pnpm, pruebas basadas en propiedades y análisis de código

- Estado: aceptada.
- Fecha: 2026-09-28.
- Base: decisiones expresamente aprobadas por el usuario durante la definición del proyecto.

## Contexto

El usuario exige pnpm, herramientas para pruebas unitarias y pruebas basadas en propiedades en frontend y backend, linters, OpenGrep y pruebas de extremo a extremo en navegador. El skill exige fast-check en el backend; el proyecto amplía su uso también al frontend.

## Decisión

Usar pnpm como gestor de dependencias y ejecutor de scripts, conservando pnpm-lock.yaml. Usar fast-check para las pruebas basadas en propiedades de frontend y backend.

Preparar pruebas unitarias, de integración con SQLite aislado y de extremo a extremo en navegador. Añadir linters, comprobación de tipos TypeScript y OpenGrep para análisis estático de seguridad. Exponer comandos individuales y un comando conjunto mediante pnpm.

Elegir y documentar el ejecutor de pruebas, la herramienta de navegador y los linters durante la preparación técnica. También concretar la instalación reproducible de OpenGrep y sus reglas: no se ha aprobado una biblioteca concreta para esas funciones ni se presupone que OpenGrep se distribuya mediante pnpm.

## Alternativas consideradas

- npm: descartado por instrucción explícita del usuario.
- Solo pruebas basadas en ejemplos: no cumple el requisito de fast-check.
- Solo pruebas unitarias: no verifica los recorridos completos ni la persistencia y autorización integradas.
- Solo análisis estático: no sustituye las pruebas de comportamiento.

## Consecuencias

La preparación técnica debe incluir herramientas y comandos verificables antes de considerar completa la primera historia. Las propiedades deben derivarse de requisitos, no copiar la implementación. Los fallos de fast-check conservarán datos para su reproducción. Las pruebas usarán datos y archivos separados de producción. OpenGrep requiere instalar su ejecutable y mantener reglas adecuadas; su presencia no garantiza por sí sola ausencia de vulnerabilidades.

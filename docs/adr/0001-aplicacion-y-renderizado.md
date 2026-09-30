# ADR-0001: Una aplicación con Node.js, TypeScript, Express y EJS

- Estado: aceptada.
- Fecha: 2026-09-28.
- Base: decisiones expresamente aprobadas por el usuario durante la definición del proyecto.

## Contexto

El producto reúne páginas públicas, un panel de un único propietario y formularios. El usuario conoce TypeScript, dispone de alojamiento para Node.js y pide tecnologías maduras, pocas dependencias y un despliegue sencillo.

## Decisión

Usar una sola aplicación Node.js y TypeScript con Express. Generar las páginas públicas y privadas en el servidor mediante EJS; utilizar CSS y TypeScript para estilos e interacciones del navegador. Mantener la web en inglés con diseño minimalista claro.

Seleccionar versiones estables compatibles con el alojamiento al preparar la implementación. No se han fijado todavía versiones concretas.

## Alternativas consideradas

- React con Vite y un backend Express: fue la propuesta inicial, pero el alcance confirmado permite resolver las páginas y los formularios con plantillas servidas desde una única aplicación.
- Un generador de sitio estático: exige trabajo adicional para el panel y las operaciones de escritura requeridas.

## Consecuencias

Se mantiene un único proceso de aplicación y el contenido público se entrega como HTML. Las interacciones complejas requieren código de navegador explícito. EJS no proporciona por sí solo componentes reactivos ni evita la necesidad de validar y proteger las entradas. El editor del blog se trata por separado.

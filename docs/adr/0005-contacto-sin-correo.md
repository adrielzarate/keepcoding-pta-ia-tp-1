# ADR-0005: Mensajes de contacto consultables en el panel

- Estado: aceptada.
- Fecha: 2026-09-28.
- Base: decisiones expresamente aprobadas por el usuario durante la definición del proyecto.

## Contexto

El usuario no tiene servicio de correo y ha elegido consultar los mensajes directamente en el panel.

## Decisión

Recoger nombre, correo y mensaje desde un formulario público, validarlos en el servidor y almacenarlos en SQLite. Permitir al administrador consultar, marcar como leído y eliminar mensajes. No enviar notificaciones ni respuestas por correo en esta fase.

## Alternativas consideradas

- Envío mediante un proveedor de correo: requiere una integración que el usuario ha excluido por ahora.
- Enlace de correo como único contacto: no proporciona la bandeja privada solicitada.

## Consecuencias

El administrador deberá consultar el panel para conocer nuevos mensajes. Los datos de contacto son privados. Se necesita protección básica frente al abuso y comprobar que eliminar o leer mensajes requiere autenticación. Un futuro envío de correo se documentará como una nueva decisión.

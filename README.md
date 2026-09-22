# GameStore - Tienda de Videojuegos

## Descripción
Proyecto de ecommerce para una tienda de videojuegos. Desarrollado como actividad
académica para optimizar la lógica y el rendimiento de una página web con Bootstrap 5
y JavaScript, sobre la base del sitio HTML/CSS de la actividad anterior.

## Demo
https://jeansantoni02.github.io/frontend1/

## Tecnologías Utilizadas
- HTML5
- CSS3
- Bootstrap 5.3 (CDN)
- Bootstrap Icons
- JavaScript ES6+
- Fetch API
- localStorage

## Estructura del Proyecto
- index.html - Página principal
- assets/css/styles.css - Estilos propios
- assets/js/ui.js - Formato de precios, avisos y estados
- assets/js/carrito.js - Lógica del carrito
- assets/js/productos.js - Carga del catálogo y filtros
- assets/js/app.js - Eventos de la interfaz
- assets/data/productos.json - Catálogo de productos
- assets/img/ - Portadas de los juegos y logo
- capturas/ - Capturas de pantalla de la actividad

## Características
- Catálogo de 12 juegos cargado desde un JSON local con la Fetch API
- Barra de navegación responsiva con categorías (Acción, Aventura, Deportes, Carreras)
- Buscador por título, categoría o plataforma (evento submit)
- Agregar al carrito con evento click y contador dinámico en la barra
- Panel lateral del carrito con cantidades, subtotales y total
- Carrito guardado en localStorage, se mantiene al recargar la página
- Orden del catálogo por precio, nombre o valoración
- Mensaje de error amigable si el JSON no carga, con botón para reintentar
- Placeholders de carga mientras se descargan los datos
- Pie de página con información de contacto y redes sociales

## Requisitos de la Actividad
- Maquetación con Bootstrap 5 y diseño responsivo
- Barra de navegación con categorías simuladas
- Pie de página con contacto y redes sociales
- Evento click para agregar productos al carrito
- Evento submit para procesar el formulario de búsqueda
- Manipulación dinámica del DOM
- Carga de datos con la Fetch API desde un JSON local
- Gestión de errores con mensaje amigable
- Código dividido en funciones reutilizables y comentado

## Cómo Ejecutar
La página usa fetch para leer el JSON y los navegadores bloquean esa lectura si el
archivo se abre con doble clic. Hay que levantar un servidor local:

1. Clonar el repositorio
2. Ejecutar `python -m http.server 8000` en la carpeta del proyecto
3. Abrir http://localhost:8000 en el navegador

En NetBeans basta con usar Run, que levanta su propio servidor.

## Dispositivos Soportados
- Escritorio (>1024px)
- Tablet (768px-1024px)
- Móvil (<768px)
- Móvil pequeño (<480px)

## Autor
Jean Santoni
GitHub: JeanSantoni02

## Licencia
MIT - Uso educativo

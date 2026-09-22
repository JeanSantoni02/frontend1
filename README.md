# GameStore

Tienda de videojuegos desarrollada con Bootstrap 5 y JavaScript.

Actividad sumativa semana 6 — Desarrollo Frontend I (PFY2201)
Jean Santoni Camilo

## Demo

https://jeansantoni02.github.io/frontend1/

## Estructura

```
index.html
assets/
  css/styles.css
  js/ui.js
  js/carrito.js
  js/productos.js
  js/app.js
  data/productos.json
  img/
capturas/
```

## Funcionalidades

- Catálogo de 12 juegos cargado desde `assets/data/productos.json` con la Fetch API.
- Barra de navegación responsiva con categorías (Acción, Aventura, Deportes, Carreras).
- Buscador por título, categoría o plataforma (evento `submit`).
- Agregar al carrito (evento `click`), con contador, panel lateral, cantidades y total.
- Carrito guardado en `localStorage`, así se mantiene al recargar.
- Orden por precio, nombre o valoración.
- Mensaje de error si el JSON no se puede cargar, con botón para reintentar.
- Pie de página con datos de contacto y redes sociales.

## Cómo ejecutarlo

La página usa `fetch` para leer el JSON, y los navegadores bloquean esa lectura
si el archivo se abre con doble clic. Hay que levantar un servidor local:

```bash
python -m http.server 8000
```

Luego abrir http://localhost:8000

En NetBeans basta con usar Run (el IDE levanta su propio servidor).

## Tecnologías

- HTML5 y CSS3
- Bootstrap 5.3 y Bootstrap Icons (CDN)
- JavaScript (ES6+): Fetch API, async/await, módulos con patrón IIFE

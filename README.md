# GameStore

Sitio web de una tienda de videojuegos online, construido con HTML5, CSS3, JavaScript,
Bootstrap 5 y React. Evaluación Final Transversal de Desarrollo Frontend I (PFY2201),
Duoc UC.

**Sitio en línea:** https://jeansantoni02.github.io/frontend1/

---

## Qué hace

- **Inicio** con una portada y un resumen del catálogo.
- **Catálogo** de videojuegos en tarjetas con imagen, nombre, precio y descripción,
  que se filtra por categoría, por texto y por ofertas, y se ordena por precio o valoración.
- **Carrito** para agregar y quitar juegos, con contador de unidades y total.
- **Administración** para agregar juegos nuevos al catálogo o eliminar los existentes.
- **Contacto** con un formulario de nombre, correo y mensaje que valida los datos antes
  de enviarlos.

Todo funciona en celular, tablet y escritorio.

---

## Instalación y uso

Requiere [Node.js](https://nodejs.org) 18 o superior.

```bash
git clone https://github.com/JeanSantoni02/frontend1.git
```

```bash
cd frontend1
```

```bash
npm install
```

```bash
npm run dev
```

El sitio queda en http://localhost:5173.

| Comando | Para qué |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm test` | Pruebas unitarias |
| `npm run build` | Versión de producción en `dist/` |
| `npm run preview` | Sirve la versión de producción en http://localhost:4173 |
| `npm run deploy` | Publica en GitHub Pages |

### Cómo usar el sitio

1. **Filtrar:** en el catálogo, elige una categoría con los botones o escribe en el buscador.
2. **Comprar:** "Agregar al carrito" suma el juego; el botón cambia a "En el carrito" y el
   contador de la barra se actualiza. El botón del carrito abre el detalle con el total.
3. **Agregar un juego:** en Administrar completa el formulario. Si no pones imagen, se
   genera una portada con el nombre. El juego aparece primero en el catálogo, marcado como
   "Nuevo".
4. **Eliminar un juego:** en Administrar presiona "Eliminar juegos"; cada tarjeta muestra
   un botón ×. Un juego eliminado también sale del carrito. "Restablecer catálogo" vuelve
   al catálogo original.
5. **Contactar:** completa el formulario. Los errores aparecen bajo cada campo al salir de
   él o al intentar enviar.

---

## Estructura

```
index.html                       punto de montaje y Bootstrap 5 por CDN
src/
├── main.jsx                     arranca React
├── App.jsx                      estado compartido y conexión de los componentes
├── componentes/
│   ├── BarraNavegacion.jsx      navbar de Bootstrap con las secciones y el carrito
│   ├── Portada.jsx              sección de inicio
│   ├── Filtros.jsx              búsqueda, orden, categorías y ofertas
│   ├── ListaVideojuegos.jsx     grilla, carga, error y sin resultados
│   ├── TarjetaVideojuego.jsx    card de Bootstrap de un juego
│   ├── AdministrarCatalogo.jsx  alta de juegos y modo eliminar
│   ├── Contacto.jsx             sección de contacto
│   ├── FormularioContacto.jsx   formulario con validación
│   ├── Carrito.jsx              panel lateral del carrito
│   └── PieDePagina.jsx          footer
├── hooks/
│   ├── useCatalogo.js           carga el catálogo y lo agrega o elimina
│   └── useCarrito.js            líneas del carrito y totales
├── datos/
│   └── videojuegos.js           objeto JavaScript con el catálogo
├── utilidades/
│   ├── catalogo.js              filtrado, orden y portada de reemplazo
│   ├── validacion.js            reglas de los formularios
│   └── formato.js               precios en pesos chilenos
└── estilos/
    └── estilos.css              identidad visual, Flexbox y CSS Grid
public/assets/img/               portadas de los juegos
scripts/capturas.mjs             recorre el sitio y genera las capturas
```

---

## Cómo cumple cada requisito

### HTML, CSS y Bootstrap 5

| Requisito | Dónde |
|---|---|
| Etiquetas semánticas | `<header>` y `<nav>` en la barra, `<main>`, una `<section>` por sección, `<article>` por tarjeta, `<form>`, `<aside>` para el carrito y `<footer>` |
| Barra de navegación | `navbar` de Bootstrap con enlaces a Inicio, Catálogo, Administrar y Contacto; en celular se colapsa en un menú. Marca la sección que está a la vista |
| Tarjetas | `card`, `card-img-top`, `card-body`, `card-title`, `card-text` y `card-footer` de Bootstrap |
| Maquetación responsiva | Grilla de Bootstrap: 1 columna en celular, 2 en tablet, 3 y 4 en escritorio |
| Flexbox | Barra de navegación, filtros, pie de tarjeta, panel del carrito y pie de página |
| CSS Grid | Portada (texto y cifras), sección de contacto (datos y formulario) y formulario de alta (4, 2 o 1 columna según el ancho) |
| Estilos propios | `estilos.css`, con variables CSS para la paleta de la tienda |

### JavaScript

| Requisito | Dónde |
|---|---|
| Objeto con los videojuegos | `src/datos/videojuegos.js`: el objeto `catalogo` con las categorías y cada juego (nombre, categoría, precio, descripción, imagen, plataforma, valoración y stock) |
| Tarjetas generadas dinámicamente | `ListaVideojuegos` recorre el arreglo con `map` y crea una `TarjetaVideojuego` por juego |
| Filtrado por categoría | Botones de categoría en `Filtros`; la lógica está en `filtrar()` de `utilidades/catalogo.js` |
| Validación del formulario | `validarContacto()` en `utilidades/validacion.js`: campos obligatorios, largo del nombre, formato del correo y largo del mensaje, con un mensaje de error por campo |

### React

| Requisito | Dónde |
|---|---|
| Componentes | Uno por responsabilidad: barra, portada, filtros, lista, tarjeta, administración, contacto, formulario, carrito y pie |
| Estado de la lista de juegos | `useCatalogo` guarda el catálogo con `useState` y expone `agregar`, `eliminar` y `restablecer` |
| Carga desde un archivo | Un `useEffect` importa `videojuegos.js` de forma diferida: el catálogo se descarga como un archivo aparte después de que la página carga, con estado de carga y de error |
| Props entre componentes | `App` mantiene los filtros y pasa los juegos filtrados a `ListaVideojuegos`; al cambiar una categoría en `Filtros`, la lista se vuelve a renderizar. Eliminar un juego en la administración lo quita también del carrito |

### Optimización y pruebas

- 31 pruebas unitarias sobre la validación de los formularios y el filtrado del catálogo:

```bash
npm test
```

- El catálogo se descarga como un archivo separado del resto de la aplicación, así que la
  página aparece antes.
- Las imágenes se cargan de forma diferida (`loading="lazy"`).
- Los formularios usan `label`, `aria-invalid` y `aria-describedby`, y el foco salta al
  primer campo con error.

---

## Capturas

Las capturas de la carpeta [`capturas/eft/`](capturas/eft/) se generan solas con el sitio
compilado y servido:

```bash
npm run build
```

```bash
npm run preview
```

```bash
node scripts/capturas.mjs
```

El script recorre el sitio con Chrome: carga el catálogo, filtra, usa el carrito, envía el
formulario con datos vacíos, inválidos y correctos, agrega y elimina juegos, y repite la
revisión en tamaño celular.

# GameStore

Tienda de videojuegos construida con React. Proyecto de la asignatura
Desarrollo Frontend I (PFY2201), Duoc UC.

**Sitio en línea:** https://jeansantoni02.github.io/frontend1/

---

## Qué hace

Un catálogo de doce juegos que se carga desde un archivo JSON y un carrito de
compras que sobrevive a la recarga de la página.

- Cada juego muestra nombre, precio normal, precio de oferta, descripción, imagen,
  categoría, plataforma y valoración.
- El carrito permite agregar y eliminar productos, ajustar cantidades, y calcula
  el contador de unidades y el total a pagar.
- El catálogo se filtra por categoría, por texto y por ofertas, y se ordena por
  precio o valoración.

---

## Cómo está hecho

| Pieza | Para qué |
|---|---|
| React 18 | Componentes y estado de la interfaz |
| Vite 5 | Servidor de desarrollo y empaquetado |
| Bootstrap 5 | Grilla responsiva y utilidades, por CDN |
| CSS propio | Identidad visual de la tienda |

### Estructura

```
src/
├── main.jsx                 punto de entrada
├── App.jsx                  arma la pantalla y conecta los estados
├── componentes/
│   ├── Encabezado.jsx       marca y botón del carrito con su contador
│   ├── Filtros.jsx          búsqueda, orden, categorías y ofertas
│   ├── ListaProductos.jsx   grilla, carga, error y sin resultados
│   ├── TarjetaProducto.jsx  un juego del catálogo
│   └── Carrito.jsx          panel lateral con el detalle y el total
├── hooks/
│   ├── useProductos.js      carga el catálogo con useEffect
│   └── useCarrito.js        estado del carrito y sus totales
├── utilidades/
│   └── formato.js           precios en pesos y cálculo de descuento
└── estilos/
    └── estilos.css

public/assets/
├── data/productos.json      el catálogo
└── img/                     portadas en SVG
```

---

## Estado con `useState`

| Dónde | Qué guarda |
|---|---|
| `useProductos` | La lista de productos, las categorías, si está cargando y el error |
| `useCarrito` | Las líneas del carrito, de donde salen el contador y el total |
| `App` | Búsqueda, categoría, orden, si se ven solo ofertas y si el panel está abierto |

El panel del carrito no se abre solo al agregar un juego: el contador del
encabezado y el texto del botón ya avisan que entró, y así se puede seguir
navegando el catálogo sin interrupciones.

## Efectos con `useEffect`

Dos efectos, cada uno con una responsabilidad:

- **Cargar el catálogo.** `useProductos` pide el JSON al montar el componente,
  simulando una fuente externa. Maneja el error y expone un `reintentar` que
  vuelve a disparar el efecto.
- **Guardar el carrito.** `useCarrito` escribe en `localStorage` cada vez que
  cambian las líneas, de modo que el carrito sigue ahí al recargar.

El efecto de carga usa una bandera para no actualizar el estado si el componente
se desmonta antes de que llegue la respuesta.

## Renderizado condicional

| Situación | Qué se muestra |
|---|---|
| Cargando | Seis tarjetas vacías con animación, en vez de una pantalla en blanco |
| Error al cargar | Aviso con el motivo y un botón para reintentar |
| Ningún resultado | Mensaje de búsqueda sin coincidencias |
| Carrito vacío | Mensaje invitando a agregar un juego, en vez del total |
| Juego ya agregado | El botón pasa de "Agregar al carrito" a "En el carrito", en verde |
| Juego sin stock | El botón queda deshabilitado con el texto "Sin stock" |
| Juego en oferta | Aparece la etiqueta con el porcentaje y el precio normal tachado |
| Carrito con productos | El contador aparece en el encabezado |
| Filtro de ofertas | El botón alterna entre "Ver solo ofertas" y "Viendo solo ofertas" |

---

## Cómo ejecutarlo

Requiere Node.js 18 o superior.

```bash
npm install
```

```bash
npm run dev
```

Queda en http://localhost:5173.

Para generar la versión de producción:

```bash
npm run build
```

```bash
npm run preview
```

Para publicar en GitHub Pages:

```bash
npm run deploy
```

El build se arma con rutas relativas, así que funciona igual servido desde la
raíz de un dominio o desde un subdirectorio como el de GitHub Pages.

---

## Evidencia

Las capturas de la semana 8 están en [`capturas/semana8/`](capturas/semana8/) y
reunidas en el informe
[Evidencias Semana 8](capturas/Evidencias%20Semana%208%20Jean%20Santoni%20Frontend%201.pdf).

Se regeneran solas con la aplicación compilada y servida:

```bash
node scripts/capturas.mjs
```

El script recorre la aplicación con Chrome: carga el catálogo, agrega y elimina
productos del carrito, aplica filtros y fuerza el error de red para capturar cada
estado sin intervención manual.

Las capturas de la semana 6, cuando el proyecto era JavaScript sin framework,
quedaron en [`capturas/`](capturas/).

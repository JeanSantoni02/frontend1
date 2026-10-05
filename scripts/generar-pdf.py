import base64, html, io, os, subprocess, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAPS = os.path.join(RAIZ, "capturas", "semana8")
HTML = os.path.join(CAPS, "_informe.html")
PDF = os.path.join(RAIZ, "capturas",
                   "Evidencias Semana 8 Jean Santoni Frontend 1.pdf")

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"


def imagen(nombre):
    with open(os.path.join(CAPS, nombre), "rb") as f:
        return "data:image/png;base64," + base64.b64encode(f.read()).decode()


CAPTURAS = [
    ("02-catalogo-cargado-con-useeffect.png",
     "Datos cargados dinamicamente",
     "useEffect",
     "El catalogo no esta escrito en el codigo: lo trae un efecto que pide el archivo "
     "productos.json al montar el componente. Los doce juegos, las cuatro categorias y "
     "el contador salen de esa respuesta."),

    ("02b-tarjetas-con-precio-normal-y-oferta.png",
     "Informacion de cada producto",
     "Datos",
     "Cada tarjeta muestra nombre, descripcion corta, imagen, precio normal tachado y "
     "precio de oferta, ademas de categoria, plataforma y valoracion."),

    ("01-estado-de-carga.png",
     "Mientras llegan los datos",
     "Renderizado condicional",
     "Antes de que responda el archivo, la grilla muestra tarjetas vacias con una "
     "animacion en vez de una pantalla en blanco. La captura se tomo reteniendo la "
     "respuesta a proposito."),

    ("09-error-con-reintentar.png",
     "Si la carga falla",
     "Renderizado condicional",
     "Con la peticion bloqueada, el mismo componente cambia a un aviso de error con el "
     "motivo y un boton que vuelve a disparar el efecto de carga."),

    ("04-boton-en-el-carrito.png",
     "El boton cambia segun el estado",
     "Renderizado condicional",
     "God of War ya esta en el carrito y su boton paso a decir 'En el carrito' en verde. "
     "Los demas siguen diciendo 'Agregar al carrito'. Arriba a la derecha, el contador "
     "aparecio con el total de unidades."),

    ("03-carrito-vacio.png",
     "Carrito vacio",
     "Renderizado condicional",
     "Sin productos, el panel muestra un mensaje invitando a agregar un juego en lugar "
     "del detalle y el total."),

    ("05-carrito-con-productos.png",
     "Carrito con productos",
     "useState",
     "Tres juegos, uno de ellos con dos unidades. Cada linea muestra su subtotal y abajo "
     "se suma el total: cuatro productos por $97.020. El contador del encabezado y el "
     "total salen del mismo estado."),

    ("06-carrito-tras-eliminar.png",
     "Despues de eliminar un producto",
     "useState",
     "Al borrar una linea con el boton de la papelera, el detalle, el contador y el total "
     "se recalculan solos."),

    ("07-filtro-solo-ofertas.png",
     "Boton que cambia de texto al hacer clic",
     "useState",
     "El mismo boton alterna entre 'Ver solo ofertas' y 'Viendo solo ofertas', y filtra "
     "el catalogo dejando unicamente los juegos rebajados."),

    ("08-busqueda-sin-resultados.png",
     "Busqueda sin coincidencias",
     "Renderizado condicional",
     "Cuando ningun juego calza con lo buscado, la grilla se reemplaza por un aviso en "
     "vez de quedar vacia."),

    ("10-version-movil.png",
     "En telefono",
     "Responsivo",
     "La misma aplicacion a 390 pixeles de ancho: la grilla pasa a una columna y el "
     "encabezado deja solo el icono del carrito con su contador."),

]

partes = ["""<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Evidencias Semana 8</title>
<style>
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", Arial, sans-serif; color: #16181d; font-size: 10.5pt;
         line-height: 1.5; margin: 0; }
  .portada { height: 245mm; display: flex; flex-direction: column;
             justify-content: center; page-break-after: always; }
  .portada .linea { width: 70px; height: 5px; background: #e94560; margin-bottom: 26px; }
  .portada h1 { font-size: 31pt; margin: 0 0 6px; letter-spacing: -0.5px; }
  .portada h2 { font-size: 15pt; font-weight: 400; color: #555; margin: 0 0 44px; }
  .portada dt { color: #8a8f98; font-size: 8.5pt; text-transform: uppercase;
                letter-spacing: 1px; margin-top: 15px; }
  .portada dd { margin: 2px 0 0; font-weight: 600; font-size: 11pt; }
  h3 { font-size: 15pt; margin: 0 0 10px; color: #c73652;
       border-bottom: 2px solid #e94560; padding-bottom: 6px; }
  section { page-break-before: always; }
  section.seguida { page-break-before: auto; }
  .bloque { page-break-inside: avoid; margin-bottom: 20px; }
  .bloque h4 { margin: 0 0 2px; font-size: 11.5pt; }
  .bloque .etiqueta { display: inline-block; margin-bottom: 6px; padding: 1px 8px;
                      border-radius: 999px; background: #fdeaee; color: #c73652;
                      font-size: 7.8pt; font-weight: 700; text-transform: uppercase;
                      letter-spacing: .06em; }
  .bloque p { margin: 0 0 8px; color: #4a4f57; font-size: 9.5pt; }
  img { width: 100%; border: 1px solid #d0d4da; border-radius: 3px; display: block; }
  table { width: 100%; border-collapse: collapse; font-size: 9.5pt; margin: 10px 0 16px; }
  th { background: #16181d; color: #fff; text-align: left; padding: 7px 9px; font-size: 9pt; }
  td { border-bottom: 1px solid #e3e6ea; padding: 6px 9px; vertical-align: top; }
  td.mono, .mono { font-family: Consolas, monospace; font-size: 8.8pt; }
  .intro { color: #4a4f57; margin-bottom: 14px; }
  pre { background: #16181d; color: #e4e4e4; padding: 11px 13px; font-size: 8pt;
        line-height: 1.5; font-family: Consolas, monospace; border-radius: 3px; margin: 0 0 14px; }
</style></head><body>""",

"""
<div class="portada">
  <div class="linea"></div>
  <h1>Evidencias de la aplicacion</h1>
  <h2>Mejorando funcionalidades clave en el eCommerce con React</h2>
  <dl>
    <dt>Estudiante</dt><dd>Jean Luc Santoni Camilo</dd>
    <dt>Asignatura</dt><dd>Desarrollo Frontend I &mdash; PFY2201</dd>
    <dt>Actividad</dt><dd>Experiencia 3, Semana 8</dd>
    <dt>Proyecto</dt><dd>GameStore, tienda de videojuegos</dd>
    <dt>Repositorio</dt><dd class="mono">github.com/JeanSantoni02/frontend1</dd>
    <dt>Sitio publicado</dt><dd class="mono">jeansantoni02.github.io/frontend1</dd>
  </dl>
</div>""",

"""
<section class="seguida">
<h3>1. Que se hizo</h3>
<p class="intro">La tienda venia escrita en JavaScript sin framework. Para esta entrega se
reconstruyo con React, conservando la identidad visual y el catalogo, y organizando la
logica en componentes y hooks.</p>

<table>
  <tr><th style="width:26%">Requerimiento</th><th>Donde esta resuelto</th></tr>
  <tr><td><b>useState</b></td><td>El catalogo y las categorias en <span class="mono">useProductos</span>;
      las lineas del carrito en <span class="mono">useCarrito</span>; la busqueda, el orden,
      la categoria, el filtro de ofertas y el panel abierto en <span class="mono">App</span>.</td></tr>
  <tr><td><b>useEffect</b></td><td>Uno carga el catalogo desde el JSON al montar el componente;
      otro guarda el carrito en el navegador cada vez que cambia.</td></tr>
  <tr><td><b>Renderizado condicional</b></td><td>Estado de carga, error con reintento, busqueda sin
      resultados, carrito vacio, boton que cambia a "En el carrito", juegos sin stock y
      etiqueta de oferta.</td></tr>
  <tr><td><b>Estructura y comentarios</b></td><td>Componentes, hooks y utilidades en carpetas
      separadas, con comentarios breves donde la intencion no se lee sola.</td></tr>
  <tr><td><b>Despliegue</b></td><td>Rama <span class="mono">gh-pages</span> con el build de produccion,
      publicada con <span class="mono">npm run deploy</span>.</td></tr>
</table>

<h3 style="margin-top:22px">Estructura del proyecto</h3>
<pre>src/
├── main.jsx                 punto de entrada
├── App.jsx                  arma la pantalla y conecta los estados
├── componentes/
│   ├── Encabezado.jsx       marca y boton del carrito con su contador
│   ├── Filtros.jsx          busqueda, orden, categorias y ofertas
│   ├── ListaProductos.jsx   grilla, carga, error y sin resultados
│   ├── TarjetaProducto.jsx  un juego del catalogo
│   └── Carrito.jsx          panel lateral con el detalle y el total
├── hooks/
│   ├── useProductos.js      carga el catalogo con useEffect
│   └── useCarrito.js        estado del carrito y sus totales
├── utilidades/
│   └── formato.js           precios en pesos y calculo de descuento
└── estilos/
    └── estilos.css

public/assets/
├── data/productos.json      el catalogo
└── img/                     portadas en SVG</pre>
</section>""",

'<section><h3>2. Capturas</h3>'
'<p class="intro">Generadas con el script <span class="mono">scripts/capturas.mjs</span>, '
'que recorre la aplicacion compilada con Chrome: carga el catalogo, agrega y elimina '
'productos, aplica filtros y fuerza el error de red para capturar cada estado.</p>']

for archivo, titulo, etiqueta, texto in CAPTURAS:
    partes.append(
        '<div class="bloque"><h4>%s</h4><span class="etiqueta">%s</span>'
        '<p>%s</p><img src="%s" alt=""></div>'
        % (html.escape(titulo), html.escape(etiqueta), html.escape(texto), imagen(archivo)))

with io.open(os.path.join(CAPS, "12-despliegue-verificado.txt"), encoding="utf-8") as f:
    verificacion = html.escape(f.read().replace("﻿", "").rstrip())

partes.append("""
<div class="bloque"><h4>Publicado en GitHub Pages</h4>
<span class="etiqueta">Despliegue</span>
<p>La aplicacion compilada se publica en la rama <span class="mono">gh-pages</span> con
<span class="mono">npm run deploy</span>. Una captura de pantalla del sitio en linea se ve
identica a la local, asi que en su lugar va la respuesta del servidor, que si distingue
una cosa de la otra.</p>
<pre>%s</pre></div>
</section></body></html>""" % verificacion)

with io.open(HTML, "w", encoding="utf-8") as f:
    f.write("\n".join(partes))

print("html: %.1f MB" % (os.path.getsize(HTML) / 1048576))

if os.path.exists(PDF):
    os.remove(PDF)

subprocess.run([
    CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
    "--print-to-pdf=" + PDF, "--virtual-time-budget=25000",
    "file:///" + HTML.replace("\\", "/")
], check=True, capture_output=True)

if os.path.exists(PDF):
    print("pdf:  %s (%.2f MB)" % (PDF, os.path.getsize(PDF) / 1048576))
    os.remove(HTML)
else:
    print("no se genero el pdf", file=sys.stderr)
    sys.exit(1)

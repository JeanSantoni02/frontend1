import { useMemo, useState } from 'react';

import Encabezado from './componentes/Encabezado.jsx';
import Filtros from './componentes/Filtros.jsx';
import ListaProductos from './componentes/ListaProductos.jsx';
import Carrito from './componentes/Carrito.jsx';

import { useProductos } from './hooks/useProductos.js';
import { useCarrito } from './hooks/useCarrito.js';
import { hayOferta } from './utilidades/formato.js';

export default function App() {
  // Catalogo: lo trae el efecto del hook desde el JSON
  const { productos, categorias, cargando, error, reintentar } = useProductos();

  // Carrito: lineas, totales y las acciones que las modifican
  const carrito = useCarrito();

  // Estado de los controles de la vista
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [orden, setOrden] = useState('relevancia');
  const [soloOfertas, setSoloOfertas] = useState(false);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  // Se recalcula solo cuando cambia el catalogo o algun filtro
  const visibles = useMemo(
    () => ordenar(filtrar(productos, busqueda, categoria, soloOfertas), orden),
    [productos, busqueda, categoria, soloOfertas, orden]
  );

  // No abre el panel: el contador y el texto del boton ya avisan que entro

  return (
    <>
      <a className="skip-link visually-hidden-focusable" href="#catalogo">
        Saltar al catalogo
      </a>

      <Encabezado
        totalUnidades={carrito.totalUnidades}
        onAbrirCarrito={() => setCarritoAbierto(true)}
      />

      <main className="container py-4 py-lg-5">
        <section className="gs-portada">
          <p className="gs-portada__epigrafe">Catalogo 2026</p>
          <h1>Los juegos que te faltan, al precio que esperabas</h1>
          <p className="gs-portada__bajada">
            Doce titulos con entrega digital inmediata. Busca, filtra y arma tu carrito.
          </p>
        </section>

        <div id="catalogo">
          <Filtros
            categorias={categorias}
            categoria={categoria}
            onCategoria={setCategoria}
            busqueda={busqueda}
            onBusqueda={setBusqueda}
            orden={orden}
            onOrden={setOrden}
            soloOfertas={soloOfertas}
            onAlternarOfertas={() => setSoloOfertas((v) => !v)}
            cantidad={visibles.length}
          />

          <ListaProductos
            productos={visibles}
            cargando={cargando}
            error={error}
            onReintentar={reintentar}
            estaEnCarrito={carrito.estaEnCarrito}
            onAgregar={carrito.agregar}
          />
        </div>
      </main>

      <footer className="gs-pie">
        <div className="container">
          <p>GameStore · Proyecto de Desarrollo Frontend I · Duoc UC</p>
        </div>
      </footer>

      {/* La capa oscura solo existe mientras el panel esta abierto */}
      {carritoAbierto && (
        <div className="gs-capa" onClick={() => setCarritoAbierto(false)} />
      )}

      <Carrito
        lineas={carrito.lineas}
        totalUnidades={carrito.totalUnidades}
        totalPesos={carrito.totalPesos}
        abierto={carritoAbierto}
        onCerrar={() => setCarritoAbierto(false)}
        onQuitarUnidad={carrito.quitarUnidad}
        onEliminar={carrito.eliminar}
        onVaciar={carrito.vaciar}
      />
    </>
  );
}

function filtrar(productos, busqueda, categoria, soloOfertas) {
  const texto = busqueda.trim().toLowerCase();

  return productos.filter((p) => {
    if (categoria !== 'todas' && p.categoria !== categoria) return false;
    if (soloOfertas && !hayOferta(p)) return false;
    if (!texto) return true;

    return p.titulo.toLowerCase().includes(texto)
      || p.descripcion.toLowerCase().includes(texto)
      || p.plataforma.toLowerCase().includes(texto);
  });
}

function ordenar(productos, orden) {
  const copia = [...productos];

  switch (orden) {
    case 'precio-asc':
      return copia.sort((a, b) => a.precioOferta - b.precioOferta);
    case 'precio-desc':
      return copia.sort((a, b) => b.precioOferta - a.precioOferta);
    case 'rating':
      return copia.sort((a, b) => b.rating - a.rating);
    default:
      // Relevancia: primero los destacados, despues por valoracion
      return copia.sort((a, b) =>
        (b.destacado - a.destacado) || (b.rating - a.rating));
  }
}

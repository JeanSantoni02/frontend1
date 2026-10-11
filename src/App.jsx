import { useEffect, useMemo, useState } from 'react';

import BarraNavegacion from './componentes/BarraNavegacion.jsx';
import Portada from './componentes/Portada.jsx';
import Filtros from './componentes/Filtros.jsx';
import ListaVideojuegos from './componentes/ListaVideojuegos.jsx';
import AdministrarCatalogo from './componentes/AdministrarCatalogo.jsx';
import Contacto from './componentes/Contacto.jsx';
import Carrito from './componentes/Carrito.jsx';
import PieDePagina from './componentes/PieDePagina.jsx';

import { useCatalogo } from './hooks/useCatalogo.js';
import { useCarrito } from './hooks/useCarrito.js';
import { filtrar, ordenar } from './utilidades/catalogo.js';
import { hayOferta } from './utilidades/formato.js';

const SECCIONES = ['inicio', 'catalogo', 'administrar', 'contacto'];

export default function App() {
  const catalogo = useCatalogo();
  const carrito = useCarrito();

  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [orden, setOrden] = useState('relevancia');
  const [soloOfertas, setSoloOfertas] = useState(false);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [modoAdmin, setModoAdmin] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [seccionActiva, setSeccionActiva] = useState('inicio');

  // Marca en la barra la seccion que esta a la vista
  useEffect(() => {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => { if (e.isIntersecting) setSeccionActiva(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    SECCIONES.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observador.observe(el);
    });
    return () => observador.disconnect();
  }, [catalogo.cargando]);

  const visibles = useMemo(
    () => ordenar(filtrar(catalogo.videojuegos, { busqueda, categoria, soloOfertas }), orden),
    [catalogo.videojuegos, busqueda, categoria, soloOfertas, orden]
  );

  const eliminarDelCatalogo = (videojuego) => {
    if (!window.confirm(`¿Eliminar «${videojuego.nombre}» del catálogo?`)) return;
    catalogo.eliminar(videojuego.id);
    // Un juego que ya no se vende tampoco puede quedar en el carrito
    carrito.eliminar(videojuego.id);
  };

  const restablecer = () => {
    catalogo.restablecer();
    setModoAdmin(false);
  };

  return (
    <>
      <a className="skip-link visually-hidden-focusable" href="#catalogo">Saltar al catálogo</a>

      <BarraNavegacion totalUnidades={carrito.totalUnidades} seccionActiva={seccionActiva}
                       onAbrirCarrito={() => setCarritoAbierto(true)} />

      <main className="container py-4 py-lg-5">
        <Portada cantidad={catalogo.videojuegos.length}
                 ofertas={catalogo.videojuegos.filter(hayOferta).length} />

        <section id="catalogo" className="gs-seccion" aria-labelledby="titulo-catalogo">
          <div className="gs-seccion__cabecera">
            <div>
              <p className="gs-portada__epigrafe">Catálogo</p>
              <h2 id="titulo-catalogo">Juegos disponibles</h2>
            </div>
          </div>

          <Filtros categorias={catalogo.categorias} categoria={categoria} onCategoria={setCategoria}
                   busqueda={busqueda} onBusqueda={setBusqueda} orden={orden} onOrden={setOrden}
                   soloOfertas={soloOfertas} onAlternarOfertas={() => setSoloOfertas((v) => !v)}
                   cantidad={visibles.length} />

          <ListaVideojuegos videojuegos={visibles} cargando={catalogo.cargando} error={catalogo.error}
                            onReintentar={catalogo.reintentar} estaEnCarrito={carrito.estaEnCarrito}
                            modoAdmin={modoAdmin} onAgregar={carrito.agregar} onEliminar={eliminarDelCatalogo} />
        </section>

        <AdministrarCatalogo categorias={catalogo.categorias} videojuegos={catalogo.videojuegos}
                             modoAdmin={modoAdmin} onCambiarModo={() => setModoAdmin((v) => !v)}
                             onAgregar={catalogo.agregar} onRestablecer={restablecer} modificado={catalogo.modificado} />

        <Contacto mensajesRecibidos={mensajes.length} onEnviado={(m) => setMensajes((l) => [...l, m])} />
      </main>

      <PieDePagina />

      {carritoAbierto && <div className="gs-capa" onClick={() => setCarritoAbierto(false)} />}

      <Carrito lineas={carrito.lineas} totalUnidades={carrito.totalUnidades} totalPesos={carrito.totalPesos}
               abierto={carritoAbierto} onCerrar={() => setCarritoAbierto(false)}
               onQuitarUnidad={carrito.quitarUnidad} onEliminar={carrito.eliminar} onVaciar={carrito.vaciar} />
    </>
  );
}

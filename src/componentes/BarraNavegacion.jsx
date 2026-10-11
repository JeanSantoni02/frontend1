import { useState } from 'react';

const SECCIONES = [
  { id: 'inicio', texto: 'Inicio' },
  { id: 'catalogo', texto: 'Catálogo' },
  { id: 'administrar', texto: 'Administrar' },
  { id: 'contacto', texto: 'Contacto' }
];

// Navbar de Bootstrap; el colapso en movil se maneja con estado, sin el JS de Bootstrap
export default function BarraNavegacion({ totalUnidades, seccionActiva, onAbrirCarrito }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="gs-encabezado">
      <nav className="navbar navbar-expand-lg navbar-dark" aria-label="Navegación principal">
        <div className="container">
          <a className="navbar-brand gs-marca" href="#inicio">
            <img src="./assets/img/logo.svg" alt="" width="34" height="34" />
            <span>Game<span className="gs-acento">Store</span></span>
          </a>

          <div className="d-flex align-items-center gap-2 order-lg-last">
            <button type="button" className="gs-boton-carrito" onClick={onAbrirCarrito}
                    aria-label={`Abrir el carrito, ${totalUnidades} productos`}>
              <span aria-hidden="true">🛒</span>
              <span className="d-none d-sm-inline">Carrito</span>
              {totalUnidades > 0 && <span className="gs-contador">{totalUnidades}</span>}
            </button>

            <button type="button" className="navbar-toggler" onClick={() => setAbierto((v) => !v)}
                    aria-controls="menu-principal" aria-expanded={abierto} aria-label="Mostrar el menú">
              <span className="navbar-toggler-icon" />
            </button>
          </div>

          <div id="menu-principal" className={`collapse navbar-collapse ${abierto ? 'show' : ''}`}>
            <ul className="navbar-nav ms-lg-4 me-auto">
              {SECCIONES.map((s) => (
                <li className="nav-item" key={s.id}>
                  <a className={`nav-link ${seccionActiva === s.id ? 'active' : ''}`}
                     aria-current={seccionActiva === s.id ? 'page' : undefined}
                     href={`#${s.id}`} onClick={() => setAbierto(false)}>
                    {s.texto}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

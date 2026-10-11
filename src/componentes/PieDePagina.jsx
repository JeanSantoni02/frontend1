export default function PieDePagina() {
  return (
    <footer className="gs-pie">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <p className="mb-0">© 2026 GameStore · Tienda de videojuegos</p>
        <nav aria-label="Enlaces del pie">
          <ul className="nav">
            <li className="nav-item"><a className="nav-link gs-link" href="#inicio">Inicio</a></li>
            <li className="nav-item"><a className="nav-link gs-link" href="#catalogo">Catálogo</a></li>
            <li className="nav-item"><a className="nav-link gs-link" href="#contacto">Contacto</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

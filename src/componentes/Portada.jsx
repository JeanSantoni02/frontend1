export default function Portada({ cantidad, ofertas }) {
  return (
    <section id="inicio" className="gs-portada" aria-labelledby="titulo-portada">
      <div className="gs-portada__texto">
        <p className="gs-portada__epigrafe">Catálogo 2026</p>
        <h1 id="titulo-portada">Los juegos que te faltan, al precio que esperabas</h1>
        <p className="gs-portada__bajada">
          Entrega digital inmediata. Filtra por categoría, arma tu carrito y escríbenos si necesitas ayuda.
        </p>
        <div className="d-flex flex-wrap gap-2 mt-4">
          <a className="btn btn-gs btn-lg" href="#catalogo">Ver catálogo</a>
          <a className="btn btn-outline-light btn-lg" href="#contacto">Contáctanos</a>
        </div>
      </div>

      <ul className="gs-portada__cifras" aria-label="Resumen del catálogo">
        <li><strong>{cantidad}</strong><span>juegos disponibles</span></li>
        <li><strong>{ofertas}</strong><span>en oferta</span></li>
        <li><strong>24/7</strong><span>entrega digital</span></li>
      </ul>
    </section>
  );
}

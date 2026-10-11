import TarjetaVideojuego from './TarjetaVideojuego.jsx';

// Esqueleto mientras carga, error con reintento, aviso sin resultados o la grilla
export default function ListaVideojuegos({
  videojuegos, cargando, error, onReintentar, estaEnCarrito, modoAdmin, onAgregar, onEliminar
}) {
  if (cargando) {
    return (
      <div className="row g-4" aria-busy="true">
        {Array.from({ length: 8 }, (_, i) => (
          <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={i}><div className="gs-esqueleto" /></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="gs-aviso gs-aviso--error" role="alert">
        <h3>No se pudo cargar el catálogo</h3>
        <p>{error}</p>
        <button type="button" className="btn btn-gs" onClick={onReintentar}>Reintentar</button>
      </div>
    );
  }

  if (videojuegos.length === 0) {
    return (
      <div className="gs-aviso">
        <h3>Sin resultados</h3>
        <p>Ningún juego calza con la búsqueda o la categoría elegida.</p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {videojuegos.map((v) => (
        <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={v.id}>
          <TarjetaVideojuego videojuego={v} enCarrito={estaEnCarrito(v.id)} modoAdmin={modoAdmin}
                             onAgregar={onAgregar} onEliminar={onEliminar} />
        </div>
      ))}
    </div>
  );
}

import TarjetaProducto from './TarjetaProducto.jsx';

// Renderizado condicional: esqueleto mientras carga, error con reintento,
// aviso si ningun filtro calza, y recien entonces la grilla
export default function ListaProductos({
  productos, cargando, error, onReintentar, estaEnCarrito, onAgregar
}) {
  if (cargando) {
    return (
      <div className="row g-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={i}>
            <div className="gs-esqueleto" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="gs-aviso gs-aviso--error">
        <h3>No se pudo cargar el catalogo</h3>
        <p>{error}</p>
        <button type="button" className="btn btn-gs" onClick={onReintentar}>
          Reintentar
        </button>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="gs-aviso">
        <h3>Sin resultados</h3>
        <p>Ningun juego calza con la busqueda o los filtros aplicados.</p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {productos.map((producto) => (
        <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={producto.id}>
          <TarjetaProducto
            producto={producto}
            enCarrito={estaEnCarrito(producto.id)}
            onAgregar={onAgregar}
          />
        </div>
      ))}
    </div>
  );
}

export default function Filtros({
  categorias, categoria, onCategoria,
  busqueda, onBusqueda,
  orden, onOrden,
  soloOfertas, onAlternarOfertas,
  cantidad
}) {
  return (
    <section className="gs-filtros">
      <div className="gs-filtros__fila">
        <input
          type="search"
          className="form-control gs-input"
          placeholder="Buscar un juego..."
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
          aria-label="Buscar un juego"
        />

        <select className="form-select gs-input" value={orden}
                onChange={(e) => onOrden(e.target.value)}
                aria-label="Ordenar el catalogo">
          <option value="relevancia">Mas relevantes</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="rating">Mejor valorados</option>
        </select>

        {/* Boton que cambia de texto segun el estado que controla */}
        <button
          type="button"
          className={`gs-chip ${soloOfertas ? 'gs-chip--activo' : ''}`}
          onClick={onAlternarOfertas}
          aria-pressed={soloOfertas}
        >
          {soloOfertas ? 'Viendo solo ofertas' : 'Ver solo ofertas'}
        </button>
      </div>

      <div className="gs-filtros__fila gs-filtros__categorias">
        <button type="button"
                className={`gs-chip ${categoria === 'todas' ? 'gs-chip--activo' : ''}`}
                onClick={() => onCategoria('todas')}>
          Todas
        </button>

        {categorias.map((c) => (
          <button key={c.id} type="button"
                  className={`gs-chip ${categoria === c.id ? 'gs-chip--activo' : ''}`}
                  onClick={() => onCategoria(c.id)}>
            {c.nombre}
          </button>
        ))}

        <span className="gs-conteo">
          {cantidad} {cantidad === 1 ? 'juego' : 'juegos'}
        </span>
      </div>
    </section>
  );
}

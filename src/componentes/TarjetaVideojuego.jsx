import { descuento, hayOferta, precio } from '../utilidades/formato.js';

// Tarjeta de Bootstrap; cambia segun oferta, stock, carrito y modo administracion
export default function TarjetaVideojuego({ videojuego, enCarrito, modoAdmin, onAgregar, onEliminar }) {
  const rebajado = hayOferta(videojuego);
  const agotado = videojuego.stock === 0;

  return (
    <article className="card gs-tarjeta h-100">
      <div className="gs-tarjeta__portada">
        <img src={videojuego.imagen} className="card-img-top" alt={`Portada de ${videojuego.nombre}`} loading="lazy" />

        {rebajado && (
          <span className="gs-etiqueta gs-etiqueta--oferta">
            -{descuento(videojuego.precioNormal, videojuego.precioOferta)}%
          </span>
        )}
        {videojuego.nuevo && <span className="gs-etiqueta gs-etiqueta--nuevo">Nuevo</span>}
        {videojuego.destacado && !rebajado && !videojuego.nuevo && (
          <span className="gs-etiqueta gs-etiqueta--destacado">Destacado</span>
        )}

        {modoAdmin && (
          <button type="button" className="gs-eliminar" onClick={() => onEliminar(videojuego)}
                  aria-label={`Eliminar ${videojuego.nombre} del catálogo`} title="Eliminar del catálogo">
            ×
          </button>
        )}
      </div>

      <div className="card-body gs-tarjeta__cuerpo">
        <div className="gs-tarjeta__meta">
          <span>{videojuego.categoriaNombre}</span>
          <span className="gs-plataforma">{videojuego.plataforma}</span>
        </div>

        <h3 className="card-title gs-tarjeta__titulo">{videojuego.nombre}</h3>
        <p className="card-text gs-tarjeta__descripcion">{videojuego.descripcion}</p>

        <div className="gs-precios">
          {rebajado && <span className="gs-precio-normal">{precio(videojuego.precioNormal)}</span>}
          <span className="gs-precio-oferta">{precio(videojuego.precioOferta)}</span>
        </div>
      </div>

      <div className="card-footer gs-tarjeta__pie">
        {videojuego.rating > 0
          ? <span className="gs-rating" title={`Valoración ${videojuego.rating} de 5`}>★ {videojuego.rating.toFixed(1)}</span>
          : <span className="gs-rating gs-rating--sin">Sin reseñas</span>}

        <button type="button"
                className={`btn btn-sm ${enCarrito ? 'btn-gs-en-carrito' : 'btn-gs'}`}
                onClick={() => onAgregar(videojuego)} disabled={agotado}>
          {agotado ? 'Sin stock' : enCarrito ? 'En el carrito' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  );
}

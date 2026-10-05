import { descuento, hayOferta, precio } from '../utilidades/formato.js';

// Renderizado condicional: la tarjeta cambia segun si el juego esta en oferta,
// si queda stock y si ya fue agregado al carrito
export default function TarjetaProducto({ producto, enCarrito, onAgregar }) {
  const rebajado = hayOferta(producto);
  const agotado = producto.stock === 0;

  return (
    <article className="gs-tarjeta h-100">
      <div className="gs-tarjeta__portada">
        <img src={producto.imagen} alt={`Portada de ${producto.titulo}`} loading="lazy" />

        {rebajado && (
          <span className="gs-etiqueta gs-etiqueta--oferta">
            -{descuento(producto.precioNormal, producto.precioOferta)}%
          </span>
        )}

        {producto.destacado && !rebajado && (
          <span className="gs-etiqueta gs-etiqueta--destacado">Destacado</span>
        )}
      </div>

      <div className="gs-tarjeta__cuerpo">
        <div className="gs-tarjeta__meta">
          <span>{producto.categoriaNombre}</span>
          <span className="gs-plataforma">{producto.plataforma}</span>
        </div>

        <h3 className="gs-tarjeta__titulo">{producto.titulo}</h3>
        <p className="gs-tarjeta__descripcion">{producto.descripcion}</p>

        <div className="gs-precios">
          {rebajado && (
            <span className="gs-precio-normal">{precio(producto.precioNormal)}</span>
          )}
          <span className="gs-precio-oferta">{precio(producto.precioOferta)}</span>
        </div>

        <div className="gs-tarjeta__pie">
          <span className="gs-rating" title={`Valoracion ${producto.rating} de 5`}>
            ★ {producto.rating.toFixed(1)}
          </span>

          <button
            type="button"
            className={`btn btn-sm ${enCarrito ? 'btn-gs-en-carrito' : 'btn-gs'}`}
            onClick={() => onAgregar(producto)}
            disabled={agotado}
          >
            {textoBoton(agotado, enCarrito)}
          </button>
        </div>
      </div>
    </article>
  );
}

function textoBoton(agotado, enCarrito) {
  if (agotado) return 'Sin stock';
  if (enCarrito) return 'En el carrito';
  return 'Agregar al carrito';
}

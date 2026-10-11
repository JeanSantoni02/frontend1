import { precio } from '../utilidades/formato.js';

// Con el carrito vacio se muestra un mensaje en vez del detalle y el total
export default function Carrito({
  lineas, totalUnidades, totalPesos, abierto, onCerrar, onQuitarUnidad, onEliminar, onVaciar
}) {
  const vacio = lineas.length === 0;

  return (
    <aside className={`gs-carrito ${abierto ? 'gs-carrito--abierto' : ''}`}
           aria-hidden={!abierto}>
      <header className="gs-carrito__cabecera">
        <h2>Tu carrito</h2>
        <button type="button" className="gs-cerrar" onClick={onCerrar}
                aria-label="Cerrar el carrito">×</button>
      </header>

      {vacio ? (
        <div className="gs-carrito__vacio">
          <span className="gs-carrito__icono">🛒</span>
          <p>Tu carrito esta vacio.</p>
          <p className="gs-texto-suave">Agrega un juego del catalogo para empezar.</p>
        </div>
      ) : (
        <>
          <ul className="gs-carrito__lista">
            {lineas.map((linea) => (
              <li className="gs-linea" key={linea.id}>
                <img src={linea.imagen} alt="" />

                <div className="gs-linea__datos">
                  <p className="gs-linea__titulo">{linea.nombre}</p>
                  <p className="gs-texto-suave">
                    {linea.cantidad} × {precio(linea.precio)}
                  </p>
                </div>

                <div className="gs-linea__acciones">
                  <span className="gs-linea__subtotal">
                    {precio(linea.precio * linea.cantidad)}
                  </span>
                  <div>
                    <button type="button" onClick={() => onQuitarUnidad(linea.id)}
                            aria-label={`Quitar una unidad de ${linea.nombre}`}>−</button>
                    <button type="button" onClick={() => onEliminar(linea.id)}
                            aria-label={`Eliminar ${linea.nombre} del carrito`}>🗑</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <footer className="gs-carrito__pie">
            <div className="gs-carrito__total">
              <span>Total ({totalUnidades} {totalUnidades === 1 ? 'producto' : 'productos'})</span>
              <strong>{precio(totalPesos)}</strong>
            </div>
            <button type="button" className="btn btn-gs w-100">Ir a pagar</button>
            <button type="button" className="gs-vaciar" onClick={onVaciar}>
              Vaciar carrito
            </button>
          </footer>
        </>
      )}
    </aside>
  );
}

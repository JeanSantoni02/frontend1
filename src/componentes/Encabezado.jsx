export default function Encabezado({ totalUnidades, onAbrirCarrito }) {
  return (
    <header className="gs-encabezado">
      <div className="container d-flex align-items-center justify-content-between gap-3">
        <a className="gs-marca" href="./">
          <img src="./assets/img/logo.svg" alt="" width="34" height="34" />
          <span>Game<span className="gs-acento">Store</span></span>
        </a>

        <button type="button" className="gs-boton-carrito" onClick={onAbrirCarrito}>
          <span aria-hidden="true">🛒</span>
          <span className="d-none d-sm-inline">Carrito</span>

          {/* El contador solo aparece cuando hay algo adentro */}
          {totalUnidades > 0 && (
            <span className="gs-contador">{totalUnidades}</span>
          )}
        </button>
      </div>
    </header>
  );
}

/* carrito.js - estado del carrito, persistencia y dibujado del panel lateral */

const Carrito = (() => {

    const CLAVE_STORAGE = 'gamestore.carrito';

    // { id: {id, titulo, precio, imagen, cantidad, stock} }
    let items = {};

    // Recupera el carrito guardado; si falla, parte vacio
    function cargar() {
        try {
            const guardado = localStorage.getItem(CLAVE_STORAGE);
            items = guardado ? JSON.parse(guardado) : {};
        } catch (error) {
            console.warn('[Carrito] No se pudo leer localStorage:', error.message);
            items = {};
        }
        render();
    }

    function guardar() {
        try {
            localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items));
        } catch (error) {
            console.warn('[Carrito] No se pudo guardar localStorage:', error.message);
        }
    }

    // Suma de las cantidades de todos los productos
    function unidades() {
        return Object.values(items).reduce((suma, i) => suma + i.cantidad, 0);
    }

    // Monto total a pagar
    function total() {
        return Object.values(items).reduce((suma, i) => suma + i.precio * i.cantidad, 0);
    }

    // Agrega un producto o suma una unidad si ya estaba, respetando el stock
    function agregar(producto) {
        const existente = items[producto.id];

        if (existente) {
            if (existente.cantidad >= producto.stock) {
                UI.aviso(`Solo quedan ${producto.stock} unidades de ${producto.titulo}`,
                         'bi-exclamation-triangle-fill');
                return false;
            }
            existente.cantidad += 1;
        } else {
            items[producto.id] = {
                id: producto.id,
                titulo: producto.titulo,
                precio: producto.precio,
                imagen: producto.imagen,
                stock: producto.stock,
                cantidad: 1
            };
        }

        guardar();
        render();
        UI.aviso(`${producto.titulo} agregado al carrito`);
        return true;
    }

    // Cambia la cantidad en +1 o -1; al llegar a cero quita el producto
    function cambiarCantidad(id, delta) {
        const item = items[id];
        if (!item) return;

        const nueva = item.cantidad + delta;

        if (nueva <= 0) {
            quitar(id);
            return;
        }
        if (nueva > item.stock) {
            UI.aviso(`Stock maximo alcanzado (${item.stock})`, 'bi-exclamation-triangle-fill');
            return;
        }

        item.cantidad = nueva;
        guardar();
        render();
    }

    function quitar(id) {
        const item = items[id];
        if (!item) return;

        delete items[id];
        guardar();
        render();
        UI.aviso(`${item.titulo} eliminado del carrito`, 'bi-trash-fill');
    }

    function vaciar() {
        if (unidades() === 0) return;
        items = {};
        guardar();
        render();
        UI.aviso('Carrito vaciado', 'bi-trash-fill');
    }

    // Redibuja el contador, la lista y los totales
    function render() {
        const lista = UI.el('listaCarrito');
        const vacio = UI.el('carritoVacio');
        const resumen = UI.el('resumenCarrito');
        const contador = UI.el('contadorCarrito');
        const totalUnidades = unidades();

        if (contador) {
            contador.textContent = totalUnidades;
            contador.classList.toggle('d-none', totalUnidades === 0);
        }

        if (!lista || !vacio || !resumen) return;

        const hayItems = totalUnidades > 0;
        vacio.classList.toggle('d-none', hayItems);
        resumen.classList.toggle('d-none', !hayItems);

        if (!hayItems) {
            lista.innerHTML = '';
            return;
        }

        lista.innerHTML = Object.values(items).map(item => `
            <li class="gs-item-carrito">
                <img src="${item.imagen}" alt="Portada de ${UI.escapar(item.titulo)}">
                <div class="flex-grow-1">
                    <p class="gs-item-titulo">${UI.escapar(item.titulo)}</p>
                    <p class="gs-item-precio mb-2">
                        ${UI.precio(item.precio)} c/u
                    </p>
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="gs-cantidad" role="group"
                             aria-label="Cantidad de ${UI.escapar(item.titulo)}">
                            <button type="button" data-accion="restar" data-id="${item.id}"
                                    aria-label="Quitar una unidad">&minus;</button>
                            <span aria-live="polite">${item.cantidad}</span>
                            <button type="button" data-accion="sumar" data-id="${item.id}"
                                    aria-label="Agregar una unidad">+</button>
                        </div>
                        <span class="fw-bold small">${UI.precio(item.precio * item.cantidad)}</span>
                    </div>
                </div>
                <button type="button" class="gs-quitar" data-accion="quitar" data-id="${item.id}"
                        aria-label="Eliminar ${UI.escapar(item.titulo)} del carrito">
                    <i class="bi bi-x-lg" aria-hidden="true"></i>
                </button>
            </li>
        `).join('');

        const nodoUnidades = UI.el('carritoUnidades');
        const nodoTotal = UI.el('carritoTotal');
        if (nodoUnidades) nodoUnidades.textContent = totalUnidades;
        if (nodoTotal) nodoTotal.textContent = UI.precio(total());
    }

    return { cargar, agregar, cambiarCantidad, quitar, vaciar, unidades, total, render };

})();

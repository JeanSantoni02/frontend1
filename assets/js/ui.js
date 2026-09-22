/* ui.js - utilidades de presentacion: precios, avisos y estados de la pagina */

const UI = (() => {

    // Formateador de pesos chilenos, creado una sola vez
    const formatoCLP = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
    });

    // 59990 -> $59.990
    function precio(valor) {
        return formatoCLP.format(valor);
    }

    // Busca un elemento por id y avisa si no existe
    function el(id) {
        const nodo = document.getElementById(id);
        if (!nodo) {
            console.warn(`[UI] No existe el elemento con id "${id}"`);
        }
        return nodo;
    }

    // Escapa el texto antes de insertarlo como HTML
    function escapar(texto) {
        const div = document.createElement('div');
        div.textContent = texto ?? '';
        return div.innerHTML;
    }

    // Muestra un estado del catalogo y oculta los otros tres
    function mostrarEstado(estado) {
        const estados = {
            cargando: 'estadoCargando',
            error: 'estadoError',
            vacio: 'estadoVacio',
            grilla: 'grillaProductos'
        };
        Object.entries(estados).forEach(([nombre, id]) => {
            const nodo = document.getElementById(id);
            if (nodo) {
                nodo.classList.toggle('d-none', nombre !== estado);
            }
        });
    }

    // Tarjetas vacias que se muestran mientras se descarga el JSON
    function pintarPlaceholders(cantidad = 8) {
        const contenedor = el('estadoCargando');
        if (!contenedor) return;

        contenedor.innerHTML = Array.from({ length: cantidad }, () => `
            <div class="col">
                <div class="gs-skeleton h-100" aria-hidden="true">
                    <div class="gs-skeleton-img placeholder-glow">
                        <span class="placeholder w-100 h-100 d-block"></span>
                    </div>
                    <div class="p-3 placeholder-glow">
                        <span class="placeholder col-9 mb-2"></span>
                        <span class="placeholder col-12 mb-2"></span>
                        <span class="placeholder col-5"></span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Aviso flotante para confirmar acciones sin usar alert()
    function aviso(mensaje, icono = 'bi-check-circle-fill') {
        const contenedor = el('contenedorAvisos');
        if (!contenedor) return;

        const nodo = document.createElement('div');
        nodo.className = 'toast align-items-center gs-toast border-0 show';
        nodo.setAttribute('role', 'status');
        nodo.setAttribute('aria-live', 'polite');
        nodo.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi ${icono} gs-acento me-2" aria-hidden="true"></i>
                    ${escapar(mensaje)}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto"
                        data-bs-dismiss="toast" aria-label="Cerrar aviso"></button>
            </div>
        `;
        contenedor.appendChild(nodo);

        const toast = new bootstrap.Toast(nodo, { delay: 2600 });
        toast.show();
        nodo.addEventListener('hidden.bs.toast', () => nodo.remove());
    }

    return { precio, el, escapar, mostrarEstado, pintarPlaceholders, aviso };

})();

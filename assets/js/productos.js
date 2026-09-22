/* productos.js - carga del JSON con Fetch API, filtros, orden y grilla */

const Catalogo = (() => {

    const RUTA_JSON = 'assets/data/productos.json';

    let productos = [];
    let filtros = {
        categoria: 'todos',
        busqueda: '',
        soloDestacados: false,
        orden: 'destacado'
    };

    // Descarga el catalogo. fetch solo falla por error de red, asi que hay
    // que revisar response.ok para detectar un 404 o un 500
    async function cargar() {
        UI.mostrarEstado('cargando');
        UI.pintarPlaceholders();

        try {
            const respuesta = await fetch(RUTA_JSON, { cache: 'no-store' });

            if (!respuesta.ok) {
                throw new Error(`El servidor respondio ${respuesta.status} ${respuesta.statusText}`);
            }

            const datos = await respuesta.json();

            if (!Array.isArray(datos.productos) || datos.productos.length === 0) {
                throw new Error('El archivo no contiene productos');
            }

            productos = datos.productos;
            console.info(`[Catalogo] ${productos.length} productos cargados desde ${RUTA_JSON}`);

            const statTotal = UI.el('statTotal');
            if (statTotal) statTotal.textContent = productos.length;

            aplicar();

        } catch (error) {
            mostrarError(error);
        }
    }

    // Traduce el fallo tecnico a un mensaje entendible para el usuario
    function mostrarError(error) {
        console.error('[Catalogo] Error al cargar el catalogo:', error);

        const nodoMensaje = UI.el('errorMensaje');
        const nodoDetalle = UI.el('errorDetalle');

        let mensaje = 'No pudimos cargar la lista de juegos. Intentalo nuevamente en unos segundos.';

        // Al abrir el index con doble clic, el navegador bloquea fetch
        if (window.location.protocol === 'file:') {
            mensaje = 'La pagina se abrio directamente desde el disco y el navegador bloquea ' +
                      'la lectura del archivo JSON. Abrela a traves de un servidor local.';
            if (nodoDetalle) {
                nodoDetalle.textContent = 'Por ejemplo: python -m http.server 8000 ' +
                                          'y luego visita http://localhost:8000';
            }
        } else if (nodoDetalle) {
            nodoDetalle.textContent = `Detalle tecnico: ${error.message}`;
        }

        if (nodoMensaje) nodoMensaje.textContent = mensaje;
        UI.mostrarEstado('error');
    }

    // Devuelve los productos que cumplen los filtros activos, ya ordenados
    function filtrar() {
        const texto = filtros.busqueda.trim().toLowerCase();

        let resultado = productos.filter(p => {
            const porCategoria = filtros.categoria === 'todos' ||
                                 p.categoria === filtros.categoria;
            const porDestacado = !filtros.soloDestacados || p.destacado;
            const porTexto = texto === '' ||
                             p.titulo.toLowerCase().includes(texto) ||
                             p.categoriaNombre.toLowerCase().includes(texto) ||
                             p.plataforma.toLowerCase().includes(texto);

            return porCategoria && porDestacado && porTexto;
        });

        const ordenadores = {
            'precio-asc': (a, b) => a.precio - b.precio,
            'precio-desc': (a, b) => b.precio - a.precio,
            'titulo': (a, b) => a.titulo.localeCompare(b.titulo, 'es'),
            'rating': (a, b) => b.rating - a.rating,
            'destacado': (a, b) => (b.destacado - a.destacado) || (b.rating - a.rating)
        };

        return resultado.sort(ordenadores[filtros.orden] || ordenadores.destacado);
    }

    function actualizarFiltros(cambios) {
        filtros = { ...filtros, ...cambios };
        aplicar();
    }

    function limpiarFiltros() {
        const input = UI.el('inputBusqueda');
        if (input) input.value = '';
        actualizarFiltros({ categoria: 'todos', busqueda: '', soloDestacados: false });
        marcarCategoriaActiva('todos');
    }

    // HTML de una tarjeta de producto
    function tarjeta(p) {
        const estrellas = '★'.repeat(Math.round(p.rating)) +
                          '☆'.repeat(5 - Math.round(p.rating));
        const cintaDestacado = p.destacado
            ? '<span class="gs-badge-destacado">Destacado</span>' : '';
        const avisoStock = p.stock <= 10
            ? `<span class="gs-stock-bajo"><i class="bi bi-exclamation-circle me-1"
                 aria-hidden="true"></i>Ultimas ${p.stock} unidades</span>` : '';

        return `
            <div class="col">
                <article class="gs-card" data-card="${p.id}">
                    <div class="gs-card-img">
                        <img src="${p.imagen}" alt="Portada del juego ${UI.escapar(p.titulo)}"
                             loading="lazy" width="400" height="500">
                        ${cintaDestacado}
                        <span class="gs-badge-plataforma">${UI.escapar(p.plataforma)}</span>
                    </div>
                    <div class="gs-card-body">
                        <h3 class="gs-card-titulo">${UI.escapar(p.titulo)}</h3>
                        <p class="gs-rating mb-0">
                            ${estrellas}
                            <span class="text-secondary ms-1">${p.rating.toFixed(1)}</span>
                        </p>
                        <p class="gs-card-desc">${UI.escapar(p.descripcion)}</p>
                        <div class="mt-auto">
                            ${avisoStock}
                            <div class="d-flex align-items-center justify-content-between
                                        gap-2 mt-2">
                                <span class="gs-precio">${UI.precio(p.precio)}</span>
                                <button class="btn btn-gs btn-sm" type="button"
                                        data-accion="agregar" data-id="${p.id}">
                                    <i class="bi bi-cart-plus me-1" aria-hidden="true"></i>Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        `;
    }

    // Dibuja la grilla segun los filtros y actualiza el resumen
    function aplicar() {
        const visibles = filtrar();
        const grilla = UI.el('grillaProductos');
        const resumen = UI.el('resumenCatalogo');
        const btnLimpiar = UI.el('btnLimpiarFiltros');

        const hayFiltros = filtros.categoria !== 'todos' ||
                           filtros.busqueda.trim() !== '' ||
                           filtros.soloDestacados;
        if (btnLimpiar) btnLimpiar.classList.toggle('d-none', !hayFiltros);

        if (resumen) {
            const partes = [`${visibles.length} de ${productos.length} juegos`];
            if (filtros.categoria !== 'todos') {
                const cat = productos.find(p => p.categoria === filtros.categoria);
                partes.push(`categoria ${cat ? cat.categoriaNombre : filtros.categoria}`);
            }
            if (filtros.busqueda.trim() !== '') partes.push(`busqueda "${filtros.busqueda.trim()}"`);
            if (filtros.soloDestacados) partes.push('solo destacados');
            resumen.textContent = partes.join(' · ');
        }

        if (visibles.length === 0) {
            const nodoVacio = UI.el('vacioMensaje');
            if (nodoVacio) {
                nodoVacio.textContent = filtros.busqueda.trim()
                    ? `No encontramos juegos que coincidan con "${filtros.busqueda.trim()}".`
                    : 'No hay juegos en esta categoria.';
            }
            UI.mostrarEstado('vacio');
            return;
        }

        if (grilla) grilla.innerHTML = visibles.map(tarjeta).join('');
        UI.mostrarEstado('grilla');
    }

    // Resalta en el menu la categoria que se esta viendo
    function marcarCategoriaActiva(categoria) {
        document.querySelectorAll('#navCategorias .nav-link').forEach(enlace => {
            const suya = enlace.dataset.categoria;
            enlace.classList.toggle('active', suya === categoria);
        });
    }

    function porId(id) {
        return productos.find(p => p.id === id);
    }

    return {
        cargar, aplicar, actualizarFiltros, limpiarFiltros,
        marcarCategoriaActiva, porId,
        get filtros() { return { ...filtros }; },
        get cantidad() { return productos.length; }
    };

})();

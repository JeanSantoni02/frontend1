/* app.js - conecta los eventos de la interfaz con Catalogo y Carrito */

document.addEventListener('DOMContentLoaded', () => {

    // Permite enlaces como index.html?q=zelda o index.html?cat=carreras
    const params = new URLSearchParams(window.location.search);
    const busquedaInicial = params.get('q') || '';
    const categoriaInicial = params.get('cat') || 'todos';

    if (busquedaInicial) {
        const input = document.getElementById('inputBusqueda');
        if (input) input.value = busquedaInicial;
    }

    Catalogo.actualizarFiltros({
        busqueda: busquedaInicial,
        categoria: categoriaInicial
    });
    Catalogo.marcarCategoriaActiva(categoriaInicial);

    // EVENTO submit: formulario de busqueda
    const formBusqueda = document.getElementById('formBusqueda');
    if (formBusqueda) {
        formBusqueda.addEventListener('submit', (evento) => {
            // Sin preventDefault la pagina se recargaria
            evento.preventDefault();

            const input = document.getElementById('inputBusqueda');
            const termino = input ? input.value : '';

            // Al buscar se sueltan los otros filtros para no esconder resultados
            Catalogo.actualizarFiltros({
                busqueda: termino,
                categoria: 'todos',
                soloDestacados: false
            });
            Catalogo.marcarCategoriaActiva('todos');

            document.getElementById('catalogo')
                    .scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // EVENTO click: agregar al carrito.
    // Se escucha en la grilla y no en cada boton porque las tarjetas se
    // vuelven a crear cada vez que se filtra (delegacion de eventos)
    const grilla = document.getElementById('grillaProductos');
    if (grilla) {
        grilla.addEventListener('click', (evento) => {
            const boton = evento.target.closest('[data-accion="agregar"]');
            if (!boton) return;

            const producto = Catalogo.porId(boton.dataset.id);
            if (!producto) return;

            const agregado = Carrito.agregar(producto);

            if (agregado) {
                const tarjeta = document.querySelector(`[data-card="${producto.id}"]`);
                if (tarjeta) {
                    tarjeta.classList.add('gs-agregado');
                    tarjeta.addEventListener('animationend',
                        () => tarjeta.classList.remove('gs-agregado'), { once: true });
                }
            }
        });
    }

    // click: botones + - y eliminar dentro del carrito
    const listaCarrito = document.getElementById('listaCarrito');
    if (listaCarrito) {
        listaCarrito.addEventListener('click', (evento) => {
            const boton = evento.target.closest('[data-accion]');
            if (!boton) return;

            const { accion, id } = boton.dataset;

            if (accion === 'sumar') Carrito.cambiarCantidad(id, 1);
            if (accion === 'restar') Carrito.cambiarCantidad(id, -1);
            if (accion === 'quitar') Carrito.quitar(id);
        });
    }

    // click: categorias del menu, del desplegable y del pie de pagina
    document.querySelectorAll('[data-categoria]').forEach(enlace => {
        enlace.addEventListener('click', () => {
            const categoria = enlace.dataset.categoria;

            const input = document.getElementById('inputBusqueda');
            if (input) input.value = '';

            Catalogo.actualizarFiltros({
                categoria,
                busqueda: '',
                soloDestacados: false
            });
            Catalogo.marcarCategoriaActiva(categoria);

            // En movil cierra el menu desplegado
            const menu = document.getElementById('menuPrincipal');
            if (menu && menu.classList.contains('show')) {
                bootstrap.Collapse.getOrCreateInstance(menu).hide();
            }
        });
    });

    // click: ver solo destacados (el mismo boton activa y desactiva)
    const btnDestacados = document.getElementById('btnVerDestacados');
    if (btnDestacados) {
        btnDestacados.addEventListener('click', () => {
            const activo = Catalogo.filtros.soloDestacados;
            Catalogo.actualizarFiltros({ soloDestacados: !activo, categoria: 'todos' });
            btnDestacados.classList.toggle('btn-gs', !activo);
            btnDestacados.classList.toggle('btn-outline-light', activo);
            document.getElementById('catalogo')
                    .scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // change: orden del catalogo
    const selectOrden = document.getElementById('selectOrden');
    if (selectOrden) {
        selectOrden.addEventListener('change', () => {
            Catalogo.actualizarFiltros({ orden: selectOrden.value });
        });
    }

    const btnLimpiar = document.getElementById('btnLimpiarFiltros');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => Catalogo.limpiarFiltros());
    }

    const btnVerTodo = document.getElementById('btnVerTodo');
    if (btnVerTodo) {
        btnVerTodo.addEventListener('click', () => Catalogo.limpiarFiltros());
    }

    // click: vuelve a intentar la peticion fetch tras un error
    const btnReintentar = document.getElementById('btnReintentar');
    if (btnReintentar) {
        btnReintentar.addEventListener('click', () => Catalogo.cargar());
    }

    const btnVaciar = document.getElementById('btnVaciarCarrito');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => Carrito.vaciar());
    }

    // click: compra simulada
    const btnPagar = document.getElementById('btnPagar');
    if (btnPagar) {
        btnPagar.addEventListener('click', () => {
            const unidades = Carrito.unidades();
            if (unidades === 0) return;

            UI.aviso(`Compra simulada: ${unidades} producto(s) por ` +
                     `${UI.precio(Carrito.total())}`, 'bi-bag-check-fill');
            Carrito.vaciar();

            const panel = document.getElementById('panelCarrito');
            if (panel) bootstrap.Offcanvas.getOrCreateInstance(panel).hide();
        });
    }

    // Arranque
    Carrito.cargar();
    Catalogo.cargar();

});

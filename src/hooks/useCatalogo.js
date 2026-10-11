import { useCallback, useEffect, useState } from 'react';
import { crearId, portadaGenerica } from '../utilidades/catalogo.js';

// El catalogo se descarga al montar la app y el estado permite agregar o eliminar juegos
export function useCatalogo() {
  const [videojuegos, setVideojuegos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [original, setOriginal] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let vigente = true;

    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        const { catalogo } = await import('../datos/videojuegos.js');
        if (!vigente) return;
        setVideojuegos(catalogo.videojuegos);
        setOriginal(catalogo.videojuegos);
        setCategorias(catalogo.categorias);
      } catch {
        if (vigente) setError('No se pudo descargar el catálogo. Revisa tu conexión e intenta otra vez.');
      } finally {
        if (vigente) setCargando(false);
      }
    }

    cargar();
    return () => { vigente = false; };
  }, [intento]);

  const reintentar = () => setIntento((n) => n + 1);

  const agregar = useCallback((datos) => {
    const categoria = categorias.find((c) => c.id === datos.categoria);
    const precio = Number(datos.precio);
    const nombre = datos.nombre.trim();

    const nuevo = {
      id: crearId(nombre),
      nombre,
      categoria: datos.categoria,
      categoriaNombre: categoria ? categoria.nombre : datos.categoria,
      plataforma: datos.plataforma || 'PC',
      precioNormal: precio,
      precioOferta: precio,
      rating: 0,
      stock: 10,
      destacado: false,
      nuevo: true,
      imagen: datos.imagen.trim() || portadaGenerica(nombre),
      descripcion: datos.descripcion.trim()
    };

    setVideojuegos((actuales) => [nuevo, ...actuales]);
    return nuevo;
  }, [categorias]);

  const eliminar = useCallback((id) => {
    setVideojuegos((actuales) => actuales.filter((v) => v.id !== id));
  }, []);

  const restablecer = () => setVideojuegos(original);

  // Cualquier alta o baja crea un arreglo nuevo, distinto del original
  const modificado = videojuegos !== original;

  return { videojuegos, categorias, cargando, error, reintentar, agregar, eliminar, restablecer, modificado };
}

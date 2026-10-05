import { useEffect, useState } from 'react';

// Carga el catalogo desde el JSON local simulando una fuente externa.
// El estado de carga y el de error permiten el renderizado condicional.
export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    // Evita actualizar el estado si el componente se desmonta antes de responder
    let vigente = true;

    async function cargar() {
      setCargando(true);
      setError(null);

      try {
        const respuesta = await fetch('./assets/data/productos.json');
        if (!respuesta.ok) {
          throw new Error(`El servidor respondio ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        if (!vigente) return;

        setProductos(datos.productos);
        setCategorias(datos.categorias);
      } catch (fallo) {
        if (!vigente) return;
        setError(mensajeDeError(fallo));
      } finally {
        if (vigente) setCargando(false);
      }
    }

    cargar();
    return () => { vigente = false; };
  }, [intento]);

  // Permite que el boton de reintentar dispare el efecto de nuevo
  const reintentar = () => setIntento((n) => n + 1);

  return { productos, categorias, cargando, error, reintentar };
}

function mensajeDeError(fallo) {
  if (window.location.protocol === 'file:') {
    return 'La pagina se abrio como archivo local y el navegador bloquea la carga de datos. Sirvela por HTTP.';
  }
  return fallo.message || 'No se pudo cargar el catalogo.';
}

import { useEffect, useState } from 'react';

const CLAVE = 'gamestore.carrito';

// El carrito se guarda en localStorage para que sobreviva a una recarga
export function useCarrito() {
  const [lineas, setLineas] = useState(leerGuardado);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(lineas));
    } catch {
      // Si el navegador bloquea el almacenamiento, el carrito sigue en memoria
    }
  }, [lineas]);

  // Si el producto ya esta, suma una unidad en vez de duplicar la linea
  const agregar = (producto) => {
    setLineas((actuales) => {
      const existente = actuales.find((l) => l.id === producto.id);
      if (existente) {
        return actuales.map((l) =>
          l.id === producto.id ? { ...l, cantidad: l.cantidad + 1 } : l
        );
      }
      return [...actuales, {
        id: producto.id,
        titulo: producto.titulo,
        precio: producto.precioOferta,
        imagen: producto.imagen,
        cantidad: 1
      }];
    });
  };

  const quitarUnidad = (id) => {
    setLineas((actuales) => actuales
      .map((l) => (l.id === id ? { ...l, cantidad: l.cantidad - 1 } : l))
      .filter((l) => l.cantidad > 0));
  };

  const eliminar = (id) => {
    setLineas((actuales) => actuales.filter((l) => l.id !== id));
  };

  const vaciar = () => setLineas([]);

  const estaEnCarrito = (id) => lineas.some((l) => l.id === id);

  const totalUnidades = lineas.reduce((suma, l) => suma + l.cantidad, 0);
  const totalPesos = lineas.reduce((suma, l) => suma + l.precio * l.cantidad, 0);

  return {
    lineas,
    agregar,
    quitarUnidad,
    eliminar,
    vaciar,
    estaEnCarrito,
    totalUnidades,
    totalPesos
  };
}

function leerGuardado() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
}

const PESOS = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
});

export const precio = (valor) => PESOS.format(valor);

export const descuento = (normal, oferta) =>
  Math.round(((normal - oferta) / normal) * 100);

export const hayOferta = (producto) => producto.precioOferta < producto.precioNormal;

import { hayOferta } from './formato.js';

export function filtrar(videojuegos, { busqueda = '', categoria = 'todas', soloOfertas = false } = {}) {
  const texto = busqueda.trim().toLowerCase();

  return videojuegos.filter((v) => {
    if (categoria !== 'todas' && v.categoria !== categoria) return false;
    if (soloOfertas && !hayOferta(v)) return false;
    if (!texto) return true;

    return v.nombre.toLowerCase().includes(texto)
      || v.descripcion.toLowerCase().includes(texto)
      || v.plataforma.toLowerCase().includes(texto);
  });
}

export function ordenar(videojuegos, orden) {
  const copia = [...videojuegos];

  switch (orden) {
    case 'precio-asc':
      return copia.sort((a, b) => a.precioOferta - b.precioOferta);
    case 'precio-desc':
      return copia.sort((a, b) => b.precioOferta - a.precioOferta);
    case 'rating':
      return copia.sort((a, b) => b.rating - a.rating);
    default:
      // Relevancia: los recien agregados, luego los destacados y despues por valoracion
      return copia.sort((a, b) => (Boolean(b.nuevo) - Boolean(a.nuevo))
        || (b.destacado - a.destacado) || (b.rating - a.rating));
  }
}

export function crearId(nombre) {
  const base = nombre.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${base || 'juego'}-${Date.now().toString(36)}`;
}

// Portada de reemplazo cuando un juego agregado no trae imagen
export function portadaGenerica(nombre) {
  const titulo = nombre.length > 22 ? `${nombre.slice(0, 21)}…` : nombre;
  const seguro = titulo.replace(/[<>&"]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">`
    + `<rect width="400" height="500" fill="#16213e"/>`
    + `<circle cx="330" cy="90" r="120" fill="#e94560" opacity="0.15"/>`
    + `<rect width="8" height="500" fill="#e94560"/>`
    + `<text x="200" y="260" fill="#fff" font-family="Segoe UI, Arial" font-size="30" `
    + `font-weight="700" text-anchor="middle">${seguro}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

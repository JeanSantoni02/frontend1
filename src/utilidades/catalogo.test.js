import { describe, expect, it } from 'vitest';
import { crearId, filtrar, ordenar, portadaGenerica } from './catalogo.js';
import { catalogo } from '../datos/videojuegos.js';

const juegos = catalogo.videojuegos;

describe('filtrar', () => {
  it('sin filtros devuelve todo el catálogo', () => {
    expect(filtrar(juegos)).toHaveLength(juegos.length);
  });

  it('por categoría deja solo esa categoría', () => {
    const accion = filtrar(juegos, { categoria: 'accion' });
    expect(accion.length).toBeGreaterThan(0);
    expect(accion.every((v) => v.categoria === 'accion')).toBe(true);
  });

  it('busca en el nombre sin distinguir mayúsculas', () => {
    expect(filtrar(juegos, { busqueda: 'ZELDA' }).map((v) => v.id)).toEqual(['zelda-totk']);
  });

  it('busca también por plataforma', () => {
    expect(filtrar(juegos, { busqueda: 'switch' }).every((v) => v.plataforma === 'Switch')).toBe(true);
  });

  it('combina categoría y ofertas', () => {
    const r = filtrar(juegos, { categoria: 'carreras', soloOfertas: true });
    expect(r.every((v) => v.categoria === 'carreras' && v.precioOferta < v.precioNormal)).toBe(true);
  });
});

describe('ordenar', () => {
  it('por precio ascendente', () => {
    const precios = ordenar(juegos, 'precio-asc').map((v) => v.precioOferta);
    expect(precios).toEqual([...precios].sort((a, b) => a - b));
  });

  it('pone primero los juegos recién agregados', () => {
    const nuevo = { ...juegos[0], id: 'x', nuevo: true, destacado: false, rating: 0 };
    expect(ordenar([...juegos, nuevo], 'relevancia')[0].id).toBe('x');
  });

  it('no modifica el arreglo original', () => {
    const copia = [...juegos];
    ordenar(juegos, 'precio-desc');
    expect(juegos).toEqual(copia);
  });
});

describe('utilidades de alta', () => {
  it('crea un id legible y sin tildes', () => {
    expect(crearId('Pokémon Escarlata')).toMatch(/^pokemon-escarlata-/);
  });

  it('genera una portada SVG cuando no hay imagen', () => {
    expect(portadaGenerica('Celeste')).toMatch(/^data:image\/svg\+xml/);
  });
});

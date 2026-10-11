import { describe, expect, it } from 'vitest';
import { esValido, validarContacto, validarVideojuego } from './validacion.js';

const valido = { nombre: 'Camila Rojas', email: 'camila@correo.cl', mensaje: 'Mi juego no se descargó.' };

describe('validarContacto', () => {
  it('acepta un mensaje completo', () => {
    expect(esValido(validarContacto(valido))).toBe(true);
  });

  it('exige los tres campos', () => {
    const errores = validarContacto({ nombre: '', email: '', mensaje: '' });
    expect(Object.keys(errores)).toEqual(['nombre', 'email', 'mensaje']);
  });

  it('no acepta solo espacios', () => {
    expect(validarContacto({ ...valido, nombre: '   ' }).nombre).toBeDefined();
  });

  it.each(['camila', 'camila@', 'camila@correo', '@correo.cl', 'camila correo@x.cl'])(
    'rechaza el correo %s', (email) => {
      expect(validarContacto({ ...valido, email }).email).toBeDefined();
    });

  it('acepta nombres con tildes y ñ', () => {
    expect(validarContacto({ ...valido, nombre: 'José Muñoz' }).nombre).toBeUndefined();
  });

  it('rechaza nombres con números', () => {
    expect(validarContacto({ ...valido, nombre: 'Camila 123' }).nombre).toBeDefined();
  });

  it('exige al menos 10 caracteres en el mensaje', () => {
    expect(validarContacto({ ...valido, mensaje: 'Hola' }).mensaje).toMatch(/10/);
  });

  it('limita el mensaje a 500 caracteres', () => {
    expect(validarContacto({ ...valido, mensaje: 'a'.repeat(501) }).mensaje).toMatch(/500/);
  });
});

describe('validarVideojuego', () => {
  const juego = { nombre: 'Celeste', categoria: 'aventura', precio: '9990', descripcion: 'Plataformas exigente.', imagen: '' };
  const existentes = [{ nombre: 'Hollow Knight' }];

  it('acepta un juego completo sin imagen', () => {
    expect(esValido(validarVideojuego(juego, existentes))).toBe(true);
  });

  it('no permite nombres repetidos, sin importar mayúsculas', () => {
    expect(validarVideojuego({ ...juego, nombre: 'hollow knight' }, existentes).nombre).toMatch(/existe/);
  });

  it.each(['', '500', '250000', '9990.5', 'abc'])('rechaza el precio %s', (precio) => {
    expect(validarVideojuego({ ...juego, precio }, existentes).precio).toBeDefined();
  });

  it('exige una categoría', () => {
    expect(validarVideojuego({ ...juego, categoria: '' }, existentes).categoria).toBeDefined();
  });

  it('solo acepta imágenes con URL http o https', () => {
    expect(validarVideojuego({ ...juego, imagen: 'javascript:alert(1)' }, existentes).imagen).toBeDefined();
    expect(validarVideojuego({ ...juego, imagen: 'https://ejemplo.cl/a.png' }, existentes).imagen).toBeUndefined();
  });
});

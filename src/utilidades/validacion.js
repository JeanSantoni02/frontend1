const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITES = { nombre: 60, mensajeMin: 10, mensajeMax: 500 };

// Devuelve un objeto con un mensaje por cada campo invalido; vacio si todo esta bien
export function validarContacto({ nombre = '', email = '', mensaje = '' }) {
  const errores = {};
  const n = nombre.trim();
  const e = email.trim();
  const m = mensaje.trim();

  if (!n) errores.nombre = 'Ingresa tu nombre.';
  else if (n.length < 2) errores.nombre = 'El nombre debe tener al menos 2 caracteres.';
  else if (n.length > LIMITES.nombre) errores.nombre = `El nombre admite hasta ${LIMITES.nombre} caracteres.`;
  else if (!/^[\p{L}\s'.-]+$/u.test(n)) errores.nombre = 'El nombre solo puede tener letras y espacios.';

  if (!e) errores.email = 'Ingresa tu correo electrónico.';
  else if (!EMAIL.test(e)) errores.email = 'El correo no tiene un formato válido, por ejemplo nombre@correo.cl.';

  if (!m) errores.mensaje = 'Escribe tu mensaje.';
  else if (m.length < LIMITES.mensajeMin) errores.mensaje = `El mensaje debe tener al menos ${LIMITES.mensajeMin} caracteres.`;
  else if (m.length > LIMITES.mensajeMax) errores.mensaje = `El mensaje admite hasta ${LIMITES.mensajeMax} caracteres.`;

  return errores;
}

export function validarVideojuego({ nombre = '', categoria = '', precio = '', descripcion = '', imagen = '' }, existentes = []) {
  const errores = {};
  const n = nombre.trim();
  const valor = Number(precio);

  if (!n) errores.nombre = 'Ingresa el nombre del juego.';
  else if (existentes.some((v) => v.nombre.toLowerCase() === n.toLowerCase())) {
    errores.nombre = 'Ya existe un juego con ese nombre.';
  }

  if (!categoria) errores.categoria = 'Elige una categoría.';

  if (precio === '' || precio === null) errores.precio = 'Ingresa el precio.';
  else if (!Number.isInteger(valor) || valor < 1000 || valor > 200000) {
    errores.precio = 'El precio debe ser un número entero entre 1.000 y 200.000.';
  }

  if (!descripcion.trim()) errores.descripcion = 'Escribe una descripción corta.';
  else if (descripcion.trim().length > 120) errores.descripcion = 'La descripción admite hasta 120 caracteres.';

  if (imagen.trim() && !/^(https?:\/\/|\.\/assets\/)/.test(imagen.trim())) {
    errores.imagen = 'La imagen debe ser una URL que empiece con http:// o https://.';
  }

  return errores;
}

export const esValido = (errores) => Object.keys(errores).length === 0;

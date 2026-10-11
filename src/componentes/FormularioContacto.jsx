import { useState } from 'react';
import { LIMITES, esValido, validarContacto } from '../utilidades/validacion.js';

const VACIO = { nombre: '', email: '', mensaje: '' };

export default function FormularioContacto({ onEnviado }) {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});
  const [enviado, setEnviado] = useState(null);
  const [fallo, setFallo] = useState(false);

  const cambiar = (e) => {
    const { name, value } = e.target;
    const siguiente = { ...datos, [name]: value };
    setDatos(siguiente);
    setEnviado(null);
    // Una vez que el campo se toco, el error se actualiza mientras se escribe
    if (tocados[name]) setErrores(validarContacto(siguiente));
  };

  const salir = (e) => {
    setTocados((t) => ({ ...t, [e.target.name]: true }));
    setErrores(validarContacto(datos));
  };

  const enviar = (e) => {
    e.preventDefault();
    const resultado = validarContacto(datos);
    setErrores(resultado);
    setTocados({ nombre: true, email: true, mensaje: true });

    setFallo(!esValido(resultado));
    if (!esValido(resultado)) {
      document.getElementById(`contacto-${Object.keys(resultado)[0]}`)?.focus();
      return;
    }

    const mensaje = { ...datos, nombre: datos.nombre.trim(), email: datos.email.trim(), fecha: new Date() };
    onEnviado?.(mensaje);
    setEnviado(mensaje.nombre.split(' ')[0]);
    setDatos(VACIO);
    setTocados({});
    setErrores({});
  };

  const clase = (campo) => `form-control gs-input ${tocados[campo] && errores[campo] ? 'is-invalid' : ''}`
    + `${tocados[campo] && !errores[campo] && datos[campo] ? ' is-valid' : ''}`;

  const largo = datos.mensaje.trim().length;

  return (
    <form className="gs-formulario" onSubmit={enviar} noValidate>
      {enviado && (
        <div className="alert alert-success" role="status">
          Gracias, {enviado}. Recibimos tu mensaje y te responderemos a la brevedad.
        </div>
      )}

      {fallo && !esValido(errores) && (
        <div className="alert alert-danger" role="alert">Revisa los campos marcados antes de enviar.</div>
      )}

      <div className="mb-3">
        <label htmlFor="contacto-nombre" className="form-label">Nombre</label>
        <input id="contacto-nombre" name="nombre" type="text" className={clase('nombre')} value={datos.nombre}
               onChange={cambiar} onBlur={salir} maxLength={LIMITES.nombre + 10} autoComplete="name"
               aria-invalid={Boolean(tocados.nombre && errores.nombre)} aria-describedby="error-nombre" />
        <div id="error-nombre" className="invalid-feedback">{errores.nombre}</div>
      </div>

      <div className="mb-3">
        <label htmlFor="contacto-email" className="form-label">Correo electrónico</label>
        <input id="contacto-email" name="email" type="email" className={clase('email')} value={datos.email}
               onChange={cambiar} onBlur={salir} autoComplete="email" placeholder="nombre@correo.cl"
               aria-invalid={Boolean(tocados.email && errores.email)} aria-describedby="error-email" />
        <div id="error-email" className="invalid-feedback">{errores.email}</div>
      </div>

      <div className="mb-3">
        <label htmlFor="contacto-mensaje" className="form-label">Mensaje</label>
        <textarea id="contacto-mensaje" name="mensaje" rows="5" className={clase('mensaje')} value={datos.mensaje}
                  onChange={cambiar} onBlur={salir}
                  aria-invalid={Boolean(tocados.mensaje && errores.mensaje)} aria-describedby="error-mensaje ayuda-mensaje" />
        <div id="error-mensaje" className="invalid-feedback">{errores.mensaje}</div>
        <div id="ayuda-mensaje" className={`form-text gs-contador-texto ${largo > LIMITES.mensajeMax ? 'text-danger' : ''}`}>
          {largo} / {LIMITES.mensajeMax} caracteres
        </div>
      </div>

      <button type="submit" className="btn btn-gs w-100">Enviar mensaje</button>
    </form>
  );
}

import { useState } from 'react';
import { esValido, validarVideojuego } from '../utilidades/validacion.js';

const VACIO = { nombre: '', categoria: '', plataforma: 'PC', precio: '', descripcion: '', imagen: '' };
const PLATAFORMAS = ['PC', 'PS5', 'Xbox', 'Switch'];

// Alta de juegos en el catalogo; la eliminacion se hace desde cada tarjeta en modo administracion
export default function AdministrarCatalogo({
  categorias, videojuegos, modoAdmin, onCambiarModo, onAgregar, onRestablecer, modificado
}) {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [agregado, setAgregado] = useState(null);

  const cambiar = (e) => {
    setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));
    setAgregado(null);
  };

  const enviar = (e) => {
    e.preventDefault();
    const resultado = validarVideojuego(datos, videojuegos);
    setErrores(resultado);
    if (!esValido(resultado)) return;

    const nuevo = onAgregar(datos);
    setAgregado(nuevo.nombre);
    setDatos(VACIO);
  };

  const campo = (nombre) => `form-control gs-input ${errores[nombre] ? 'is-invalid' : ''}`;

  return (
    <section id="administrar" className="gs-seccion" aria-labelledby="titulo-administrar">
      <div className="gs-seccion__cabecera">
        <div>
          <p className="gs-portada__epigrafe">Administración</p>
          <h2 id="titulo-administrar">Gestionar el catálogo</h2>
          <p className="gs-texto-suave">
            Agrega juegos nuevos o activa el modo administración para eliminar los existentes desde su tarjeta.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {/* El boton cambia de texto y de estilo segun el estado que controla */}
          <button type="button" className={`btn ${modoAdmin ? 'btn-danger' : 'btn-outline-light'}`}
                  onClick={onCambiarModo} aria-pressed={modoAdmin}>
            {modoAdmin ? 'Terminar de eliminar' : 'Eliminar juegos'}
          </button>
          {modificado && (
            <button type="button" className="btn btn-outline-secondary" onClick={onRestablecer}>
              Restablecer catálogo
            </button>
          )}
        </div>
      </div>

      {modoAdmin && (
        <div className="alert alert-warning gs-alerta" role="status">
          Modo administración activo: cada tarjeta del catálogo muestra un botón × para eliminarla.
        </div>
      )}

      <form className="gs-formulario gs-formulario--admin" onSubmit={enviar} noValidate>
        {agregado && <div className="alert alert-success gs-ancho-total" role="status">«{agregado}» se agregó al catálogo.</div>}

        <div>
          <label htmlFor="juego-nombre" className="form-label">Nombre</label>
          <input id="juego-nombre" name="nombre" className={campo('nombre')} value={datos.nombre} onChange={cambiar} />
          <div className="invalid-feedback">{errores.nombre}</div>
        </div>

        <div>
          <label htmlFor="juego-categoria" className="form-label">Categoría</label>
          <select id="juego-categoria" name="categoria" className={`form-select gs-input ${errores.categoria ? 'is-invalid' : ''}`}
                  value={datos.categoria} onChange={cambiar}>
            <option value="">Elige una</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          <div className="invalid-feedback">{errores.categoria}</div>
        </div>

        <div>
          <label htmlFor="juego-plataforma" className="form-label">Plataforma</label>
          <select id="juego-plataforma" name="plataforma" className="form-select gs-input" value={datos.plataforma} onChange={cambiar}>
            {PLATAFORMAS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="juego-precio" className="form-label">Precio (CLP)</label>
          <input id="juego-precio" name="precio" type="number" min="1000" max="200000" step="10" className={campo('precio')}
                 value={datos.precio} onChange={cambiar} />
          <div className="invalid-feedback">{errores.precio}</div>
        </div>

        <div className="gs-ancho-total">
          <label htmlFor="juego-descripcion" className="form-label">Descripción corta</label>
          <input id="juego-descripcion" name="descripcion" className={campo('descripcion')} value={datos.descripcion}
                 onChange={cambiar} maxLength={140} />
          <div className="invalid-feedback">{errores.descripcion}</div>
        </div>

        <div className="gs-ancho-total">
          <label htmlFor="juego-imagen" className="form-label">URL de la imagen <span className="gs-texto-suave">(opcional)</span></label>
          <input id="juego-imagen" name="imagen" className={campo('imagen')} value={datos.imagen} onChange={cambiar}
                 placeholder="Si la dejas vacía se genera una portada" />
          <div className="invalid-feedback">{errores.imagen}</div>
        </div>

        <div className="gs-ancho-total">
          <button type="submit" className="btn btn-gs">Agregar al catálogo</button>
        </div>
      </form>
    </section>
  );
}

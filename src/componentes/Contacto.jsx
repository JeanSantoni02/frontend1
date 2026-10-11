import FormularioContacto from './FormularioContacto.jsx';

// Grilla CSS de dos columnas que pasa a una sola en pantallas chicas
export default function Contacto({ onEnviado, mensajesRecibidos }) {
  return (
    <section id="contacto" className="gs-seccion gs-contacto" aria-labelledby="titulo-contacto">
      <div className="gs-contacto__info">
        <p className="gs-portada__epigrafe">Contacto</p>
        <h2 id="titulo-contacto">¿Tienes una duda o un problema con tu compra?</h2>
        <p className="gs-texto-suave">
          Escríbele al administrador de la tienda. Respondemos dentro de las siguientes 24 horas hábiles.
        </p>

        <ul className="gs-contacto__datos">
          <li><span aria-hidden="true">✉</span> soporte@gamestore.cl</li>
          <li><span aria-hidden="true">☎</span> +56 2 2345 6789</li>
          <li><span aria-hidden="true">⏱</span> Lunes a viernes, 9:00 a 18:00</li>
        </ul>

        {mensajesRecibidos > 0 && (
          <p className="gs-texto-suave">Mensajes enviados en esta sesión: {mensajesRecibidos}</p>
        )}
      </div>

      <FormularioContacto onEnviado={onEnviado} />
    </section>
  );
}

// Genera las capturas de evidencia recorriendo la aplicacion con Chrome.
// Uso:  npm run preview   y en otra consola   node scripts/capturas.mjs

import { mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SITIO = process.env.SITIO || 'http://localhost:4173';
const DESTINO = 'capturas/semana8';

const ESCRITORIO = { width: 1440, height: 900, deviceScaleFactor: 1 };
const MOVIL = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true };

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// Deja la primera fila de tarjetas completa en pantalla, con sus botones
async function bajarAlCatalogo(pagina) {
  await pagina.evaluate(() => {
    const tarjeta = document.querySelector('.gs-tarjeta');
    if (tarjeta) window.scrollTo({ top: tarjeta.getBoundingClientRect().top + window.scrollY - 90 });
  });
  await esperar(400);
}

const navegador = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  defaultViewport: ESCRITORIO
});

await mkdir(DESTINO, { recursive: true });
const pagina = await navegador.newPage();

async function capturar(nombre, opciones = {}) {
  await esperar(400);
  await pagina.screenshot({ path: join(DESTINO, `${nombre}.png`), ...opciones });
  console.log('  ' + nombre + '.png');
}

async function abrir({ limpiar = true } = {}) {
  await pagina.goto(SITIO, { waitUntil: 'networkidle0' });
  if (limpiar) {
    await pagina.evaluate(() => localStorage.clear());
    await pagina.reload({ waitUntil: 'networkidle0' });
  }
  await pagina.waitForSelector('.gs-tarjeta');
  await esperar(600);
}

// Hace clic en el boton de una tarjeta buscandola por el titulo del juego
async function agregar(titulo) {
  await pagina.evaluate((t) => {
    const tarjeta = [...document.querySelectorAll('.gs-tarjeta')]
      .find((c) => c.querySelector('.gs-tarjeta__titulo')?.textContent.includes(t));
    tarjeta?.querySelector('button')?.click();
  }, titulo);
  await esperar(250);
}

console.log('Generando capturas...');

// 1. Estado de carga: se interrumpe la respuesta del JSON para congelarlo
await pagina.setRequestInterception(true);
const retener = (peticion) => {
  if (peticion.url().includes('productos.json')) {
    setTimeout(() => peticion.continue().catch(() => {}), 4000);
  } else {
    peticion.continue().catch(() => {});
  }
};
pagina.on('request', retener);
await pagina.goto(SITIO, { waitUntil: 'domcontentloaded' });
await pagina.waitForSelector('.gs-esqueleto');
await capturar('01-estado-de-carga');
pagina.off('request', retener);
await pagina.setRequestInterception(false);

// 2. Catalogo cargado desde el JSON
await abrir();
await capturar('02-catalogo-cargado-con-useeffect');
await bajarAlCatalogo(pagina);
await capturar('02b-tarjetas-con-precio-normal-y-oferta');

// 3. Carrito vacio
await pagina.click('.gs-boton-carrito');
await esperar(600);
await capturar('03-carrito-vacio');
await pagina.click('.gs-capa');
await esperar(500);

// 4. Boton que cambia de texto al agregar
await agregar('God of War');
await agregar('Elden Ring');
await bajarAlCatalogo(pagina);
await capturar('04-boton-en-el-carrito');

// 5. Carrito con productos, contador y total
await agregar('Hollow Knight');
await agregar('Hollow Knight');
await pagina.click('.gs-boton-carrito');
await esperar(600);
await capturar('05-carrito-con-productos');

// 6. Carrito despues de eliminar una linea
await pagina.evaluate(() => {
  document.querySelector('.gs-linea__acciones button:last-child')?.click();
});
await esperar(600);
await capturar('06-carrito-tras-eliminar');
await pagina.click('.gs-capa');
await esperar(500);

// 7. Boton de ofertas en su estado activo
await pagina.evaluate(() => {
  [...document.querySelectorAll('.gs-chip')]
    .find((b) => b.textContent.includes('Ver solo ofertas'))?.click();
});
await esperar(500);
await bajarAlCatalogo(pagina);
await capturar('07-filtro-solo-ofertas');
await pagina.evaluate(() => {
  [...document.querySelectorAll('.gs-chip')]
    .find((b) => b.textContent.includes('Viendo solo ofertas'))?.click();
});

// 8. Busqueda sin resultados
await pagina.type('input[type="search"]', 'pokemon');
await esperar(600);
await capturar('08-busqueda-sin-resultados');

// 9. Error de carga con boton de reintentar
await pagina.setRequestInterception(true);
const fallar = (peticion) => {
  if (peticion.url().includes('productos.json')) peticion.abort().catch(() => {});
  else peticion.continue().catch(() => {});
};
pagina.on('request', fallar);
await pagina.goto(SITIO, { waitUntil: 'domcontentloaded' });
await pagina.waitForSelector('.gs-aviso--error');
await capturar('09-error-con-reintentar');
pagina.off('request', fallar);
await pagina.setRequestInterception(false);

// 10. Version movil
await pagina.setViewport(MOVIL);
await abrir({ limpiar: false });
await capturar('10-version-movil');

await navegador.close();

const generadas = (await readdir(DESTINO)).filter((f) => f.endsWith('.png'));
console.log(`\n${generadas.length} capturas en ${DESTINO}`);

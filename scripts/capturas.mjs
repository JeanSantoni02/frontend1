// Captura cada funcionalidad recorriendo el sitio compilado; requiere npm run preview

import { mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const SITIO = process.env.SITIO || 'http://localhost:4173';
const DESTINO = 'capturas/eft';

const ESCRITORIO = { width: 1440, height: 900, deviceScaleFactor: 1 };
const MOVIL = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

const navegador = await puppeteer.launch({ executablePath: CHROME, headless: 'new', defaultViewport: ESCRITORIO });
await mkdir(DESTINO, { recursive: true });
const pagina = await navegador.newPage();
pagina.on('dialog', (d) => d.accept());

async function capturar(nombre, opciones = {}) {
  await esperar(450);
  await pagina.screenshot({ path: join(DESTINO, `${nombre}.png`), ...opciones });
  console.log('  ' + nombre + '.png');
}

async function abrir() {
  await pagina.goto(SITIO, { waitUntil: 'networkidle0' });
  await pagina.evaluate(() => localStorage.clear());
  await pagina.reload({ waitUntil: 'networkidle0' });
  await pagina.waitForSelector('.gs-tarjeta');
  await esperar(700);
}

async function irA(id, margen = 80) {
  await pagina.evaluate((i, m) => {
    const el = document.getElementById(i);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - m, behavior: 'instant' });
  }, id, margen);
  await esperar(500);
}

async function clicTexto(selector, texto) {
  await pagina.evaluate((s, t) => {
    [...document.querySelectorAll(s)].find((e) => e.textContent.trim().includes(t))?.click();
  }, selector, texto);
  await esperar(350);
}

async function escribir(selector, texto) {
  await pagina.click(selector);
  await pagina.keyboard.down('Control');
  await pagina.keyboard.press('KeyA');
  await pagina.keyboard.up('Control');
  await pagina.keyboard.press('Backspace');
  await pagina.type(selector, texto);
}

console.log('Generando capturas...');

// Estado de carga: se retiene el modulo del catalogo
await pagina.setRequestInterception(true);
const retener = (p) => {
  if (p.url().includes('videojuegos-')) setTimeout(() => p.continue().catch(() => {}), 4000);
  else p.continue().catch(() => {});
};
pagina.on('request', retener);
await pagina.goto(SITIO, { waitUntil: 'domcontentloaded' });
await pagina.waitForSelector('.gs-esqueleto');
await irA('catalogo');
await capturar('01-carga-del-catalogo');
pagina.off('request', retener);
await pagina.setRequestInterception(false);

await abrir();
await capturar('02-inicio-y-navegacion');

await irA('catalogo');
await capturar('03-catalogo-tarjetas');

await clicTexto('.gs-chip', 'Aventura');
await capturar('04-filtro-por-categoria');
await clicTexto('.gs-chip', 'Todas');

await pagina.click('.gs-tarjeta .card-footer button');
await esperar(200);
await pagina.evaluate(() => document.querySelectorAll('.gs-tarjeta .card-footer button')[2].click());
await esperar(200);
await pagina.click('.gs-boton-carrito');
await esperar(700);
await capturar('05-carrito');
await pagina.click('.gs-capa');
await esperar(500);

// Formulario de contacto
await irA('contacto');
await pagina.click('.gs-contacto button[type="submit"]');
await capturar('06-contacto-campos-vacios');

await escribir('#contacto-nombre', 'Camila Rojas');
await escribir('#contacto-email', 'camila@correo');
await escribir('#contacto-mensaje', 'Hola');
await pagina.click('#contacto-nombre');
await capturar('07-contacto-datos-invalidos');

await escribir('#contacto-email', 'camila.rojas@correo.cl');
await escribir('#contacto-mensaje', 'Compré Hades II y no me llegó el código de activación al correo.');
await pagina.click('.gs-contacto button[type="submit"]');
await capturar('08-contacto-enviado');

// Administracion: alta con validacion y baja
await irA('administrar');
await pagina.click('.gs-formulario--admin button[type="submit"]');
await capturar('09-alta-con-errores');

await escribir('#juego-nombre', 'Celeste');
await pagina.select('#juego-categoria', 'aventura');
await pagina.select('#juego-plataforma', 'Switch');
await escribir('#juego-precio', '9990');
await escribir('#juego-descripcion', 'Plataformas exigente sobre escalar una montaña.');
await pagina.click('.gs-formulario--admin button[type="submit"]');
await esperar(400);
await capturar('10-alta-exitosa');

await irA('catalogo');
await capturar('11-juego-agregado-en-catalogo');

await irA('administrar');
await clicTexto('#administrar button', 'Eliminar juegos');
await irA('catalogo');
await capturar('12-modo-eliminar');

const antes = await pagina.$$eval('.gs-tarjeta', (t) => t.length);
await pagina.evaluate(() => document.querySelectorAll('.gs-eliminar')[1].click());
await esperar(500);
const despues = await pagina.$$eval('.gs-tarjeta', (t) => t.length);
console.log(`  tarjetas: ${antes} -> ${despues}`);
await capturar('13-juego-eliminado');

// Version movil
await pagina.setViewport(MOVIL);
await abrir();
await capturar('14-movil-inicio');
await pagina.click('.navbar-toggler');
await esperar(400);
await capturar('15-movil-menu-abierto');
await pagina.click('.navbar-toggler');
await irA('catalogo', 70);
await capturar('16-movil-catalogo');
await irA('contacto', 70);
await capturar('17-movil-contacto');

await navegador.close();
const total = (await readdir(DESTINO)).filter((f) => f.endsWith('.png')).length;
console.log(`\n${total} capturas en ${DESTINO}`);

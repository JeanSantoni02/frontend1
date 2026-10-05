// Captura el sitio ya publicado en GitHub Pages
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const SITIO = 'https://jeansantoni02.github.io/frontend1/';

const navegador = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  defaultViewport: { width: 1440, height: 900 }
});

const pagina = await navegador.newPage();
await pagina.goto(SITIO, { waitUntil: 'networkidle0' });
await pagina.waitForSelector('.gs-tarjeta');
await new Promise((r) => setTimeout(r, 1200));

await pagina.evaluate(() => {
  const tarjeta = document.querySelector('.gs-tarjeta');
  if (tarjeta) window.scrollTo({ top: tarjeta.getBoundingClientRect().top + window.scrollY - 90 });
});
await new Promise((r) => setTimeout(r, 500));

await pagina.screenshot({ path: 'capturas/semana8/11-sitio-publicado.png' });
console.log('  11-sitio-publicado.png');

await navegador.close();

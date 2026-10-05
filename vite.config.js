import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Rutas relativas para que el build funcione igual en local y en gh-pages
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});

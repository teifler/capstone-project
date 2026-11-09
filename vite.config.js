import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// `vite preview` serves the production build with the same security headers
// as Vercel (vercel.json is the single source). The dev server does not get
// them: it needs inline scripts and a websocket for hot reload.
const vercel = JSON.parse(
  readFileSync(new URL('./vercel.json', import.meta.url), 'utf8')
);
const productionHeaders = Object.fromEntries(
  vercel.headers
    .find(rule => rule.source === '/(.*)')
    .headers.map(({ key, value }) => [key, value])
);

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // No public source maps in production.
    sourcemap: false,
    // Emit every asset as a file instead of a data: URL, so the CSP can keep
    // img-src and font-src without data:.
    assetsInlineLimit: 0,
  },
  preview: {
    headers: productionHeaders,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.jsx'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/**/*.stories.jsx',
        'src/**/*.{spec,test}.{js,jsx}',
        'src/test/**',
      ],
      reporter: ['text', 'html', 'json-summary'],
    },
  },
});

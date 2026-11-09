import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // No public source maps in production.
    sourcemap: false,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.jsx'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.stories.jsx', 'src/**/*.{spec,test}.{js,jsx}'],
      reporter: ['text', 'html', 'json-summary'],
    },
  },
});

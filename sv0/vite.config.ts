import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vite.dev/config/
export default defineConfig({
  plugins: [ svelte() ],
  test: {
    environment: 'jsdom',
    // environment: 'happy-dom',
    include: [
      './src/**/*.test.{js,ts,svelte}',
    ],
    reporters: [
      'default',
      'junit',
    ],
    outputFile: {
      junit: './test-reports/junit.xml',
    },
    coverage: {
      include: [
        'src/**/*.{js,ts,svelte}',
      ],
      all: true,
      provider: 'istanbul',
      reporter: [
        'text',
        'cobertura',
        'html',
      ],
    },
  }
});

import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  publicDir: '../public',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: '../dist',
    assetsDir: 'assets'
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
}); 
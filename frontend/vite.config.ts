// import { defineConfig } from 'vite';
// import solidPlugin from 'vite-plugin-solid';

// export default defineConfig({
//   plugins: [solidPlugin()],
//   server: {
//     port: 3000,
//   },
//   build: {
//     target: 'esnext',
//   },
// });
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  optimizeDeps: {
    exclude: [
      '@tiptap/core',
      '@tiptap/starter-kit',
      '@tiptap/extension-bubble-menu',
    ],
  },
  plugins: [solidPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Адрес вашего сервера Django
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

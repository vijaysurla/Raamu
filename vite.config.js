import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['pdfjs-dist'],
  },
  server: {
    // Configure middleware to set correct MIME type for worker files
    fs: {
      // Allow serving files from the project root
      strict: false,
    },
  },
  // Ensure worker files are handled correctly
  assetsInclude: ['**/*.worker.js', '**/*.worker.mjs'],
})

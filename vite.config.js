import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api-hf': {
        target: 'https://api-inference.huggingface.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-hf/, ''),
        secure: true,
      },
    },
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'qrcode.react'],
  },
})

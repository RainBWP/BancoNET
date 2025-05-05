import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost/banconet/api.php', // matches your backend server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // removes '/api' prefix
      }
    }
  },preview: {
    allowedHosts: [
      '9e5d-2806-2f0-7001-804b-a173-1cc9-cd00-c750.ngrok-free.app'
    ]
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/BancoNET/', // Change this to your repo name
  server: {
    host: true,
    port: 3000,
    open: true
  }
})
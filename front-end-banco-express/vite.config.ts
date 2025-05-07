import { defineConfig , loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 3000,
      open: true,
      proxy: {
        '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '') // removes '/api' prefix
          }
          }
        },
        preview: {
          allowedHosts: [
          env.VITE_ALLOWED_HOST // uses only env variable
      ]
    }
  };
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    allowedHosts: true,
  },
  plugins: [
    react(),
    // basicSsl(), // Disabled for localtunnel
  ],
})

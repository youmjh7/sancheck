import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
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
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon-v4.png', 'masked-icon.svg'],
      manifest: {
        name: '산책하니?',
        short_name: '산책하니?',
        description: '내 강아지와 함께하는 행복한 산책',
        theme_color: '#fdfbfb',
        background_color: '#fdfbfb',
        display: 'standalone',
        start_url: '/?v=2',
        icons: [
          {
            src: 'pwa-192x192-v4.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512-v4.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'manifest-icon-192-v4.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'manifest-icon-512-v4.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})

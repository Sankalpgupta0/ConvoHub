import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy:{
      '/api': 'https://convohub-server-j9ov.onrender.com'
    }
  },
  plugins: [react()],
})

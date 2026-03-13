import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  
  // Enable environment variable access
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || ''),
  },
  
  server: {
    port: 3000,
    proxy: {
      '/imports': 'http://localhost:8000',
      '/metrics': 'http://localhost:8000',
      '/todos': 'http://localhost:8000',
      '/api': 'http://localhost:8000',
      '/auth': 'http://localhost:8000',
    }
  },
  
  build: {
    // Production build configuration
    outDir: 'dist',
    sourcemap: mode !== 'production',
    minify: mode === 'production' ? 'terser' : false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
  },
}))

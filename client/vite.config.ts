import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/api': 'http://localhost:5000',
            '/contact': 'http://localhost:5000',
            '/admin': 'http://localhost:5000',
        },
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        // Fix #7: Minification settings
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,  // Remove console.logs in production
                drop_debugger: true,
            },
        },
        // Code splitting for better caching
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                    'vendor-animation': ['framer-motion'],
                    'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
                    'vendor-ui': ['lucide-react', 'clsx', 'tailwind-merge'],
                },
            },
        },
        // Chunk size warnings
        chunkSizeWarningLimit: 500,
        // Asset optimization
        assetsInlineLimit: 4096, // Inline assets < 4KB
    },
    // Optimize dependencies
    optimizeDeps: {
        include: ['react', 'react-dom', 'framer-motion'],
    },
})

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: { allowedHosts: ['huge-papers-clap.loca.lt'], proxy: { '/api': 'http://localhost:4000' } },
  build: { rollupOptions: { output: { manualChunks(id) {
    if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react-vendor';
    if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion-')) return 'motion-vendor';
    if (id.includes('node_modules/lucide-react')) return 'icons-vendor';
    if (id.includes('node_modules/@tanstack') || id.includes('node_modules/zustand')) return 'state-vendor';
    if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/zod') || id.includes('node_modules/react-router')) return 'forms-router-vendor';
  } } } },
  test: { environment: 'jsdom', setupFiles: './src/test-setup.ts' }
});

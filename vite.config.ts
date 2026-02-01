import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Ryutsu/', // Set base for GitHub Pages
  plugins: [react()],
});
});

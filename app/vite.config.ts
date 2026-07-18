import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages отдаёт проектный сайт из подпапки с именем репозитория, а не
  // из корня домена. Значение приходит из workflow (.github/workflows/pages.yml);
  // локально остаётся '/', поэтому `npm run dev` работает как раньше.
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

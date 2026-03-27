import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '')
  const isVercel = env.VERCEL === '1'

  return {
    plugins: [react(), tailwindcss()],
    base: isVercel ? '/' : '/gnb/',
    build: {
      rollupOptions: {
        input: {
          main: resolve(rootDir, 'index.html'),
          admin: resolve(rootDir, 'admin.html'),
        },
      },
    },
  }
})

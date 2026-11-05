import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: '/de-ds-interview-lab/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  build: {
    // Bản phân phối của Mermaid có vài chunk lớn nhưng chỉ tải ở trang có sơ đồ.
    chunkSizeWarningLimit: 1600,
    rolldownOptions: {
      output: {
        // Gộp câu hỏi theo chủ đề để không phải tải hàng trăm tệp nhỏ khi mở ngân hàng câu hỏi.
        codeSplitting: {
          groups: [
            {
              name(id: string) {
                const match = id.match(/\/content\/([^/]+)\/(quiz|interview)\//)
                return match ? `${match[2]}-${match[1]}` : null
              },
            },
          ],
        },
      },
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
})

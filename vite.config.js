import { defineConfig } from 'vite'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: '.',
  base: '/',

  plugins: [
    tailwindcss(),
  ],

  build: {
    // 构建到 templates/assets/dist/ 子目录
    outDir: resolve(__dirname, 'templates/assets/dist'),
    emptyOutDir: true,
    // 强制合并所有 CSS 到一个文件
    cssCodeSplit: false,
    // 禁用 CSS minify（解决 lightningcss 在媒体查询中处理 CSS 变量的问题）
    cssMinify: false,

    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/js/main.js'),
      },
      output: {
        // 输出 IIFE 格式，直接在浏览器运行，不需要 type="module"
        format: 'iife',
        // JS 放在 dist/js/
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        // CSS 输出为 main.css
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name ? assetInfo.name.split('.').pop() : '';
          if (['css'].includes(ext)) {
            return 'css/main[extname]';
          }
          if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'webp'].includes(ext)) {
            return 'images/[name][extname]';
          }
          if (['woff', 'woff2', 'ttf', 'eot'].includes(ext)) {
            return 'fonts/[name][extname]';
          }
          return 'assets/[name][extname]';
        }
      }
    }
  },

  server: {
    port: 5173,
    open: true,
    cors: true
  }
})

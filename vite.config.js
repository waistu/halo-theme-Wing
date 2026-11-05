import { defineConfig } from 'vite'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

// IIFE 格式不支持多入口（rolldown 限制），因此按 mode 分两次构建（npm run build 串联）：
//   默认 mode —— main：全站脚本 + 全部 CSS
//   moments mode —— moments：瞬间页交互脚本（不依赖 CSS），仅瞬间相关页面引用
export default defineConfig(({ mode }) => {
  const isMoments = mode === 'moments'
  return {
    root: '.',
    base: '/',

    plugins: [
      tailwindcss(),
    ],

    build: {
      // 构建到 templates/assets/dist/ 子目录
      outDir: resolve(__dirname, 'templates/assets/dist'),
      // 第二次构建（moments）不清空 dist，只追加产物
      emptyOutDir: !isMoments,
      // CSS 输出为独立文件而非注入 JS
      cssCodeSplit: false,
      // 用 esbuild 压缩 CSS（lightningcss 会把媒体查询里的 CSS 变量解析坏，故不用默认值）
      cssMinify: 'esbuild',

      rollupOptions: {
        input: isMoments
          ? { moments: resolve(__dirname, 'src/js/moments.js') }
          : { main: resolve(__dirname, 'src/js/main.js') },
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
  }
})

/**
 * vite.config.shiki.js
 * 专门用于打包 Shiki 代码高亮模块（ESM 格式）
 * 单独构建避免与主 IIFE bundle 的 codeSplitting 冲突
 */
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  base: '/assets/dist/js/',

  build: {
    outDir: resolve(__dirname, 'templates/assets/dist/js'),
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/js/shiki-bundle.js'),
      name: 'ShikiBundle',
      fileName: () => 'shiki-bundle.js',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        // chunk 文件也放在同目录
        chunkFileNames: 'shiki-[name].js',
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name ? assetInfo.name.split('.').pop() : '';
          if (ext === 'wasm') return '[name][extname]';
          return '[name][extname]';
        }
      }
    },
    // 不需要 CSS minify
    cssMinify: false,
  }
})

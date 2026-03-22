/** @type {import('tailwindcss').Config} */
module.exports = {
  // 启用基于 class 的深色模式，这是最灵活的方式
  darkMode: 'class',
  // 指定 Tailwind 应该扫描哪些文件来生成样式
  content: [
    // 扫描所有 Halo 模板文件（.html）
    "./templates/**/*.html",
    // 扫描所有位于 static 目录下的 .js 文件（您的旧脚本）
    "./static/**/*.js",
    // 扫描您将要创建的新前端源码（.js, .vue 等）
    "./src/**/*.{js,vue,ts}",
  ],
  theme: {
    extend: {
      // 您可以在这里扩展 Tailwind 的默认主题
      // 例如自定义颜色、字体、间距等
      colors: {
        'primary': {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      },
      // 自定义响应式断点（可选）
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [
    // 在此处添加您需要的 Tailwind 插件
    // 例如： require('@tailwindcss/typography'),
    // 例如： require('@tailwindcss/forms'),
  ],
}
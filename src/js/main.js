// 导入主样式（Vite 会处理 Tailwind CSS）
import '../css/main.css'
// 导入旧版完整样式（保留原有设计）
import '../css/style.css'

// ========== 深色模式管理 ==========
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'system'
    this.init()
  }

  init() {
    this.applyTheme()
    this.setupListeners()
  }

  applyTheme() {
    const isDark = this.getCurrentTheme() === 'dark'
    if (isDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
    }
    this.updateToggleIcon(isDark)
  }

  getCurrentTheme() {
    if (this.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return this.theme
  }

  setTheme(theme) {
    this.theme = theme
    localStorage.setItem('theme', theme)
    this.applyTheme()
  }

  toggleTheme() {
    const current = this.getCurrentTheme()
    this.setTheme(current === 'dark' ? 'light' : 'dark')
  }

  updateToggleIcon(isDark) {
    // 更新所有 .theme-toggle 按钮的图标
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun')
      const moonIcon = btn.querySelector('.icon-moon')
      if (sunIcon) sunIcon.style.display = isDark ? 'block' : 'none'
      if (moonIcon) moonIcon.style.display = isDark ? 'none' : 'block'
    })
  }

  setupListeners() {
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.theme === 'system') {
        this.applyTheme()
      }
    })
  }
}

// 提前初始化主题（避免闪烁），挂载到 window
window.themeManager = new ThemeManager()

// ========== 移动端菜单控制 ==========
class MobileMenu {
  constructor(selector = '.mobile-menu') {
    this.menu = document.querySelector(selector)
    this.toggleBtn = document.querySelector('.mobile-menu-toggle')
    this.init()
  }

  init() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle())
    }

    // 点击菜单外部关闭
    document.addEventListener('click', (e) => {
      if (this.menu && this.menu.classList.contains('active') &&
          !this.menu.contains(e.target) &&
          e.target !== this.toggleBtn) {
        this.close()
      }
    })
  }

  toggle() {
    this.menu?.classList.toggle('active')
    this.toggleBtn?.classList.toggle('active')
  }

  open() {
    this.menu?.classList.add('active')
    this.toggleBtn?.classList.add('active')
  }

  close() {
    this.menu?.classList.remove('active')
    this.toggleBtn?.classList.remove('active')
  }
}

// ========== 页面加载完成后初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
  // 初始化移动端菜单
  if (document.querySelector('.mobile-menu')) {
    window.mobileMenu = new MobileMenu()
  }

  // 绑定深色模式切换按钮
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      window.themeManager.toggleTheme()
    })
  })

  // 图片懒加载
  const images = document.querySelectorAll('img[data-src]')
  if (images.length > 0 && 'IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.removeAttribute('data-src')
          imageObserver.unobserve(img)
        }
      })
    })
    images.forEach(img => imageObserver.observe(img))
  }

  // dayjs 相对时间初始化（如果已加载）
  if (window.dayjs) {
    dayjs.extend(window.dayjs_plugin_relativeTime)
    dayjs.locale('zh-cn')
    document.querySelectorAll('[data-date]').forEach(el => {
      const dateStr = el.getAttribute('data-date')
      if (dateStr) {
        el.textContent = dayjs(dateStr).fromNow()
      }
    })
  }

  // 搜索框交互
  const searchIcon = document.getElementById('searchIcon')
  const searchInput = document.getElementById('searchInput')
  if (searchIcon && searchInput) {
    searchIcon.addEventListener('click', () => {
      if (searchInput.classList.contains('show')) {
        const query = searchInput.value.trim()
        if (query && window.SearchWidget) {
          SearchWidget.open(query)
        } else if (window.SearchWidget) {
          SearchWidget.open('')
        }
        searchInput.classList.remove('show')
        searchInput.value = ''
      } else {
        searchInput.classList.add('show')
        searchInput.focus()
      }
    })

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim()
        if (window.SearchWidget) {
          SearchWidget.open(query)
        }
        searchInput.classList.remove('show')
        searchInput.value = ''
      }
      if (e.key === 'Escape') {
        searchInput.classList.remove('show')
        searchInput.value = ''
      }
    })

    // 点击外部关闭搜索框
    document.addEventListener('click', (e) => {
      if (!searchIcon.contains(e.target) && !searchInput.contains(e.target)) {
        searchInput.classList.remove('show')
      }
    })
  }
})





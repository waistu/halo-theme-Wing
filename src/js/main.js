// 导入主样式（Vite 会处理 Tailwind CSS）
import '../css/main.css'

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

  toggleTheme(x, y) {
    const current = this.getCurrentTheme()
    const nextTheme = current === 'dark' ? 'light' : 'dark'

    // 不支持 View Transition API，直接切换
    if (!document.startViewTransition) {
      this.setTheme(nextTheme)
      return
    }

    // 计算从点击点到最远角的半径（确保圆形能覆盖整个屏幕）
    const cx = x ?? window.innerWidth
    const cy = y ?? 0
    const endRadius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    )

    const transition = document.startViewTransition(() => {
      this.setTheme(nextTheme)
    })

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${endRadius}px at ${cx}px ${cy}px)`
      ]
      document.documentElement.animate(
        { clipPath },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)'
        }
      )
    })
  }

  updateToggleIcon(isDark) {
    // 更新所有 .theme-toggle 按钮的图标
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun')
      const moonIcon = btn.querySelector('.icon-moon')
      if (sunIcon) sunIcon.style.display = isDark ? 'none' : 'block'
      if (moonIcon) moonIcon.style.display = isDark ? 'block' : 'none'
    })
    
    // 更新 Header 主题切换按钮的图标
    document.querySelectorAll('.theme-toggle-header').forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun')
      const moonIcon = btn.querySelector('.icon-moon')
      if (sunIcon) sunIcon.style.display = isDark ? 'none' : 'flex'
      if (moonIcon) moonIcon.style.display = isDark ? 'flex' : 'none'
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
  // 初始化主题管理器（只初始化一次）
  window.themeManager = new ThemeManager()

  // 初始化移动端菜单
  if (document.querySelector('.mobile-menu')) {
    window.mobileMenu = new MobileMenu()
  }

  // 绑定深色模式切换按钮
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      window.themeManager.toggleTheme(e.clientX, e.clientY)
    })
  })

  // 绑定 Header 主题切换按钮
  document.querySelectorAll('.theme-toggle-header').forEach(btn => {
    btn.addEventListener('click', (e) => {
      window.themeManager.toggleTheme(e.clientX, e.clientY)
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

  // dayjs 相对时间初始化
  if (window.dayjs) {
    window.dayjs.extend(window.dayjs_plugin_relativeTime)
    window.dayjs.locale('zh-cn')
    document.querySelectorAll('[data-date]').forEach(el => {
      const dateStr = el.getAttribute('data-date')
      if (dateStr) {
        el.textContent = window.dayjs(dateStr).fromNow()
      }
    })
  }

  // ========== 搜索框交互 ==========
  const searchIcon = document.getElementById('searchIcon')
  const searchInput = document.getElementById('searchInput')
  const searchBox = document.querySelector('.search-box')

  if (searchIcon && searchInput) {
    searchIcon.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()

      if (window.SearchWidget) {
        // 有搜索插件：直接打开插件
        SearchWidget.open(searchInput.value.trim())
      } else {
        // 无插件：切换原生输入框显示
        searchInput.classList.toggle('show')
        if (searchInput.classList.contains('show')) {
          searchInput.focus()
        }
      }
    })

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        const keyword = searchInput.value.trim()
        if (!keyword) return

        if (window.SearchWidget) {
          SearchWidget.open(keyword)
        } else {
          window.location.href = `/search?keyword=${encodeURIComponent(keyword)}`
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

    // 鼠标离开搜索框区域关闭（仅无插件时）
    if (searchBox && !window.SearchWidget) {
      searchBox.addEventListener('mouseleave', () => {
        searchInput.classList.remove('show')
      })
    }
  }

  // ========== 标签页切换 ==========
  const tabItems = document.querySelectorAll('.tab-item')
  tabItems.forEach(item => {
    item.addEventListener('click', () => {
      tabItems.forEach(i => i.classList.remove('active'))
      item.classList.add('active')
    })
  })

  // ========== 移动端菜单图标 ==========
  const menuIcon = document.getElementById('menuIcon')
  const sidebar = document.querySelector('.sidebar')
  if (menuIcon && sidebar) {
    menuIcon.addEventListener('click', (e) => {
      e.stopPropagation()
      sidebar.classList.toggle('active')
    })

    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !menuIcon.contains(e.target)) {
        sidebar.classList.remove('active')
      }
    })
  }

  // ========== 标签列表排序（文章数量） ==========
  const topicList = document.querySelector('.topic-items')
  if (topicList) {
    const topicItems = topicList.querySelectorAll('.topic-item')
    if (topicItems.length > 0) {
      const items = Array.from(topicItems)
      const validItems = items.filter(item => {
        const count = parseInt(item.getAttribute('data-count'), 10)
        return !isNaN(count) && count > 0
      })

      validItems.sort((a, b) => {
        const countA = parseInt(a.getAttribute('data-count'), 10) || 0
        const countB = parseInt(b.getAttribute('data-count'), 10) || 0
        return countB - countA
      })

      if (validItems.length > 0) {
        topicList.innerHTML = ''
        validItems.forEach(item => topicList.appendChild(item))
      } else {
        topicList.parentElement.style.display = 'none'
      }
    }
  }

  // ========== 标签聚合页排序 ==========
  const tagsList = document.querySelector('.tags-list')
  if (tagsList) {
    const tagItems = tagsList.querySelectorAll('.tag-item')
    if (tagItems.length > 0) {
      const items = Array.from(tagItems)
      const validItems = items.filter(item => {
        const count = parseInt(item.getAttribute('data-count'), 10)
        return !isNaN(count) && count > 0
      })

      validItems.sort((a, b) => {
        const countA = parseInt(a.getAttribute('data-count'), 10) || 0
        const countB = parseInt(b.getAttribute('data-count'), 10) || 0
        return countB - countA
      })

      if (validItems.length > 0) {
        tagsList.innerHTML = ''
        validItems.forEach(item => tagsList.appendChild(item))
      } else {
        tagsList.parentElement.style.display = 'none'
      }
    }
  }
})
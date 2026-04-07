// 导入主样式（Vite 会处理 Tailwind CSS）
// twikoo.css 必须在 main.css 之后导入，以便主题覆盖样式生效
import '../css/twikoo.css'
import '../css/main.css'

// ========== 深色模式管理 ==========
class ThemeManager {
  constructor() {
    // 读取后台注入的配置（base.html 的早期脚本写入）
    const cfg = window.__WING_THEME__ || {}
    this.serverMode = cfg.serverMode || 'auto'   // 后台设置：'light' | 'dark' | 'auto'
    this.lightStart = cfg.lightStart || '06:00'
    this.darkStart  = cfg.darkStart  || '22:00'

    // 用户在 dropdown 里选择的模式，持久化到 localStorage
    // - 'auto'：跟随后台自动时间（或后台强制模式）
    // - 'light' / 'dark'：用户手动固定
    this._userMode = localStorage.getItem('wing-user-mode') || 'auto'

    this.init()
  }

  /** 将 "HH:MM" 解析为当天分钟数 */
  _timeToMin(t) {
    const [h, m] = (t || '00:00').split(':').map(Number)
    return h * 60 + (m || 0)
  }

  /** 根据当前时间判断自动模式应用的主题 */
  _getAutoTheme() {
    const now = new Date()
    const cur = now.getHours() * 60 + now.getMinutes()
    const ls  = this._timeToMin(this.lightStart)
    const ds  = this._timeToMin(this.darkStart)
    if (ds > ls) return (cur >= ds || cur < ls) ? 'dark' : 'light'
    return (cur >= ds && cur < ls) ? 'dark' : 'light'
  }

  /**
   * 解析最终生效的 dark/light
   * 优先级：后台强制模式 > 用户选择 > 自动时间
   */
  getCurrentTheme() {
    // 后台强制模式直接决定，用户无法覆盖
    if (this.serverMode === 'light') return 'light'
    if (this.serverMode === 'dark')  return 'dark'
    // 后台为 auto：看用户选择
    if (this._userMode === 'light') return 'light'
    if (this._userMode === 'dark')  return 'dark'
    // 用户也选 auto：按时间
    return this._getAutoTheme()
  }

  /** 当前 dropdown 显示的选中 mode（auto/light/dark） */
  getSelectedMode() {
    if (this.serverMode !== 'auto') return this.serverMode  // 后台强制，选中固定
    return this._userMode  // 用户选择
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
    this._updateDropdownUI()
  }

  /**
   * 用户从 dropdown 选择模式
   * @param {'auto'|'light'|'dark'} mode
   * @param {number} [x] 点击 x 坐标（用于波纹动画）
   * @param {number} [y] 点击 y 坐标
   */
  setMode(mode, x, y) {
    if (this.serverMode !== 'auto') return  // 后台强制时不允许覆盖

    this._userMode = mode
    localStorage.setItem('wing-user-mode', mode)

    if (!document.startViewTransition) {
      this.applyTheme()
      return
    }

    const cx = x ?? window.innerWidth / 2
    const cy = y ?? 0
    const endRadius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    )

    const transition = document.startViewTransition(() => {
      this.applyTheme()
    })

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${cx}px ${cy}px)`,
            `circle(${endRadius}px at ${cx}px ${cy}px)`
          ]
        },
        { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
      )
    })
  }

  /** 同步 dropdown 触发器图标 + 选项选中状态 */
  _updateDropdownUI() {
    const selectedMode = this.getSelectedMode()
    const isDark = this.getCurrentTheme() === 'dark'

    // 更新触发器图标
    document.querySelectorAll('.theme-dropdown-trigger').forEach(trigger => {
      const sunIcon  = trigger.querySelector('.icon-sun')
      const moonIcon = trigger.querySelector('.icon-moon')
      const autoIcon = trigger.querySelector('.icon-auto')
      if (selectedMode === 'auto') {
        if (sunIcon)  sunIcon.style.display  = 'none'
        if (moonIcon) moonIcon.style.display = 'none'
        if (autoIcon) autoIcon.style.display = 'flex'
      } else if (isDark) {
        if (sunIcon)  sunIcon.style.display  = 'none'
        if (autoIcon) autoIcon.style.display = 'none'
        if (moonIcon) moonIcon.style.display = 'flex'
      } else {
        if (moonIcon) moonIcon.style.display = 'none'
        if (autoIcon) autoIcon.style.display = 'none'
        if (sunIcon)  sunIcon.style.display  = 'flex'
      }
    })

    // 更新 dropdown 选项的选中状态
    document.querySelectorAll('.theme-dropdown-item').forEach(item => {
      item.classList.toggle('selected', item.dataset.mode === selectedMode)
    })
  }

  /** 初始化 dropdown 交互 */
  initDropdown() {
    const dropdown = document.getElementById('themeDropdown')
    const trigger  = document.getElementById('themeDropdownTrigger')
    const menu     = document.getElementById('themeDropdownMenu')
    if (!dropdown || !trigger || !menu) return

    // 触发器点击：开关菜单
    trigger.addEventListener('click', (e) => {
      e.stopPropagation()
      const isOpen = menu.classList.contains('open')
      if (isOpen) {
        this._closeDropdown(menu)
      } else {
        this._openDropdown(menu)
      }
    })

    // 选项点击
    document.querySelectorAll('.theme-dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation()
        const mode = item.dataset.mode
        this._closeDropdown(menu)
        this.setMode(mode, trigger.getBoundingClientRect().right, trigger.getBoundingClientRect().top)
      })
    })

    // 点击外部关闭
    document.addEventListener('click', () => this._closeDropdown(menu))
  }

  _openDropdown(menu) {
    menu.classList.add('open')
    menu.setAttribute('aria-hidden', 'false')
  }

  _closeDropdown(menu) {
    if (!menu) return
    menu.classList.remove('open')
    menu.setAttribute('aria-hidden', 'true')
  }

  init() {
    this.applyTheme()
    this.setupListeners()
  }

  setupListeners() {
    if (this.serverMode === 'auto') {
      const now = new Date()
      const msToNextMin = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
      setTimeout(() => {
        this._tickCheck()
        setInterval(() => this._tickCheck(), 60 * 1000)
      }, msToNextMin)
    }
  }

  _tickCheck() {
    // 只有后台 auto 且用户也选 auto 时才自动切换
    if (this.serverMode !== 'auto' || this._userMode !== 'auto') return
    const nowTheme = this._getAutoTheme()
    const curApplied = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    if (nowTheme !== curApplied) this.applyTheme()
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
  window.themeManager.initDropdown()

  // 初始化移动端菜单
  if (document.querySelector('.mobile-menu')) {
    window.mobileMenu = new MobileMenu()
  }

  // 兼容：旧版 .theme-toggle 按钮（如侧边栏等地方有的话，点击切换 auto→dark→light 循环）
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modes = ['auto', 'light', 'dark']
      const cur = window.themeManager.getSelectedMode()
      const next = modes[(modes.indexOf(cur) + 1) % modes.length]
      window.themeManager.setMode(next, e.clientX, e.clientY)
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
    // 排除热力图格子（.heatmap-map__item），只处理专门用于显示时间的元素
    document.querySelectorAll('[data-date]:not(.heatmap-map__item)').forEach(el => {
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
  if (tabItems && tabItems.length > 0) {
    tabItems.forEach(item => {
      item.addEventListener('click', () => {
        tabItems.forEach(i => i.classList.remove('active'))
        item.classList.add('active')
      })
    })
  }

  // ========== 桌面端强制显示 sidebar（覆盖内联样式）==========
  (function() {
    const sidebar = document.querySelector('.sidebar[data-sidebar]');
    if (sidebar && window.matchMedia('(min-width: 768px)').matches) {
      sidebar.style.display = '';
    }
  })();

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

  // ========== B 站视频链接自动嵌入 ==========
  function initBilibiliEmbed() {
    const selectors = '.post-content, .page-content, .moment-content'
    document.querySelectorAll(selectors).forEach(container => {
      if (container.dataset.bilibiliProcessed) return
      container.dataset.bilibiliProcessed = '1'

      // 0. 将编辑器插入的 <video src="BV号或B站链接"> 的 <figure> 替换为 iframe 播放器
      container.querySelectorAll('video[src]').forEach(video => {
        const bv = extractBv(video.getAttribute('src'))
        if (!bv) return
        if (video.closest('.bilibili-embed')) return
        const figure = video.closest('figure') || video
        const wrapper = document.createElement('div')
        wrapper.className = 'bilibili-embed'
        const caption = figure.querySelector('figcaption')
        const title = caption ? caption.textContent.trim() : bv
        wrapper.innerHTML = buildIframe(bv, title)
        figure.replaceWith(wrapper)
      })

      // 1. 将包含 B 站链接的 <a> 标签转为 iframe 播放器
      container.querySelectorAll('a[href]').forEach(link => {
        const bv = extractBv(link.href)
        if (!bv) return
        if (link.closest('.bilibili-embed')) return
        const wrapper = document.createElement('div')
        wrapper.className = 'bilibili-embed'
        wrapper.innerHTML = buildIframe(bv, link.textContent.trim())
        link.replaceWith(wrapper)
      })

      // 2. 将纯文本中的 BV 号转为播放器（必须跳过已生成的 .bilibili-embed 内部文本）
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
      const textNodes = []
      while (walker.nextNode()) textNodes.push(walker.currentNode)
      textNodes.forEach(node => {
        const bv = extractBv(node.textContent.trim())
        if (!bv) return
        // 跳过已在 <a>、<video>、.bilibili-embed 内的文本
        if (node.parentElement.closest('a, video, figure, .bilibili-embed')) return
        const wrapper = document.createElement('div')
        wrapper.className = 'bilibili-embed'
        wrapper.innerHTML = buildIframe(bv, node.textContent.trim())
        node.replaceWith(wrapper)
      })
    })
  }

  function extractBv(text) {
    if (!text) return null
    // 匹配完整 B 站 URL 或纯 BV 号
    const match = text.match(/(BV[a-zA-Z0-9]{10})/)
    if (match) return match[1]
    return null
  }

  function buildIframe(bv, title) {
    const safeTitle = (title || bv).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    return '<div class="bilibili-player">'
      + '<div class="bilibili-player-title">' + safeTitle + '</div>'
      + '<div class="bilibili-player-wrapper">'
      + '<iframe src="//player.bilibili.com/player.html?bvid=' + bv + '&autoplay=0&mute=1" '
      + 'scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" '
      + 'sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts allow-popups"></iframe>'
      + '</div></div>'
  }

  initBilibiliEmbed()

  // ========== 全局视频默认静音（仅首次播放） ==========
  document.querySelectorAll('video').forEach(video => {
    video.muted = true
    video.addEventListener('play', function handler() {
      video.muted = true
      video.removeEventListener('play', handler)
    })
  })

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
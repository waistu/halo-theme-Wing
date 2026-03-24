// 导入主样式（Vite 会处理 Tailwind CSS）
import '../css/main.css'

document.addEventListener('DOMContentLoaded', function () {
  // 初始化 dayjs 相对时间
  if (dayjs) {
    dayjs.extend(dayjs_plugin_relativeTime);
    dayjs.locale('zh-cn');
    
    // 格式化所有时间
    document.querySelectorAll('.time-ago').forEach(function(el) {
      const date = el.dataset.date;
      if (date) {
        el.textContent = dayjs(date).fromNow();
      }
    });

    // 格式化瞬间时间
    document.querySelectorAll('.moment-time').forEach(function(el) {
      const date = el.dataset.date;
      if (date) {
        el.textContent = dayjs(date).fromNow();
      }
    });

    // 标签列表按文章数量排序，过滤掉数量为0的
      const topicItems = document.querySelectorAll('.topic-item');
      const topicList = document.querySelector('.topic-items');
      if (topicItems.length > 0 && topicList) {
        const items = Array.from(topicItems);
        const validItems = items.filter(item => {
          const count = parseInt(item.getAttribute('data-count'), 10);
          return !isNaN(count) && count > 0;
        });
        
        validItems.sort((a, b) => {
          const countA = parseInt(a.getAttribute('data-count'), 10) || 0;
          const countB = parseInt(b.getAttribute('data-count'), 10) || 0;
          return countB - countA;
        });
        
        if (validItems.length > 0) {
          topicList.innerHTML = '';
          validItems.forEach(item => topicList.appendChild(item));
        } else {
          topicList.parentElement.style.display = 'none';
        }
      }
      
      // 标签聚合页处理
      const tagsList = document.querySelector('.tags-list');
      if (tagsList) {
        const tagItems = tagsList.querySelectorAll('.tag-item');
        if (tagItems.length > 0) {
          const items = Array.from(tagItems);
          const validItems = items.filter(item => {
            const count = parseInt(item.getAttribute('data-count'), 10);
            return !isNaN(count) && count > 0;
          });
          
          validItems.sort((a, b) => {
            const countA = parseInt(a.getAttribute('data-count'), 10) || 0;
            const countB = parseInt(b.getAttribute('data-count'), 10) || 0;
            return countB - countA;
          });
          
          if (validItems.length > 0) {
            tagsList.innerHTML = '';
            validItems.forEach(item => tagsList.appendChild(item));
          } else {
            tagsList.parentElement.style.display = 'none';
          }
        }
      }
  } // end if (dayjs)

  const searchIcon = document.getElementById('searchIcon');
  const searchInput = document.getElementById('searchInput');
  const searchBox = document.querySelector('.search-box');

  // 搜索框相关逻辑（如果元素存在才绑定）
  if (searchIcon && searchInput && searchBox) {

  // 点击搜索图标
  searchIcon.addEventListener('click', function (e) {
    e.preventDefault(); // 永远阻止刷新

    // --------------------------
    // 方案：有插件用插件，没插件一律用原生框
    // 所有页面都一样！包括 404！
    // --------------------------
    if (window.SearchWidget) {
      // 正常页面：插件弹窗
      SearchWidget.open(searchInput.value.trim());
    } else {
      // 404 / 错误页面：展开原生框
      searchInput.classList.toggle('show');
      if (searchInput.classList.contains('show')) {
        searchInput.focus();
      }
    }
  });

  // 鼠标离开关闭
  searchBox.addEventListener('mouseleave', function () {
    if (!window.SearchWidget) {
      searchInput.classList.remove('show');
    }
  });

  // 回车搜索
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const keyword = searchInput.value.trim();
      if (!keyword) return;

      if (window.SearchWidget) {
        SearchWidget.open(keyword);
      } else {
        window.location.href = `/search?keyword=${encodeURIComponent(keyword)}`;
      }
    }
  });

  // ESC 关闭
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      searchInput.classList.remove('show');
    }
  });
  } // end if (searchIcon && searchInput && searchBox)
});
// 获取所有标签项
const tabItems = document.querySelectorAll('.tab-item');

// 遍历绑定点击事件
tabItems.forEach(item => {
  item.addEventListener('click', () => {
    // 先移除所有标签的 active 类
    tabItems.forEach(i => i.classList.remove('active'));
    // 给当前点击的标签添加 active 类
    item.classList.add('active');
  });
});





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
  
  // 绑定 Header 主题切换按钮
  document.querySelectorAll('.theme-toggle-header').forEach(btn => {
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
// 等页面加载完再执行
document.addEventListener('DOMContentLoaded', function () {
  const menuIcon = document.getElementById('menuIcon');
  const sidebar = document.querySelector('.sidebar');

  if (menuIcon && sidebar) {
    // 点击图标 → 开关侧边栏
    menuIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('active');
    });

    // 点击空白处 → 关闭
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !menuIcon.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    });
  }
});



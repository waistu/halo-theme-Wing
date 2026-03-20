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

  if (!searchIcon || !searchInput || !searchBox) return;

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


// ==================== 本地数据分页加载 ====================
let currentPage = 1;
let pageSize = 10;
let isLoading = false;
let allPosts = [];

document.addEventListener('DOMContentLoaded', function() {
  // 获取服务端渲染的所有文章数据
  allPosts = window.allPosts || [];

  // 处理骨架屏：等待一小段时间后隐藏，显示真实内容
  const skeletonContainer = document.getElementById('skeletonContainer');
  const articleList = document.getElementById('articleList');

  if (skeletonContainer && articleList) {
    setTimeout(function() {
      skeletonContainer.style.display = 'none';
      articleList.style.display = 'block';
    }, 100);
  }

  // 生成分页控件
  renderPagination();

  // 点击分页按钮
  document.addEventListener('click', function(e) {
    const pageNum = e.target.closest('.page-number');
    if (pageNum && !e.target.classList.contains('active')) {
      const page = parseInt(pageNum.dataset.page, 10);
      goToPage(page);
    }
  });
});

function renderPagination() {
  const totalPages = Math.ceil(allPosts.length / pageSize);
  const pagination = document.getElementById('pagination');
  if (!pagination) return;

  const pageNumbers = pagination.querySelector('.page-numbers');
  if (!pageNumbers) return;

  let html = '';
  for (let i = 1; i <= totalPages; i++) {
    html += `<span class="page-number ${i === 1 ? 'active' : ''}" data-page="${i}">${i}</span>`;
  }
  pageNumbers.innerHTML = html;
}

function goToPage(page) {
  if (isLoading) return;
  isLoading = true;

  currentPage = page;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const posts = allPosts.slice(start, end);

  const articleList = document.getElementById('articleList');
  if (articleList) {
    // 清空并重新渲染当前页
    articleList.innerHTML = '';

    posts.forEach(item => {
      const coverHtml = item.spec.cover ? `
        <div class="card-cover">
          <img src="${item.spec.cover}" alt="封面">
        </div>
      ` : '';
      const html = `
        <div class="noteCard">
          <a href="${item.status.permalink}" class="article-card">
            <h3 class="card-title">${item.spec.title}</h3>
            <div class="card-content">
              <p class="card-excerpt">${item.status.excerpt || '暂无摘要'}</p>
              ${coverHtml}
            </div>
            <div class="card-meta">
              <div class="meta-left">
                <span class="time-ago">${new Date(item.spec.publishTime).toLocaleDateString()}</span>
              </div>
              <span class="read-more">阅读全文</span>
            </div>
          </a>
        </div>
      `;
      articleList.insertAdjacentHTML('beforeend', html);
    });
  }

  // 更新分页高亮
  document.querySelectorAll('.page-number').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.page, 10) === page);
  });

  // 滚动到顶部
  const notesCore = document.querySelector('.notes-core');
  if (notesCore) {
    notesCore.scrollTop = 0;
  }

  isLoading = false;
}

// ==================== Halo 标签切换 + 无限加载 =========================
document.addEventListener('DOMContentLoaded', function () {
  const tabItems = document.querySelectorAll('.tab-item');
  const articleList = document.getElementById('articleList');
  const loadMore = document.getElementById('loadMore');

  // 初始化：默认显示「全部」，文章可见
  filterByType('all');

  // 标签点击切换逻辑
  tabItems.forEach(tab => {
    tab.addEventListener('click', function () {
      // 切换标签高亮
      tabItems.forEach(item => item.classList.remove('active'));
      this.classList.add('active');

      // 获取当前标签类型
      const type = this.dataset.type;
      filterByType(type);
    });
  });

  // 核心筛选函数：控制文章列表显示/隐藏
  function filterByType(type) {
    if (!articleList) return;

    // 规则：
    // - 全部 / 文章 → 显示文章列表
    // - 笔记 → 隐藏文章列表
    if (type === 'all' || type === 'post') {
      articleList.style.display = 'block'; // 显示文章
      if (loadMore) loadMore.style.display = 'block'; // 显示加载更多
    } else if (type === 'note') {
      articleList.style.display = 'none'; // 隐藏文章
      if (loadMore) loadMore.style.display = 'none'; // 隐藏加载更多
    }
  }
});


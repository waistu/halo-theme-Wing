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




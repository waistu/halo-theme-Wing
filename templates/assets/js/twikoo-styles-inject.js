// Twikoo 样式注入脚本
// 在 Twikoo 加载后，添加 HeroUI 风格的样式覆盖

(function() {
  // 等待 Twikoo 初始化完成
  function waitForTwikoo() {
    if (!window.twikoo || !document.querySelector('#twikoo-container .tk-comments-container')) {
      console.log('等待 Twikoo 加载...');
      setTimeout(waitForTwikoo, 500);
      return;
    }
    
    console.log('Twikoo 已加载，开始注入 HeroUI 风格样式');
    injectHeroUIStyles();
  }
  
  function injectHeroUIStyles() {
    // 动态样式表
    const style = document.createElement('style');
    style.id = 'twikoo-heroui-styles';
    style.textContent = `
      /* Twikoo HeroUI 风格改造 */
      #twikoo-container .tk-comments-container {
        background: var(--bg-card) !important;
        border-radius: 0.75rem !important;
        border: 1px solid var(--border-color) !important;
        padding: 1.5rem !important;
      }
      
      html.dark #twikoo-container .tk-comments-container,
      [data-theme="dark"] #twikoo-container .tk-comments-container {
        background: var(--bg-card-dark) !important;
        border-color: var(--border-color-dark) !important;
      }
      
      /* 评论输入框 */
      #twikoo-container .tk-comments-container .el-textarea__inner,
      #twikoo-container .tk-comments-container textarea {
        background: var(--bg-secondary) !important;
        border: 1px solid var(--border-color) !important;
        border-radius: 0.5rem !important;
        color: var(--text-primary) !important;
        padding: 0.75rem 1rem !important;
        font-size: 0.875rem !important;
        transition: all 0.2s ease !important;
      }
      
      #twikoo-container .tk-comments-container .el-textarea__inner:focus,
      #twikoo-container .tk-comments-container textarea:focus {
        outline: 2px solid var(--color-primary-500) !important;
        outline-offset: 2px !important;
        border-color: var(--color-primary-500) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .el-textarea__inner,
      html.dark #twikoo-container .tk-comments-container textarea,
      [data-theme="dark"] #twikoo-container .tk-comments-container .el-textarea__inner,
      [data-theme="dark"] #twikoo-container .tk-comments-container textarea {
        background: var(--bg-secondary-dark) !important;
        border-color: var(--border-color-dark) !important;
        color: var(--text-primary-dark) !important;
      }
      
      /* 提交按钮 */
      #twikoo-container .tk-comments-container .el-button--primary {
        background: var(--color-primary-600) !important;
        border-color: var(--color-primary-600) !important;
        color: white !important;
        border-radius: 0.5rem !important;
        padding: 0.625rem 1.25rem !important;
        font-weight: 500 !important;
        transition: all 0.2s ease !important;
      }
      
      #twikoo-container .tk-comments-container .el-button--primary:hover {
        background: var(--color-primary-700) !important;
        border-color: var(--color-primary-700) !important;
      }
      
      #twikoo-container .tk-comments-container .el-button--primary:active {
        background: var(--color-primary-800) !important;
        border-color: var(--color-primary-800) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .el-button--primary {
        background: var(--color-primary-500) !important;
        border-color: var(--color-primary-500) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .el-button--primary:hover {
        background: var(--color-primary-600) !important;
        border-color: var(--color-primary-600) !important;
      }
      
      /* 评论列表项 */
      #twikoo-container .tk-comments-container .tk-comment {
        border-bottom: 1px solid var(--border-color) !important;
        padding-bottom: 1.5rem !important;
        margin-bottom: 1.5rem !important;
      }
      
      #twikoo-container .tk-comments-container .tk-comment:last-child {
        border-bottom: none !important;
        margin-bottom: 0 !important;
        padding-bottom: 0 !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-comment,
      [data-theme="dark"] #twikoo-container .tk-comments-container .tk-comment {
        border-color: var(--border-color-dark) !important;
      }
      
      /* 头像 */
      #twikoo-container .tk-comments-container .tk-avatar {
        border-radius: 50% !important;
        border: 2px solid var(--border-color) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-avatar,
      [data-theme="dark"] #twikoo-container .tk-comments-container .tk-avatar {
        border-color: var(--border-color-dark) !important;
      }
      
      /* 用户名 */
      #twikoo-container .tk-comments-container .tk-author-name,
      #twikoo-container .tk-comments-container .tk-nick {
        color: var(--text-primary) !important;
        font-weight: 600 !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-author-name,
      html.dark #twikoo-container .tk-comments-container .tk-nick,
      [data-theme="dark"] #twikoo-container .tk-comments-container .tk-author-name,
      [data-theme="dark"] #twikoo-container .tk-comments-container .tk-nick {
        color: var(--text-primary-dark) !important;
      }
      
      /* 评论内容 */
      #twikoo-container .tk-comments-container .tk-content,
      #twikoo-container .tk-comments-container .tk-content p,
      #twikoo-container .tk-comments-container .tk-content div {
        color: var(--text-secondary) !important;
        line-height: 1.6 !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-content,
      html.dark #twikoo-container .tk-comments-container .tk-content p,
      html.dark #twikoo-container .tk-comments-container .tk-content div,
      [data-theme="dark"] #twikoo-container .tk-comments-container .tk-content,
      [data-theme="dark"] #twikoo-container .tk-comments-container .tk-content p,
      [data-theme="dark"] #twikoo-container .tk-comments-container .tk-content div {
        color: var(--text-secondary-dark) !important;
      }
      
      /* 时间戳 */
      #twikoo-container .tk-comments-container .tk-time,
      #twikoo-container .tk-comments-container .tk-date {
        color: var(--text-tertiary) !important;
        font-size: 0.75rem !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-time,
      html.dark #twikoo-container .tk-comments-container .tk-date,
      [data-theme="dark"] #twikoo-container .tk-comments-container .tk-time,
      [data-theme="dark"] #twikoo-container .tk-comments-container .tk-date {
        color: var(--text-tertiary-dark) !important;
      }
      
      /* 操作按钮 */
      #twikoo-container .tk-comments-container .tk-action,
      #twikoo-container .tk-comments-container .tk-action-link {
        color: var(--text-tertiary) !important;
        transition: color 0.2s ease !important;
      }
      
      #twikoo-container .tk-comments-container .tk-action:hover,
      #twikoo-container .tk-comments-container .tk-action-link:hover {
        color: var(--color-primary-500) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-action,
      html.dark #twikoo-container .tk-comments-container .tk-action-link {
        color: var(--text-tertiary-dark) !important;
      }
    `;
    
    document.head.appendChild(style);
    
    // 监控 DOM 变化，确保新加载的评论也能应用样式
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          // 检查新节点是否包含 Twikoo 元素
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1 && node.querySelector) {
              if (node.querySelector('.tk-comments-container')) {
                console.log('检测到新的 Twikoo 评论内容，确保样式应用');
              }
            }
          });
        }
      });
    });
    
    const container = document.querySelector('#twikoo-container');
    if (container) {
      observer.observe(container, { childList: true, subtree: true });
    }
  }
  
  // 启动等待
  waitForTwikoo();
})();
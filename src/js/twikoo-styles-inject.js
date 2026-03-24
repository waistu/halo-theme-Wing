// Twikoo 样式注入脚本
// 在 Twikoo 加载后，添加 HeroUI 风格的样式覆盖

(function() {
  let retryCount = 0;
  const maxRetries = 20; // 10秒超时
  
  // 等待 Twikoo 初始化完成
  function waitForTwikoo() {
    if (retryCount >= maxRetries) {
      console.warn('Twikoo 加载超时，样式注入可能失败');
      return;
    }
    
    if (!window.twikoo || !document.querySelector('#twikoo-container .tk-comments-container')) {
      retryCount++;
      console.log(`等待 Twikoo 加载... (${retryCount}/${maxRetries})`);
      setTimeout(waitForTwikoo, 500);
      return;
    }
    
    console.log('Twikoo 已加载，开始注入现代化 HeroUI 样式');
    injectHeroUIStyles();
  }
  
  // 页面加载完成后开始检测
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // 检查是否已经有 Twikoo 容器
      const hasTwikooContainer = document.querySelector('#twikoo-container');
      if (hasTwikooContainer) {
        waitForTwikoo();
      } else {
        console.log('未找到 Twikoo 容器，等待页面初始化...');
        // 如果容器是动态生成的，稍后重试
        setTimeout(waitForTwikoo, 1000);
      }
    });
  } else {
    waitForTwikoo();
  }
  
  function injectHeroUIStyles() {
    // 动态样式表
    const style = document.createElement('style');
    style.id = 'twikoo-heroui-styles';
    style.textContent = `
      /* ========== Twikoo HeroUI 现代化布局优化 ========== */
      
      /* 评论整体容器 - 现代化卡片设计 */
      #twikoo-container .tk-comments-container {
        background: var(--bg-card) !important;
        border-radius: 1rem !important;
        border: 1px solid var(--border-color) !important;
        padding: 2rem !important;
        box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.08),
                    0 2px 8px -1px rgba(0, 0, 0, 0.04) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      #twikoo-container .tk-comments-container:hover {
        box-shadow: 0 8px 30px -2px rgba(0, 0, 0, 0.12),
                    0 4px 12px -1px rgba(0, 0, 0, 0.08) !important;
        transform: translateY(-2px) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container,
      [data-theme="dark"] #twikoo-container .tk-comments-container {
        background: var(--bg-card-dark) !important;
        border-color: var(--border-color-dark) !important;
        box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.25),
                    0 2px 8px -1px rgba(0, 0, 0, 0.15) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container:hover,
      [data-theme="dark"] #twikoo-container .tk-comments-container:hover {
        box-shadow: 0 8px 30px -2px rgba(0, 0, 0, 0.35),
                    0 4px 12px -1px rgba(0, 0, 0, 0.25) !important;
      }
      
      /* 评论标题区域 */
      #twikoo-container .tk-comments-container .tk-header {
        margin-bottom: 2rem !important;
        padding-bottom: 1.5rem !important;
        border-bottom: 1px solid var(--border-color) !important;
        position: relative !important;
      }
      
      #twikoo-container .tk-comments-container .tk-header:after {
        content: '' !important;
        position: absolute !important;
        bottom: -1px !important;
        left: 0 !important;
        width: 60px !important;
        height: 2px !important;
        background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-300)) !important;
        border-radius: 1px !important;
      }
      
      #twikoo-container .tk-comments-container .tk-title {
        color: var(--text-primary) !important;
        font-size: 1.5rem !important;
        font-weight: 700 !important;
        margin: 0 !important;
        line-height: 1.2 !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-title,
      [data-theme="dark"] #twikoo-container .tk-comments-container .tk-title {
        color: var(--text-primary-dark) !important;
      }
      
      /* 评论输入区域 - 现代化设计 */
      #twikoo-container .tk-comments-container .tk-comment-input {
        margin-bottom: 2rem !important;
        background: var(--bg-secondary) !important;
        border-radius: 1rem !important;
        padding: 1.5rem !important;
        border: 1px solid var(--border-color) !important;
        transition: all 0.3s ease !important;
      }
      
      #twikoo-container .tk-comments-container .tk-comment-input:hover {
        background: var(--bg-tertiary) !important;
        border-color: var(--color-primary-300) !important;
        box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.08) !important;
      }
      
      #twikoo-container .tk-comments-container .el-textarea__inner,
      #twikoo-container .tk-comments-container textarea {
        background: transparent !important;
        border: none !important;
        border-radius: 0 !important;
        color: var(--text-primary) !important;
        padding: 0 !important;
        font-size: 0.9375rem !important;
        line-height: 1.6 !important;
        min-height: 100px !important;
        resize: vertical !important;
        transition: all 0.2s ease !important;
        width: 100% !important;
      }
      
      #twikoo-container .tk-comments-container .el-textarea__inner::placeholder,
      #twikoo-container .tk-comments-container textarea::placeholder {
        color: var(--text-tertiary) !important;
        font-size: 0.9375rem !important;
      }
      
      #twikoo-container .tk-comments-container .el-textarea__inner:focus,
      #twikoo-container .tk-comments-container textarea:focus {
        outline: none !important;
        box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.1) !important;
        background: transparent !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-comment-input,
      [data-theme="dark"] #twikoo-container .tk-comments-container .tk-comment-input {
        background: var(--bg-secondary-dark) !important;
        border-color: var(--border-color-dark) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-comment-input:hover {
        background: var(--bg-card-dark) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .el-textarea__inner,
      html.dark #twikoo-container .tk-comments-container textarea,
      [data-theme="dark"] #twikoo-container .tk-comments-container .el-textarea__inner,
      [data-theme="dark"] #twikoo-container .tk-comments-container textarea {
        color: var(--text-primary-dark) !important;
        background: transparent !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .el-textarea__inner::placeholder,
      html.dark #twikoo-container .tk-comments-container textarea::placeholder,
      [data-theme="dark"] #twikoo-container .tk-comments-container .el-textarea__inner::placeholder,
      [data-theme="dark"] #twikoo-container .tk-comments-container textarea::placeholder {
        color: var(--text-tertiary-dark) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .el-textarea__inner:focus,
      html.dark #twikoo-container .tk-comments-container textarea:focus {
        box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.15) !important;
      }
      
      /* 提交按钮和操作区域 - 现代化设计 */
      #twikoo-container .tk-comments-container .tk-comment-input .tk-row-actions {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        margin-top: 1.5rem !important;
        padding-top: 1.5rem !important;
        border-top: 1px solid var(--border-color) !important;
      }
      
      #twikoo-container .tk-comments-container .el-button--primary {
        background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600)) !important;
        border: none !important;
        color: white !important;
        border-radius: 0.75rem !important;
        padding: 0.75rem 1.5rem !important;
        font-weight: 600 !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        box-shadow: 0 4px 12px -2px rgba(244, 63, 94, 0.3) !important;
        position: relative !important;
        overflow: hidden !important;
        font-size: 0.9375rem !important;
      }
      
      #twikoo-container .tk-comments-container .el-button--primary:before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: -100% !important;
        width: 100% !important;
        height: 100% !important;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent) !important;
        transition: left 0.6s ease !important;
      }
      
      #twikoo-container .tk-comments-container .el-button--primary:hover {
        background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700)) !important;
        box-shadow: 0 6px 20px -2px rgba(244, 63, 94, 0.4) !important;
        transform: translateY(-2px) !important;
      }
      
      #twikoo-container .tk-comments-container .el-button--primary:hover:before {
        left: 100% !important;
      }
      
      #twikoo-container .tk-comments-container .el-button--primary:active {
        transform: translateY(0) !important;
        box-shadow: 0 2px 6px -1px rgba(244, 63, 94, 0.3) !important;
        transition-duration: 0.1s !important;
      }
      
      #twikoo-container .tk-comments-container .el-button--primary:disabled {
        background: linear-gradient(135deg, var(--color-gray-400), var(--color-gray-500)) !important;
        box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.1) !important;
        cursor: not-allowed !important;
        opacity: 0.7 !important;
        transform: none !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .el-button--primary {
        background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700)) !important;
        box-shadow: 0 4px 12px -2px rgba(244, 63, 94, 0.4) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .el-button--primary:hover {
        background: linear-gradient(135deg, var(--color-primary-700), var(--color-primary-800)) !important;
      }
      
      /* 评论列表项 - 现代化卡片层叠布局 */
      #twikoo-container .tk-comments-container .tk-comments {
        display: flex !important;
        flex-direction: column !important;
        gap: 1.25rem !important;
      }
      
      #twikoo-container .tk-comments-container .tk-comment {
        background: var(--bg-card) !important;
        border-radius: 1rem !important;
        border: 1px solid var(--border-color) !important;
        padding: 1.5rem !important;
        margin: 0 !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        box-shadow: 0 2px 8px -1px rgba(0, 0, 0, 0.04) !important;
        position: relative !important;
      }
      
      #twikoo-container .tk-comments-container .tk-comment:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px -2px rgba(0, 0, 0, 0.08) !important;
        border-color: var(--color-primary-200) !important;
      }
      
      #twikoo-container .tk-comments-container .tk-comment.tk-reply {
        margin-left: 2rem !important;
        background: var(--bg-secondary) !important;
        border-left: 3px solid var(--color-primary-300) !important;
        border-radius: 0.75rem !important;
      }
      
      #twikoo-container .tk-comments-container .tk-comment.tk-reply:before {
        content: '' !important;
        position: absolute !important;
        left: -1.125rem !important;
        top: 1.5rem !important;
        width: 0.75rem !important;
        height: 0.75rem !important;
        background: var(--color-primary-300) !important;
        border-radius: 50% !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-comment {
        background: var(--bg-card-dark) !important;
        border-color: var(--border-color-dark) !important;
        box-shadow: 0 2px 8px -1px rgba(0, 0, 0, 0.15) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-comment:hover {
        border-color: var(--color-primary-500) !important;
        box-shadow: 0 6px 20px -2px rgba(0, 0, 0, 0.2) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-comment.tk-reply {
        background: var(--bg-secondary-dark) !important;
        border-left-color: var(--color-primary-500) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-comment.tk-reply:before {
        background: var(--color-primary-500) !important;
      }
      
      /* 评论头部布局 - 现代化头像和信息排列 */
      #twikoo-container .tk-comments-container .tk-comment .tk-row {
        display: flex !important;
        align-items: flex-start !important;
        gap: 1rem !important;
        margin-bottom: 1rem !important;
      }
      
      /* 头像 - 现代化设计 */
      #twikoo-container .tk-comments-container .tk-avatar {
        border-radius: 50% !important;
        border: 3px solid transparent !important;
        background: linear-gradient(135deg, var(--color-primary-300), var(--color-primary-500)) border-box !important;
        -webkit-mask: 
          linear-gradient(#fff 0 0) padding-box, 
          linear-gradient(#fff 0 0) !important;
        -webkit-mask-composite: destination-out !important;
        mask-composite: exclude !important;
        width: 48px !important;
        height: 48px !important;
        flex-shrink: 0 !important;
        transition: transform 0.3s ease, box-shadow 0.3s ease !important;
      }
      
      #twikoo-container .tk-comments-container .tk-comment:hover .tk-avatar {
        transform: scale(1.05) !important;
        box-shadow: 0 4px 12px -2px rgba(244, 63, 94, 0.2) !important;
      }
      
      /* 用户信息区域 */
      #twikoo-container .tk-comments-container .tk-comment .tk-col {
        flex: 1 !important;
        min-width: 0 !important;
      }
      
      /* 用户名 - 现代化设计 */
      #twikoo-container .tk-comments-container .tk-author-name,
      #twikoo-container .tk-comments-container .tk-nick {
        color: var(--text-primary) !important;
        font-weight: 700 !important;
        font-size: 1.0625rem !important;
        margin: 0 !important;
        line-height: 1.2 !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
      }
      
      /* 管理员/作者徽章 */
      #twikoo-container .tk-comments-container .tk-author-name .tk-badge,
      #twikoo-container .tk-comments-container .tk-nick .tk-badge {
        background: linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200)) !important;
        color: var(--color-primary-700) !important;
        font-size: 0.6875rem !important;
        font-weight: 600 !important;
        padding: 0.125rem 0.5rem !important;
        border-radius: 1rem !important;
        text-transform: uppercase !important;
        letter-spacing: 0.02em !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-author-name,
      html.dark #twikoo-container .tk-comments-container .tk-nick,
      [data-theme="dark"] #twikoo-container .tk-comments-container .tk-author-name,
      [data-theme="dark"] #twikoo-container .tk-comments-container .tk-nick {
        color: var(--text-primary-dark) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-author-name .tk-badge,
      html.dark #twikoo-container .tk-comments-container .tk-nick .tk-badge {
        background: linear-gradient(135deg, var(--color-primary-800), var(--color-primary-900)) !important;
        color: var(--color-primary-100) !important;
      }
      
      /* 评论内容 - 现代化排版和交互 */
      #twikoo-container .tk-comments-container .tk-content,
      #twikoo-container .tk-comments-container .tk-content p,
      #twikoo-container .tk-comments-container .tk-content div {
        color: var(--text-secondary) !important;
        line-height: 1.7 !important;
        font-size: 0.9375rem !important;
        margin: 0 !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        hyphens: auto !important;
      }
      
      #twikoo-container .tk-comments-container .tk-content a {
        color: var(--color-primary-600) !important;
        text-decoration: none !important;
        border-bottom: 1px solid transparent !important;
        transition: all 0.2s ease !important;
      }
      
      #twikoo-container .tk-comments-container .tk-content a:hover {
        color: var(--color-primary-700) !important;
        border-bottom-color: var(--color-primary-500) !important;
      }
      
      #twikoo-container .tk-comments-container .tk-content blockquote {
        border-left: 3px solid var(--color-primary-300) !important;
        margin: 1rem 0 !important;
        padding: 0.5rem 1rem !important;
        background: var(--bg-secondary) !important;
        border-radius: 0 0.5rem 0.5rem 0 !important;
        font-style: italic !important;
        color: var(--text-secondary) !important;
      }
      
      #twikoo-container .tk-comments-container .tk-content code {
        background: var(--bg-tertiary) !important;
        color: var(--text-primary) !important;
        padding: 0.125rem 0.375rem !important;
        border-radius: 0.375rem !important;
        font-family: 'Menlo', 'Monaco', 'Courier New', monospace !important;
        font-size: 0.8125rem !important;
        border: 1px solid var(--border-color) !important;
      }
      
      /* 时间戳和元信息 - 现代化设计 */
      #twikoo-container .tk-comments-container .tk-time,
      #twikoo-container .tk-comments-container .tk-date {
        color: var(--text-tertiary) !important;
        font-size: 0.8125rem !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.25rem !important;
        margin-top: 0.5rem !important;
      }
      
      #twikoo-container .tk-comments-container .tk-time:before,
      #twikoo-container .tk-comments-container .tk-date:before {
        content: '•' !important;
        margin: 0 0.25rem !important;
        opacity: 0.5 !important;
      }
      
      /* 操作按钮区域 - 现代化设计 */
      #twikoo-container .tk-comments-container .tk-comment-actions {
        display: flex !important;
        gap: 0.75rem !important;
        margin-top: 1rem !important;
        padding-top: 1rem !important;
        border-top: 1px solid var(--border-color) !important;
      }
      
      #twikoo-container .tk-comments-container .tk-action,
      #twikoo-container .tk-comments-container .tk-action-link {
        color: var(--text-tertiary) !important;
        transition: all 0.2s ease !important;
        font-size: 0.875rem !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.25rem !important;
        padding: 0.375rem 0.75rem !important;
        border-radius: 0.5rem !important;
        background: transparent !important;
        border: none !important;
        cursor: pointer !important;
      }
      
      #twikoo-container .tk-comments-container .tk-action:hover,
      #twikoo-container .tk-comments-container .tk-action-link:hover {
        color: var(--color-primary-500) !important;
        background: var(--color-primary-50) !important;
        transform: translateY(-1px) !important;
      }
      
      #twikoo-container .tk-comments-container .tk-action:active,
      #twikoo-container .tk-comments-container .tk-action-link:active {
        transform: translateY(0) !important;
        transition-duration: 0.1s !important;
      }
      
      #twikoo-container .tk-comments-container .tk-action svg,
      #twikoo-container .tk-comments-container .tk-action-link svg {
        width: 1rem !important;
        height: 1rem !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-content,
      html.dark #twikoo-container .tk-comments-container .tk-content p,
      html.dark #twikoo-container .tk-comments-container .tk-content div,
      [data-theme="dark"] #twikoo-container .tk-comments-container .tk-content,
      [data-theme="dark"] #twikoo-container .tk-comments-container .tk-content p,
      [data-theme="dark"] #twikoo-container .tk-comments-container .tk-content div {
        color: var(--text-secondary-dark) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-content a {
        color: var(--color-primary-400) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-content a:hover {
        color: var(--color-primary-300) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-content blockquote {
        background: var(--bg-secondary-dark) !important;
        border-left-color: var(--color-primary-500) !important;
        color: var(--text-secondary-dark) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-content code {
        background: var(--bg-tertiary-dark) !important;
        color: var(--text-primary-dark) !important;
        border-color: var(--border-color-dark) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-time,
      html.dark #twikoo-container .tk-comments-container .tk-date,
      [data-theme="dark"] #twikoo-container .tk-comments-container .tk-time,
      [data-theme="dark"] #twikoo-container .tk-comments-container .tk-date {
        color: var(--text-tertiary-dark) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-action,
      html.dark #twikoo-container .tk-comments-container .tk-action-link {
        color: var(--text-tertiary-dark) !important;
      }
      
      html.dark #twikoo-container .tk-comments-container .tk-action:hover,
      html.dark #twikoo-container .tk-comments-container .tk-action-link:hover {
        color: var(--color-primary-400) !important;
        background: var(--color-primary-900) !important;
      }
      
      /* ========== 响应式优化 ========== */
      @media (max-width: 768px) {
        #twikoo-container .tk-comments-container {
          padding: 1.25rem !important;
          border-radius: 0.75rem !important;
          margin: 0 -0.5rem !important;
        }
        
        #twikoo-container .tk-comments-container .tk-comment {
          padding: 1.25rem !important;
        }
        
        #twikoo-container .tk-comments-container .tk-comment .tk-row {
          gap: 0.75rem !important;
        }
        
        #twikoo-container .tk-comments-container .tk-avatar {
          width: 40px !important;
          height: 40px !important;
        }
        
        #twikoo-container .tk-comments-container .tk-author-name,
        #twikoo-container .tk-comments-container .tk-nick {
          font-size: 1rem !important;
        }
        
        #twikoo-container .tk-comments-container .tk-comment.tk-reply {
          margin-left: 1rem !important;
        }
        
        #twikoo-container .tk-comments-container .tk-comment.tk-reply:before {
          left: -0.875rem !important;
        }
        
        #twikoo-container .tk-comments-container .tk-comment-actions {
          flex-wrap: wrap !important;
          gap: 0.5rem !important;
        }
      }
      
      /* 加载状态和空状态 */
      #twikoo-container .tk-comments-container .tk-loading,
      #twikoo-container .tk-comments-container .tk-empty {
        text-align: center !important;
        padding: 3rem 2rem !important;
        color: var(--text-tertiary) !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 1rem !important;
      }
      
      #twikoo-container .tk-comments-container .tk-loading:before {
        content: '' !important;
        width: 40px !important;
        height: 40px !important;
        border: 3px solid var(--border-color) !important;
        border-top-color: var(--color-primary-500) !important;
        border-radius: 50% !important;
        animation: tk-spin 1s linear infinite !important;
      }
      
      @keyframes tk-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      #twikoo-container .tk-comments-container .tk-empty svg {
        width: 48px !important;
        height: 48px !important;
        opacity: 0.5 !important;
      }
      
      #twikoo-container .tk-comments-container .tk-empty .tk-empty-text {
        font-size: 1rem !important;
        font-weight: 500 !important;
        margin: 0.5rem 0 !important;
      }
      
      #twikoo-container .tk-comments-container .tk-empty .tk-empty-subtext {
        font-size: 0.875rem !important;
        opacity: 0.7 !important;
      }
      
      /* 平滑过渡动画 */
      #twikoo-container .tk-comments-container .tk-comment {
        animation: tk-fade-in 0.3s ease-out !important;
      }
      
      @keyframes tk-fade-in {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
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
/* ================================================
   Meteor 流星背景 - 基于 Magic-UI 原版实现
   ================================================ */

(function () {
  'use strict';

  const CONFIG = {
    number: 50,        // 流星数量，增加密度
    minDelay: 0,
    maxDelay: 3,       // 延迟范围更大，随机分布
    minDuration: 3,
    maxDuration: 8,    // 持续时间更均匀
    angle: 35,         // 角度（度），流星从右上往左下飞
  };

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createMeteors() {
    const container = document.getElementById('meteor-bg');
    if (!container) return;

    // 清除已有流星
    container.innerHTML = '';

    for (let i = 0; i < CONFIG.number; i++) {
      const meteor = document.createElement('div');
      meteor.className = 'meteor';

      // 随机起始位置（覆盖整个屏幕区域，从右侧外开始）
      meteor.style.top = random(-20, 120) + '%';
      meteor.style.left = 'calc(100% + ' + Math.floor(random(0, 500)) + 'px)';

      // 随机动画参数（用 CSS 变量）
      const delay = random(CONFIG.minDelay, CONFIG.maxDelay);
      const duration = Math.floor(random(CONFIG.minDuration, CONFIG.maxDuration));

      meteor.style.setProperty('--meteor-delay', delay + 's');
      meteor.style.setProperty('--meteor-duration', duration + 's');
      meteor.style.setProperty('--meteor-angle', -CONFIG.angle + 'deg');
      meteor.style.animationDelay = delay + 's';
      meteor.style.animationDuration = duration + 's';

      container.appendChild(meteor);
    }
  }

  // 初始化
  function init() {
    createMeteors();

    // 监听主题变化，重新生成流星
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === 'class') {
          createMeteors();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
  }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/**
 * Meteors - Pure JavaScript Animation
 * 将 Magic UI 的 Meteors 效果转换为纯 JS 实现
 */

class Meteors {
  static defaultOptions = {
    number: 20,
    minDelay: 0.2,
    maxDelay: 1.2,
    minDuration: 2,
    maxDuration: 10,
    angle: 215,
    meteorColor: '#71717a',
    tailColor: '#71717a',
  };

  constructor(element, options = {}) {
    this.element = element;
    this.options = { ...Meteors.defaultOptions, ...options };
    this.meteors = [];
    this.init();
  }

  init() {
    const { element, options } = this;

    // 确保父元素有定位
    element.style.position = 'relative';

    // 创建容器
    this.container = document.createElement('div');
    this.container.className = 'meteors-container';

    // 生成流星
    for (let i = 0; i < options.number; i++) {
      const meteor = this.createMeteor();
      this.container.appendChild(meteor);
      this.meteors.push(meteor);
    }

    element.insertBefore(this.container, element.firstChild);
  }

  createMeteor() {
    const { options } = this;
    const meteor = document.createElement('span');
    meteor.className = 'meteor';

    // 随机位置
    const left = Math.random() * 100;
    // 随机延迟
    const delay = Math.random() * (options.maxDelay - options.minDelay) + options.minDelay;
    // 随机持续时间
    const duration = Math.floor(Math.random() * (options.maxDuration - options.minDuration) + options.minDuration);

    meteor.style.left = `${left}%`;
    meteor.style.setProperty('--meteor-delay', `${delay}s`);
    meteor.style.setProperty('--meteor-duration', `${duration}s`);
    meteor.style.setProperty('--meteor-angle', `-${options.angle}deg`);
    meteor.style.background = options.meteorColor;
    meteor.style.boxShadow = `0 0 0 1px rgba(255, 255, 255, 0.1)`;

    // 设置尾巴颜色
    const style = document.createElement('style');
    const id = 'meteor-' + Math.random().toString(36).substr(2, 9);
    meteor.id = id;
    style.textContent = `
      #${id}::before {
        background: linear-gradient(to left, ${options.tailColor}, transparent);
      }
    `;
    document.head.appendChild(style);

    return meteor;
  }

  // 销毁实例
  destroy() {
    this.meteors.forEach(meteor => {
      const style = document.querySelector(`style#${meteor.id}`);
      if (style) style.remove();
      meteor.remove();
    });
    this.container.remove();
    this.meteors = [];
  }

  // 更新配置
  update(options) {
    Object.assign(this.options, options);
    this.destroy();
    this.init();
  }
}

// 自动初始化带 data-meteors 属性的元素
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-meteors]').forEach(el => {
    const options = {};
    const dataset = el.dataset;

    if (dataset.meteorCount) options.number = parseInt(dataset.meteorCount);
    if (dataset.meteorMinDelay) options.minDelay = parseFloat(dataset.meteorMinDelay);
    if (dataset.meteorMaxDelay) options.maxDelay = parseFloat(dataset.meteorMaxDelay);
    if (dataset.meteorMinDuration) options.minDuration = parseFloat(dataset.meteorMinDuration);
    if (dataset.meteorMaxDuration) options.maxDuration = parseFloat(dataset.meteorMaxDuration);
    if (dataset.meteorAngle) options.angle = parseInt(dataset.meteorAngle);
    if (dataset.meteorColor) options.meteorColor = dataset.meteorColor;
    if (dataset.meteorTailColor) options.tailColor = dataset.meteorTailColor;

    new Meteors(el, options);
  });
});

// 导出供模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Meteors;
}

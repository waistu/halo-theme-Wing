/**
 * Ripple - Pure JavaScript Animation
 * 将 Magic UI 的 Ripple 效果转换为纯 JS 实现
 */

class Ripple {
  static defaultOptions = {
    mainCircleSize: 210,
    mainCircleOpacity: 0.24,
    numCircles: 8,
    circleGap: 70,
    opacityStep: 0.03,
    delayStep: 0.06,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    duration: 5,
  };

  constructor(element, options = {}) {
    this.element = element;
    this.options = { ...Ripple.defaultOptions, ...options };
    this.circles = [];
    this.init();
  }

  init() {
    const { element, options } = this;

    // 确保父元素有定位
    element.style.position = 'relative';

    // 创建容器
    this.container = document.createElement('div');
    this.container.className = 'ripple-container';

    // 创建圆圈
    for (let i = 0; i < options.numCircles; i++) {
      const circle = this.createCircle(i);
      this.container.appendChild(circle);
      this.circles.push(circle);
    }

    element.insertBefore(this.container, element.firstChild);
  }

  createCircle(index) {
    const { options } = this;
    const circle = document.createElement('div');
    const size = options.mainCircleSize + index * options.circleGap;
    const opacity = options.mainCircleOpacity - index * options.opacityStep;
    const delay = index * options.delayStep;

    circle.className = 'ripple-circle';
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.opacity = opacity;
    circle.style.animationDelay = `${delay}s`;
    circle.style.animationDuration = `${options.duration}s`;
    circle.style.borderColor = options.borderColor;
    circle.style.borderWidth = `${options.borderWidth}px`;
    circle.style.setProperty('--ripple-opacity', opacity);

    return circle;
  }

  // 销毁实例
  destroy() {
    this.circles.forEach(circle => circle.remove());
    this.container.remove();
    this.circles = [];
  }

  // 更新配置
  update(options) {
    Object.assign(this.options, options);
    this.destroy();
    this.init();
  }
}

// 自动初始化带 data-ripple 属性的元素
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-ripple]').forEach(el => {
    const options = {};
    const dataset = el.dataset;

    if (dataset.rippleSize) options.mainCircleSize = parseInt(dataset.rippleSize);
    if (dataset.rippleOpacity) options.mainCircleOpacity = parseFloat(dataset.rippleOpacity);
    if (dataset.rippleCount) options.numCircles = parseInt(dataset.rippleCount);
    if (dataset.rippleGap) options.circleGap = parseInt(dataset.rippleGap);
    if (dataset.rippleBorder) options.borderColor = dataset.rippleBorder;
    if (dataset.rippleDuration) options.duration = parseFloat(dataset.rippleDuration);

    new Ripple(el, options);
  });
});

// 导出供模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Ripple;
}

/**
 * Border Beam - Pure JavaScript Animation
 * 将 Magic UI 的 Border Beam 效果转换为纯 JS 实现
 */

class BorderBeam {
  static defaultOptions = {
    size: 50,
    duration: 6,
    delay: 0,
    colorFrom: '#ffaa40',
    colorTo: '#9c40ff',
    reverse: false,
    borderWidth: 1,
    initialOffset: 0,
    spring: false,
  };

  constructor(element, options = {}) {
    this.element = element;
    this.options = { ...BorderBeam.defaultOptions, ...options };
    this.beams = [];
    this.init();
  }

  init() {
    const { element, options } = this;

    // 确保父元素有相对定位和溢出隐藏
    element.classList.add('border-beam-container');
    
    // 创建遮罩层
    this.mask = document.createElement('div');
    this.mask.className = 'border-beam-mask';
    this.mask.style.borderWidth = `${options.borderWidth}px`;
    
    // 创建光束
    this.createBeam(options);
    
    // 插入到 DOM
    element.insertBefore(this.mask, element.firstChild);
  }

  createBeam(config) {
    const beam = document.createElement('div');
    beam.className = 'border-beam';
    
    if (config.reverse) {
      beam.classList.add('reverse');
    }
    
    if (config.spring) {
      beam.classList.add('spring');
    }

    // 设置 CSS 变量
    beam.style.setProperty('--beam-size', `${config.size}px`);
    beam.style.setProperty('--beam-duration', `${config.duration}s`);
    beam.style.setProperty('--beam-delay', `${config.delay}s`);
    beam.style.setProperty('--beam-color-from', config.colorFrom);
    beam.style.setProperty('--beam-color-to', config.colorTo);
    beam.style.setProperty('--beam-start', `${config.initialOffset}%`);
    beam.style.width = `${config.size}px`;

    this.mask.appendChild(beam);
    this.beams.push(beam);
    
    return beam;
  }

  // 添加第二个光束（双光束效果）
  addBeam(options = {}) {
    return this.createBeam({ ...this.options, ...options });
  }

  // 销毁实例
  destroy() {
    this.beams.forEach(beam => beam.remove());
    this.mask.remove();
    this.element.classList.remove('border-beam-container');
  }

  // 更新选项
  update(options) {
    Object.assign(this.options, options);
    this.beams.forEach(beam => beam.remove());
    this.beams = [];
    this.mask.remove();
    this.init();
  }
}

// 自动初始化带 data-border-beam 属性的元素
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-border-beam]').forEach(el => {
    const options = {};
    const dataset = el.dataset;
    
    if (dataset.beamSize) options.size = parseInt(dataset.beamSize);
    if (dataset.beamDuration) options.duration = parseFloat(dataset.beamDuration);
    if (dataset.beamDelay) options.delay = parseFloat(dataset.beamDelay);
    if (dataset.beamColorFrom) options.colorFrom = dataset.beamColorFrom;
    if (dataset.beamColorTo) options.colorTo = dataset.beamColorTo;
    if (dataset.beamReverse) options.reverse = dataset.beamReverse === 'true';
    if (dataset.beamBorderWidth) options.borderWidth = parseInt(dataset.beamBorderWidth);
    if (dataset.beamInitialOffset) options.initialOffset = parseInt(dataset.beamInitialOffset);
    if (dataset.beamSpring) options.spring = dataset.beamSpring === 'true';
    
    new BorderBeam(el, options);
  });
});

// 导出供模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BorderBeam;
}

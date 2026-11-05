(function () {
      'use strict';

      var cfgEl = document.getElementById('wingMomentsConfig');
      var CFG = {
        base: (cfgEl && cfgEl.dataset.base) || '/moments',
        loggedIn: !!(cfgEl && cfgEl.dataset.loggedIn === '1'),
        api: {
          publicList: '/apis/api.moment.halo.run/v1alpha1/moments',
          ucItem: '/apis/uc.api.moment.halo.run/v1alpha1/moments',
          upvote: '/apis/api.halo.run/v1alpha1/trackers/upvote'
        }
      };
      var API = CFG.api;

      /* ==================== 工具 ==================== */
      function debounce(fn, delay) {
        var timer = null;
        return function () {
          var ctx = this, args = arguments;
          clearTimeout(timer);
          timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
        };
      }

      function findItem(name) {
        return document.querySelector('.moment-item[data-moment-name="' + name + '"]');
      }

      /* ==================== 图片灯箱 ==================== */
      (function initImageViewer() {
        var viewer = document.getElementById('imageViewer');
        if (!viewer) return;
        var viewerImage = document.getElementById('viewerImage');
        var viewerPrev = document.getElementById('viewerPrev');
        var viewerNext = document.getElementById('viewerNext');
        var viewerClose = document.getElementById('viewerClose');
        var viewerCounter = document.getElementById('viewerCounter');
        var backdrop = viewer.querySelector('.viewer-backdrop');
        var currentImages = [], currentIndex = 0;

        document.querySelectorAll('.moment-photos .photo-item img').forEach(function (img) {
          img.style.cursor = 'zoom-in';
          img.addEventListener('click', function (e) {
            e.preventDefault();
            var container = img.closest('.moment-photos');
            if (!container) return;
            currentImages = Array.prototype.map.call(container.querySelectorAll('img'), function (i) { return i.src; });
            currentIndex = currentImages.indexOf(img.src);
            if (currentIndex < 0) currentIndex = 0;
            openViewer();
          });
        });

        function updateImage() {
          viewerImage.src = currentImages[currentIndex] || '';
          var multiple = currentImages.length > 1;
          viewerPrev.style.display = multiple ? 'block' : 'none';
          viewerNext.style.display = multiple ? 'block' : 'none';
          viewerCounter.style.display = multiple ? 'block' : 'none';
          if (multiple) viewerCounter.textContent = (currentIndex + 1) + ' / ' + currentImages.length;
        }
        function openViewer() {
          viewer.style.display = 'flex';
          updateImage();
          document.body.style.overflow = 'hidden';
        }
        function closeViewer() {
          viewer.style.display = 'none';
          document.body.style.overflow = '';
        }
        function step(delta) {
          if (!currentImages.length) return;
          currentIndex = (currentIndex + delta + currentImages.length) % currentImages.length;
          updateImage();
        }

        viewerClose.addEventListener('click', closeViewer);
        backdrop.addEventListener('click', closeViewer);
        viewerPrev.addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
        viewerNext.addEventListener('click', function (e) { e.stopPropagation(); step(1); });
        document.addEventListener('keydown', function (e) {
          if (viewer.style.display === 'none') return;
          if (e.key === 'Escape') closeViewer();
          if (e.key === 'ArrowLeft') step(-1);
          if (e.key === 'ArrowRight') step(1);
        });
      })();

      /* ==================== 视频：竖屏检测 + 弹窗 ==================== */
      (function initVideo() {
        var videoViewer = document.getElementById('videoViewer');
        if (!videoViewer) return;
        var viewerVideo = document.getElementById('viewerVideo');
        var closeBtn = document.getElementById('videoViewerClose');
        var backdrop = videoViewer.querySelector('.video-viewer-backdrop');

        function checkRatio(video) {
          var wrapper = video.closest('.moment-video-wrapper');
          if (!wrapper || !video.videoWidth || !video.videoHeight) return;
          if (video.videoWidth / video.videoHeight <= 1) {
            wrapper.classList.add('vertical');
            var overlay = wrapper.querySelector('.moment-video-overlay');
            if (overlay) overlay.style.display = 'flex';
          }
        }

        document.querySelectorAll('.moment-video').forEach(function (video) {
          video.addEventListener('loadedmetadata', function () { checkRatio(video); });
          video.addEventListener('play', function () { video.muted = true; });
          if (video.readyState >= 1) checkRatio(video);
        });

        document.querySelectorAll('.moment-video-overlay').forEach(function (overlay) {
          overlay.addEventListener('click', function () {
            var wrapper = overlay.closest('.moment-video-wrapper');
            var src = wrapper && wrapper.dataset.videoSrc;
            if (!src) return;
            viewerVideo.muted = true;
            viewerVideo.src = src;
            videoViewer.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            viewerVideo.play().catch(function () { });
          });
        });

        function close() {
          videoViewer.style.display = 'none';
          viewerVideo.pause();
          viewerVideo.removeAttribute('src');
          document.body.style.overflow = '';
        }
        closeBtn.addEventListener('click', close);
        backdrop.addEventListener('click', close);
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && videoViewer.style.display !== 'none') close();
        });
      })();

      /* ==================== 点赞 ==================== */
      (function initLike() {
        var LIKED_KEY = 'halo_moment_liked';
        var pending = false;

        function getLiked() {
          try { return JSON.parse(localStorage.getItem(LIKED_KEY) || '[]'); } catch (e) { return []; }
        }
        function saveLiked(list) {
          try { localStorage.setItem(LIKED_KEY, JSON.stringify(list)); } catch (e) { }
        }
        function isLiked(name) { return getLiked().indexOf(name) !== -1; }

        function track(method, name) {
          return fetch(API.upvote, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ group: 'moment.halo.run', plural: 'moments', name: name })
          }).then(function (res) {
            if (res.status === 204) return { upvote: null };
            return res.json().catch(function () { return { upvote: null }; });
          });
        }

        document.querySelectorAll('.moment-like').forEach(function (btn) {
          var name = btn.dataset.momentName;
          if (!name) return;
          var icon = btn.querySelector('i');
          var count = btn.querySelector('.like-count');

          if (isLiked(name) && icon) {
            icon.classList.remove('czs-heart-l');
            icon.classList.add('czs-heart', 'liked');
          }

          btn.addEventListener('click', debounce(function (e) {
            e.preventDefault();
            if (pending) return;
            pending = true;
            var liked = isLiked(name);
            var current = parseInt(count.textContent, 10) || 0;

            track(liked ? 'DELETE' : 'POST', name).then(function (result) {
              var list = getLiked();
              if (liked) {
                var idx = list.indexOf(name);
                if (idx !== -1) list.splice(idx, 1);
              } else if (list.indexOf(name) === -1) {
                list.push(name);
              }
              saveLiked(list);

              var next = (result && typeof result.upvote === 'number')
                ? result.upvote
                : (liked ? Math.max(current - 1, 0) : current + 1);
              count.textContent = next;

              if (liked) {
                icon.classList.remove('czs-heart', 'liked');
                icon.classList.add('czs-heart-l');
              } else {
                icon.classList.remove('czs-heart-l');
                icon.classList.add('czs-heart', 'liked');
              }
            }).catch(function (err) {
              console.error('点赞失败:', err);
            }).finally(function () {
              pending = false;
            });
          }, 300));
        });
      })();

      /* ==================== 评论展开/收起（互斥 + 惰性挂载） ==================== */
      (function initComments() {
        var HIDDEN = 'moment-comments-hidden';
        var openWrapper = null;
        var openBtn = null;

        /*
          评论组件由 halo:comment 服务端渲染，但 Halo 输出的是「div + 立即执行的 module 脚本」。
          模板把整块包在 <template data-lazy-comment> 里：浏览器解析时不会执行模板内的脚本，
          只有真正展开时才 clone 进文档 —— 避免一次渲染几十个评论实例、几十次 module 加载。
        */
        function mount(wrapper) {
          if (wrapper.dataset.mounted === '1') return;
          wrapper.dataset.mounted = '1';
          var tpl = wrapper.querySelector('template[data-lazy-comment]');
          if (!tpl) return;
          wrapper.appendChild(tpl.content.cloneNode(true));
        }

        function close(wrapper, btn) {
          if (!wrapper) return;
          wrapper.classList.add(HIDDEN);
          if (btn) {
            var i = btn.querySelector('i');
            if (i) i.classList.remove('active');
          }
        }

        document.querySelectorAll('.moment-comments-toggle').forEach(function (btn) {
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            var wrapper = document.getElementById('comments-wrapper-' + btn.dataset.momentName);
            if (!wrapper) return;
            var icon = btn.querySelector('i');

            if (openWrapper === wrapper && !wrapper.classList.contains(HIDDEN)) {
              close(wrapper, btn);
              openWrapper = null;
              openBtn = null;
              return;
            }
            if (openWrapper && openWrapper !== wrapper) close(openWrapper, openBtn);

            mount(wrapper);
            wrapper.classList.remove(HIDDEN);
            if (icon) icon.classList.add('active');
            openWrapper = wrapper;
            openBtn = btn;
          });
        });

        document.addEventListener('click', function (e) {
          if (openWrapper && !e.target.closest('.moment-item')) {
            close(openWrapper, openBtn);
            openWrapper = null;
            openBtn = null;
          }
        });
      })();

      /* ==================== 正文 #话题 转可点击链接 ==================== */
      (function linkifyTags() {
        var RE = /(^|[\s(（【>])#([^\s#<>"'，。！？、；：）」』】]+)/g;

        /*
          预处理：
          1. 发布器输出的 <span class="moment-tag">#标签</span> —— 拆掉 span 只留文本，
             由下方 walk 统一转为单一 <a class="tag">，避免 span>a 双层嵌套；
          2. console 端创建的 <a class="tag"> 无 href —— 补上 ?tag= 链接使其可点击。
        */
        document.querySelectorAll('.moment-content').forEach(function (root) {
          root.querySelectorAll('span.moment-tag').forEach(function (span) {
            var parent = span.parentNode;
            while (span.firstChild) parent.insertBefore(span.firstChild, span);
            parent.removeChild(span);
            parent.normalize();
          });
          root.querySelectorAll('a.tag').forEach(function (a) {
            if (!a.getAttribute('href')) {
              var text = (a.textContent || '').replace(/^#/, '').trim();
              if (text) a.href = CFG.base + '?tag=' + encodeURIComponent(text);
            }
          });
        });

        function walk(root) {
          var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
              var p = node.parentNode;
              if (!p) return NodeFilter.FILTER_REJECT;
              if (/^(A|CODE|PRE|SCRIPT|STYLE|BUTTON)$/.test(p.nodeName)) return NodeFilter.FILTER_REJECT;
              if (!node.nodeValue || node.nodeValue.indexOf('#') === -1) return NodeFilter.FILTER_REJECT;
              return NodeFilter.FILTER_ACCEPT;
            }
          });
          var nodes = [], n;
          while ((n = walker.nextNode())) nodes.push(n);

          nodes.forEach(function (textNode) {
            var text = textNode.nodeValue, frag = document.createDocumentFragment();
            var last = 0, m;
            RE.lastIndex = 0;
            while ((m = RE.exec(text))) {
              var start = m.index + m[1].length;
              var tag = m[2];
              if (start > last) frag.appendChild(document.createTextNode(text.slice(last, start)));
              var a = document.createElement('a');
              a.className = 'tag';
              a.href = CFG.base + '?tag=' + encodeURIComponent(tag);
              a.textContent = '#' + tag;
              frag.appendChild(a);
              last = start + tag.length + 1;
            }
            if (!last) return;
            if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
            textNode.parentNode.replaceChild(frag, textNode);
          });
        }

        document.querySelectorAll('.moment-content').forEach(walk);
      })();

      /* ==================== 历史数据兼容：转义标签还原 ==================== */
      (function normalizeContent() {
        document.querySelectorAll('.moment-content').forEach(function (el) {
          var html = el.innerHTML;
          if (html.indexOf('&lt;p&gt;') !== -1) {
            el.innerHTML = html
              .replace(/&lt;p&gt;/g, '<p>').replace(/&lt;\/p&gt;/g, '</p>')
              .replace(/&lt;br\s*\/?&gt;/g, '<br>');
          }
        });
      })();

      /* ==================== 自定义确认弹窗 ==================== */
      window.wingConfirm = function (message, icon) {
        return new Promise(function (resolve) {
          var modal = document.getElementById('wingConfirmModal');
          if (!modal) { resolve(window.confirm(message)); return; }
          var iconEl = modal.querySelector('.wing-confirm-icon');
          var msgEl = modal.querySelector('.wing-confirm-message');
          var okBtn = modal.querySelector('.wing-confirm-ok');
          var cancelBtn = modal.querySelector('.wing-confirm-cancel');
          var backdrop = modal.querySelector('.wing-confirm-backdrop');

          iconEl.textContent = icon || '🗑️';
          msgEl.textContent = message;
          modal.style.display = 'flex';
          requestAnimationFrame(function () { modal.classList.add('show'); });

          function close(result) {
            modal.classList.remove('show');
            setTimeout(function () { modal.style.display = 'none'; }, 200);
            okBtn.removeEventListener('click', onOk);
            cancelBtn.removeEventListener('click', onCancel);
            backdrop.removeEventListener('click', onCancel);
            document.removeEventListener('keydown', onKey);
            resolve(result);
          }
          function onOk() { close(true); }
          function onCancel() { close(false); }
          function onKey(e) {
            if (e.key === 'Escape') close(false);
            if (e.key === 'Enter') close(true);
          }
          okBtn.addEventListener('click', onOk);
          cancelBtn.addEventListener('click', onCancel);
          backdrop.addEventListener('click', onCancel);
          document.addEventListener('keydown', onKey);
        });
      };

      /* ==================== 更多菜单 ==================== */
      (function initMoreMenu() {
        document.addEventListener('click', function (e) {
          var btn = e.target.closest('.moment-more-btn');
          if (btn) {
            e.stopPropagation();
            var menu = btn.nextElementSibling;
            var isOpen = menu && menu.style.display !== 'none';
            document.querySelectorAll('.moment-more-menu').forEach(function (m) { m.style.display = 'none'; });
            if (!isOpen && menu) menu.style.display = 'block';
            return;
          }

          var item = e.target.closest('.moment-more-item');
          if (item) {
            e.stopPropagation();
            var menuEl = item.closest('.moment-more-menu');
            if (menuEl) menuEl.style.display = 'none';
            var action = item.dataset.action;
            var name = item.dataset.momentName;
            if (!action || !name) return; /* 「查看详情」是 <a>，走原生跳转 */
            if (action === 'edit') window.openEditModal(name);
            if (action === 'visibility') window.toggleMomentVisibility(name, item);
            if (action === 'delete') window.deleteMoment(name);
            return;
          }

          document.querySelectorAll('.moment-more-menu').forEach(function (m) { m.style.display = 'none'; });
        });
      })();

      /* ==================== 删除 ==================== */
      window.deleteMoment = function (name, redirect) {
        if (!name) return;
        window.wingConfirm('确定要删除这条笔记吗？删除后无法恢复。').then(function (ok) {
          if (!ok) return;
          fetch(API.ucItem + '/' + name, { method: 'DELETE', credentials: 'include' })
            .then(function (res) {
              if (!(res.ok || res.status === 204)) throw new Error('HTTP ' + res.status);
              if (redirect) { window.location.href = CFG.base; return; }
              var el = findItem(name);
              if (!el) return;
              el.style.transition = 'opacity .3s, transform .3s';
              el.style.opacity = '0';
              el.style.transform = 'scale(.96)';
              setTimeout(function () { el.remove(); }, 300);
            })
            .catch(function (err) { window.wingConfirm('删除失败：' + err.message, '❌'); });
        });
      };

      /* ==================== 可见性切换 ==================== */
      window.toggleMomentVisibility = function (name, menuItem) {
        var current = menuItem.dataset.visible || 'PUBLIC';
        var isPrivate = current === 'PRIVATE';
        var next = isPrivate ? 'PUBLIC' : 'PRIVATE';

        fetch(API.ucItem + '/' + name, { credentials: 'include' })
          .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
          .then(function (moment) {
            moment.spec.visible = next;
            return fetch(API.ucItem + '/' + name, {
              method: 'PUT',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(moment)
            });
          })
          .then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            menuItem.dataset.visible = next;
            menuItem.textContent = next === 'PUBLIC' ? '设为私密' : '设为公开';

            var item = findItem(name);
            if (!item) return;
            var headerLeft = item.querySelector('.moment-header-left');
            var badge = item.querySelector('.moment-visibility-badge');
            if (next === 'PRIVATE') {
              if (!badge && headerLeft) {
                badge = document.createElement('span');
                badge.className = 'moment-visibility-badge';
                headerLeft.appendChild(badge);
              }
              if (badge) { badge.textContent = '🔒 私密'; badge.style.display = ''; }
            } else if (badge) {
              badge.remove();
            }
          })
          .catch(function (err) { window.wingConfirm('切换失败：' + err.message, '❌'); });
      };

      /* ==================== 原位编辑 ==================== */
      window.__editingName = null;

      /* DOM → Markdown，与发布器 toMarkdown 同一套规则，
         保证行内编辑保存后 raw 里的链接/格式不丢 */
      function wingMdSerialize(node) {
        if (node.nodeType === 3) {
          return (node.nodeValue || '').replace(/\u00a0/g, ' ');
        }
        if (node.nodeType !== 1) { return ''; }
        var tag = node.tagName.toLowerCase();
        var inner = '';
        for (var i = 0; i < node.childNodes.length; i++) {
          inner += wingMdSerialize(node.childNodes[i]);
        }
        switch (tag) {
          case 'br':
            return '\n';
          case 'b':
          case 'strong':
            return inner.trim() ? '**' + inner + '**' : inner;
          case 'i':
          case 'em':
            return inner.trim() ? '*' + inner + '*' : inner;
          case 'u':
            return inner.trim() ? '__' + inner + '__' : inner;
          case 's':
          case 'strike':
          case 'del':
            return inner.trim() ? '~~' + inner + '~~' : inner;
          case 'code':
            return inner ? '`' + inner + '`' : '';
          case 'pre': {
            var code = (node.textContent || '').replace(/\u00a0/g, ' ').replace(/\n+$/, '');
            return '\n```\n' + code + '\n```\n';
          }
          case 'blockquote': {
            var q = inner.replace(/[ \t]+\n/g, '\n').replace(/\n{2,}/g, '\n').trim();
            return q ? '\n> ' + q.split('\n').join('\n> ') + '\n' : '';
          }
          case 'ul':
          case 'ol': {
            var lines = [];
            for (var j = 0; j < node.children.length; j++) {
              var li = node.children[j];
              if (li.tagName.toLowerCase() !== 'li') { continue; }
              var text = wingMdSerialize(li).replace(/\n+/g, ' ').trim();
              if (!text) { continue; }
              lines.push((tag === 'ul' ? '- ' : (lines.length + 1) + '. ') + text);
            }
            return lines.length ? '\n' + lines.join('\n') + '\n' : '';
          }
          case 'li':
            return inner;
          case 'div':
          case 'p':
            return '\n' + inner;
          case 'span':
            if (node.classList && node.classList.contains('moment-media')) { return ''; }
            if (node.classList && node.classList.contains('moment-tag')) {
              var tagName = (node.textContent || '').replace(/^#/, '').trim();
              return tagName ? '#' + tagName : '';
            }
            return inner;
          case 'a': {
            var href = (node.getAttribute('href') || '').trim();
            var label = inner.replace(/\n+/g, ' ').trim();
            if (!href) { return inner; }
            return '[' + (label || href) + '](' + href + ')';
          }
          case 'img':
            return '';
          /* 富文本遗留的媒体节点保留原样，避免编辑后 raw 丢视频 */
          case 'figure':
          case 'video':
          case 'audio':
          case 'iframe':
            return node.outerHTML;
          default:
            return inner;
        }
      }
      function wingMomentToMarkdown(root) {
        return wingMdSerialize(root)
          .replace(/\r\n?/g, '\n')
          .replace(/[ \t]+\n/g, '\n')
          .replace(/\n{3,}/g, '\n\n')
          .replace(/^\n+/, '')
          .replace(/\s+$/, '');
      }

      window.openEditModal = function (name) {
        if (window.__editingName || !name) return;
        var item = findItem(name);
        if (!item) return;
        var contentEl = item.querySelector('.moment-content');
        if (!contentEl) return;

        window.__editingName = name;
        contentEl.style.display = 'none';

        var wrapper = document.createElement('div');
        wrapper.className = 'inline-edit-wrapper';
        wrapper.innerHTML =
          '<div class="publisher-toolbar"><div class="toolbar-main">' +
          '<button class="toolbar-btn toolbar-format" type="button" title="话题" data-action="tag">#</button>' +
          '<div class="emoji-btn-wrapper"><button class="toolbar-btn" type="button" title="表情" data-action="emoji">☺</button><div class="emojis-mart-container" style="display:none;"></div></div>' +
          '<div class="toolbar-separator"></div>' +
          '<button class="toolbar-btn toolbar-format" type="button" title="粗体" data-action="bold"><b>B</b></button>' +
          '<button class="toolbar-btn toolbar-format" type="button" title="斜体" data-action="italic"><i>I</i></button>' +
          '<button class="toolbar-btn toolbar-format" type="button" title="插入链接" data-action="link">🔗</button>' +
          '<div class="toolbar-more-wrapper"><button class="toolbar-btn toolbar-more" type="button" title="更多" data-action="more">⋯</button>' +
          '<div class="toolbar-more-menu" style="display:none;">' +
          '<button class="toolbar-more-item" type="button" data-action="underline">下划线</button>' +
          '<button class="toolbar-more-item" type="button" data-action="strike">删除线</button>' +
          '<div class="toolbar-more-divider"></div>' +
          '<button class="toolbar-more-item" type="button" data-action="blockquote">❝ 引用</button>' +
          '<button class="toolbar-more-item" type="button" data-action="code">行内代码</button>' +
          '<button class="toolbar-more-item" type="button" data-action="codeblock">{ } 代码块</button>' +
          '<div class="toolbar-more-divider"></div>' +
          '<button class="toolbar-more-item" type="button" data-action="ul">☰ 无序列表</button>' +
          '<button class="toolbar-more-item" type="button" data-action="ol">1. 有序列表</button>' +
          '</div></div></div></div>' +
          '<div class="moment-editor" contenteditable="true" data-placeholder="写点什么..."></div>' +
          '<div class="inline-link-panel moment-link-panel" style="display:none;">' +
          '<div class="moment-link-title">插入链接</div>' +
          '<input type="text" class="moment-link-input js-link-text" placeholder="链接文字（留空则显示网址）" />' +
          '<input type="url" class="moment-link-input js-link-url" placeholder="https://example.com" />' +
          '<div class="moment-link-actions">' +
          '<button type="button" class="moment-link-cancel js-link-cancel">取消</button>' +
          '<button type="button" class="moment-link-confirm js-link-confirm">确定</button>' +
          '</div></div>' +
          '<div class="inline-edit-actions"><button class="inline-edit-cancel" type="button">取消</button>' +
          '<button class="inline-edit-save" type="button">保存</button></div>';

        contentEl.parentNode.insertBefore(wrapper, contentEl);

        var ed = wrapper.querySelector('.moment-editor');
        var saveBtn = wrapper.querySelector('.inline-edit-save');
        var cancelBtn = wrapper.querySelector('.inline-edit-cancel');

        /* ---- 链接面板：文字 + 地址两个输入框 ---- */
        var linkPanel = wrapper.querySelector('.inline-link-panel');
        var linkTextInput = wrapper.querySelector('.js-link-text');
        var linkUrlInput = wrapper.querySelector('.js-link-url');
        var savedLinkRange = null;

        function normalizeUrl(raw) {
          var url = (raw || '').trim();
          if (!url) { return ''; }
          if (/^(https?:|mailto:|tel:|\/|#)/i.test(url)) { return url; }
          if (/^[\w-]+(\.[\w-]+)+/.test(url)) { return 'https://' + url; }
          return url;
        }
        function nearestAnchor(node) {
          var el = node && node.nodeType === 1 ? node : (node ? node.parentNode : null);
          while (el && el !== ed) {
            if (el.tagName && el.tagName.toLowerCase() === 'a') { return el; }
            el = el.parentNode;
          }
          return null;
        }
        function openLinkPanel() {
          var sel = window.getSelection();
          var inEditor = sel && sel.rangeCount && sel.anchorNode && ed.contains(sel.anchorNode);
          var existing = inEditor ? nearestAnchor(sel.anchorNode) : null;
          savedLinkRange = inEditor ? sel.getRangeAt(0).cloneRange() : null;

          if (existing) {
            linkPanel.dataset.mode = 'edit';
            linkTextInput.value = (existing.textContent || '').trim();
            linkUrlInput.value = existing.getAttribute('href') || '';
          } else {
            linkPanel.dataset.mode = 'insert';
            linkTextInput.value = inEditor ? sel.toString().trim() : '';
            linkUrlInput.value = '';
          }
          linkPanel.style.display = 'block';
          setTimeout(function() {
            if (linkTextInput.value) { linkUrlInput.focus(); linkUrlInput.select(); }
            else { linkTextInput.focus(); linkTextInput.select(); }
          }, 0);
        }
        function closeLinkPanel() {
          linkPanel.style.display = 'none';
          savedLinkRange = null;
        }
        function applyLink() {
          var url = normalizeUrl(linkUrlInput.value);
          var label = (linkTextInput.value || '').trim();
          if (!url) { linkUrlInput.focus(); return; }

          var sel = window.getSelection();
          if (savedLinkRange) {
            sel.removeAllRanges();
            sel.addRange(savedLinkRange);
          }
          var anchor = sel && sel.rangeCount ? nearestAnchor(sel.anchorNode) : null;

          if (linkPanel.dataset.mode === 'edit' && anchor) {
            anchor.setAttribute('href', url);
            anchor.setAttribute('target', '_blank');
            anchor.setAttribute('rel', 'noopener noreferrer');
            if (label) { anchor.textContent = label; }
          } else {
            var aEl = document.createElement('a');
            aEl.setAttribute('href', url);
            aEl.setAttribute('target', '_blank');
            aEl.setAttribute('rel', 'noopener noreferrer');
            aEl.textContent = label || url;
            if (sel && sel.rangeCount && ed.contains(sel.anchorNode)) {
              var range = sel.getRangeAt(0);
              range.deleteContents();
              range.insertNode(aEl);
              var after = document.createRange();
              after.setStartAfter(aEl);
              after.collapse(true);
              sel.removeAllRanges();
              sel.addRange(after);
            } else {
              ed.appendChild(aEl);
            }
          }
          closeLinkPanel();
          ed.focus();
        }
        wrapper.querySelector('.js-link-confirm').addEventListener('click', function(e) { e.preventDefault(); applyLink(); });
        wrapper.querySelector('.js-link-cancel').addEventListener('click', function(e) { e.preventDefault(); closeLinkPanel(); });
        linkTextInput.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') { e.preventDefault(); linkUrlInput.focus(); linkUrlInput.select(); }
          else if (e.key === 'Escape') { e.preventDefault(); closeLinkPanel(); }
        });
        linkUrlInput.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') { e.preventDefault(); applyLink(); }
          else if (e.key === 'Escape') { e.preventDefault(); closeLinkPanel(); }
        });

        ed.textContent = '加载中...';
        fetch(API.ucItem + '/' + name, { credentials: 'include' })
          .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
          .then(function (d) {
            if (d.spec && d.spec.content) {
              /* 所见即所得：加载渲染后的 html（raw 是 Markdown 源码，直接展示会导致保存后链接变纯文本） */
              ed.innerHTML = d.spec.content.html || (d.spec.content.raw || '');
            }
            ed.focus();
          })
          .catch(function (e) { ed.textContent = '加载失败：' + e.message; });

        function insert(text) {
          ed.focus();
          document.execCommand('insertText', false, text);
        }
        function wrap(tagName) {
          ed.focus();
          var sel = window.getSelection();
          if (!sel.rangeCount || !sel.toString().length) return;
          var range = sel.getRangeAt(0);
          var node = document.createElement(tagName);
          node.textContent = sel.toString();
          range.deleteContents();
          range.insertNode(node);
          range.setStartAfter(node);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }

        wrapper.querySelector('.toolbar-main').addEventListener('click', function (e) {
          var btn = e.target.closest('[data-action]');
          if (!btn) return;
          e.preventDefault();
          var action = btn.dataset.action;
          if (action === 'tag') insert('#');
          else if (action === 'bold') wrap('b');
          else if (action === 'italic') wrap('i');
          else if (action === 'link') { openLinkPanel(); }
          else if (action === 'underline') wrap('u');
          else if (action === 'strike') wrap('s');
          else if (action === 'blockquote') wrap('blockquote');
          else if (action === 'code') wrap('code');
          else if (action === 'codeblock') insert('\n```\n代码\n```\n');
          else if (action === 'ul') insert('\n- ');
          else if (action === 'ol') insert('\n1. ');
          else if (action === 'more') {
            var menu = wrapper.querySelector('.toolbar-more-menu');
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
          }
        });

        wrapper.querySelector('.toolbar-more-menu').addEventListener('click', function (e) {
          var item = e.target.closest('[data-action]');
          if (!item) return;
          var action = item.dataset.action;
          if (action === 'codeblock') insert('\n```\n代码\n```\n');
          else if (action === 'ul') insert('\n- ');
          else if (action === 'ol') insert('\n1. ');
          else wrap(action);
          this.style.display = 'none';
        });

        var emojiPanel = wrapper.querySelector('.emojis-mart-container');
        var picker = null;
        wrapper.querySelector('[data-action="emoji"]').addEventListener('click', function (e) {
          e.stopPropagation();
          if (emojiPanel.style.display !== 'none') { emojiPanel.style.display = 'none'; return; }
          emojiPanel.style.display = 'block';
          if (picker) return;
          function build() {
            picker = new window.EmojiMart.Picker({
              onEmojiSelect: function (emoji) { insert(emoji.native); emojiPanel.style.display = 'none'; },
              autoFocus: false,
              locale: 'zh'
            });
            emojiPanel.appendChild(picker);
          }
          if (window.EmojiMart) { build(); return; }
          var script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/emoji-mart@5.6.0/dist/browser.js';
          script.onload = build;
          document.head.appendChild(script);
        });

        ed.addEventListener('keydown', function (e) {
          if (!(e.ctrlKey || e.metaKey)) return;
          if (e.key === 'b') { e.preventDefault(); wrap('b'); }
          if (e.key === 'i') { e.preventDefault(); wrap('i'); }
          if (e.key === 'u') { e.preventDefault(); wrap('u'); }
        });

        /* 编辑态点击链接：不跳转，打开面板可直接改文字/地址 */
        ed.addEventListener('click', function (e) {
          var a = e.target.closest && e.target.closest('a');
          if (!a || !ed.contains(a)) { return; }
          e.preventDefault();
          var range = document.createRange();
          range.selectNodeContents(a);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          openLinkPanel();
        });

        function cleanup() {
          wrapper.remove();
          contentEl.style.display = '';
          window.__editingName = null;
        }

        cancelBtn.addEventListener('click', cleanup);

        saveBtn.addEventListener('click', function () {
          var raw = wingMomentToMarkdown(ed);
          var html = ed.innerHTML.trim();
          if (!raw && !html) return;
          saveBtn.disabled = true;
          saveBtn.textContent = '保存中...';

          fetch(API.ucItem + '/' + name, { credentials: 'include' })
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
            .then(function (moment) {
              moment.spec.content.raw = raw;
              moment.spec.content.html = html;
              return fetch(API.ucItem + '/' + name, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(moment)
              });
            })
            .then(function (r) {
              if (!r.ok) throw new Error('HTTP ' + r.status);
              contentEl.innerHTML = ed.innerHTML;
              cleanup();
            })
            .catch(function (err) { window.wingConfirm('保存失败：' + err.message, '❌'); })
            .finally(function () {
              saveBtn.disabled = false;
              saveBtn.textContent = '保存';
            });
        });
      };
    })();

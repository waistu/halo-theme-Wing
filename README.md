# Wing

> 一款简洁流畅、数据驱动的 Halo 2 响应式主题，移植自 WordPress 主题 Wing。

[在线预览](https://blog.waistu.com/) · [使用文档](https://blog.waistu.com/doc/wing/index.html) · [应用市场](https://www.halo.run/store/apps/app-rumygxyf) · [问题反馈](https://github.com/waistu/halo-theme-Wing/issues)

## 简介

Wing 由 WordPress 主题 [Tokinx/Wing](https://github.com/tokinx/Wing) 移植而来。模板层按 Halo 的数据模型重写，调用 Finder API 与插件扩展点；样式与交互在原版基础上重新实现，保留原作克制的留白与圆角卡片风格，并补齐笔记、归档、友链、文档等 Halo 侧的内容形态。

前端为 Thymeleaf + Tailwind CSS v4 + 原生 JavaScript。`normalize.css`、`dayjs`、`markdown-it`、`emoji-mart`、草莓图标等资源全部随主题打包，不引用 CDN 与在线字体；构建产物已包含在主题包内，安装时不需要 Node.js 环境。

当前版本 `1.1.0`，适配 Halo 2.x。

## 功能

### 首页与导航

- 首页支持两种形态：**笔记模式**（默认，首页即瞬间流）与**文章模式**。另一种内容通过独立页面访问，路径可在设置中指定。
- 顶部内容 Tab 由公共片段统一生成，始终指向每类内容的唯一入口；文章页尚未创建时自动降级到归档页，不再弹出配置提示。
- 左侧导航与作者卡、右侧热力图分区展示，可分别关闭。
- 移动端为固定毛玻璃顶栏 + 底部内容 Tab，桌面端为三栏布局。
- 首页可选开启流星背景动画。

### 笔记（瞬间）

- 首页首屏服务端渲染 20 条，超出部分引导至 `/moments` 完整列表，列表支持分页。
- 独立详情页 `/moments/{name}`，带独立标题、描述与社交卡片信息。
- 支持点赞、图片灯箱、B 站视频弹窗。评论区默认折叠，点击后才挂载评论组件，首屏不为每条笔记创建评论实例。
- 标签筛选使用插件下发的真实计数，点击后由服务端按 `?tag=` 筛选，不再前端重渲染。
- 登录用户可在首页直接发布。发布框支持加粗、斜体、下划线、删除线、有序/无序列表、链接插入、标签、emoji 与图片附件（最多 9 个），并可切换公开/私密。
- 未安装瞬间插件时，首页笔记区与发布框自动隐藏，不产生空白与报错。

### 文章阅读

- 侧栏双页签：文章目录与站点导航。目录按 h1–h6 层级自动生成，滚动时高亮当前小节。
- 文章点赞（Halo upvote 接口）、评论、canonical 声明。
- 代码块样式兼容 Shiki、Prettify 等插件，主题不额外注入高亮脚本，避免与插件重复渲染。
- 归档、分类、标签页均为服务端渲染，并支持原生分页。

### 外观

- 8 套强调色：玫瑰红、蓝、翠绿、紫罗兰、琥珀橙、灰褐、洋红、石板灰。切换配色时按钮、链接、高亮、渐变数字等一并更新。
- 明暗模式支持自动（按设定时段切换）、浅色、深色三种策略。首屏在 `<head>` 内联初始化，避免刷新闪白；用户手动切换后写入本地存储，优先于服务端配置。
- 配色与明暗均通过 CSS 变量实现，未使用的页面不会残留硬编码色值。
- 登录页可单独配置 Logo 与左侧背景图；已适配注册、登出、密码重置、二次验证（TOTP）与通行密钥（Passkey）页面。
- 404 页面为独立的卡片布局，提供返回上一页与回到首页入口。

### 评论与互动

- 评论通道可选 Halo 内置评论或 Twikoo。
- 支持匿名评论开关、预设昵称与邮箱、隐私协议链接。
- Twikoo 使用官方 CSS 的本地化版本，样式并入主题样式表，不产生外部请求。

## 页面覆盖

| 模板 | 页面 | 说明 |
| --- | --- | --- |
| `index.html` | 首页 | 笔记或文章模式，含发布框、Tab、热力图 |
| `posts.html` | 文章列表 | 笔记首页模式下的文章入口，建议路径 `/posts` |
| `post.html` | 文章详情 | 目录侧栏、点赞、评论 |
| `page.html` | 独立页面 | 通用单页布局 |
| `archives.html` | 归档 | 按年月分组，支持分页 |
| `categories.html` / `category.html` | 分类集合 / 分类文章 | — |
| `tags.html` / `tag.html` | 标签集合 / 标签文章 | — |
| `moments.html` / `moment.html` | 瞬间列表 / 瞬间详情 | 需瞬间插件 |
| `friends.html` | 朋友圈 | 链接管理插件的订阅动态 |
| `links.html` | 友链 | 链接管理插件分组 + 折叠说明 |
| `about.html` | 关于 | 卡片式个人主页 |
| `douban.html` | 豆瓣 | 需豆瓣插件 |
| `docs.html` / `doc.html` / `doc-catalog.html` | 文档列表 / 详情 / 目录 | 需 Docsme 插件 |
| `login.html` / `signup.html` / `logout.html` | 认证页面 | 登录、注册、登出入口 |
| `gateway_fragments/` | 认证网关片段 | 供 Halo 认证网关复用的页面外壳与表单 |
| `password-reset/` / `challenges/two-factor/` | 认证补充页 | 邮件重置密码、二次验证 |
| `error/404.html` | 404 | — |
| `layout.html` | 插件页面布局 | Halo 2.26 的页面布局契约，供插件前台页复用主题外壳 |

## 安装

1. Halo 控制台 → 主题 → 安装主题，上传 `theme-wing-1.1.0.zip`；或在应用市场搜索 **Wing** 安装。
2. 在主题列表启用主题，打开站点首页确认渲染正常。
3. 按需安装插件：瞬间（笔记）、链接管理（友链与朋友圈）、搜索、Docsme（文档）、豆瓣。
4. 进入主题设置，按「基础设置 → 首页布局 → 外观与样式」的顺序完成站点标题、首页形态与配色配置。

升级时直接上传新版本主题包覆盖即可，主题设置与内容数据不受影响。

## 主题设置

| 分组 | 可配置项 |
| --- | --- |
| 基础设置 | 站点标题、备案号、建站时间（用于计算运行天数） |
| 首页布局 | 左右侧栏开关、首页内容（笔记/文章）、文章页路径 |
| 外观与样式 | 流星效果、默认文章封面、登录页 Logo 与背景、主题模式与自动切换时段、8 套配色方案 |
| 评论与互动 | 评论通道、匿名评论、预设昵称与邮箱、隐私协议链接、Twikoo 配置 |
| 友链页面 | 页面评论开关、折叠说明分组（标题、副标题、内容、默认展开） |
| 作者卡片 | 名称、头像、封面、简介、关注按钮、社交链接 |
| 关于 | 个人卡片（状态、简历、打字机文案、信息行、按钮、统计数字）与地图卡片（明暗两张图、定位文案） |

## 自定义页面模板

新建页面时在右侧「页面模板」中选择：

| 模板 | 适用场景 |
| --- | --- |
| 朋友圈页面模板 | 用链接管理插件的订阅动态生成朋友圈时间线 |
| 友链页面模板 | 展示链接管理插件的分组友链，支持卡片状态样式 |
| 关于页面模板 | 展示个人资料、统计与地图卡片 |
| 文章列表页面模板 | 首页设为笔记模式时，用此模板创建文章列表页（建议 `/posts`） |

友链卡片的推荐/失联样式通过链接分组的注解 `theme-wing/link-group-style` 控制，取值为 `default`、`recommend`、`lost`。

## 插件适配

| 插件 | 用途 | 未安装时表现 |
| --- | --- | --- |
| 瞬间（PluginMoments） | 首页笔记流、`/moments` 列表与详情、发布框 | 笔记区与发布框自动隐藏 |
| 链接管理 | 友链分组、朋友圈订阅时间线 | 页面显示插件提示，不报错 |
| 搜索（PluginSearchWidget） | 顶栏搜索弹窗 | 回退到 `/search?keyword=` 页面 |
| Docsme | 文档详情、列表与目录 | 需插件提供模板片段 |
| 豆瓣 | 豆瓣页面 | 显示友好提示 |
| Twikoo | 评论通道 | 使用 Halo 内置评论 |

## 本地开发

```bash
npm install
npm run build    # 输出到 templates/assets/dist/
npm run dev      # 样式开发预览
```

- 样式入口为 `src/css/main.css`，交互入口为 `src/js/main.js`，产物写入 `templates/assets/dist/`。
- 修改模板后，在开发环境的 Halo 中关闭 Thymeleaf 缓存即可预览；修改 `theme.yaml`、`settings.yaml` 后需在控制台重载主题配置。
- 发布新版本时先递增 `theme.yaml` 的 `version`，再打 tag 触发 GitHub Actions：构建 → 打包 `theme-wing-<版本>.zip` → 发布 Release → 提交应用市场。
- Tailwind CSS v4 的 `cssMinify` 已关闭（lightningcss 不支持媒体查询中使用 CSS 变量），请勿改回默认值。

## 兼容性

- `theme.yaml` 声明 `requires: >=2.0.0`，实际验证版本为 Halo 2.26.0。
- `layout.html` 是 Halo 2.26 引入的插件页面布局契约，低于该版本时 Halo 会忽略此文件，不影响其他页面。
- 界面在 Chromium 内核下按移动端与桌面端两个视口实际检查；未对 Safari、Firefox 及全部历史文章格式做穷举测试。
- 评论流程使用 Halo 标准扩展点，正式启用前建议在目标站点核对所用评论插件的登录与发布流程。

## 更新日志

完整记录见 [RELEASE_NOTES.md](./RELEASE_NOTES.md)。

### 1.1.0

- 新增瞬间详情页、豆瓣页面模板与 Docsme 文档页适配
- 首页与列表改为服务端渲染，首屏更快、对 SEO 更友好
- 发表框在所有带 Tab 的列表页统一展示，支持公开/私密切换
- 适配链接管理插件：朋友圈改用订阅动态，友链移除原自助提交插件支持
- 修复瞬间标签重复渲染、子目录部署下标签链接失效、未安装瞬间插件时首页空白等问题
- 收敛内容 Tab 至公共片段，为重复内容页面补全 canonical

### 1.0.8

- 适配 Passkey 认证插件，完善二次验证、注册等认证页面

## 第三方资源与许可

- 原主题 [Tokinx/Wing](https://github.com/tokinx/Wing)：MIT License
- 图标：草莓图标（免费开源版），随主题内置 iconfont
- 视觉参考：Magic UI 的部分动效与渐变组件，已改写为纯 HTML + Tailwind，无 React 依赖
- 内置前端库：Normalize.css、dayjs（含 relativeTime 与 zh-cn）、markdown-it、emoji-mart
- 本项目基于原主题重构与移植，整体以 **GNU General Public License v3.0（GPL-3.0）** 开源，详见 [LICENSE](./LICENSE)

## 致谢

- [Tokinx/Wing](https://github.com/tokinx/Wing)
- [Halo](https://github.com/halo-dev/halo)
- [Halo 主题开发文档](https://docs.halo.run/developer-guide/theme/prepare)

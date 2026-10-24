# C++ 刷题 · 微信小程序 v2.2

一个能刷 C++ 语法、算法、面试题的微信小程序。
**核心变化：题库不再打包进包体，开源题全部改成运行时在线加载。**

> v2.2：修「每个入口左上角都写顺序练习」——标题改为「分类 · 模式」，题头加分类小标签。
> **想装到手机上用 / 发布给别人用 → 看 [`UPLOAD.md`](./UPLOAD.md)**（含域名白名单、审核类目、常见报错对照）。

---

## 一、题库策略（重点）

| | v1.x | v2.1 |
|---|---|---|
| 开源题 | 打包进 `data/bank-open.js`（36KB） | **删除，改为在线拉取** |
| 包体内题目 | 352 题 | **600 题**（中文，每题带详细解析） |
| 新增题目 | 必须重新发版 | 改远程 JSON 即可，或直接在 App 里粘贴导入 |
| 离线可用 | 是 | 是（拉过一次就有缓存） |

**运行流程**

```
首次启动
  └─ 读本地缓存 Storage（cpp_quiz_remote_v1）
       ├─ 有 → 直接当题库用（秒开，不联网）
       └─ 无 → 后台静默拉取「已启用的源」
                └─ adapter 统一格式 → 按 id 去重 → 写入 Storage
                     └─ 失败也不打扰，内置 600 题照样能刷
```

- 缓存位置：`wx.setStorageSync('cpp_quiz_remote_v1', [...])`
- 每个源的加载情况：`cpp_quiz_src_state_v1`
- 哪些源被启用：`cpp_quiz_src_on_v1`

---

## 一·补、题库构成（600 题）

| 分类 | 题量 | 覆盖 |
|---|---|---|
| C++ 语法基础 | 200 | 类型 / 指针引用 / 内存与对象模型 / 类与继承 / STL / 模板 / 智能指针 |
| 算法与数据结构 | 200 | 复杂度 / 排序查找 / 链表栈队列 / 树堆 / 图 / DP / 字符串 / 位运算 |
| 面试真题 | 200 | 多态原理 / 构造析构 / 编译链接 / 内存排查 / 系统与网络 / 工程实践 |
| C++ 新特性 | 0 | 由在线源 `modern` 提供（约 52 题） |

**每题都有解析，且解析讲的是「为什么」**，不是重复一遍答案。比如：

- 错选 `int* const p` 时，解析会说清 `const` 在 `*` 左边还是右边分别锁住什么、口诀怎么记
- 错选「volatile 可以保证原子性」，解析会指出它只阻止编译器优化、不提供内存屏障，并说明跨语言混淆的来源
- 算法题会同时给出「这个做法为什么错」和「正确做法的复杂度从哪来」

题目按分类拆成 6 个分片文件（`data/bank/p1..p6.js`），每片 50 题，方便继续往里加。

## 二、在线源清单

在 `utils/sources.js` 的 `CATALOG` 里维护，运行时可在「题库」页单独开关 / 单独刷新。

| id | 名称 | 类型 | 说明 |
|---|---|---|---|
| cpp11 | C++11 核心特性 | json | celilygt/cpp-quiz（MIT），jsDelivr 加速 |
| cpp14 | C++14 特性 | json | 同上 |
| cpp17 | C++17 特性 | json | 同上 |
| cpp20 | C++20 特性 | json | 同上 |
| otdb | 计算机基础 | api | Open Trivia DB，`category=18`，英文，每次随机 |

> 实测（2026-10）：4 个 C++ 源可解析出 **52 题**（配对题无法转选择题，自动丢弃）；
> Open Trivia DB 一次可取 50 题。合计约 100 题，加上内置 600 题 **≈ 700 题**。

**加一个新源只要往 `CATALOG` 里加一条：**

```js
{
  id: 'mybank',
  name: '我的题库',
  desc: '一句话说明',
  tag: 'C++',
  type: 'json',            // json | api | text
  cat: 'syntax',           // syntax | algo | interview | modern
  url: 'https://cdn.jsdelivr.net/gh/xxx/yyy@main/questions.json',
  on: true                 // 是否默认启用
}
```

`type: 'text'` 表示抓回来的是纯文本 / Markdown，会走「粘贴导入」同一套解析器，
也就是**任何写成像样的题库 README 都能直接当源用**。

---

## 三、格式适配

`utils/adapter.js` 把各家格式统一成本项目结构：

```js
{ id, cat, type: 'single'|'multi'|'judge', level: 1|2|3, q, code?, options: [], ans: [idx], exp }
```

已支持：

1. 本项目标准格式
2. celilygt/cpp-quiz（`true_false` / `multiple_choice`，`matching` 丢弃）
3. 通用下标格式 `{ question, options, answer: 0 }`
4. 通用文本答案 `{ correct_answer: 'B' }` / `{ correct: '文本' }`
5. Open Trivia DB（`correct_answer` + `incorrect_answers`，含 HTML 实体解码）

**id 用题干 hash 生成**（`hashId`），所以重复加载同一个源、重复导入同一段文本都不会重复入库。

---

## 四、真机联网的两条路

小程序真机强制校验 request 合法域名，二选一：

**A. 配域名（简单）**

小程序后台 → 开发管理 → 服务器域名 → request 合法域名，加入：

```
https://cdn.jsdelivr.net
https://opentdb.com
```

**B. 云函数代理（可接任意源）**

1. 开通云开发
2. 把 `app.js` 里的 `CLOUD_ENV` 填成你的环境 ID
3. 上传部署 `cloudfunctions/fetchBank`
4. 上传时选「上传并部署：云端安装依赖」

配好后 `globalData.cloudReady = true`，请求会自动走服务端代理，不受域名白名单限制。

---

## 五、页面

| 页面 | 路径 | 作用 |
|---|---|---|
| 首页 | `pages/index` | 数据概览、模拟考试入口、练习方式、分类进度、最近记录 |
| 答题 | `pages/practice` | 题干 / 选项 / 即时判卷 / 解析 / 答题卡 / 限时交卷 |
| 结果 | `pages/result` | 百分制成绩、逐题展开解析 |
| 复习 | `pages/wrong` | 错题本 + 收藏，下划线 Tab |
| 题库 | `pages/bank` | 在线源开关、单源刷新、自定义链接、清空在线题 |
| 书架 | `pages/books` | **新增**：免费可读的 C++ 书 + 经典书目与获取方式 |
| 导入 | `pages/import` | 粘贴牛客 / 网页 / 文档里的题，自动结构化 |

答题规则：单选即时判卷；多选点「确认作答」；**未作答不弹窗、直接计错**；考试模式交卷统一出分。

---

## 六、设计规范（v2.x 全量重写）

从深色渐变改成**纸感浅色**，参考「不背单词」的阅读器质感：

```
纸底 #F6F3EC   卡片 #FFFFFF   墨黑 #1B1917
次级 #6E695F   弱化 #A8A296   分隔线 rgba(27,25,23,.08)
强调 #D9542B（全站唯一强调色）
正确 #2E7D5B   错误 #C1463B
```

- **字号阶梯**：大数字 64–168rpx（Georgia 衬线）/ 题干 40rpx / 正文 27–30rpx / 辅助 21–23rpx
- **不用渐变、不用彩色图标块、不用重阴影**，层次靠明度与 1rpx 细线
- 数字与英文统一 Georgia，中文用系统字重 500
- 动效只有 `fadeUp` / `fadeIn` / `sheetUp`，280–340ms
- 自定义导航栏（`navigationStyle: custom`），页面自己让出状态栏高度

---

## 七、本地跑起来

**微信开发者工具**

1. 导入本目录（`cpp-quiz`）
2. 详情 → 本地设置 → 勾选「不校验合法域名」（开发期）
3. 真机预览前记得配好合法域名或云函数

**只想看界面**

直接用浏览器打开 `preview.html`：

- 手机外框 + 可点按交互，按 v2.0 设计稿 1:1 复刻
- 首页 → 点任意入口都能跳转
- 题库页点「刷新已启用题库」会**真的去 jsDelivr 拉一次**，验证这条链路通不通
- 也可以用 `preview.html#practice`、`#bank`、`#result`、`#wrong`、`#import` 直达某一页

---

## 八、目录

```
cpp-quiz/
├── app.js / app.json / app.wxss        全局入口、路由、设计系统
├── data/questions.js                   题库装配（CORE + 分片 + 运行时在线题）
├── data/bank/p1..p6.js                 扩充题库 6 个分片，每片 50 题
├── data/books.js                       书架数据
├── utils/
│   ├── adapter.js                      多格式适配 + 纯文本解析 + hash id
│   ├── sources.js                      在线源清单与加载管线
│   ├── store.js                        本地记录 / 错题 / 收藏 / 会话
│   └── ui.js                           状态栏高度
├── pages/{index,practice,result,wrong,import,bank}/
├── cloudfunctions/fetchBank/           服务端代理（绕过域名白名单）
├── preview.html                        浏览器预览（含真实在线拉取）
└── sample-questions.json               题库格式示例
```

---

## 九、书单与版权

「书架」页（`pages/books`）收录两类，**不打包任何书籍文件**：

**免费可读（6 本）** —— 作者或基金会免费授权发布，点开是原始地址

| 书 | 说明 |
|---|---|
| 现代 C++ 教程（欧长坤） | CC BY-NC-ND 4.0，中文 PDF，走作者官网直链 |
| C++ Core Guidelines | Stroustrup & Sutter，开源文档 |
| cppreference | 权威速查 |
| C++ FAQ（isocpp） | 常见问题详解 |
| Google C++ Style Guide | 工业界规范 |
| LearnCpp | 免费长教程 |

PDF 用 `wx.downloadFile` + `wx.openDocument` 在线打开，不占包体；在线文档复制链接到浏览器看。

**经典必读（6 本）** —— C++ Primer、Effective C++、The C++ Programming Language、
C++ Concurrency in Action、深度探索 C++ 对象模型、STL 源码剖析。

> **这六本是仍在售的版权书，本程序不提供电子版，也不做转存。**
> 书架里只给书目、作者、出版社和「为什么值得读」，点「怎么拿到」可复制书名去电商或图书馆检索。
> 想支持作者就买正版；学校图书馆基本都有这几本。

真机要能直接打开 PDF，需在小程序后台把 `changkun.de` 加进 **downloadFile 合法域名**。

### 书到底怎么打开（三档）

| 书型 | 点一下发生什么 | 依赖 |
|---|---|---|
| PDF（现代 C++ 教程） | `wx.downloadFile` 下载 → `wx.openDocument` 用微信自带阅读器打开 | downloadFile 域名白名单 |
| 在线文档（Core Guidelines / cppreference / FAQ / Style / LearnCpp） | 弹出说明 → 复制链接 → 粘贴到任意聊天框点开 | 无 |
| 版权书（Primer 等 6 本） | 弹出书目信息 → 复制书名去电商 / 图书馆搜 | 无 |

小程序里**不能**直接拉起系统浏览器，也没有内置浏览器，所以外链只有「复制链接→粘到聊天框」这一条稳的路；
想一步到位只能配 `web-view` 业务域名，或把 PDF 托管到自己已备案的域名下再进白名单。
下载失败时页面会明确指出缺哪个域名，并给一键复制，不会只丢一句报错。

预览页 `preview.html#books` 是浏览器环境，浮层里的「在线阅读 PDF ↗」直接新开标签，不受这些限制。

## 十、已知限制

- 中文 C++ 选择题**没有**可公开下载的开源题库，所以这一类只能靠「粘贴导入」补齐（牛客的题就是这样进来的）
- celilygt 里 7 道配对题无法转成选择题，会被跳过
- Open Trivia DB 是英文计算机常识题，不是 C++ 专项，默认关闭
- 牛客没有对个人开放的题库 API（开放平台 OAuth 只发给企业），抓页面违反 ToS，所以没做

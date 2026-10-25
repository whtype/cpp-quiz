# 给接手这个项目的 AI 的说明

> 这份文件是给外部 AI（GPT / Claude 等）看的。你要改的是**一个已经上线、有真人在用的微信小程序**，
> 不是从零搭的原型。改之前请把「硬约束」读完，那几条都是踩过坑换来的，破了就会当场宕机。

---

## 一、这是什么

C++ 刷题微信小程序，题库 600 题（中文，每题带「为什么」式解析），支持语法 / 算法 / 面试三个分类、
模拟考试、错题本、收藏、书架（12 本 C++ 书）、在线题库运行时加载、粘贴导入。

- **技术栈**：微信小程序原生（无框架、无构建工具、无 npm 依赖）
- **代码风格**：ES5 为主（`var` + `function`），刻意不用箭头函数/模板字符串，兼容老基础库
- **设计语言**：纸感浅色。米白底 `#F6F3EC` / 白卡 / 墨黑字 `#1B1917` / 唯一暖橙 `#D9542B`
  （另有正确绿 `#2E7D5B`、错误红 `#C1463B`）。**无渐变、无阴影堆叠，层次靠 1rpx 细线**
- **字体**：数字和标题用 Georgia / Songti SC 衬线，正文用系统无衬线

---

## 二、目录

```
app.js / app.json / app.wxss      全局入口、路由表、设计系统（CSS 变量都在 app.wxss 顶部）
pages/
  index/        首页：统计、考试入口、练习方式、分类进度、选题数浮层
  practice/     答题页：题干/选项/即时判卷/解析/答题卡/限时/续做/跳过
  result/       结果页：百分制 + 逐题解析
  wrong/        错题本 + 收藏（下划线 Tab）
  bank/         在线题库管理：源开关、单源刷新、自定义链接、清空
  books/        书架：6 本可读 + 6 本版权书
  import/       粘贴导入：把牛客/网页题目转成结构化
data/
  questions.js  题库装配（CORE 数组 + 引用 bank 分片 + 运行时在线题）
  bank/p1..p6.js  扩充题库，每片 50 题
  books.js      书架数据
utils/
  adapter.js    多格式适配 + 纯文本解析 + 题干 hash 生成稳定 id
  sources.js    在线源清单与加载管线
  store.js      本地存储：记录/错题/收藏/进度/偏好
  ui.js         状态栏高度、返回兜底、toast
check.js        静态自检（19 项），改完必须跑
tools/
  test-resume.js    行为回归（16 项）
  shot-mobile.js    真机尺寸截图（DevTools 协议）
  md2qa.js / bank-build.js  题库生产流水线
preview.html    浏览器版界面（GitHub Pages 线上就是它），和小程序端是两套独立实现
```

---

## 三、硬约束（破了会出线上事故）

### 1. `.nav` 必须保持 `box-sizing: content-box`

自定义导航栏 `navigationStyle: custom`，`.nav` 的高度是 88rpx + 状态栏高度（由 `utils/ui.js` 内联注入 padding-top）。

全局 `view{box-sizing:border-box}` 会把 `height` 算进 `padding-top`，导致内容区被压成 0，
**左上角返回键被顶进状态栏，灵动岛机型（iPhone 15/16/17 系列）看得见但点不动**。
这个问题线上出现过两次，用户原话「点击左上角返回没反应」。

### 2. 题目 `id` 绝对不能变

错题本、收藏、练习进度存的全是**题目 id 字符串**（`wx.setStorageSync`）。
改 id = 用户所有历史记录失效。新增题目请用新 id，不要改旧的。

### 3. 题目 id 索引不能只在 `setExtra()` 里建

`data/questions.js` 的 `MAP` 必须在模块加载时就 `rebuild()` 一次。
曾经只在 `setExtra()`（在线题库加载完）里建索引，结果没有在线缓存时 `MAP` 恒空，
**错题本点进去全是空白**。`getByIds()` 里还有线性扫描回填兜底，别删。

### 4. WXML 不支持 HTML 标签

只能用 `view / text / image / scroll-view / button / input / textarea / picker`。
写成 `<div>` `<span>` `<b>` `<i>` `<br>` 会编译失败或渲染异常。
标题加粗请用 `<text class="xxx">` 配 `font-weight`。

### 5. 题目 `options` 必须写真实内容

不能只写 `['A','B','C','D']` 而把内容塞进 `code`——页面上会渲染成「A A」。
`check.js` 已经加了这条守卫，违反会报错。

### 6. 改完必须跑这两条

```bash
node check.js            # 19 项静态检查，退出码非 0 即失败
node tools/test-resume.js # 16 项行为断言（续做/题数/跳过/浮层）
```

`check.js` 会查：页面四件套是否齐全、全量 JS 语法、WXML 非法标签、
**用到但没定义的样式类**、题库完整性、id 索引、错题/收藏全链路、导航栏 box-sizing。

---

## 四、几个业务规则（不是 bug，别"修"）

| 规则 | 说明 |
|---|---|
| 未作答直接算错 | 单选即时判卷；考试模式未答按错计，不弹窗、不拦截 |
| 未作答可以跳过 | 底栏按钮未答时显示「跳过」，答了显示「下一题」。**别再改回「请先作答」拦截** |
| 退出能续做 | 进度存 `cpp_quiz_progress_v1`，只存题目 id 列表不存题面；`resumable()` 判据是 `0 < idx < len-1`（答到最后一题就不该再续） |
| 交卷清进度 | `finish()` 里会 `clearProgress()`，否则下次还问"要不要继续一轮做完的" |
| 题库不打包 | 开源题运行时从 CDN 拉（jsDelivr），包体只有 600 道中文题。别把在线题写回 `data/` |

---

## 五、Storage 键位

| Key | 内容 |
|---|---|
| `cpp_quiz_stats_v1` | 已答、正确率、各分类进度 |
| `cpp_quiz_session_v1` | 最近一次练习结果 |
| `cpp_quiz_remote_v1` | 在线题库缓存 |
| `cpp_quiz_src_on_v1` / `cpp_quiz_src_state_v1` | 各在线源开关 / 加载状态 |
| `cpp_quiz_progress_v1` | 未完成的练习进度（续做用） |
| `cpp_quiz_pref_v1` | 偏好（上次选题数） |
| `cpp_quiz_wrong_v1` / `cpp_quiz_fav_v1` | 错题 / 收藏的 id 列表 |

改键名要做迁移，否则老用户数据全丢。

---

## 六、改 UI 之前

有两套界面，改一处要同步另一处，否则线上预览和真机对不上：

1. **小程序**：`pages/*/*.wxml` + `*.wxss`（WXSS 用 rpx）
2. **浏览器预览**：`preview.html`（CSS 用 px，内嵌了题库渲染和全部交互）

改完用真机尺寸看一眼，别用 `chrome --window-size=390,844` 直接截——
Chrome 窗口有最小宽度（约 500px），截出来是 512 视口被裁掉右边，**看着像页面溢出，实际没坏**。
用项目里的脚本：

```bash
node tools/shot-mobile.js --url "file:///.../preview.html?still=1" --out shot.png
```

`?still=1` 关掉过渡动画，抓的是终态。
`preview.html` 还支持 `?pick=seq`（直开选题浮层）、`?resume=1`（显示续做条）、`#practice-algo` 之类的深链，方便逐页验收。

---

## 七、版权红线

- 书架里 6 本免费书（CC BY-NC-SA / 作者授权）只给原始链接，**不打包 PDF**
- 6 本版权书（Effective Modern C++ 等）**只给书目信息**，不提供电子版
- 在线题库源必须确认 LICENSE 可非商用转载；无 LICENSE 的仓库（如 0voice）不能用
- 牛客 / 力扣的题**不能抓**，ToS 明确禁止。要加题只能自己写或从合规源导入

/**
 * 项目自检：node check.js
 * 上传前跑一遍，把「静默变空」「点不动」这类问题在本地就拦下来。
 *
 * 起因：题库的 id 索引（MAP）只在 setExtra() 里构建，没有在线题库缓存时永远是空的，
 * 于是错题本 / 收藏 / 结果页查题全部返回空 —— 界面上就是「有 12 道错题，点进去一道没有」。
 * 这个脚本会直接跑通那条链路。
 */

var fs = require('fs')
var path = require('path')
var vm = require('vm')

var ROOT = __dirname
var pass = 0
var fail = 0
var notes = []

function ok(msg) { pass += 1; console.log('  \u2713 ' + msg) }
function bad(msg) { fail += 1; console.log('  \u2717 ' + msg) }
function title(t) { console.log('\n' + t) }

/* ---------------- 1. 文件结构 ---------------- */
title('[1] 文件结构')

var appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'))
var pages = appJson.pages || []
if (!pages.length) bad('app.json 里没有 pages')
pages.forEach(function (p) {
  var miss = ['js', 'wxml', 'wxss', 'json'].filter(function (ext) {
    return !fs.existsSync(path.join(ROOT, p + '.' + ext))
  })
  if (miss.length) bad(p + ' 缺 ' + miss.join('/'))
  else ok(p)
})
if (!appJson.pages[0]) bad('启动页缺失')
else ok('启动页 ' + appJson.pages[0])

/* ---------------- 2. JS 语法 ---------------- */
title('[2] JS 语法')

function walk(dir, out) {
  fs.readdirSync(dir).forEach(function (name) {
    if (name === 'node_modules' || name === '.git' || name === 'cloudfunctions') return
    var full = path.join(dir, name)
    var st = fs.statSync(full)
    if (st.isDirectory()) walk(full, out)
    else if (/\.js$/.test(name)) out.push(full)
  })
  return out
}

var jsFiles = walk(ROOT, [])
jsFiles.forEach(function (f) {
  try {
    new vm.Script(fs.readFileSync(f, 'utf8'), { filename: f })
  } catch (e) {
    bad(path.relative(ROOT, f) + ' 语法错误：' + e.message)
  }
})
if (fail === 0) ok(jsFiles.length + ' 个 js 文件语法正确')

/* ---------------- 3. WXML 非法标签 + 样式类是否都存在 ---------------- */
title('[3] WXML 标签与样式类')

var appWxss = fs.readFileSync(path.join(ROOT, 'app.wxss'), 'utf8')
var appCls = {}
;(appWxss.match(/\.[a-zA-Z][\w-]*/g) || []).forEach(function (c) { appCls[c.slice(1)] = 1 })

var wxmlBad = 0
var clsBad = 0
pages.forEach(function (p) {
  var f = path.join(ROOT, p + '.wxml')
  if (!fs.existsSync(f)) return
  var s = fs.readFileSync(f, 'utf8')
  var hits = s.match(/<(div|span|p|i|b|br|em|strong)\b/g)
  if (hits) {
    wxmlBad += 1
    bad(p + '.wxml 用了小程序不支持的标签：' + hits.join(' '))
  }

  // class 用了但没有任何 wxss 定义 → 元素等于裸奔，排版会塌
  var local = {}
  var wf = path.join(ROOT, p + '.wxss')
  if (fs.existsSync(wf)) {
    ;(fs.readFileSync(wf, 'utf8').match(/\.[a-zA-Z][\w-]*/g) || []).forEach(function (c) { local[c.slice(1)] = 1 })
  }
  var used = {}
  ;(s.match(/class="[^"]*"/g) || []).forEach(function (m) {
    m.slice(7, -1).replace(/\{\{[^}]*\}\}/g, ' ').split(/\s+/).forEach(function (t) {
      if (t) used[t] = 1
    })
  })
  var miss = Object.keys(used).filter(function (c) { return !local[c] && !appCls[c] })
  if (miss.length) {
    clsBad += 1
    bad(p + '.wxml 有未定义的样式类：' + miss.join(', '))
  }
})
if (!wxmlBad) ok('没有 div/span/p/i/b 之类非法标签')
if (!clsBad) ok('所有用到的样式类都有定义')

/* ---------------- 4. 题库完整性 ---------------- */
title('[4] 题库')

var Q = require(path.join(ROOT, 'data/questions.js'))
var qs = Q.QUESTIONS
var seen = {}
var problems = []
qs.forEach(function (q) {
  if (!q.id) problems.push('有题目缺 id')
  else if (seen[q.id]) problems.push('id 重复：' + q.id)
  else seen[q.id] = 1
  if (!q.options || !q.options.length) problems.push((q.id || '?') + ' 没有选项')
  if (!q.ans || !q.ans.length) problems.push((q.id || '?') + ' 没有答案')
  else q.ans.forEach(function (i) {
    if (i < 0 || i >= (q.options || []).length) problems.push((q.id || '?') + ' 答案下标越界')
  })
  if (q.type === 'judge' && (q.options || []).length !== 2) problems.push((q.id || '?') + ' 判断题应为 2 个选项')
  if (!q.exp || q.exp.length < 15) problems.push((q.id || '?') + ' 解析过短')
})
if (problems.length) problems.slice(0, 8).forEach(bad)
else ok('共 ' + qs.length + ' 题，id 唯一、答案合法、解析齐全')
Q.CATEGORIES.forEach(function (c) {
  notes.push('    ' + c.name + '：' + Q.countByCat(c.key) + ' 题')
})

/* ---------------- 5. id 索引必须开箱可用 ---------------- */
title('[5] 题目 id 索引（曾导致错题本全空）')

var sample = [qs[0].id, qs[Math.floor(qs.length / 2)].id, qs[qs.length - 1].id]
var found = Q.getByIds(sample)
if (found.length !== sample.length) {
  bad('未调用 setExtra 时查不到题（索引没建）：' + sample.join(',') + ' → 只查到 ' + found.length)
} else {
  ok('不用 setExtra 也能按 id 查题')
}

/* ---------------- 6. 错题本 / 收藏 全链路 ---------------- */
title('[6] 错题本 / 收藏 全链路')

var db = {}
global.wx = {
  getStorageSync: function (k) { return db[k] },
  setStorageSync: function (k, v) { db[k] = v },
  removeStorageSync: function (k) { delete db[k] }
}
var store = require(path.join(ROOT, 'utils/store.js'))

store.record(sample[0], false)
store.record(sample[1], false)
store.toggleFav(sample[2])

var wrongIds = store.getWrongIds()
var wrongQs = Q.getByIds(wrongIds)
if (wrongQs.length !== wrongIds.length) bad('错题本有 ' + wrongIds.length + ' 条，只能查到 ' + wrongQs.length + ' 道题')
else ok('错题重练拿到 ' + wrongQs.length + ' 道题')

var favQs = Q.getByIds(store.getFavIds())
if (!favQs.length) bad('收藏练习拿到 0 道题')
else ok('收藏练习拿到 ' + favQs.length + ' 道题')

// 模拟在线题库换源：旧 id 失效应被自愈清理
store.record('ghost-not-exist', false)
var all = store.getByIds ? null : null
var valid = Q.getByIds(store.getWrongIds()).map(function (q) { return q.id })
var pruned = store.prune('wrong', valid)
if (pruned !== 1) bad('失效 id 没被清理（清掉 ' + pruned + ' 条）')
else ok('失效 id 自动清理：清掉 ' + pruned + ' 条，剩 ' + store.getWrongIds().length + ' 条')

/* ---------------- 7. 在线题库合并后仍在 ---------------- */
title('[7] setExtra 之后内置题还在')

Q.setExtra([{ id: '__online__', cat: 'modern', type: 'single', level: 1, q: '在线题', options: ['a', 'b'], ans: [0], exp: '这是在线题解析' }])
if (!Q.getById(sample[0])) bad('setExtra 后内置题丢了')
else if (!Q.getById('__online__')) bad('setExtra 后在线题查不到')
else ok('内置题与在线题同时可查，共 ' + Q.QUESTIONS.length + ' 题')
Q.setExtra([])

/* ---------------- 8. 导航栏 box-sizing ---------------- */
title('[8] 自定义导航栏')

var wxss = fs.readFileSync(path.join(ROOT, 'app.wxss'), 'utf8')
var navBlock = (wxss.match(/\.nav\s*\{[^}]*\}/) || [''])[0]
if (!/content-box/.test(navBlock)) {
  bad('.nav 没有 content-box —— padding-top 会把 88rpx 吃掉，返回键会顶进状态栏（灵动岛机型点不动）')
} else {
  ok('.nav 用 content-box，状态栏高度叠加在 88rpx 之上')
}
if (!/nav-back/.test(wxss)) bad('找不到 .nav-back 样式')
else ok('.nav-back 存在')

/* ---------------- 汇总 ---------------- */
console.log('\n' + '-'.repeat(46))
if (notes.length) console.log(notes.join('\n'))
console.log('通过 ' + pass + ' 项' + (fail ? '，失败 ' + fail + ' 项' : '，全部通过'))
process.exit(fail ? 1 : 0)

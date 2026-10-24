/**
 * test-resume.js —— 练习进度的回归测试（node tools/test-resume.js）
 *
 * 覆盖用户提的三个点：
 *   1. 退出后再进来，能接着上次那题（答案也还在）
 *   2. 题数可选（10 / 20 / 50 / 全部）
 *   3. 没作答也能直接跳过
 *
 * 用假的 wx + Page 把页面逻辑跑起来，不依赖开发者工具。
 */

var path = require('path')
var ROOT = path.join(__dirname, '..')

var db = {}
var pageDef = null
var lastNav = ''

global.wx = {
  getWindowInfo: function () { return { statusBarHeight: 62, windowWidth: 440 } },
  getStorageSync: function (k) { return db[k] },
  setStorageSync: function (k, v) { db[k] = v },
  removeStorageSync: function (k) { delete db[k] },
  setNavigationBarTitle: function () {},
  showToast: function () {},
  showModal: function () {},
  showLoading: function () {},
  hideLoading: function () {},
  navigateBack: function () {},
  reLaunch: function () {},
  redirectTo: function (o) { lastNav = o.url },
  navigateTo: function (o) { lastNav = o.url }
}
global.Page = function (def) { pageDef = def }
global.getApp = function () { return { globalData: {} } }

var pass = 0
var fail = 0

function chk(name, cond, extra) {
  if (cond) { pass += 1; console.log('  \u2713 ' + name) }
  else { fail += 1; console.log('  \u2717 ' + name + (extra ? '（' + extra + '）' : '')) }
}

function load(file) {
  var full = path.join(ROOT, file)
  delete require.cache[require.resolve(full)]
  require(full)
  var p = Object.create(pageDef)
  p.data = JSON.parse(JSON.stringify(pageDef.data))
  p.setData = function (o) {
    var self = this
    Object.keys(o).forEach(function (k) {
      if (k.indexOf('.') > 0) {
        var seg = k.split('.')
        var cur = self.data
        for (var i = 0; i < seg.length - 1; i++) cur = cur[seg[i]]
        cur[seg[seg.length - 1]] = o[k]
      } else {
        self.data[k] = o[k]
      }
    })
  }
  return p
}

/* ---------------- 1. 题数可选 ---------------- */
console.log('\n[1] 题数可选')

var p10 = load('pages/practice/practice.js')
p10.onLoad({ mode: 'seq', cat: 'syntax', count: '10' })
chk('count=10 → 出 10 题', p10.data.total === 10, '实际 ' + p10.data.total)
p10.onUnload()
db = {}

var pAll = load('pages/practice/practice.js')
pAll.onLoad({ mode: 'seq', cat: 'syntax', count: '0' })
chk('count=0 → 该分类全部（200）', pAll.data.total > 10, '实际 ' + pAll.data.total)
pAll.onUnload()
db = {}

/* ---------------- 2. 退出后接着做 ---------------- */
console.log('\n[2] 退出后再进来接着做')

var a = load('pages/practice/practice.js')
a.onLoad({ mode: 'seq', cat: 'syntax', count: '10' })
chk('首次进入从第 1 题开始', a.data.idx === 0 && a.data.resumed === false)

a.tapOption({ currentTarget: { dataset: { i: 0 } } })
a.next()
chk('答完第 1 题后到第 2 题', a.data.idx === 1)

var firstId = a.data.list[0].id
a.onUnload()  // 模拟：退出小程序 / 返回首页

var b = load('pages/practice/practice.js')
b.onLoad({ mode: 'seq', cat: 'syntax', count: '10' })
chk('重进恢复到最后的位置', b.data.idx === 1 && b.data.resumed === true,
  'idx=' + b.data.idx + ' resumed=' + b.data.resumed)
chk('已答的答案还在', !!(b.answers[firstId] && b.answers[firstId].picked.length),
  JSON.stringify(b.answers[firstId] || null))
chk('题目总数沿用上次的快照', b.data.total === 10, '实际 ' + b.data.total)

/* 换分类不能串进度 */
var c = load('pages/practice/practice.js')
c.onLoad({ mode: 'seq', cat: 'algo', count: '10' })
chk('换分类从头开始', c.data.idx === 0 && c.data.resumed === false)
c.onUnload()

/* 重新开始 */
var d = load('pages/practice/practice.js')
d.onLoad({ mode: 'seq', cat: 'syntax', count: '10', restart: '1' })
chk('restart=1 时从头开始', d.data.idx === 0 && d.data.resumed === false)
d.onUnload()

/* ---------------- 3. 跳过 ---------------- */
console.log('\n[3] 不作答也能跳过')

var e = load('pages/practice/practice.js')
e.onLoad({ mode: 'seq', cat: 'syntax', count: '10', restart: '1' })
var before = e.data.idx
e.next()   // 一次都没点选项
chk('未作答点「下一题」直接前进', e.data.idx === before + 1,
  before + ' → ' + e.data.idx)

/* 跳到最后一题并交卷 */
while (e.data.idx < e.data.total - 1) e.next()
e.next()
chk('最后一题交卷会跳到结果页', /result/.test(lastNav), lastNav)

var progressed = db['cpp_quiz_progress_v1']
chk('交卷后清掉进度（不该再「继续」到已完成的轮次）', !progressed)

/* ---------------- 4. 首页选题数浮层 ---------------- */
console.log('\n[4] 首页选题数')

var home = load('pages/index/index.js')
home.onLoad()
home.setData = home.setData || function () {}
var fake = { currentTarget: { dataset: { mode: 'seq', cat: 'syntax' } } }
home.goPractice(fake)
chk('点练习会先弹选题数浮层', home.data.picker.open === true)
chk('默认题数是 10/20/50/全部 之一',
  [10, 20, 50, 0].indexOf(home.data.picker.count) >= 0, String(home.data.picker.count))
home.pickCount({ currentTarget: { dataset: { n: '50' } } })
chk('能选中 50 题', home.data.picker.count === 50)
home.startPractice()
chk('开始后跳转带上 count', /count=50/.test(lastNav) && /restart=1/.test(lastNav), lastNav)

console.log('\n' + '-'.repeat(40))
console.log('通过 ' + pass + ' 项' + (fail ? '，失败 ' + fail + ' 项' : '，全部通过'))
process.exit(fail ? 1 : 0)

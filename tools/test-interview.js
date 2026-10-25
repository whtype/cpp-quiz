/* Real page logic with only the WeChat boundary replaced. Run: node tools/test-interview.js */
var assert = require('assert')
var Q = require('../data/questions')
var store = require('../utils/store')
var adapter = require('../utils/adapter')
var db, definition, nav, ticks, now
var passed = 0, failed = 0
var originalNow = Date.now
var lastModal
Date.now = function () { return now }
global.setInterval = function (fn) { ticks.push(fn); return ticks.length }
global.clearInterval = function () {}
global.wx = {
  getWindowInfo: function () { return { statusBarHeight: 62, windowWidth: 390 } },
  getStorageSync: function (k) { return db[k] },
  setStorageSync: function (k, v) { db[k] = JSON.parse(JSON.stringify(v)) },
  removeStorageSync: function (k) { delete db[k] },
  setNavigationBarTitle: function () {}, showToast: function () {},
  showModal: function (o) { lastModal = o },
  navigateTo: function (o) { nav = o.url }, redirectTo: function (o) { nav = o.url }
}
global.Page = function (d) { definition = d }
global.getApp = function () { return { globalData: {} } }
function page(file) {
  var path = require.resolve('../pages/' + file + '/' + file)
  delete require.cache[path]; require(path)
  var p = Object.create(definition)
  p.data = JSON.parse(JSON.stringify(definition.data))
  p.setData = function (updates) {
    Object.keys(updates).forEach(function (key) {
      var parts = key.split('.'), obj = p.data
      while (parts.length > 1) obj = obj[parts.shift()]
      obj[parts[0]] = updates[key]
    })
  }
  return p
}
function test(name, fn) {
  db = {}; nav = ''; ticks = []; now = 100000; Q.setExtra([])
  try { fn(); passed++; console.log('PASS ' + name) }
  catch (e) { failed++; console.error('FAIL ' + name + ': ' + e.message) }
}
function learning() { return require('../utils/learning') }
test('random count=0 includes the entire selected pool', function () {
  var p = page('practice'); p.onLoad({ mode: 'random', cat: 'syntax', count: '0' })
  assert.strictEqual(p.data.total, Q.countByCat('syntax'))
})
test('skipped practice questions enter wrong list exactly once on finish', function () {
  var p = page('practice'); p.onLoad({ count: '10' })
  p.tapOption({ currentTarget: { dataset: { i: p.data.cur.ans[0] } } })
  p.finish(); p.finish()
  assert.strictEqual(store.getStats().answered, 10)
  assert.strictEqual(store.getWrongIds().length, 9)
})
test('multi answer confirmation is idempotent', function () {
  var p = page('practice'); p.onLoad({ count: '0' })
  p.setData({ idx: p.data.list.findIndex(function (q) { return q.type === 'multi' }) }); p.render()
  p.tapOption({ currentTarget: { dataset: { i: p.data.cur.ans[0] } } })
  p.doSubmit(); p.doSubmit()
  assert.strictEqual(store.getStats().answered, 1)
})
test('coverage counts distinct current questions, not repetitions', function () {
  for (var i = 0; i < 12; i++) store.record(Q.QUESTIONS[0].id, true)
  var h = page('index'); h.onLoad()
  assert.strictEqual(h.data.answered, 1)
})
test('remote duplicates cannot shadow a built-in id or inflate count', function () {
  var base = Q.QUESTIONS.length, first = Q.QUESTIONS[0]
  var extra = { id: 'test-extra', q: 'Valid test question', cat: 'modern', level: 2, type: 'single', options: ['x','y'], ans: [0], exp: 'Test explanation for a valid remote question.' }
  Q.setExtra([Object.assign({}, first, { q: 'malicious overwrite' }), extra, extra])
  assert.strictEqual(Q.getById(first.id).q, first.q)
  assert.strictEqual(Q.QUESTIONS.length, base + 1)
})
test('adapter rejects fractional and duplicate answer indices', function () {
  var raw = { q: 'test', options: ['a','b'], ans: [0.5], exp: 'test' }
  assert.strictEqual(adapter.normalize([raw]).list.length, 0)
  raw.ans = [0,0]; raw.type = 'multi'
  assert.strictEqual(adapter.normalize([raw]).list.length, 0)
  raw.ans = ['0oops']
  assert.strictEqual(adapter.normalize([raw]).list.length, 0)
})
test('adapter rejects single question with multiple correct indices', function () {
  assert.strictEqual(adapter.normalize([{ q: 'test', type: 'single', options: ['a','b'], ans: [0,1] }]).list.length, 0)
})
test('exam clock accounts for background elapsed wall time', function () {
  var p = page('practice'); p.onLoad({ mode: 'exam' }); p.onHide()
  now += 1201000
  if (p.onShow) p.onShow()
  assert.ok(/result/.test(nav), 'overdue exam must submit on foreground')
})
test('result again preserves count and filters', function () {
  var p = page('practice'); p.onLoad({ mode: 'seq', count: '10', level: '2', track: 'backend' }); p.finish()
  var r = page('result'); r.onLoad(); r.again()
  assert.ok(/count=10/.test(nav)); assert.ok(/level=2/.test(nav)); assert.ok(/track=backend/.test(nav))
})
test('learning filters intersect, search matches code, empty stays empty', function () {
  var L = learning()
  var list = [
    {id:'a',cat:'modern',level:1,q:'ownership',code:'unique_ptr',tags:['lifetime']},
    {id:'b',cat:'interview',level:2,q:'epoll',tags:['network']},
    {id:'c',cat:'algo',level:2,q:'binary search',tags:['algorithms']}
  ]
  assert.deepStrictEqual(L.select(list,{level:2,track:'backend',topic:'network'}).map(function(q){return q.id}),['b'])
  assert.strictEqual(L.select(list,{search:'UNIQUE_PTR'}).length,1)
  assert.strictEqual(L.select(list,{topic:'network',level:1}).length,0)
})
test('balanced exam is unique and includes each available category', function () {
  var out = learning().exam(Q.QUESTIONS,20)
  assert.strictEqual(out.length,20)
  assert.strictEqual(new Set(out.map(function(q){return q.id})).size,20)
  Q.CATEGORIES.forEach(function(c){ if(Q.countByCat(c.key)) assert.ok(out.some(function(q){return q.cat===c.key})) })
})
test('changing level cannot resume a different filter snapshot', function () {
  var p = page('practice'); p.onLoad({count:'10',level:'1'}); p.next(); p.onUnload()
  var r = page('practice'); r.onLoad({count:'10',level:'2'})
  assert.strictEqual(r.data.resumed,false)
  assert.ok(r.data.list.every(function(q){return q.level===2}))
})
test('simple practice clears obsolete role filters and starts in one click', function () {
  store.setPref('learning',{level:2,track:'backend',topic:'network',search:'TCP'})
  var p = page('learn'); p.onLoad()
  assert.strictEqual(p.data.track,''); assert.strictEqual(p.data.topic,''); assert.strictEqual(p.data.search,'')
  p.start()
  assert.ok(/mode=study/.test(nav)); assert.ok(/count=20/.test(nav)); assert.ok(/level=2/.test(nav))
})
test('authored modern questions remain reachable through topic and client filters', function () {
  var L = learning(), modern = Q.QUESTIONS.filter(function(q){return q.id.indexOf('mi')===0})
  assert.ok(modern.length > 0)
  modern.forEach(function(q){
    assert.ok(L.describe(q).labels.length, q.id + ' missing visible topic')
    assert.strictEqual(L.select([q],{track:'client',topic:'modern'}).length,1,q.id)
  })
})
test('browser learning API is available with preview CommonJS shim', function () {
  var context = {module:{exports:{}},window:{}}
  require('vm').runInNewContext(require('fs').readFileSync(require.resolve('../utils/learning'),'utf8'),context)
  assert.ok(context.window.CppLearning && context.window.CppLearning.select)
})
test('text import rejects repeated or out-of-range answers without success count', function () {
  ;['A,A','A,C'].forEach(function(ans) {
    var parsed = adapter.parseText('1. 测试题\nA. 选项一\nB. 选项二\n答案：'+ans)
    assert.strictEqual(parsed.converted,0)
    assert.strictEqual(parsed.skipped,1)
  })
})
test('legacy algorithm STL topics remain discoverable', function () {
  var q={id:'legacy',cat:'algo',level:2,q:'vector 的迭代器何时失效'}
  assert.strictEqual(learning().select([q],{topic:'stl'}).length,1)
})
test('empty filtered wrong practice must not erase unrelated wrong questions', function () {
  store.record(Q.QUESTIONS[0].id,false)
  var oldTimeout = global.setTimeout
  global.setTimeout = function() {}
  try { var p=page('practice'); p.onLoad({mode:'wrong',search:'__no_such_question__'}) }
  finally { global.setTimeout=oldTimeout }
  assert.strictEqual(store.getWrongIds().length,1)
})
test('repeated import reports effective added count and consumes parsed draft', function () {
  var p=page('import'); p.onLoad()
  p.setData({text:'1. 导入回归测试题\nA. 答案甲\nB. 答案乙\n答案：A'})
  p.parse(); var draft=p.data.result; p.doImport()
  assert.ok(lastModal.content.indexOf('新增 1 题')>=0)
  assert.strictEqual(p.data.result,null)
  p.setData({result:draft}); p.doImport()
  assert.ok(lastModal.content.indexOf('新增 0 题')>=0)
})
test('home primary action starts or resumes practice without a configuration page', function () {
  var h=page('index'); h.onLoad(); h.goDaily()
  assert.ok(/practice\?mode=study/.test(nav)); assert.ok(/level=1/.test(nav))
  var p=page('practice'); p.onLoad({mode:'study',level:'1',count:'20'}); p.next(); p.onUnload()
  h.refresh(); h.goDaily()
  assert.ok(!/restart=1/.test(nav))
})
test('new study round prioritizes unseen questions and keeps saved ordering on resume', function () {
  var p=page('practice'); p.onLoad({mode:'study',level:'1',count:'20'})
  var first=p.data.list[0].id; p.finish()
  var r=page('practice'); r.onLoad({mode:'study',level:'1',count:'20',restart:'1'})
  assert.notStrictEqual(r.data.list[0].id,first)
  r.next(); r.onUnload(); var ids=r.data.list.map(function(q){return q.id})
  var t=page('practice'); t.onLoad({mode:'study',level:'1',count:'20'})
  assert.deepStrictEqual(t.data.list.map(function(q){return q.id}),ids)
})
test('course filters separate arrays and exceptions and combine with difficulty', function () {
  var L=learning(), qs=[
    {id:'array',cat:'syntax',level:1,q:'数组下标访问',code:'int a[3];'},
    {id:'except',cat:'syntax',level:2,q:'异常传播',code:'try { f(); } catch (...) {}'},
    {id:'other',cat:'syntax',level:1,q:'整数加法'},
    {id:'map',cat:'syntax',level:2,q:'std::map 的 operator[] 有何行为？'},
    {id:'sort',cat:'algo',level:2,q:'排序结果异常，应怎样修正比较器？'}
  ]
  assert.deepStrictEqual(L.select(qs,{course:'arrays'}).map(function(q){return q.id}),['array'])
  assert.deepStrictEqual(L.select(qs,{course:'exceptions'}).map(function(q){return q.id}),['except'])
  assert.strictEqual(L.select(qs,{course:'exceptions',level:1}).length,0)
  assert.strictEqual(L.select(qs,{course:'unknown'}).length,0)
  assert.notStrictEqual(L.key({course:'arrays'}),L.key({course:'exceptions'}))
})
test('course selection is saved and used by the start action', function () {
  var p=page('learn'); p.onLoad()
  var i=learning().COURSES.findIndex(function(c){return c.key==='exceptions'})
  p.chooseCourse({detail:{value:String(i)}})
  assert.strictEqual(p.data.course,'exceptions'); assert.strictEqual(p.data.level,0)
  assert.ok(p.data.matched>0); p.start(); assert.ok(/course=exceptions/.test(nav))
  var again=page('learn'); again.onLoad(); assert.strictEqual(again.data.course,'exceptions')
})
test('course practice, resume, result and home retain the selected chapter', function () {
  var p=page('practice');p.onLoad({mode:'study',course:'arrays',count:'20'})
  assert.ok(p.data.list.length);assert.ok(p.data.list.every(function(q){return learning().select([q],{course:'arrays'}).length===1}))
  p.next();p.onUnload()
  var h=page('index');h.onLoad();h.goDaily();assert.ok(/course=arrays/.test(nav))
  var restored=page('practice');restored.onLoad({mode:'study',course:'arrays',count:'20'});assert.ok(restored.data.resumed)
  restored.finish();var r=page('result');r.onLoad();r.again();assert.ok(/course=arrays/.test(nav))
})
test('changing chapters never resumes a different chapter', function () {
  var p=page('practice');p.onLoad({mode:'study',course:'arrays',count:'20'});p.next();p.onUnload()
  var other=page('practice');other.onLoad({mode:'study',course:'exceptions',count:'20'})
  assert.strictEqual(other.data.resumed,false)
})
test('browser home resume and repeat keep the active chapter despite picker changes', function () {
  var context={CppLearning:learning(),quiz:Q,state:{},cur:{list:[]},render:function(){},flash:function(){}}
  require('vm').runInNewContext(require('fs').readFileSync(require.resolve('../preview-learning'),'utf8'),context)
  context.LEARN_FILTER={level:0,course:'arrays'};context.learnStart()
  context.cur.idx=1;context.learnCourse('exceptions');context.homeStudy()
  assert.strictEqual(context.cur.studyCourse,'arrays');assert.strictEqual(context.cur.idx,1)
  context.practiceAgain()
  assert.strictEqual(context.cur.studyCourse,'arrays');assert.strictEqual(context.cur.idx,0)
  assert.ok(context.cur.list.every(function(q){return learning().select([q],{course:'arrays'}).length===1}))
})

Date.now = originalNow
Q.setExtra([])
console.log(passed + ' passed, ' + failed + ' failed')
process.exitCode = failed ? 1 : 0

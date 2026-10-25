var Q = require('../../data/questions')
var store = require('../../utils/store')
var ui = require('../../utils/ui')
var L = require('../../utils/learning')

var TILE = [
  { mode: 'seq', name: '顺序练习', desc: '从头逐题推进' },
  { mode: 'random', name: '随机练习', desc: '打乱检验手感' },
  { mode: 'wrong', name: '错题重练', desc: '专攻踩过的坑' },
  { mode: 'fav', name: '收藏练习', desc: '挑出来的重点' }
]

var MODE_TITLE = {
  seq: '顺序练习',
  random: '随机练习',
  exam: '模拟考试',
  wrong: '错题重练',
  fav: '收藏练习'
}

var CAT_SHORT = {
  syntax: '语法',
  algo: '算法',
  interview: '面试',
  modern: '新特性'
}

var COUNT_OPTS = [10, 20, 50, 0]

/* 浮层主按钮文案：有续做点就别直接开新的 */
function ctaOf(canResume, n) {
  if (canResume) return '按新题数重来'
  return n === 0 ? '把这类的题全刷完' : '开始刷 ' + n + ' 题'
}

Page({
  data: {
    statusBar: 20,
    dateStr: '',
    total: 0,
    baseTotal: 0,
    answered: 0,
    accuracy: 0,
    wrongNum: 0,
    favNum: 0,
    mastered: 0,
    percent: 0,
    tiles: [],
    cats: [],
    recent: [],
    onlineNum: 0,
    cloudOn: false,
    booting: false,
    countOpts: COUNT_OPTS,
    picker: {
      open: false,
      mode: '',
      cat: '',
      name: '',
      count: 20,
      canResume: false,
      resumeIdx: 0,
      resumeTotal: 0
    }
  },

  onLoad: function () {
    ui.attach(this)
    var d = new Date()
    this.setData({ dateStr: (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日' })
    this.refresh()
  },

  onShow: function () {
    this.refresh()
    var app = getApp()
    if (app && app.globalData && app.globalData.booting) {
      var that = this
      setTimeout(function () { that.refresh() }, 2400)
    }
  },

  refresh: function () {
    var s = store.getStats()
    var answered = Q.QUESTIONS.filter(function(q) { return s.records[q.id] && s.records[q.id].t > 0 }).length
    var onlineNum = Q.getExtra().length

    // 哪一条练习还有没做完的进度，就在那儿标个「继续」
    var prog = store.getProgress()
    var resumeKey = store.resumable(prog) && L.key(prog) === L.key({}) ? (prog.mode + '|' + (prog.cat || '')) : ''
    var resumeIdx = store.resumable(prog) ? (prog.idx + 1) : 0

    var cats = Q.CATEGORIES.map(function (c) {
      var st = store.catStat(c.key, Q.QUESTIONS)
      return {
        key: c.key,
        name: c.name,
        desc: c.desc,
        total: st.total,
        done: st.done,
        percent: st.percent,
        resume: resumeKey === ('seq|' + c.key),
        resumeIdx: resumeIdx
      }
    }).filter(function (c) { return c.total > 0 })

    var recent = (s.history || []).slice(0, 3).map(function (h) {
      return {
        desc: h.modeName + ' · ' + h.correct + '/' + h.total,
        acc: h.total ? Math.round((h.correct / h.total) * 100) : 0,
        time: h.timeStr
      }
    })

    var tiles = TILE.map(function (t) {
      var num = ''
      if (t.mode === 'seq') num = Q.QUESTIONS.length
      else if (t.mode === 'random') num = 20
      else if (t.mode === 'wrong') num = s.wrong.length
      else num = s.fav.length
      return {
        mode: t.mode,
        name: t.name,
        desc: t.desc,
        num: num,
        resume: resumeKey === (t.mode + '|'),
        resumeIdx: resumeIdx
      }
    })

    var app = getApp()

    this.setData({
      dailyResume: !!(store.resumable(prog) && prog.mode === 'study' && !prog.cat && !prog.track && !prog.topic && !prog.search),
      dailyIndex: prog ? prog.idx + 1 : 0,
      dailyCourse: L.courseLabel(store.resumable(prog) && prog.mode === 'study' ? prog.course : store.getPref('learning', {}).course),
      total: Q.QUESTIONS.length,
      baseTotal: Q.QUESTIONS.length - onlineNum,
      answered: answered,
      accuracy: store.accuracy(),
      wrongNum: s.wrong.length,
      favNum: s.fav.length,
      mastered: store.masteredCount(),
      percent: Q.QUESTIONS.length ? Math.min(100, Math.round((answered / Q.QUESTIONS.length) * 100)) : 0,
      tiles: tiles,
      cats: cats,
      recent: recent,
      onlineNum: onlineNum,
      cloudOn: !!(app && app.globalData && app.globalData.cloudReady),
      booting: !!(app && app.globalData && app.globalData.booting)
    })
  },

  goPractice: function (e) {
    var mode = e.currentTarget.dataset.mode || 'seq'
    var cat = e.currentTarget.dataset.cat || ''

    if (mode === 'wrong' && this.data.wrongNum === 0) {
      ui.toast('错题本是空的，继续保持')
      return
    }
    if (mode === 'fav' && this.data.favNum === 0) {
      ui.toast('还没有收藏题目')
      return
    }

    // 考试固定 20 题 20 分钟，不用选题数
    if (mode === 'exam') {
      wx.navigateTo({ url: '/pages/practice/practice?mode=exam' })
      return
    }

    var prog = store.getProgress()
    var canResume = store.resumable(prog) && prog.mode === mode && (prog.cat || '') === cat && L.key(prog) === L.key({})
    var last = store.getPref('count', mode === 'random' ? 20 : 20)
    if (mode === 'wrong' || mode === 'fav') last = store.getPref('count', 0)

    var name = MODE_TITLE[mode] || '练习'
    if (cat && CAT_SHORT[cat]) name = CAT_SHORT[cat] + ' · ' + name

    this.setData({
      picker: {
        open: true,
        mode: mode,
        cat: cat,
        name: name,
        count: last,
        cta: ctaOf(canResume, last),
        canResume: canResume,
        resumeIdx: canResume ? (prog.idx + 1) : 0,
        resumeTotal: canResume ? (prog.list || []).length : 0
      }
    })
  },

  pickCount: function (e) {
    var n = parseInt(e.currentTarget.dataset.n, 10)
    if (isNaN(n)) n = 20
    this.setData({
      'picker.count': n,
      'picker.cta': ctaOf(false, n)
    })
  },

  closePicker: function () {
    this.setData({ 'picker.open': false })
  },

  noop: function () {},

  /* 继续上次：题数沿用上次的快照 */
  resumeLast: function () {
    var p = this.data.picker
    var prog = store.getProgress()
    var count = prog && typeof prog.count === 'number' ? prog.count : p.count
    this.setData({ 'picker.open': false })
    wx.navigateTo({
      url: '/pages/practice/practice?mode=' + p.mode + '&cat=' + p.cat + '&count=' + count
    })
  },

  /* 按选中的题数从头开始 */
  startPractice: function () {
    var p = this.data.picker
    store.setPref('count', p.count)
    this.setData({ 'picker.open': false })
    wx.navigateTo({
      url: '/pages/practice/practice?mode=' + p.mode + '&cat=' + p.cat +
        '&count=' + p.count + '&restart=1'
    })
  },

  goWrong: function () {
    wx.navigateTo({ url: '/pages/wrong/wrong' })
  },

  goImport: function () {
    wx.navigateTo({ url: '/pages/import/import' })
  },

  goBank: function () {
    wx.navigateTo({ url: '/pages/bank/bank' })
  },

  goBooks: function () {
    wx.navigateTo({ url: '/pages/books/books' })
  },

  goLearn: function () {
    wx.navigateTo({ url: '/pages/learn/learn' })
  },

  goDaily: function () {
    var p = store.getProgress()
    var canResume = store.resumable(p) && p.mode === 'study' && !p.cat && !p.track && !p.topic && !p.search
    var saved = store.getPref('learning', {level:1})
    var level = canResume ? p.level : ([0,1,2].indexOf(saved.level) >= 0 ? saved.level : 1)
    wx.navigateTo({url:'/pages/practice/practice?mode=study&count='+(canResume?p.count:20)+(canResume?'':'&restart=1')+L.query({level:level,course:canResume?p.course:(L.COURSES.some(function(c){return c.key===saved.course})?saved.course:'')})})
  },

  goSaved: function () {
    if (!store.getFavIds().length) { ui.toast('还没有收藏题目'); return }
    wx.navigateTo({url:'/pages/practice/practice?mode=fav&count=20'})
  },

  resetAll: function () {
    var that = this
    wx.showModal({
      title: '清空学习数据',
      content: '答题记录、错题本与收藏都会被清除，且无法恢复。',
      confirmColor: '#d9542b',
      success: function (res) {
        if (!res.confirm) return
        store.resetAll()
        that.refresh()
        ui.toast('已清空')
      }
    })
  }
})

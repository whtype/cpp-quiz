var Q = require('../../data/questions')
var store = require('../../utils/store')
var ui = require('../../utils/ui')

var TILE = [
  { mode: 'seq', name: '顺序练习', desc: '从头逐题推进' },
  { mode: 'random', name: '随机 20 题', desc: '打乱检验手感' },
  { mode: 'wrong', name: '错题重练', desc: '专攻踩过的坑' },
  { mode: 'fav', name: '收藏练习', desc: '挑出来的重点' }
]

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
    booting: false
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
    var answered = s.answered || 0
    var onlineNum = Q.getExtra().length

    var cats = Q.CATEGORIES.map(function (c) {
      var st = store.catStat(c.key, Q.QUESTIONS)
      return {
        key: c.key,
        name: c.name,
        desc: c.desc,
        total: st.total,
        done: st.done,
        percent: st.percent
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
      return { mode: t.mode, name: t.name, desc: t.desc, num: num }
    })

    var app = getApp()

    this.setData({
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
    wx.navigateTo({ url: '/pages/practice/practice?mode=' + mode + '&cat=' + cat })
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

var Q = require('../../data/questions')
var store = require('../../utils/store')
var ui = require('../../utils/ui')
var L = require('../../utils/learning')

var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

var CAT_NAME = {}
Q.CATEGORIES.forEach(function (c) { CAT_NAME[c.key] = c.name })

var TYPE_NAME = { single: '单选', multi: '多选', judge: '判断' }

function fmtTime(sec) {
  var m = Math.floor(sec / 60)
  var s = sec % 60
  return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s)
}

function lettersTo(arr) {
  if (!arr || !arr.length) return '未作答'
  return arr.slice().sort().map(function (n) { return LETTERS[n] }).join('、')
}

Page({
  data: {
    statusBar: 20,
    session: null,
    score: 0,
    correct: 0,
    wrongNum: 0,
    total: 0,
    elapsedText: '00:00',
    comment: '',
    items: [],
    openIdx: -1,
    modeName: ''
  },

  onLoad: function () {
    ui.attach(this)
    var session = store.getSession()
    if (!session || !session.items || !session.items.length) {
      wx.showToast({ title: '没有找到练习记录', icon: 'none' })
      setTimeout(function () { ui.back() }, 1200)
      return
    }

    var items = []
    session.items.forEach(function (it) {
      var q = Q.getById(it.id)
      if (!q) return
      items.push({
        id: q.id,
        q: q.q,
        code: q.code || '',
        cat: CAT_NAME[q.cat] || '',
        typeName: TYPE_NAME[q.type] || '',
        right: it.right,
        answered: it.answered,
        answerText: lettersTo(q.ans),
        pickedText: lettersTo(it.picked),
        exp: q.exp
      })
    })

    var total = session.total || items.length
    var correct = session.correct || 0
    var score = total ? Math.round((correct / total) * 100) : 0
    var comment = score >= 90 ? '非常棒，基础扎实！'
      : score >= 75 ? '不错，错题再巩固一下'
      : score >= 60 ? '及格线徘徊，建议回看解析'
      : '别灰心，先把错题吃透'

    wx.setNavigationBarTitle({ title: session.modeName || '练习结果' })

    this.setData({
      session: session,
      items: items,
      score: score,
      correct: correct,
      wrongNum: total - correct,
      total: total,
      elapsedText: fmtTime(session.elapsed || 0),
      comment: comment,
      openIdx: -1,
      modeName: session.modeName || '练习'
    })
  },

  toggleItem: function (e) {
    var i = e.currentTarget.dataset.i
    this.setData({ openIdx: this.data.openIdx === i ? -1 : i })
  },

  again: function () {
    var s = this.data.session
    wx.redirectTo({
      url: '/pages/practice/practice?mode=' + (s.mode || 'seq') + '&cat=' + (s.cat || '') + '&count=' + (s.count || 0) + '&restart=1' + L.query(s)
    })
  },

  practiceWrong: function () {
    var ids = []
    this.data.items.forEach(function (it) {
      if (!it.right) ids.push(it.id)
    })
    if (!ids.length) {
      wx.showToast({ title: '全部答对，没有错题', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/wrong/wrong' })
  },

  goHome: function () {
    wx.reLaunch({ url: '/pages/index/index' })
  }
})

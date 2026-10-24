var Q = require('../../data/questions')
var store = require('../../utils/store')
var ui = require('../../utils/ui')

var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

var CAT_NAME = {}
Q.CATEGORIES.forEach(function (c) { CAT_NAME[c.key] = c.name })

var TYPE_NAME = { single: '单选', multi: '多选', judge: '判断' }

Page({
  data: {
    statusBar: 20,
    tab: 'wrong',
    list: [],
    openIdx: -1,
    wrongNum: 0,
    favNum: 0
  },

  onLoad: function () {
    ui.attach(this)
    this.build()
  },

  goBack: function () { ui.back() },

  onShow: function () { this.build() },

  build: function () {
    var kind = this.data.tab === 'wrong' ? 'wrong' : 'fav'
    var ids = kind === 'wrong' ? store.getWrongIds() : store.getFavIds()
    var qs = Q.getByIds(ids)
    // 自愈：题库变动后旧 id 会失效，清掉它们，别让「计数有 12、列表是空」
    if (qs.length !== ids.length) {
      store.prune(kind, qs.map(function (q) { return q.id }))
    }
    var list = qs.map(function (q) {
      return {
        id: q.id,
        q: q.q,
        code: q.code || '',
        cat: CAT_NAME[q.cat] || '',
        typeName: TYPE_NAME[q.type] || '',
        ansText: q.ans.map(function (n) { return LETTERS[n] }).join('、'),
        times: store.wrongTimes(q.id),
        exp: q.exp
      }
    })

    this.setData({
      list: list,
      openIdx: -1,
      wrongNum: store.getWrongIds().length,
      favNum: store.getFavIds().length
    })
  },

  switchTab: function (e) {
    var tab = e.currentTarget.dataset.tab
    if (tab === this.data.tab) return
    this.setData({ tab: tab }, this.build())
  },

  toggleItem: function (e) {
    var i = e.currentTarget.dataset.i
    this.setData({ openIdx: this.data.openIdx === i ? -1 : i })
  },

  remove: function (e) {
    var id = e.currentTarget.dataset.id
    var that = this
    if (this.data.tab === 'wrong') {
      store.removeWrong(id)
      wx.showToast({ title: '已移出错题本', icon: 'none' })
    } else {
      store.toggleFav(id)
      wx.showToast({ title: '已取消收藏', icon: 'none' })
    }
    that.build()
  },

  practice: function () {
    var tab = this.data.tab
    if (tab === 'wrong' && this.data.wrongNum === 0) {
      wx.showToast({ title: '错题本还是空的', icon: 'none' })
      return
    }
    if (tab === 'fav' && this.data.favNum === 0) {
      wx.showToast({ title: '还没有收藏题目', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/practice/practice?mode=' + tab })
  },

  clear: function () {
    var that = this
    var tab = this.data.tab
    if ((tab === 'wrong' && !this.data.wrongNum) || (tab === 'fav' && !this.data.favNum)) {
      wx.showToast({ title: '没有可清空的内容', icon: 'none' })
      return
    }
    wx.showModal({
      title: '确认清空',
      content: tab === 'wrong' ? '将清空整个错题本，无法恢复。' : '将清空全部收藏，无法恢复。',
      confirmColor: '#d9542b',
      success: function (res) {
        if (!res.confirm) return
        if (tab === 'wrong') store.clearWrong()
        else store.clearFav()
        that.build()
        wx.showToast({ title: '已清空', icon: 'success' })
      }
    })
  }
})

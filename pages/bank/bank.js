var Q = require('../../data/questions')
var store = require('../../utils/store')
var sources = require('../../utils/sources')
var ui = require('../../utils/ui')

Page({
  data: {
    statusBar: 20,
    baseTotal: 0,
    onlineNum: 0,
    total: 0,
    srcs: [],
    enabledNum: 0,
    running: false,
    log: '',
    logTone: 'dim'
  },

  onLoad: function () {
    ui.attach(this)
    this.refresh()
  },

  onShow: function () { this.refresh() },

  refresh: function () {
    var srcs = sources.list()
    var online = Q.getExtra().length
    this.setData({
      srcs: srcs,
      onlineNum: online,
      baseTotal: Q.QUESTIONS.length - online,
      total: Q.QUESTIONS.length,
      enabledNum: srcs.filter(function (s) { return s.enabled }).length
    })
  },

  onToggle: function (e) {
    var id = e.currentTarget.dataset.id
    var cur = null
    this.data.srcs.forEach(function (s) { if (s.id === id) cur = s })
    if (!cur) return
    sources.toggle(id, !cur.enabled)
    this.refresh()
  },

  goBack: function () {
    ui.back()
  },

  /** 刷新全部已启用的源 */
  refreshAll: function () {
    var srcs = this.data.srcs.filter(function (s) { return s.enabled })
    if (!srcs.length) {
      ui.toast('先打开至少一个题源')
      return
    }
    this.run(srcs, '已启用题库')
  },

  /** 单独刷新一个源 */
  refreshOne: function (e) {
    var id = e.currentTarget.dataset.id
    var one = this.data.srcs.filter(function (s) { return s.id === id })
    if (!one.length) return
    this.run(one, one[0].name)
  },

  run: function (srcs, label) {
    if (this.data.running) return
    var that = this
    this.setData({ running: true, log: '正在连接…', logTone: 'dim' })

    var exist = Q.QUESTIONS.map(function (q) { return q.id })

    sources.loadMany(srcs, exist, function (done, total) {
      that.setData({ log: '正在加载 ' + done + ' / ' + total + ' 个来源' })
    }).then(function (r) {
      if (r.list && r.list.length) {
        store.mergeRemote(r.list)
        Q.setExtra(store.getRemote())
      }
      that.refresh()

      var failed = r.per.filter(function (p) { return !p.ok })
      var text = label + '：新增 ' + r.added + ' 题'
      if (failed.length) {
        text += ' · ' + failed.length + ' 个源失败'
      }
      that.setData({
        running: false,
        log: text,
        logTone: r.added ? 'ok' : (failed.length ? 'err' : 'dim')
      })
    }).catch(function (e) {
      that.setData({ running: false, log: (e && e.message) || '加载失败', logTone: 'err' })
    })
  },

  /** 自定义链接 */
  addCustom: function () {
    var that = this
    wx.showModal({
      title: '自定义题库链接',
      content: '支持 JSON 题库、纯文本/Markdown 题库、Open Trivia DB 接口',
      editable: true,
      placeholderText: 'https://…/questions.json',
      confirmColor: '#d9542b',
      success: function (res) {
        if (!res.confirm || !res.content) return
        var url = String(res.content).trim()
        if (url.indexOf('http') !== 0) {
          ui.toast('链接要以 http 开头')
          return
        }
        that.run([sources.customSource(url)], '自定义链接')
      }
    })
  },

  /** 清空在线题，回到纯内置题库 */
  clearOnline: function () {
    var that = this
    wx.showModal({
      title: '清空在线题目',
      content: '将删除所有在线加载与粘贴导入的题目，只保留内置的 ' + this.data.baseTotal + ' 题。',
      confirmColor: '#d9542b',
      success: function (res) {
        if (!res.confirm) return
        store.clearRemote()
        Q.setExtra([])
        sources.resetState()
        that.refresh()
        that.setData({ log: '已回到内置题库', logTone: 'dim' })
      }
    })
  },

  goImport: function () {
    wx.navigateTo({ url: '/pages/import/import' })
  }
})

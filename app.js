var Q = require('./data/questions')
var store = require('./utils/store')
var sources = require('./utils/sources')

// 云开发环境 ID：填写后自动启用云函数代理（可绕过小程序 request 域名白名单，
// 从而在线加载任意来源的题库）。留空则用 wx.request 直连（需在后台配置合法域名）。
var CLOUD_ENV = ''

App({
  globalData: {
    version: '2.6.0',
    cloudEnv: CLOUD_ENV,
    cloudReady: false,
    booting: false,
    booted: false
  },

  onLaunch: function () {
    // 1. 先用本地缓存恢复上次在线加载的题目（秒开，不联网）
    try {
      var remote = store.getRemote()
      if (remote && remote.length) Q.setExtra(remote)
    } catch (e) {}

    // 2. 初始化云开发（未开通时静默失败，自动回退到 wx.request 直连）
    try {
      if (wx.cloud) {
        wx.cloud.init({ env: CLOUD_ENV || undefined, traceUser: true })
        this.globalData.cloudReady = !!CLOUD_ENV
      }
    } catch (e) {
      this.globalData.cloudReady = false
    }

    // 3. 首次启动（没有任何在线题缓存）→ 后台静默拉一次开源题
    //    失败了也不打扰用户，内置 600 题照样能刷
    var that = this
    this.globalData.booting = true
    setTimeout(function () {
      that.bootLoad()
    }, 300)
  },

  /** 首次静默拉取启用的在线源 */
  bootLoad: function () {
    var that = this
    if (this.globalData.booted) return
    if (store.getRemote().length) {
      this.globalData.booting = false
      this.globalData.booted = true
      return
    }

    var srcs = sources.list().filter(function (s) { return s.enabled })
    if (!srcs.length) {
      this.globalData.booting = false
      this.globalData.booted = true
      return
    }

    var existIds = Q.QUESTIONS.map(function (q) { return q.id })
    sources.loadMany(srcs, existIds).then(function (r) {
      if (r.list && r.list.length) {
        store.mergeRemote(r.list)
        Q.setExtra(store.getRemote())
      }
      that.globalData.booting = false
      that.globalData.booted = true
      if (that.bankListener) that.bankListener(r)
    }).catch(function () {
      that.globalData.booting = false
      that.globalData.booted = true
    })
  },

  onShow: function () {},
  onHide: function () {}
})

var data = require('../../data/books')
var ui = require('../../utils/ui')

Page({
  data: {
    statusBar: 20,
    freeList: [],
    classicList: [],
    busyId: '',
    tip: '',
    showHint: true
  },

  onLoad: function () {
    ui.attach(this)
    var free = [], classic = []
    data.BOOKS.forEach(function (b) {
      if (b.group === 'free') free.push(b)
      else classic.push(b)
    })
    this.setData({ freeList: free, classicList: classic })
  },

  goBack: function () { ui.back() },

  hideHint: function () { this.setData({ showHint: false }) },

  onTap: function (e) {
    var id = e.currentTarget.dataset.id
    var book = null
    data.BOOKS.forEach(function (b) { if (b.id === id) book = b })
    if (!book) return

    if (book.action === 'pdf') this.openPdf(book)
    else if (book.action === 'link') this.copyLink(book)
    else this.howToGet(book)
  },

  /* 免费 PDF：下载后用微信内置阅读器打开（不占包体） */
  openPdf: function (book) {
    var that = this
    if (this.data.busyId) {
      wx.showToast({ title: '正在打开上一本，稍等', icon: 'none' })
      return
    }
    this.setData({ busyId: book.id, tip: '' })
    wx.showLoading({ title: '下载中…', mask: true })

    wx.downloadFile({
      url: book.url,
      timeout: 60000,
      success: function (res) {
        wx.hideLoading()
        if (res.statusCode !== 200) {
          that.fail(book, '下载失败 HTTP ' + res.statusCode)
          return
        }
        wx.openDocument({
          filePath: res.tempFilePath,
          fileType: 'pdf',
          showMenu: true,
          success: function () {
            that.setData({ busyId: '' })
          },
          fail: function (e) {
            that.fail(book, '文件已下载，但打开失败' + (e && e.errMsg ? '（' + e.errMsg + '）' : ''))
          }
        })
      },
      fail: function (e) {
        wx.hideLoading()
        that.fail(book, '下载失败' + (e && e.errMsg ? '：' + e.errMsg : ''))
      }
    })
  },

  /* 打不开时的兜底：把两条可行路径讲清楚，而不是只报错 */
  fail: function (book, msg) {
    this.setData({ busyId: '' })
    var that = this
    var host = this.hostOf(book.url)
    wx.showModal({
      title: '没能直接打开',
      content: msg + '。\n\n原因通常是 ' + host + ' 还没加进「downloadFile 合法域名」。\n\n' +
        '点「复制链接」→ 粘贴到微信任意聊天（比如文件传输助手）→ 点一下就能在微信里打开。',
      confirmText: '复制链接',
      cancelText: '知道了',
      confirmColor: '#d9542b',
      success: function (r) {
        if (r.confirm) that.copyOnly(book)
      }
    })
  },

  /* 只复制，不再二次确认 */
  copyOnly: function (book) {
    wx.setClipboardData({
      data: book.url,
      success: function () { wx.showToast({ title: '已复制，去粘贴打开', icon: 'none' }) }
    })
  },

  hostOf: function (url) {
    var m = String(url).match(/^https?:\/\/([^\/]+)/)
    return m ? m[1] : url
  },

  /* 在线文档：小程序不能直接拉起外部浏览器，只能给一条"能落地"的路 */
  copyLink: function (book) {
    var that = this
    wx.showModal({
      title: book.title,
      content: '这是一份在线文档，小程序内不能直接打开外部网页。\n\n点「复制链接」→ 粘贴到微信任意聊天（比如文件传输助手）→ 点一下就能打开。',
      confirmText: '复制链接',
      cancelText: '知道了',
      confirmColor: '#d9542b',
      success: function (r) {
        if (!r.confirm) return
        that.copyOnly(book)
      }
    })
  },

  /* 版权书：只给获取方式，不分发文件 */
  howToGet: function (book) {
    var that = this
    wx.showModal({
      title: book.title,
      content: book.author + '\n' + (book.note || '') +
        '\n\n这本是版权书，本程序不提供电子版。点「复制书名」可以拿去电商或图书馆搜。',
      confirmText: '复制书名',
      cancelText: '知道了',
      confirmColor: '#d9542b',
      success: function (r) {
        if (!r.confirm) return
        wx.setClipboardData({
          data: book.title + ' ' + (book.en || ''),
          success: function () {
            wx.showToast({ title: '书名已复制', icon: 'none' })
          }
        })
      }
    })
  },

  copyAll: function () {
    var lines = []
    data.BOOKS.forEach(function (b) {
      lines.push((b.group === 'free' ? '[免费] ' : '[需购买] ') + b.title + ' — ' + b.author)
    })
    wx.setClipboardData({
      data: 'C++ 推荐书单\n\n' + lines.join('\n'),
      success: function () { wx.showToast({ title: '书单已复制', icon: 'none' }) }
    })
  }
})

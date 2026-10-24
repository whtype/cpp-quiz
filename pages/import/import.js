var Q = require('../../data/questions')
var store = require('../../utils/store')
var adapter = require('../../utils/adapter')
var ui = require('../../utils/ui')

var SAMPLE = '1. 下列关于虚函数表的说法，正确的是？\n' +
  'A. 每个类都有一张虚函数表\n' +
  'B. 含有虚函数的类才有虚函数表，对象中存放 vptr\n' +
  'C. 虚函数表在栈上分配\n' +
  'D. 虚函数表每个对象一份\n' +
  '答案：B\n' +
  '解析：只有含虚函数的类才有 vtable，对象内只存一个指针 vptr。\n\n' +
  '2. 下列哪些属于稳定排序？\n' +
  'A. 归并排序\n' +
  'B. 冒泡排序\n' +
  'C. 快速排序\n' +
  'D. 简单选择排序\n' +
  '【答案】A,B\n\n' +
  '3. TCP 是面向连接的可靠传输协议。\n' +
  'A. 正确\n' +
  'B. 错误\n' +
  '答案：A'

Page({
  data: {
    statusBar: 20,
    text: '',
    catNames: [],
    catKeys: [],
    catIndex: 0,
    result: null,
    previewList: []
  },

  onLoad: function () {
    ui.attach(this)
    var names = Q.CATEGORIES.map(function (c) { return c.name })
    var keys = Q.CATEGORIES.map(function (c) { return c.key })
    this.setData({ catNames: names, catKeys: keys })
  },

  goBack: function () { ui.back() },

  onInput: function (e) {
    this.setData({ text: e.detail.value, result: null, previewList: [] })
  },

  onCatChange: function (e) {
    this.setData({ catIndex: Number(e.detail.value) })
  },

  fillSample: function () {
    this.setData({ text: SAMPLE, result: null, previewList: [] })
  },

  clearText: function () {
    this.setData({ text: '', result: null, previewList: [] })
  },

  parse: function () {
    var text = this.data.text
    if (!text || !String(text).trim()) {
      wx.showToast({ title: '请先粘贴题目', icon: 'none' })
      return
    }
    var cat = this.data.catKeys[this.data.catIndex] || 'syntax'
    var existIds = Q.QUESTIONS.map(function (q) { return q.id })
    var r = adapter.parseText(text, cat, existIds)

    if (!r.converted) {
      var tips = '未识别到题目。请检查：\n' +
        '· 选项以 A. B. C. 或 A: B: 开头\n' +
        '· 每题末尾有「答案：B」（多选可写 A,B 或 A、B）\n' +
        '· 题与题之间空行分隔'
      wx.showModal({ title: '解析结果为空', content: tips, showCancel: false })
      return
    }

    var preview = r.list.slice(0, 3).map(function (q) {
      return {
        q: q.q,
        options: q.options.map(function (o, i) {
          return { k: String.fromCharCode(65 + i), v: o }
        }),
        ansText: q.ans.map(function (n) { return String.fromCharCode(65 + n) }).join('、'),
        typeName: q.type === 'multi' ? '多选' : (q.type === 'judge' ? '判断' : '单选')
      }
    })

    this.setData({ result: r, previewList: preview })
    wx.showToast({ title: '识别 ' + r.converted + ' 题', icon: 'none' })
  },

  doImport: function () {
    var r = this.data.result
    if (!r || !r.converted) return
    var that = this

    store.mergeRemote(r.list)
    Q.setExtra(store.getRemote())

    wx.showModal({
      title: '导入成功',
      content: '已新增 ' + r.converted + ' 题'
        + (r.skipped ? '，跳过 ' + r.skipped + ' 题（缺选项或答案）' : '')
        + '。当前题库共 ' + Q.QUESTIONS.length + ' 题。',
      confirmText: '去练习',
      cancelText: '继续导入',
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({ url: '/pages/practice/practice?mode=seq&cat=' + (that.data.catKeys[that.data.catIndex] || '') })
        } else {
          that.setData({ text: '', result: null, previewList: [] })
        }
      }
    })
  }
})

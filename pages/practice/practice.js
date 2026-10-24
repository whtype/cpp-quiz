var Q = require('../../data/questions')
var store = require('../../utils/store')
var ui = require('../../utils/ui')

var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
var EXAM_LIMIT = 20 * 60   // 模拟考试限时 20 分钟
var EXAM_COUNT = 20

var MODE_NAME = {
  seq: '顺序练习',
  random: '随机练习',
  exam: '模拟考试',
  wrong: '错题重练',
  fav: '收藏练习'
}

var CAT_NAME = {}
Q.CATEGORIES.forEach(function (c) { CAT_NAME[c.key] = c.name })

// 标题用的短分类名（导航栏放不下全名）
var CAT_SHORT = {
  syntax: '语法',
  algo: '算法',
  interview: '面试',
  modern: '新特性'
}

/* 组装页面标题：带分类时显示「分类 · 模式」，否则只显示模式 */
function buildTitle(mode, cat) {
  var t = MODE_NAME[mode] || '练习'
  if (mode === 'exam' || mode === 'wrong' || mode === 'fav') return t
  if (cat && CAT_SHORT[cat]) return CAT_SHORT[cat] + ' · ' + t
  return t
}

var TYPE_NAME = {
  single: '单选题',
  multi: '多选题',
  judge: '判断题'
}

var LEVEL_NAME = { 1: '入门', 2: '进阶', 3: '拔高' }

function shuffle(arr) {
  var a = arr.slice()
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var t = a[i]; a[i] = a[j]; a[j] = t
  }
  return a
}

function fmtTime(sec) {
  var m = Math.floor(sec / 60)
  var s = sec % 60
  return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s)
}

function sameSet(a, b) {
  if (a.length !== b.length) return false
  var x = a.slice().sort().join(',')
  var y = b.slice().sort().join(',')
  return x === y
}

Page({
  data: {
    statusBar: 20,
    percent: 0,
    mode: 'seq',
    cat: '',
    modeName: '顺序练习',
    catName: '',
    typeName: '',
    levelName: '',
    list: [],
    total: 0,
    idx: 0,
    cur: {},
    options: [],
    optCls: [],
    picked: [],
    answered: false,
    revealed: false,
    isRight: false,
    faved: false,
    answerText: '',
    instant: true,
    isExam: false,
    isLast: false,
    elapsed: 0,
    timeText: '00:00',
    cardOpen: false,
    flags: [],
    letters: LETTERS
  },

  answers: {},   // { qid: { picked: [], answered: bool, right: bool } }
  timer: null,
  finished: false,

  onLoad: function (options) {
    ui.attach(this)
    var mode = options.mode || 'seq'
    var cat = options.cat || ''
    var list = this.buildList(mode, cat)

    if (!list.length) {
      wx.showToast({ title: '暂无可练习的题目', icon: 'none' })
      setTimeout(function () { wx.navigateBack() }, 1200)
      return
    }

    var isExam = mode === 'exam'
    var title = buildTitle(mode, cat)
    wx.setNavigationBarTitle({ title: title })

    this.setData({
      mode: mode,
      cat: cat,
      modeName: title,
      list: list,
      total: list.length,
      isExam: isExam,
      instant: !isExam
    })

    this.render()
    this.startTimer()
  },

  onUnload: function () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },

  buildList: function (mode, cat) {
    var pool = Q.filterByCat(cat)
    if (mode === 'random') return shuffle(pool).slice(0, 20)
    if (mode === 'exam') return shuffle(Q.QUESTIONS).slice(0, EXAM_COUNT)
    if (mode === 'wrong') return Q.getByIds(store.getWrongIds())
    if (mode === 'fav') return Q.getByIds(store.getFavIds())
    return pool
  },

  startTimer: function () {
    var that = this
    this.timer = setInterval(function () {
      var el = that.data.elapsed + 1
      var txt = that.data.isExam
        ? fmtTime(Math.max(EXAM_LIMIT - el, 0))
        : fmtTime(el)
      that.setData({ elapsed: el, timeText: txt })
      if (that.data.isExam && el >= EXAM_LIMIT) {
        wx.showToast({ title: '时间到，自动交卷', icon: 'none' })
        that.finish(true)
      }
    }, 1000)
  },

  /* 渲染当前题目 */
  render: function () {
    var list = this.data.list
    var idx = this.data.idx
    var cur = list[idx]
    if (!cur) return

    var a = this.answers[cur.id] || { picked: [], answered: false, right: false }
    var revealed = this.data.instant && a.answered

    var cls = []
    for (var i = 0; i < cur.options.length; i++) {
      var c = ''
      if (revealed) {
        if (cur.ans.indexOf(i) >= 0) c = 'right'
        else if (a.picked.indexOf(i) >= 0) c = 'wrong'
        else c = 'dim'
      } else if (a.picked.indexOf(i) >= 0) {
        c = 'picked'
      }
      cls.push(c)
    }

    var answerText = cur.ans.map(function (n) { return LETTERS[n] }).join('、')
    var pickedText = a.picked.slice().sort().map(function (n) { return LETTERS[n] }).join('、')

    // 答题卡状态：0 未答 / 1 正确 / 2 错误 / 3 已答（未判）
    var self = this
    var flagArr = list.map(function (q) {
      var st = self.answers[q.id]
      if (!st || !st.answered) return 0
      if (self.data.instant) return st.right ? 1 : 2
      return 3
    })

    this.setData({
      cur: cur,
      idx: idx,
      percent: list.length ? Math.round(((idx + 1) / list.length) * 100) : 0,
      catName: CAT_SHORT[cur.cat] || CAT_NAME[cur.cat] || '',
      typeName: TYPE_NAME[cur.type] || '',
      levelName: LEVEL_NAME[cur.level] || '',
      picked: a.picked,
      answered: a.answered,
      revealed: revealed,
      isRight: a.right,
      optCls: cls,
      answerText: answerText,
      pickedText: pickedText,
      faved: store.isFav(cur.id),
      isLast: idx === list.length - 1,
      flags: flagArr,
      answeredCount: flagArr.filter(function (f) { return f !== 0 }).length
    })
  },

  noop: function () {},

  goBack: function () {
    var that = this
    if (this.data.isExam && !this.finished) {
      wx.showModal({
        title: '退出考试',
        content: '本次作答不会计入统计，确定退出？',
        confirmColor: '#d9542b',
        success: function (r) {
          if (!r.confirm) return
          that.finished = true
          if (that.timer) { clearInterval(that.timer); that.timer = null }
          wx.navigateBack()
        }
      })
      return
    }
    wx.navigateBack()
  },

  onFinishTap: function () {
    this.finish(false)
  },

  /* 点击选项 */
  tapOption: function (e) {
    if (this.data.revealed) return
    var i = e.currentTarget.dataset.i
    var cur = this.data.cur
    var a = this.answers[cur.id] || { picked: [], answered: false, right: false }

    if (cur.type === 'multi') {
      var p = a.picked.indexOf(i)
      if (p >= 0) a.picked.splice(p, 1)
      else a.picked.push(i)
      a.answered = false
      this.answers[cur.id] = a
      this.render()
      return
    }

    // 单选 / 判断
    a.picked = [i]
    if (this.data.instant) {
      a.answered = true
      a.right = sameSet(a.picked, cur.ans)
      this.answers[cur.id] = a
      store.record(cur.id, a.right)
      this.render()
    } else {
      a.answered = true
      a.right = sameSet(a.picked, cur.ans)
      this.answers[cur.id] = a
      this.render()
    }
  },

  /* 多选题确认作答 */
  doSubmit: function () {
    var cur = this.data.cur
    var a = this.answers[cur.id] || { picked: [], answered: false, right: false }
    if (!a.picked.length) {
      wx.showToast({ title: '请先选择答案', icon: 'none' })
      return
    }
    a.answered = true
    a.right = sameSet(a.picked, cur.ans)
    this.answers[cur.id] = a
    if (this.data.instant) store.record(cur.id, a.right)
    this.render()
  },

  prev: function () {
    if (this.data.idx <= 0) {
      wx.showToast({ title: '已经是第一题', icon: 'none' })
      return
    }
    this.setData({ idx: this.data.idx - 1 })
    this.render()
  },

  next: function () {
    var cur = this.data.cur
    var a = this.answers[cur.id]

    if (this.data.instant && (!a || !a.answered)) {
      wx.showToast({ title: '请先作答', icon: 'none' })
      return
    }
    if (this.data.idx >= this.data.list.length - 1) {
      this.finish(false)
      return
    }
    this.setData({ idx: this.data.idx + 1 })
    this.render()
  },

  toggleFav: function () {
    var id = this.data.cur.id
    var on = store.toggleFav(id)
    this.setData({ faved: on })
    wx.showToast({ title: on ? '已收藏' : '已取消收藏', icon: 'none' })
  },

  toggleCard: function () {
    this.setData({ cardOpen: !this.data.cardOpen })
  },

  jumpTo: function (e) {
    var i = e.currentTarget.dataset.i
    this.setData({ idx: i, cardOpen: false })
    this.render()
  },

  /* 交卷 / 完成 */
  finish: function (force) {
    if (this.finished) return
    var self = this
    var list = this.data.list
    var mode = this.data.mode

    this.finished = true
    if (this.timer) { clearInterval(this.timer); this.timer = null }

    var correct = 0
    var items = list.map(function (q) {
      var a = self.answers[q.id] || { picked: [], answered: false, right: false }
      var right = a.answered && a.right
      if (!self.data.instant) {
        // 考试模式：此刻统一计入统计
        store.record(q.id, !!right)
      }
      if (right) correct += 1
      return {
        id: q.id,
        picked: a.picked || [],
        answered: !!a.answered,
        right: !!right
      }
    })

    var now = new Date()
    var timeStr = (now.getMonth() + 1) + '/' + now.getDate() + ' ' +
      ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2)

    var session = {
      mode: mode,
      cat: this.data.cat,
      modeName: this.data.modeName,
      total: list.length,
      correct: correct,
      elapsed: this.data.elapsed,
      timeStr: timeStr,
      items: items
    }

    store.setSession(session)
    store.addHistory({
      mode: mode,
      modeName: this.data.modeName,
      total: list.length,
      correct: correct,
      elapsed: this.data.elapsed,
      timeStr: timeStr
    })

    wx.redirectTo({ url: '/pages/result/result' })
  }
})

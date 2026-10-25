var Q = require('../../data/questions')
var store = require('../../utils/store')
var ui = require('../../utils/ui')
var L = require('../../utils/learning')

var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
var EXAM_LIMIT = 20 * 60   // 模拟考试限时 20 分钟
var EXAM_COUNT = 20

var MODE_NAME = {
  study: 'C++ 刷题',
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
    level: 0, course: '', track: '', topic: '', search: '',
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
    letters: LETTERS,
    count: 0,          // 本轮题数上限，0 = 全部
    resumed: false,    // 是否接着上次的进度
    resumedFrom: 0     // 接着的第几题（1 基）
  },

  answers: {},   // { qid: { picked: [], answered: bool, right: bool } }
  timer: null,
  finished: false,

  onLoad: function (options) {
    ui.attach(this)
    var mode = options.mode || 'seq'
    var cat = options.cat || ''
    var count = options.count === undefined ? (mode === 'random' ? 20 : 0) : Math.max(0, parseInt(options.count, 10) || 0)
    var filters = L.filters(options)
    this.finished = false
    this.setData(filters)
    var forceNew = options.restart === '1'
    var isExam = mode === 'exam'

    var title = mode === 'study' && filters.course ? L.courseLabel(filters.course) + ' · 练习' : buildTitle(mode, cat)
    wx.setNavigationBarTitle({ title: title })

    /* 先看有没有能接着做的：同一个模式 + 同一个分类，且上次没答到最后一题 */
    var prog = store.getProgress()
    var canResume = !forceNew && !isExam && store.resumable(prog) &&
      prog.mode === mode && (prog.cat || '') === cat && L.key(prog) === L.key(filters)

    var list, fromIdx = 0, answers = {}, elapsed = 0, resumed = false

    if (canResume) {
      var restored = Q.getByIds(prog.list)
      if (restored.length === prog.list.length && restored.length) {
        list = restored
        fromIdx = Math.min(prog.idx || 0, restored.length - 1)
        answers = prog.answers || {}
        elapsed = prog.elapsed || 0
        // 题数沿用上次的快照，否则点「重新开始」会变成全量
        count = typeof prog.count === 'number' ? prog.count : count
        resumed = true
      } else {
        // 题目本身失效了（在线题库换源），别硬撑，从头来
        store.clearProgress()
        list = this.buildList(mode, cat, count)
      }
    } else {
      list = this.buildList(mode, cat, count)
    }

    if (!list.length) {
      var tip = '暂无可练习的题目'
      if (mode === 'wrong' && !store.getWrongIds().length) {
        tip = '错题本暂无有效题目'
      } else if (mode === 'fav' && !store.getFavIds().length) {
        tip = '收藏暂无有效题目'
      }
      wx.showToast({ title: tip, icon: 'none' })
      setTimeout(function () { ui.back() }, 1200)
      return
    }

    this.answers = answers || {}

    this.setData({
      mode: mode,
      cat: cat,
      count: count,
      modeName: title,
      list: list,
      total: list.length,
      idx: fromIdx,
      elapsed: elapsed,
      timeText: fmtTime(isExam ? Math.max(EXAM_LIMIT - elapsed, 0) : elapsed),
      isExam: isExam,
      instant: !isExam,
      resumed: resumed,
      resumedFrom: fromIdx + 1
    })

    this.render()
    this.clockStart = Date.now() - elapsed * 1000
    this.startTimer()
  },

  onShow: function () {
    if (this.finished || !this.data.total) return
    if (!this.data.isExam && this.hiddenAt) this.clockStart += Date.now() - this.hiddenAt
    this.hiddenAt = 0
    this.updateClock()
    if (!this.finished && !this.timer) this.startTimer()
  },

  onHide: function () {
    this.updateClock()
    this.hiddenAt = Date.now()
    if (this.timer) { clearInterval(this.timer); this.timer = null }
    this.persist()
  },

  onUnload: function () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.persist()
  },

  /* 把当前进度存下来：退出小程序 / 返回首页后再进来能接着做 */
  persist: function () {
    if (this.finished || this.data.isExam) return
    var list = this.data.list
    if (!list || !list.length) return
    store.saveProgress({
      mode: this.data.mode,
      cat: this.data.cat,
      level: this.data.level, course: this.data.course, track: this.data.track, topic: this.data.topic, search: this.data.search,
      count: this.data.count,
      idx: this.data.idx,
      elapsed: this.data.elapsed,
      list: list.map(function (q) { return q.id }),
      answers: this.answers,
      savedAt: Date.now()
    })
  },

  /* 顶部提示条上的「重来」 */
  restart: function () {
    this.finished = true
    store.clearProgress()
    var url = '/pages/practice/practice?mode=' + this.data.mode +
      '&cat=' + this.data.cat + '&count=' + this.data.count + '&restart=1' + L.query(this.data)
    wx.redirectTo({ url: url })
  },

  buildList: function (mode, cat, count) {
    var n = count > 0 ? count : 0
    var pool = L.select(Q.filterByCat(cat), this.data)
    if (mode === 'study') {
      var records = store.getStats().records
      var fresh = pool.filter(function(q) { return !records[q.id] || !records[q.id].t })
      var seen = pool.filter(function(q) { return records[q.id] && records[q.id].t })
      pool = fresh.concat(seen)
    }
    if (mode === 'random') return shuffle(pool).slice(0, n || pool.length)
    if (mode === 'exam') return L.exam(pool, EXAM_COUNT)
    if (mode === 'wrong' || mode === 'fav') {
      var kind = mode === 'wrong' ? 'wrong' : 'fav'
      var ids = kind === 'wrong' ? store.getWrongIds() : store.getFavIds()
      var qs = Q.getByIds(ids)
      // 自愈：在线题库换源后旧 id 会失效，顺手把查不到的清掉
      if (qs.length !== ids.length) {
        store.prune(kind, qs.map(function (q) { return q.id }))
      }
      qs = L.select(qs, this.data)
      return n ? qs.slice(0, n) : qs
    }
    return n ? pool.slice(0, n) : pool
  },

  startTimer: function () {
    var that = this
    if (this.timer) clearInterval(this.timer)
    this.timer = setInterval(function () { that.updateClock() }, 1000)
  },

  updateClock: function () {
    if (this.finished || this.clockStart === undefined) return
    var el = Math.max(0, Math.floor((Date.now() - this.clockStart) / 1000))
    if (this.data.isExam) el = Math.min(el, EXAM_LIMIT)
    this.setData({elapsed:el,timeText:fmtTime(this.data.isExam ? EXAM_LIMIT - el : el)})
    if (this.data.isExam && el >= EXAM_LIMIT) {
      wx.showToast({title:'时间到，自动交卷',icon:'none'})
      this.finish(true)
    }
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
      followUpOpen: false,
      sourceLabel: L.describe(cur).source,
      topicLabels: this.data.course ? L.courseLabel(this.data.course) : L.describe(cur).labels.join(' / '),
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

    this.persist()
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
          ui.back()
        }
      })
      return
    }
    ui.back()
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
    if (this.finished || this.data.revealed) return
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

  /* 下一题：没作答也可以直接跳（交卷时按未作答算错） */
  next: function () {
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

  copyReference: function () {
    var ref = this.data.cur.reference
    if (ref && /^https:\/\//.test(ref.url)) wx.setClipboardData({data:ref.url})
  },

  toggleFollowUp: function () {
    this.setData({followUpOpen: !this.data.followUpOpen})
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
    var skipped = 0
    var items = list.map(function (q) {
      var a = self.answers[q.id] || { picked: [], answered: false, right: false }
      var right = a.answered && a.right
      if (!a.answered) skipped += 1
      if (!self.data.instant || !a.answered) {
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
      count: this.data.count,
      level: this.data.level, course: this.data.course, track: this.data.track, topic: this.data.topic, search: this.data.search,
      modeName: this.data.modeName,
      total: list.length,
      correct: correct,
      skipped: skipped,
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

    // 这一轮结束了，别再让人「继续」到已完成的进度
    store.clearProgress()

    wx.redirectTo({ url: '/pages/result/result' })
  }
})

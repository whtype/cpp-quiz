/**
 * 本地存储：答题进度、错题本、收藏夹、答题记录
 * 全部使用 wx.setStorageSync，保证关闭小程序后数据仍在
 */

var STATS_KEY = 'cpp_quiz_stats_v1'
var SESSION_KEY = 'cpp_quiz_session_v1'
var REMOTE_KEY = 'cpp_quiz_remote_v1'

function defaultStats() {
  return {
    answered: 0,      // 累计作答次数
    correct: 0,       // 累计答对次数
    records: {},      // { qid: { t: 作答次数, c: 答对次数, last: 0错/1对 } }
    wrong: [],        // 错题本 id 列表（当前未攻克）
    wrongCount: {},   // { qid: 累计错误次数 }
    fav: [],          // 收藏 id 列表
    history: []       // 最近 20 次练习记录
  }
}

function getStats() {
  try {
    var s = wx.getStorageSync(STATS_KEY)
    if (!s || typeof s !== 'object') return defaultStats()
    var d = defaultStats()
    return {
      answered: s.answered || 0,
      correct: s.correct || 0,
      records: s.records || {},
      wrong: s.wrong || [],
      wrongCount: s.wrongCount || {},
      fav: s.fav || [],
      history: s.history || []
    }
  } catch (e) {
    return defaultStats()
  }
}

function saveStats(s) {
  try {
    wx.setStorageSync(STATS_KEY, s)
  } catch (e) {
    // 忽略存储失败
  }
}

/** 记录一次作答 */
function record(qid, right) {
  var s = getStats()
  s.answered += 1
  if (right) s.correct += 1

  var r = s.records[qid] || { t: 0, c: 0, last: 0 }
  r.t += 1
  if (right) r.c += 1
  r.last = right ? 1 : 0
  s.records[qid] = r

  if (right) {
    // 答对即从错题本移除
    var i = s.wrong.indexOf(qid)
    if (i >= 0) s.wrong.splice(i, 1)
  } else {
    if (s.wrong.indexOf(qid) < 0) s.wrong.push(qid)
    s.wrongCount[qid] = (s.wrongCount[qid] || 0) + 1
  }

  saveStats(s)
  return s
}

function getRecord(qid) {
  var s = getStats()
  return s.records[qid] || null
}

/** 收藏 / 取消收藏，返回收藏后的状态 */
function toggleFav(qid) {
  var s = getStats()
  var i = s.fav.indexOf(qid)
  if (i >= 0) {
    s.fav.splice(i, 1)
    saveStats(s)
    return false
  }
  s.fav.push(qid)
  saveStats(s)
  return true
}

function isFav(qid) {
  return getStats().fav.indexOf(qid) >= 0
}

function getFavIds() { return getStats().fav.slice() }
function getWrongIds() { return getStats().wrong.slice() }

function removeWrong(qid) {
  var s = getStats()
  var i = s.wrong.indexOf(qid)
  if (i >= 0) s.wrong.splice(i, 1)
  saveStats(s)
  return s.wrong
}

function clearWrong() {
  var s = getStats()
  s.wrong = []
  saveStats(s)
}

function clearFav() {
  var s = getStats()
  s.fav = []
  saveStats(s)
}

/** 某题累计错误次数 */
function wrongTimes(qid) {
  return getStats().wrongCount[qid] || 0
}

/** 已掌握：答对过且当前不在错题本 */
function masteredCount() {
  var s = getStats()
  var n = 0
  Object.keys(s.records).forEach(function (k) {
    if (s.records[k].c > 0 && s.wrong.indexOf(k) < 0) n += 1
  })
  return n
}

/** 正确率（整数百分比），未作答返回 0 */
function accuracy() {
  var s = getStats()
  if (!s.answered) return 0
  return Math.round((s.correct / s.answered) * 100)
}

/** 分类维度的统计 */
function catStat(cat, questions) {
  var s = getStats()
  var total = 0, done = 0, right = 0
  questions.forEach(function (q) {
    if (q.cat !== cat) return
    total += 1
    var r = s.records[q.id]
    if (r && r.t > 0) {
      done += 1
      if (r.c > 0) right += 1
    }
  })
  return {
    total: total,
    done: done,
    right: right,
    percent: total ? Math.round((done / total) * 100) : 0
  }
}

/** 保存一次练习结果，供结果页读取 */
function setSession(session) {
  try {
    wx.setStorageSync(SESSION_KEY, session)
  } catch (e) {}
}

function getSession() {
  try {
    return wx.getStorageSync(SESSION_KEY) || null
  } catch (e) {
    return null
  }
}

/** 追加一条历史记录 */
function addHistory(item) {
  var s = getStats()
  s.history.unshift(item)
  if (s.history.length > 20) s.history = s.history.slice(0, 20)
  saveStats(s)
}

/** 在线导入的题库 */
function saveRemote(list) {
  try {
    wx.setStorageSync(REMOTE_KEY, list)
  } catch (e) {
    // 题目过多可能超出单 key 容量，此时放弃缓存但本次会话仍可用
  }
}

function getRemote() {
  try {
    return wx.getStorageSync(REMOTE_KEY) || []
  } catch (e) {
    return []
  }
}

/** 与已有的在线题库按 id 去重合并，返回 { total, added } */
function mergeRemote(list) {
  var cur = getRemote()
  var map = {}
  var added = 0
  cur.forEach(function (q) { if (q && q.id) map[q.id] = q })
  ;(list || []).forEach(function (q) {
    if (!q || !q.id || map[q.id]) return
    map[q.id] = q
    added += 1
  })
  var out = Object.keys(map).map(function (k) { return map[k] })
  saveRemote(out)
  return { total: out.length, added: added }
}

function clearRemote() {
  try {
    wx.removeStorageSync(REMOTE_KEY)
  } catch (e) {}
}

/** 清空所有学习数据 */
function resetAll() {
  try {
    wx.removeStorageSync(STATS_KEY)
    wx.removeStorageSync(SESSION_KEY)
  } catch (e) {}
}

module.exports = {
  getStats: getStats,
  record: record,
  getRecord: getRecord,
  toggleFav: toggleFav,
  isFav: isFav,
  getFavIds: getFavIds,
  getWrongIds: getWrongIds,
  removeWrong: removeWrong,
  clearWrong: clearWrong,
  clearFav: clearFav,
  wrongTimes: wrongTimes,
  masteredCount: masteredCount,
  accuracy: accuracy,
  catStat: catStat,
  setSession: setSession,
  getSession: getSession,
  addHistory: addHistory,
  saveRemote: saveRemote,
  getRemote: getRemote,
  mergeRemote: mergeRemote,
  clearRemote: clearRemote,
  resetAll: resetAll
}

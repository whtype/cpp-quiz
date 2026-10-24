/**
 * 在线题库源
 * ---------------------------------------------------------------
 * 设计原则：开源题一律不打包进小程序包体。
 * 用户打开小程序时按需拉取 → 转成本地格式 → 存进 Storage 缓存，
 * 下次直接读缓存（秒开），点「刷新」才重新联网。
 *
 * 支持的源类型：
 *   json  标准题目 JSON（自动适配多种格式，见 utils/adapter.js）
 *   api   开放式出题接口（如 Open Trivia DB）
 *   text  纯文本 / Markdown（按「题干 + A. B. C. D. + 答案：X」解析）
 */

var adapter = require('./adapter')

var CATALOG = [
  {
    id: 'cpp11',
    name: 'C++11 核心特性',
    desc: 'auto / lambda / 右值引用 / 智能指针',
    tag: 'C++',
    type: 'json',
    cat: 'modern',
    url: 'https://cdn.jsdelivr.net/gh/celilygt/cpp-quiz@master/content/questions/cpp11.json',
    on: true
  },
  {
    id: 'cpp14',
    name: 'C++14 特性',
    desc: '泛型 lambda / 变量模板 / make_unique',
    tag: 'C++',
    type: 'json',
    cat: 'modern',
    url: 'https://cdn.jsdelivr.net/gh/celilygt/cpp-quiz@master/content/questions/cpp14.json',
    on: true
  },
  {
    id: 'cpp17',
    name: 'C++17 特性',
    desc: '结构化绑定 / if constexpr / optional',
    tag: 'C++',
    type: 'json',
    cat: 'modern',
    url: 'https://cdn.jsdelivr.net/gh/celilygt/cpp-quiz@master/content/questions/cpp17.json',
    on: true
  },
  {
    id: 'cpp20',
    name: 'C++20 特性',
    desc: 'concepts / ranges / 协程 / 三向比较',
    tag: 'C++',
    type: 'json',
    cat: 'modern',
    url: 'https://cdn.jsdelivr.net/gh/celilygt/cpp-quiz@master/content/questions/cpp20.json',
    on: true
  },
  {
    id: 'otdb',
    name: '计算机基础',
    desc: 'Open Trivia DB 开放接口 · 英文 · 每次随机',
    tag: '扩充',
    type: 'api',
    cat: 'syntax',
    url: 'https://opentdb.com/api.php?amount=50&category=18&type=multiple',
    on: false
  }
]

var KEY_ON = 'cpp_quiz_src_on_v1'        // 已启用的源 id
var KEY_STATE = 'cpp_quiz_src_state_v1'  // 每个源上次加载到的题数

function readJSON(key, def) {
  try {
    var v = wx.getStorageSync(key)
    return (v === '' || v === null || v === undefined) ? def : v
  } catch (e) {
    return def
  }
}

function writeJSON(key, val) {
  try { wx.setStorageSync(key, val) } catch (e) {}
}

/** 源列表（带启用状态 / 已加载题数） */
function list() {
  var on = readJSON(KEY_ON, null)
  var state = readJSON(KEY_STATE, {}) || {}
  return CATALOG.map(function (s) {
    var enabled = on ? on.indexOf(s.id) >= 0 : !!s.on
    var st = state[s.id] || {}
    return {
      id: s.id,
      name: s.name,
      desc: s.desc,
      tag: s.tag,
      type: s.type,
      cat: s.cat,
      url: s.url,
      enabled: enabled,
      cached: st.n || 0,
      time: st.t || ''
    }
  })
}

function getOn() {
  var on = readJSON(KEY_ON, null)
  if (on) return on
  return CATALOG.filter(function (s) { return s.on }).map(function (s) { return s.id })
}

function setOn(ids) {
  writeJSON(KEY_ON, ids)
  return ids
}

function toggle(id, on) {
  var ids = getOn()
  var i = ids.indexOf(id)
  if (on && i < 0) ids.push(id)
  if (!on && i >= 0) ids.splice(i, 1)
  setOn(ids)
  return ids
}

function markLoaded(id, n) {
  var state = readJSON(KEY_STATE, {}) || {}
  var d = new Date()
  state[id] = {
    n: n,
    t: (d.getMonth() + 1) + '/' + d.getDate()
  }
  writeJSON(KEY_STATE, state)
}

function resetState() {
  writeJSON(KEY_STATE, {})
}

/** 抓取：优先云函数代理（无域名限制），失败退回 wx.request 直连 */
function fetchRaw(url) {
  return new Promise(function (resolve, reject) {
    var app = null
    try { app = getApp() } catch (e) {}
    var useCloud = !!(app && app.globalData && app.globalData.cloudReady)

    if (useCloud && wx.cloud && wx.cloud.callFunction) {
      wx.cloud.callFunction({ name: 'fetchBank', data: { url: url } })
        .then(function (r) {
          var res = (r && r.result) || {}
          if (res.statusCode === 200 && res.body) resolve(res.body)
          else reject(new Error(res.error || '代理返回异常'))
        })
        .catch(reject)
      return
    }

    wx.request({
      url: url,
      method: 'GET',
      dataType: 'text',
      timeout: 20000,
      success: function (res) {
        if (res.statusCode !== 200) { reject(new Error('HTTP ' + res.statusCode)); return }
        resolve(res.data)
      },
      fail: function () { reject(new Error('网络不可达')) }
    })
  })
}

function toJson(body) {
  if (body && typeof body === 'object') return body
  var s = String(body)
  try { return JSON.parse(s) } catch (e) {}
  // 有些 CDN 会返回带前缀的 JSONP
  var a = s.indexOf('{'), b = s.lastIndexOf('}')
  if (s.charAt(0) === '[') { a = 0; b = s.lastIndexOf(']') }
  if (a >= 0 && b > a) {
    try { return JSON.parse(s.slice(a, b + 1)) } catch (e) {}
  }
  return null
}

/** 拉一个源并转换成题目数组 */
function fetchSource(src, existIds) {
  return fetchRaw(src.url).then(function (body) {
    if (src.type === 'text') {
      return adapter.parseText(String(body), src.cat, existIds)
    }
    var json = toJson(body)
    if (!json) throw new Error('返回内容不是 JSON')
    return adapter.normalize(json, existIds)
  })
}

/**
 * 批量加载
 * @param {Array} srcs 源对象数组（来自 list()）
 * @param {Array} existIds 已存在的题目 id（用于去重）
 * @param {Function} onProgress (loaded, total)
 * @returns Promise<{ list, per, added, ok, fail }>
 */
function loadMany(srcs, existIds, onProgress) {
  var exist = {}
  ;(existIds || []).forEach(function (id) { exist[id] = 1 })

  var list = []
  var per = []
  var failed = 0
  var done = 0

  function step(i) {
    if (i >= srcs.length) {
      return Promise.resolve({
        list: list,
        per: per,
        added: list.length,
        ok: srcs.length - failed,
        fail: failed
      })
    }
    var src = srcs[i]
    return fetchSource(src, Object.keys(exist)).then(function (res) {
      var picked = []
      ;(res.list || []).forEach(function (q) {
        if (exist[q.id]) return
        exist[q.id] = 1
        picked.push(q)
      })
      list = list.concat(picked)
      per.push({ id: src.id, name: src.name, ok: true, added: picked.length, total: res.total || 0, skipped: res.skipped || 0 })
      if (picked.length) markLoaded(src.id, picked.length)
      return null
    }).catch(function (e) {
      failed += 1
      per.push({ id: src.id, name: src.name, ok: false, added: 0, err: e.message || '加载失败' })
      return null
    }).then(function () {
      done += 1
      if (onProgress) onProgress(done, srcs.length)
      return step(i + 1)
    })
  }

  return step(0)
}

/** 通过自定义链接加载（类型按扩展名猜） */
function customSource(url, cat) {
  var u = String(url)
  var text = /\.(md|markdown|txt)$/i.test(u) || u.indexOf('opentdb.com') >= 0
  return {
    id: 'custom_' + Math.abs(hash(u)),
    name: '自定义链接',
    desc: u,
    tag: '自定义',
    type: u.indexOf('opentdb.com') >= 0 ? 'api' : (text ? 'text' : 'json'),
    cat: cat || 'syntax',
    url: u,
    on: true
  }
}

function hash(s) {
  var h = 5381
  for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  return h
}

module.exports = {
  CATALOG: CATALOG,
  list: list,
  getOn: getOn,
  setOn: setOn,
  toggle: toggle,
  resetState: resetState,
  fetchRaw: fetchRaw,
  fetchSource: fetchSource,
  loadMany: loadMany,
  customSource: customSource
}

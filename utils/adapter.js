/**
 * 题库格式适配器
 * 把各种来源的题库 JSON 统一转换为本小程序的题目结构：
 *   { id, cat, type, level, q, code, options, ans:[idx], exp }
 *
 * 已支持的源格式：
 *  1) 本小程序标准格式：{ q, options, ans:[0], exp, code?, cat?, type?, level? }
 *  2) celilygt/cpp-quiz：{ type:'true_false'|'multiple_choice'|'matching', statement|question,
 *                          answer(bool) | correctIndex(number), options, explanation, codeSnippet, difficulty }
 *  3) 通用下标格式：{ question, options, answer: 0 }
 *  4) 通用文本答案：{ question, options, correct_answer: 'B文本' } / { correct: '文本' }
 *  5) Open Trivia DB 风格：{ question, correct_answer, incorrect_answers }
 */

var LV = { beginner: 1, easy: 1, intermediate: 2, medium: 2, advanced: 3, hard: 3 }
var CATS = ['syntax', 'algo', 'interview', 'modern']

/**
 * 稳定 id：由题干内容算出的短 hash。
 * 在线源没有 id（或每次随机打乱选项）时，用它保证「重复加载同一题不会重复入库」。
 */
function hashId(s) {
  var str = String(s)
  var h = 5381
  for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0
  return h.toString(36)
}

/** 解码 HTML 实体（Open Trivia DB 的题干里带 &#039; 之类） */
function decodeEnt(s) {
  return String(s)
    .replace(/&#(\d+);/g, function (m, d) { return String.fromCharCode(parseInt(d, 10)) })
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function pickLevel(v) {  if (typeof v === 'number' && v >= 1 && v <= 3) return v
  if (typeof v === 'string') return LV[v.toLowerCase()] || 2
  return 2
}

function pickCat(v) {
  return CATS.indexOf(v) >= 0 ? v : 'syntax'
}

function pickType(v, ansLen) {
  if (v === 'multi' || v === 'judge' || v === 'single') return v
  if (ansLen > 1) return 'multi'
  return 'single'
}

/** 单条转换，失败返回 null */
function convert(raw, seq) {
  if (!raw || typeof raw !== 'object') return null

  var q = '', options = null, ans = null, exp = '', code = '', type = '', level = 2, cat = 'syntax'

  // --- 2) celilygt 格式 ---
  if (raw.type === 'true_false' || raw.type === 'multiple_choice' || raw.type === 'matching') {
    if (raw.type === 'matching') return null          // 配对题无法转为选择题，丢弃
    if (raw.type === 'true_false') {
      q = raw.statement || raw.question || ''
      options = ['正确', '错误']
      ans = raw.answer === true || raw.answer === 'true' ? [0] : [1]
      type = 'judge'
    } else {
      q = raw.question || ''
      options = raw.options
      if (typeof raw.correctIndex === 'number') ans = [raw.correctIndex]
      else if (typeof raw.correct === 'number') ans = [raw.correct]
      type = 'single'
    }
    exp = raw.explanation || ''
    code = raw.codeSnippet || ''
    if (raw.topic) code = '// topic: ' + raw.topic + (code ? '\n' + code : '')
    level = pickLevel(raw.difficulty)
    cat = 'modern'

    // 与内置开源题库保持同一 id 前缀，保证在线更新时能正确去重
    return finish(raw.id ? 'o-' + raw.id : ('oen' + hashId(q)), q, code, options, ans, exp, type, level, cat)
  }

  // --- 5) Open Trivia DB ---
  if (Array.isArray(raw.incorrect_answers) && raw.correct_answer) {
    q = decodeEnt(raw.question || '')
    var opts = raw.incorrect_answers.map(decodeEnt)
    var ci = Math.floor(Math.random() * (opts.length + 1))
    opts.splice(ci, 0, decodeEnt(raw.correct_answer))
    return finish(raw.id || ('tv' + hashId(q)), q, '', opts, [ci], '', 'single', pickLevel(raw.difficulty), 'syntax')
  }

  // --- 1) / 3) / 4) 通用格式 ---
  q = raw.q || raw.question || raw.title || raw.statement || ''
  options = raw.options || raw.choices || raw.answers
  code = raw.code || raw.codeSnippet || ''
  exp = raw.exp || raw.explanation || raw.analysis || '暂无解析'
  cat = pickCat(raw.cat || raw.category)
  level = pickLevel(raw.level || raw.difficulty)
  type = raw.type || ''

  if (!Array.isArray(options) || options.length < 2) return null

  if (Array.isArray(raw.ans) && raw.ans.length) {
    ans = raw.ans
  } else if (typeof raw.answer === 'number') {
    ans = [raw.answer]
  } else if (typeof raw.answer === 'string') {
    var i1 = options.indexOf(raw.answer)
    if (i1 < 0) i1 = ['A', 'B', 'C', 'D', 'E', 'F'].indexOf(raw.answer.toUpperCase())
    if (i1 < 0) return null
    ans = [i1]
  } else if (typeof raw.correct_answer === 'string' || typeof raw.correct === 'string') {
    var target = raw.correct_answer || raw.correct
    var i2 = options.indexOf(target)
    if (i2 < 0) i2 = ['A', 'B', 'C', 'D', 'E', 'F'].indexOf(String(target).toUpperCase())
    if (i2 < 0) return null
    ans = [i2]
  }

  if (!ans || !ans.length) return null

  // 答案可能是字符串下标
  ans = ans.map(function (n) { return typeof n === 'string' ? parseInt(n, 10) : n })
  var ins = 'r' + hashId(String(q) + '|' + options.join('|'))
  return finish(raw.id || ins, q, code, options, ans, exp, pickType(type, ans.length), level, cat)
}

function finish(id, q, code, options, ans, exp, type, level, cat) {
  if (!q || !String(q).trim()) return null
  if (!Array.isArray(options) || options.length < 2) return null
  var valid = ans.every(function (n) {
    return typeof n === 'number' && n >= 0 && n < options.length
  })
  if (!valid) return null
  return {
    id: String(id),
    cat: cat,
    type: type,
    level: level,
    q: String(q),
    code: code ? String(code) : '',
    options: options.map(function (o) { return String(o) }),
    ans: ans,
    exp: exp ? String(exp) : '暂无解析'
  }
}

/**
 * 批量转换
 * @param {Array|Object} raw  数组，或 { questions: [...] }
 * @param {Array} existIds    已存在的题目 id（用于去重）
 * @returns { list, total, converted, skipped, dup }
 */
function normalize(raw, existIds) {
  var arr = Array.isArray(raw) ? raw : (raw && (raw.questions || raw.results))
  if (!Array.isArray(arr)) return { list: [], total: 0, converted: 0, skipped: 0, dup: 0 }

  var exist = {}
  ;(existIds || []).forEach(function (id) { exist[id] = 1 })

  var list = [], skipped = 0, dup = 0
  arr.forEach(function (item, i) {
    var one = convert(item, i)
    if (!one) { skipped += 1; return }
    if (exist[one.id]) { dup += 1; return }
    exist[one.id] = 1
    list.push(one)
  })

  return {
    list: list,
    total: arr.length,
    converted: list.length,
    skipped: skipped,
    dup: dup
  }
}

/* ==========================================================
   纯文本解析：把从牛客 / 网页 / Word 复制出来的题目文本，
   自动切成结构化题目（无需手写 JSON）
   ========================================================== */

var OPT_RE = /^[（(]?([A-Ha-h])[）)\.、．:：]\s*(.*)$/
// 兼容：答案：B / 【答案】B / （答案:B）/ Answer - AB / 答案 AB
var ANS_RE = /(?:正确答案|参考答案|标准答案|答案|answer)\s*[^A-Za-z\u4e00-\u9fa5\n]{0,3}\s*([A-Ha-h](?:\s*[、,，\/]\s*[A-Ha-h])*)/i
var EXP_RE = /^\s*[【\[（(]?\s*(?:解析|解释|详解|答案解析|试题解析|说明)\s*[】\]）)]?\s*[:：]?\s*(.*)$/
var NUM_RE = /^\s*(?:第\s*)?\d{1,3}\s*(?:题)?\s*[.、)．：:]\s*/
var NUM_HEAD_RE = /^\s*(?:第\s*)?\d{1,3}\s*(?:题)?\s*[.、)．：:]\s*\S/
var JUDGE_WORDS = ['正确', '错误', '对', '错', 'true', 'false', 'yes', 'no']

function isJudge(options) {
  if (options.length !== 2) return false
  return options.every(function (o) {
    var v = String(o).toLowerCase().trim()
    return JUDGE_WORDS.some(function (w) { return v === w || v.indexOf(w) === 0 })
  })
}

/**
 * 解析纯文本题目
 * @param {String} text 题目文本（可含多题）
 * @param {String} cat  默认分类
 * @param {Array} existIds 已存在 id（去重）
 */
function parseText(text, cat, existIds) {
  var empty = { list: [], total: 0, converted: 0, skipped: 0, dup: 0 }
  if (!text || !String(text).trim()) return empty

  var lines = String(text).split(/\r?\n/)
  var items = []
  var cur = null

  function flush() {
    if (!cur) return
    if (cur.q && cur.options.length >= 2 && cur.ans && cur.ans.length) {
      items.push(cur)
    }
    cur = null
  }

  lines.forEach(function (raw) {
    var line = String(raw).trim()
    if (!line) return

    // 出现新题号且上一题已有选项/答案 → 强制切题（防止下一题被并进上一题）
    if (NUM_HEAD_RE.test(line) && cur && (cur.options.length || cur.ans.length)) {
      flush()
    }

    var m = line.match(ANS_RE)
    if (m) {
      if (!cur) cur = { q: '', options: [], ans: [], exp: '' }
      var letters = m[1].toUpperCase().replace(/[^A-H]/g, '').split('')
      cur.ans = letters.map(function (c) { return c.charCodeAt(0) - 65 })
      flush()
      return
    }

    m = line.match(EXP_RE)
    if (m) {
      var tail = cur || items[items.length - 1]
      if (tail) tail.exp = (tail.exp ? tail.exp + '\n' : '') + (m[1] || '').trim()
      return
    }

    m = line.match(OPT_RE)
    if (m && cur && cur.q) {
      // 只有已经出现题干时，A. B. 开头的行才算选项
      cur.options.push(m[2].trim())
      return
    }

    if (!cur) cur = { q: '', options: [], ans: [], exp: '' }
    if (!cur.options.length) {
      var q = line.replace(NUM_RE, '')
      cur.q = cur.q ? cur.q + '\n' + q : q
    } else {
      cur.options[cur.options.length - 1] += '\n' + line
    }
  })
  flush()

  var exist = {}
  ;(existIds || []).forEach(function (id) { exist[id] = 1 })

  var list = [], skipped = 0, dup = 0
  items.forEach(function (it, i) {
    var opts = it.options.map(function (o) { return String(o).trim() }).filter(function (o) { return o })
    var ans = it.ans.filter(function (n) { return n >= 0 && n < opts.length })
    if (!it.q.trim() || opts.length < 2 || !ans.length) { skipped += 1; return }

    var type = ans.length > 1 ? 'multi' : (isJudge(opts) ? 'judge' : 'single')
    // 用题干 hash 做 id：同一段文本重复导入不会重复入库
    var id = 't' + hashId(it.q.trim() + '|' + opts.join('|'))
    if (exist[id]) { dup += 1; return }
    exist[id] = 1

    list.push({
      id: id,
      cat: cat || 'syntax',
      type: type,
      level: 2,
      q: it.q.trim(),
      code: '',
      options: opts,
      ans: ans,
      exp: it.exp ? it.exp.trim() : '暂无解析'
    })
  })

  return { list: list, total: items.length, converted: list.length, skipped: skipped, dup: dup }
}

module.exports = {
  normalize: normalize,
  convert: convert,
  parseText: parseText
}

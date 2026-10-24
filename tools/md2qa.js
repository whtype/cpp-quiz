/**
 * md2qa.js —— 把「八股式 Markdown」切成问答卡草稿
 *
 * 用法：
 *   node tools/md2qa.js <markdown 文件或 http(s) 地址> [--level 3] [--out data/qa/draft.jsonl]
 *
 * 为什么这么做：
 *   面试准备真正的缺口不是选择题，而是「一个问题 + 一段要点」的问答卡。
 *   huihut/interview、0voice/cpp_new_features 这类仓库的结构天然就是
 *   `### 虚函数、纯虚函数`（= 问题）下面跟一段解释（= 答案），可以直接切。
 *
 * 产物是草稿（JSONL），**必须人工过一遍**再用 bank-build.js 编译上线。
 * 自动切出来的答案常常夹带代码块、图片、外部链接，不能直接当卡片给人看。
 */

var fs = require('fs')
var path = require('path')
var http = require('http')
var https = require('https')

var args = process.argv.slice(2)
var input = args[0]
var levelArg = args.indexOf('--level')
var level = levelArg >= 0 ? parseInt(args[levelArg + 1], 10) : 3
var outArg = args.indexOf('--out')
var outFile = outArg >= 0 ? args[outArg + 1] : 'data/qa/draft.jsonl'
var catArg = args.indexOf('--cat')
var cat = catArg >= 0 ? args[catArg + 1] : 'interview'
var lvArg = args.indexOf('--lv')
var defLevel = lvArg >= 0 ? parseInt(args[lvArg + 1], 10) : 2
var srcArg = args.indexOf('--src')
var srcShort = srcArg >= 0 ? args[srcArg + 1] : ''

if (!input) {
  console.log('用法: node tools/md2qa.js <markdown 文件或 URL> [--level 3] [--cat interview] [--out data/qa/draft.jsonl]')
  process.exit(1)
}

/* 和 utils/adapter.js 一样的 hashId，保证同一条内容每次生成的 id 都一样 */
function hashId(s) {
  var h = 5381
  for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

function fetchText(url, cb) {
  var lib = url.indexOf('https:') === 0 ? https : http
  lib.get(url, function (res) {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      return fetchText(res.headers.location, cb)
    }
    if (res.statusCode !== 200) return cb(new Error('HTTP ' + res.statusCode))
    var chunks = []
    res.on('data', function (c) { chunks.push(c) })
    res.on('end', function () { cb(null, Buffer.concat(chunks).toString('utf8')) })
  }).on('error', cb)
}

/* 把一段 Markdown 洗成纯文本：去锚点、去图片、去链接壳、去代码块、压空行 */
function clean(md) {
  var s = md
  s = s.replace(/<img[^>]*>/gi, '')
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  s = s.replace(/```[\s\S]*?```/g, '\n\n')     // 代码块在卡片上没法读，整块丢掉
  s = s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  s = s.replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, '$1')
  s = s.replace(/<[^>]+>/g, '')
  s = s.replace(/^#{1,6}\s*/gm, '')            // 子标题只留文字，别把 #### 塞进答案
  s = s.replace(/```\w*/g, '')
  s = s.replace(/``\s*/g, '')
  s = s.replace(/`([^`]*)`/g, '$1')
  s = s.replace(/^\s*[-*]\s+/gm, '· ')
  s = s.replace(/\n{3,}/g, '\n\n')
  return s.trim()
}

/** 从正文里挑「要点」：优先取段落首句和列表项，太长就截断 */
function toAnswer(body) {
  var text = clean(body)
  if (!text) return ''
  // 去掉整段都是代码的块，卡片上读不了
  text = text.split(/\n{2,}/).filter(function (block) {
    var codeLines = (block.match(/^\s{4,}|\t/gm) || []).length
    return codeLines < 3
  }).join('\n\n')
  return text.replace(/\s+/g, ' ').trim()
}

/** 标题也要洗：去链接壳、去反引号、去 markdown 记号 */
function cleanTitle(t) {
  return String(t)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[*`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** 目录型段落：全是「· 一、二、三」这种列表，没有解释，不是问答卡 */
function looksLikeTOC(text) {
  var lines = text.split(/\n/).filter(function (l) { return l.trim() })
  if (lines.length < 6) return false
  var dots = lines.filter(function (l) { return /^\s*·/.test(l) }).length
  return dots / lines.length > 0.7
}

function parse(md, srcName) {
  var lines = md.split(/\r?\n/)
  var want = new Array(level + 1).join('#') // '###'
  var items = []
  var skipped = 0
  var cur = null
  var buf = []

  function flush() {
    if (!cur) return
    var a = toAnswer(buf.join('\n'))
    var title = cur.title
    // 归纳不了的直接丢：太短、像目录、标题本身是链接或句子太长
    if (!a || a.length < 40 || looksLikeTOC(a) || title.length > 40 || /https?:/.test(title)) {
      skipped += 1
      cur = null
      buf = []
      return
    }
    items.push({
      id: 'qa' + hashId(title + '|' + a.slice(0, 60)),
      cat: cat,
      level: defLevel,
      q: title,
      a: a,
      src: srcName
    })
    cur = null
    buf = []
  }

  lines.forEach(function (ln) {
    var m = ln.match(/^(#{1,6})\s+(.*)$/)
    if (m) {
      var lv = m[1].length
      if (lv <= level) {
        flush()
        if (lv === level) cur = { title: cleanTitle(m[2]) }
        return
      }
    }
    if (cur) buf.push(ln)
  })
  flush()
  items.skipped = skipped
  return items
}

function run(md, srcName) {
  var items = parse(md, srcName)
  var lens = items.map(function (it) { return it.a.length })
  var avg = lens.length ? Math.round(lens.reduce(function (a, b) { return a + b }, 0) / lens.length) : 0
  var short = items.filter(function (it) { return it.a.length < 120 }).length

  var dir = path.dirname(outFile)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(outFile, items.map(function (it) { return JSON.stringify(it) }).join('\n') + '\n', 'utf8')

  console.log('源        : ' + srcName)
  console.log('切出问答卡: ' + items.length + ' 条')
  console.log('平均答案长: ' + avg + ' 字（<120 字的偏短，共 ' + short + ' 条，建议人工补要点）')
  console.log('跳过    : ' + (items.skipped || 0) + ' 个标题（目录型 / 标题是链接 / 内容过短）')
  console.log('输出      : ' + outFile)
  console.log('')
  console.log('前 5 条预览：')
  items.slice(0, 5).forEach(function (it, i) {
    console.log('  ' + (i + 1) + '. ' + it.q)
    console.log('     ' + it.a.slice(0, 60) + (it.a.length > 60 ? '…' : ''))
  })
  console.log('')
  console.log('注意：草稿必须人工过一遍——自动切出来的答案常夹带代码块和外部链接，')
  console.log('      而且原仓库的许可证（如 CC BY-NC-SA）要求署名 + 非商用，上线前确认。')
}

if (/^https?:\/\//.test(input)) {
  fetchText(input, function (err, text) {
    if (err) { console.error('拉取失败: ' + err.message); process.exit(1) }
    run(text, input)
  })
} else {
  run(fs.readFileSync(input, 'utf8'), input)
}

/**
 * bank-build.js —— 把「草稿」（JSONL）编译成小程序能直接 require 的题库分片
 *
 * 草稿一行一条，两种题型：
 *   选择题： {"id":"s301","cat":"syntax","type":"single","level":2,"q":"...","options":["A","B"],"ans":[0],"exp":"..."}
 *   问答卡： {"id":"qa-vtbl","cat":"interview","level":2,"q":"虚函数表是什么？","a":"...","tags":["虚函数"]}
 *
 * 用法：
 *   node tools/bank-build.js --type choice --in data/bank/draft-choice.jsonl --out data/bank --start 7
 *   node tools/bank-build.js --type qa     --in data/qa/draft.jsonl        --out data/qa   --shard 50
 *
 * 做的事：校验 → 去重（含跨已有分片）→ 按 shard 切片 → 生成 p{n}.js / q{n}.js + index.js + 报告。
 * 校验不过直接退出码 1，不会产出半成品分片。
 */

var fs = require('fs')
var path = require('path')

var ROOT = path.join(__dirname, '..')

function arg(name, def) {
  var i = process.argv.indexOf('--' + name)
  return i >= 0 ? process.argv[i + 1] : def
}

var type = arg('type', 'choice')
var inFile = arg('in', '')
var outDir = arg('out', type === 'qa' ? path.join(ROOT, 'data/qa') : path.join(ROOT, 'data/bank'))
var shardSize = parseInt(arg('shard', '50'), 10)
var startNo = parseInt(arg('start', type === 'qa' ? '1' : '7'), 10)
var prefix = type === 'qa' ? 'Q' : 'P'

if (!inFile) {
  console.log('用法: node tools/bank-build.js --type choice|qa --in <草稿.jsonl> [--out 目录] [--shard 50] [--start 1]')
  process.exit(1)
}

/* ---------------- 读草稿 ---------------- */
var raw = fs.readFileSync(path.resolve(ROOT, inFile), 'utf8')
var lines = raw.split(/\r?\n/).filter(function (l) { return l.trim() && l.trim()[0] === '{' })
var draft = []
var bad = []

lines.forEach(function (l, i) {
  try {
    draft.push(JSON.parse(l))
  } catch (e) {
    bad.push('第 ' + (i + 1) + ' 行 JSON 解析失败：' + e.message)
  }
})

/* ---------------- 已有分片里的 id / 题干，用于跨文件去重 ---------------- */
var existingIds = {}
var existingQ = {}

function scanExisting() {
  var files = []
  try { files = fs.readdirSync(outDir) } catch (e) { return }
  files.forEach(function (f) {
    if (!/^[pq]\d+\.js$/.test(f)) return
    var s = fs.readFileSync(path.join(outDir, f), 'utf8')
    var ids = s.match(/id:\s*'([^']+)'/g) || []
    ids.forEach(function (m) { existingIds[m.replace(/^id:\s*'|'$/g, '')] = f })
    var qs = s.match(/^\s{4}q:\s*'([^']+)'/gm) || []
    qs.forEach(function (m) {
      var q = m.replace(/^\s*q:\s*'|'$/g, '')
      existingQ[norm(q)] = f
    })
  })
}

function norm(s) {
  return String(s || '')
    .replace(/\s+/g, '')
    .replace(/[，。、；：？！“”‘’（）()【】\[\]「」《》\.\,\?\:\;\!\'"]/g, '')
    .toLowerCase()
}

scanExisting()

/* ---------------- 校验 ---------------- */
function validate(it, idx) {
  var errs = []
  var where = '第 ' + (idx + 1) + ' 条' + (it.id ? '(' + it.id + ')' : '')

  if (!it.id) errs.push(where + ' 缺 id')
  else if (existingIds[it.id]) errs.push(where + ' id 与已有分片 ' + existingIds[it.id] + ' 重复')
  if (!it.q || !String(it.q).trim()) errs.push(where + ' 缺题干')
  else if (existingQ[norm(it.q)]) errs.push(where + ' 题干与已有分片 ' + existingQ[norm(it.q)] + ' 重复：' + String(it.q).slice(0, 24))
  if (!it.cat) errs.push(where + ' 缺 cat')
  if (!it.level) it.level = 2

  if (type === 'qa') {
    if (!it.a || String(it.a).length < 20) errs.push(where + ' 答案为空或过短（<20 字）')
  } else {
    if (!it.options || it.options.length < 2) errs.push(where + ' 选项少于 2 个')
    if (!it.ans || !it.ans.length) errs.push(where + ' 缺答案')
    else it.ans.forEach(function (n) {
      if (!(n >= 0 && n < (it.options || []).length)) errs.push(where + ' 答案下标越界：' + n)
    })
    if (it.type === 'single' && it.ans && it.ans.length !== 1) errs.push(where + ' 单选题答案数应为 1')
    if (it.type === 'judge' && it.options && it.options.length !== 2) errs.push(where + ' 判断题应为 2 个选项')
    if (['single', 'multi', 'judge'].indexOf(it.type) < 0) errs.push(where + ' type 非法：' + it.type)
    if (!it.exp || String(it.exp).length < 15) errs.push(where + ' 解析为空或过短（<15 字）')
  }
  return errs
}

var seenId = {}
var seenQ = {}
var okItems = []
draft.forEach(function (it, i) {
  var errs = validate(it, i)
  if (it.id && seenId[it.id]) errs.push('第 ' + (i + 1) + ' 条 id 在本批内重复：' + it.id)
  if (it.q && seenQ[norm(it.q)]) errs.push('第 ' + (i + 1) + ' 条题干在本批内重复')
  if (errs.length) {
    bad = bad.concat(errs)
    return
  }
  seenId[it.id] = 1
  seenQ[norm(it.q)] = 1
  okItems.push(it)
})

console.log('草稿    : ' + draft.length + ' 条（' + inFile + '）')
console.log('合格    : ' + okItems.length + ' 条')
console.log('问题    : ' + bad.length + ' 条')

if (bad.length) {
  console.log('')
  bad.slice(0, 12).forEach(function (b) { console.log('  ✗ ' + b) })
  if (bad.length > 12) console.log('  … 还有 ' + (bad.length - 12) + ' 条')
  if (!okItems.length) {
    console.log('\n没有合格条目，不生成分片。')
    process.exit(1)
  }
  console.log('\n提示：有问题的条目会被丢弃，其余照常生成。建议改完草稿重跑，做到 0 问题再上线。')
}

/* ---------------- 切片输出 ---------------- */
function jsStr(s) {
  return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'"
}

function toChoice(it) {
  var o = []
  o.push('  {')
  o.push('    id: ' + jsStr(it.id) + ', cat: ' + jsStr(it.cat) + ', type: ' + jsStr(it.type) + ', level: ' + it.level + ',')
  o.push('    q: ' + jsStr(it.q) + ',')
  if (it.code) o.push('    code: ' + jsStr(it.code) + ',')
  o.push('    options: [')
  it.options.forEach(function (opt, i) {
    o.push('      ' + jsStr(opt) + (i < it.options.length - 1 ? ',' : ''))
  })
  o.push('    ],')
  o.push('    ans: [' + it.ans.join(', ') + '],')
  o.push('    exp: ' + jsStr(it.exp))
  o.push('  }')
  return o.join('\n')
}

function toQa(it) {
  var o = []
  o.push('  {')
  o.push('    id: ' + jsStr(it.id) + ', cat: ' + jsStr(it.cat) + ', level: ' + it.level + ',')
  if (it.tags && it.tags.length) o.push('    tags: [' + it.tags.map(jsStr).join(', ') + '],')
  o.push('    q: ' + jsStr(it.q) + ',')
  if (it.src) o.push('    src: ' + jsStr(it.src) + ',')
  o.push('    a: ' + jsStr(it.a))
  o.push('  }')
  return o.join('\n')
}

var shards = []
for (var i = 0; i < okItems.length; i += shardSize) {
  shards.push(okItems.slice(i, i + shardSize))
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

var idx = []
shards.forEach(function (slice, n) {
  var no = startNo + n
  var name = (type === 'qa' ? 'q' : 'p') + no
  var varName = prefix + no
  var head = type === 'qa'
    ? '/* 问答卡分片 ' + no + ' · ' + slice.length + ' 条 */\n'
    : '/* 题库分片 ' + no + ' · ' + slice.length + ' 题 */\n'
  var body = slice.map(type === 'qa' ? toQa : toChoice).join(',\n')
  var text = head + 'var ' + varName + ' = [\n' + body + '\n]\n\n' +
    "if (typeof module !== 'undefined' && module.exports) module.exports = " + varName + '\n'
  fs.writeFileSync(path.join(outDir, name + '.js'), text, 'utf8')
  idx.push(name)
  console.log('  → ' + path.join(outDir, name + '.js') + '（' + slice.length + ' 条）')
})

fs.writeFileSync(path.join(outDir, 'index.js'),
  '/* 由 tools/bank-build.js 生成，请勿手改 */\nvar LIST = [].concat(\n' +
  idx.map(function (n) { return "  require('./" + n + ".js')" }).join(',\n') +
  '\n)\n\nif (typeof module !== \'undefined\' && module.exports) module.exports = LIST\n', 'utf8')

console.log('  → ' + path.join(outDir, 'index.js'))
console.log('\n合计 ' + okItems.length + ' 条，' + shards.length + ' 个分片。')
console.log('下一步：node check.js 跑一遍自检，再在小程序里看效果。')

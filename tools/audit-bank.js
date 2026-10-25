/* Structural quality gate; this cannot prove the factual correctness of prose. */
var assert = require('assert')
var Q = require('../data/questions')
var L = require('../utils/learning')
var ids = Object.create(null), prompts = Object.create(null), levels = {}, cats = {}
Q.QUESTIONS.forEach(function(q) {
  assert.ok(!ids[q.id], 'duplicate id: '+q.id); ids[q.id]=1
  var fingerprint=q.q.replace(/\s+/g,'')+'|'+(q.code||'').replace(/\s+/g,'')
  assert.ok(!prompts[fingerprint], 'duplicate prompt+code: '+q.id+' / '+prompts[fingerprint]); prompts[fingerprint]=q.id
  assert.ok([1,2,3].indexOf(q.level)>=0, q.id+' invalid level')
  assert.ok(['single','multi','judge'].indexOf(q.type)>=0,q.id+' invalid type')
  assert.ok(q.options.length>=2 && q.options.length<=8,q.id+' invalid options')
  assert.ok(q.ans.length>0 && q.ans.every(function(n,i){return Number.isInteger(n)&&n>=0&&n<q.options.length&&q.ans.indexOf(n)===i}),q.id+' invalid answers')
  if(q.type!=='multi')assert.strictEqual(q.ans.length,1,q.id)
  assert.ok(q.exp.length>=15,q.id+' missing explanation')
  assert.ok(L.describe(q).labels.length>0,q.id+' unreachable topic')
  levels[q.level]=(levels[q.level]||0)+1; cats[q.cat]=(cats[q.cat]||0)+1
})
var authored=Q.QUESTIONS.filter(function(q){return /^(mi|si|ai)\d+$/.test(q.id)})
assert.strictEqual(authored.length,150)
authored.forEach(function(q){
  assert.strictEqual(q.source,'原创练习',q.id)
  assert.ok(q.tags.length&&q.followUp.length>=15,q.id+' missing learning metadata')
  assert.ok(q.reference.title&&/^https:\/\//.test(q.reference.url),q.id+' missing reference')
})
console.log(JSON.stringify({total:Q.QUESTIONS.length,categories:cats,levels:levels,authored:authored.length,withCode:authored.filter(function(q){return !!q.code}).length,multi:authored.filter(function(q){return q.type==='multi'}).length,duplicatePromptAndCode:0},null,2))
console.log('Content structure PASS; factual review and reference availability are separate checks.')

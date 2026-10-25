var fs=require('fs'),vm=require('vm'),assert=require('assert')
var memory={}
function boot(){
  var element={style:{},innerHTML:'',scrollTop:0,classList:{add:function(){},remove:function(){},contains:function(){return false}}}
  var ctx={console:console,module:{exports:{}},location:{hash:'',search:''},Date:Date,
    localStorage:{getItem:function(k){return memory[k]||null},setItem:function(k,v){memory[k]=v},removeItem:function(k){delete memory[k]}},
    document:{hidden:false,documentElement:{className:'still'},getElementById:function(){return element},addEventListener:function(){}},
    setTimeout:function(){},clearTimeout:function(){},setInterval:function(){},addEventListener:function(){},requestAnimationFrame:function(){}}
  ctx.window=ctx;vm.createContext(ctx)
  var html=fs.readFileSync('preview.html','utf8'),re=/<script(?: src="([^"]+)")?[^>]*>([\s\S]*?)<\/script>/g,m
  while((m=re.exec(html)))vm.runInContext(m[1]?fs.readFileSync(m[1],'utf8'):m[2],ctx,{filename:m[1]||'inline'})
  return ctx
}
var b=boot();assert.ok(b.WebStore,'browser must use real storage');assert.strictEqual(b.MOCK_ANS,0)
b.LEARN_FILTER={level:0,course:'arrays'};b.learnStart();var id=b.cur.list[0].id
b.startPractice('wrong');assert.strictEqual(b.cur.list[0].id,id);assert.strictEqual(b.state.mode,'study')
b.pick(b.cur.list[0].ans[0]);b.pick(b.cur.list[0].ans[0]);assert.strictEqual(b.WebStore.getStats().answered,1)
b.toggleFav();assert.ok(b.WebStore.isFav(id));b.next()
var restored=boot();assert.strictEqual(restored.cur.idx,1);assert.strictEqual(restored.cur.studyCourse,'arrays');assert.ok(restored.cur.answers[id].answered);assert.ok(restored.WebStore.isFav(id))
while(!restored.cur.completed)restored.next()
assert.strictEqual(restored.WebStore.getStats().answered,20);assert.strictEqual(restored.WebStore.getWrongIds().length,19)
assert.strictEqual(restored.webResult().correct,1);assert.strictEqual(restored.webResult().total,20)
assert.ok(restored.vResult().indexOf('5</span>')>=0);assert.strictEqual(restored.WebStore.getProgress(),null)
var last=boot();assert.ok(last.cur.completed);assert.strictEqual(last.webResult().correct,1)
last.practiceAgain();assert.strictEqual(last.cur.studyCourse,'arrays');assert.notStrictEqual(last.cur.list[0].id,id)
var imported={id:'web-test',cat:'syntax',level:1,type:'single',q:'测试导入',options:['甲','乙'],ans:[0],exp:'甲'}
last.PARSE_LIST=[imported];last.importWeb();assert.ok(last.quiz.getById('web-test'));assert.ok(boot().quiz.getById('web-test'))
last.PARSE_LIST=[imported];last.importWeb();assert.strictEqual(last.quiz.getExtra().length,1)
console.log('PASS web: real scoring, idempotent answers, favorites, refresh resume, skipped wrong items, results, chapter repeat, persistent import')

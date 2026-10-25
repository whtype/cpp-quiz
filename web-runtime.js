/* Web test edition: real local records, shared with native business logic. */
function webResult(){
  var correct=cur.list.filter(function(q){var a=cur.answers[q.id];return a&&a.answered&&a.right}).length
  return {correct:correct,total:cur.list.length,score:cur.list.length?Math.round(correct*100/cur.list.length):0}
}
function webSync(){
  if(cur.list.length){
    cur.list.forEach(function(q){
      var a=cur.answers[q.id]
      if(cur.completed&&(!a||!a.answered))a=cur.answers[q.id]={picked:[],answered:true,right:false}
      if(a&&a.answered&&!a.recorded&&(state.mode!=='exam'||cur.completed)){
        WebStore.record(q.id,!!a.right);a.recorded=true
      }
    })
    var snapshot={mode:state.mode,cat:state.cat,level:cur.studyLevel||0,course:cur.studyCourse||'',
      list:cur.list.map(function(q){return q.id}),idx:cur.idx,answers:cur.answers,
      startedAt:cur.startedAt,finishedAt:cur.finishedAt,completed:!!cur.completed}
    if(cur.completed){WebStore.clearProgress();WebStore.setSession(snapshot)}
    else WebStore.saveProgress(snapshot)
  }
  WebStore.setPref('learning',LEARN_FILTER)
  var s=WebStore.getStats()
  PREVIEW_DONE={}
  Object.keys(s.records).forEach(function(id){if(s.records[id].t)PREVIEW_DONE[id]=true})
  MOCK_ANS=quiz.QUESTIONS.filter(function(q){return PREVIEW_DONE[q.id]}).length
  MOCK_ACC=WebStore.accuracy()
  MOCK_WRONG=[];MOCK_FAV=[]
  quiz.QUESTIONS.forEach(function(q,i){if(s.wrong.indexOf(q.id)>=0)MOCK_WRONG.push(i);if(s.fav.indexOf(q.id)>=0)MOCK_FAV.push(i)})
}
function toggleFav(){
  var q=cur.list[cur.idx];if(!q)return
  var on=WebStore.toggleFav(q.id);render();flash(on?'已收藏':'已取消收藏')
}
function removeReview(index){
  var list=state.tab==='wrong'?MOCK_WRONG:MOCK_FAV,q=quiz.QUESTIONS[list[index]]
  if(!q)return
  if(state.tab==='wrong')WebStore.removeWrong(q.id);else WebStore.toggleFav(q.id)
  render()
}
function importWeb(){
  var before=quiz.QUESTIONS.length
  var imported=(window.PARSE_LIST||[]).filter(function(q){return !quiz.getById(q.id)})
  quiz.setExtra(quiz.getExtra().concat(imported));WebStore.saveRemote(quiz.getExtra())
  window.PARSE_LIST=null;render();flash('新增 '+(quiz.QUESTIONS.length-before)+' 题')
}
function webTime(){
  var sec=Math.max(0,Math.floor(((cur.finishedAt||Date.now())-(cur.startedAt||Date.now()))/1000))
  return Math.floor(sec/60)+':'+('0'+sec%60).slice(-2)
}
function vResult(){
  var r=webResult()
  var h='<div class="nav"><div class="nav-back" onclick="go(\'home\')">‹</div><div class="nav-title">练习结果</div></div>'
  h+='<div class="rs"><div class="rs-n"><span class="serif">'+r.score+'</span><span class="rs-u">分</span></div>'
  h+='<div class="rs-c">答对 '+r.correct+' / '+r.total+' 题 · 用时 '+webTime()+'</div></div>'
  h+='<div class="sec"><span class="t">逐题解析</span><span class="s">点开查看</span></div><div class="items">'
  cur.list.forEach(function(q,i){
    var a=cur.answers[q.id]||{picked:[],right:false},open=state.openIdx===i
    h+='<div class="it '+(open?'open':'')+'" onclick="toggleItem('+i+')"><div class="it-head"><span class="it-no">'+(i+1)+'</span><span class="it-q">'+esc(q.q)+'</span><span class="it-mark">'+(a.right?'✓':'✕')+'</span></div>'
    if(open){
      h+='<div class="it-body">'+(q.code?'<div class="code">'+esc(q.code)+'</div>':'')
      h+='<div>正确答案：'+q.ans.map(function(n){return LETTERS[n]}).join('、')+'</div>'
      h+='<div>你的答案：'+(a.picked.length?a.picked.map(function(n){return LETTERS[n]}).join('、'):'未作答')+'</div><div class="it-exp">'+esc(q.exp)+'</div></div>'
    }
    h+='</div>'
  })
  return h+'</div><div class="btns"><button class="btn ghost" onclick="go(\'home\')">返回首页</button><button class="btn" onclick="practiceAgain()">再来一组</button></div><div class="link" onclick="go(\'wrong\')">查看错题本 →</div>'
}
function vBank(){
  var h='<div class="nav"><div class="nav-back" onclick="go(\'home\')">‹</div><div class="nav-title">题库</div></div><div class="learn-title serif">'+quiz.QUESTIONS.length+' 道 C++ 练习题</div>'
  h+='<div class="learn-intro">按课程章节选择，交叉知识点可出现在多个章节。</div><div class="list">'
  CppLearning.COURSES.filter(function(c){return c.key}).forEach(function(c){
    h+='<div class="row" onclick="openCourse(\''+c.key+'\')"><div class="rt"><div class="rn">'+c.label+'</div></div><div class="rarw">'+CppLearning.select(quiz.QUESTIONS,{course:c.key}).length+' 题 ›</div></div>'
  })
  return h+'</div><button class="btn" onclick="go(\'import\')">导入自己的题目</button><div class="note">题目为学习练习题，非企业官方真题。个人导入的题目仅保存在当前浏览器。</div>'
}
function openCourse(key){LEARN_FILTER.course=key;LEARN_FILTER.level=0;go('learn')}
function webBoot(){
  quiz.setExtra(WebStore.getRemote())
  var saved=WebStore.getPref('learning',{level:1,course:''})
  LEARN_FILTER={level:[0,1,2].indexOf(saved.level)>=0?saved.level:1,
    course:CppLearning.COURSES.some(function(c){return c.key===saved.course})?saved.course:'',count:20}
  var p=WebStore.getProgress()||WebStore.getSession()
  if(p){
    var list=quiz.getByIds(p.list)
    if(list.length&&list.length===p.list.length){
      cur={list:list,idx:Math.min(p.idx||0,list.length-1),answers:p.answers||{},resumed:!p.completed,
        completed:!!p.completed,studyLevel:p.level,studyCourse:p.course||'',startedAt:p.startedAt,finishedAt:p.finishedAt}
      state.mode=p.mode;state.cat=p.cat||''
    }else WebStore.clearProgress()
  }
  RESUME_AT={}
  var baseRender=render
  render=function(){webSync();baseRender()}
  webSync()
  window.addEventListener('pagehide',webSync)
}
webBoot()

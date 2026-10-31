/* Browser presentation of the same interview model used by the mini-program. */
var ORAL_STATE=WebStore.getPref('interviewPractice',{})
function oralSave(){WebStore.setPref('interviewPractice',ORAL_STATE)}
function openInterview(course,restart){
  CppInterview.open(CppInterviewCards,ORAL_STATE,course===undefined?ORAL_STATE.course:course,Date.now(),restart)
  oralSave();state.page='interview';render()
}
function oralChoose(course){openInterview(course)}
function oralDraft(id,value){CppInterview.draft(CppInterviewCards,ORAL_STATE,id,value);oralSave()}
function oralReveal(id){CppInterview.reveal(CppInterviewCards,ORAL_STATE,id);oralSave();render()}
function oralRate(id,grade){
  if(CppInterview.rate(CppInterviewCards,ORAL_STATE,id,grade,Date.now())){oralSave();render()}
}
function vInterview(){
  CppInterview.open(CppInterviewCards,ORAL_STATE,ORAL_STATE.course,Date.now())
  var v=CppInterview.view(CppInterviewCards,ORAL_STATE,Date.now()),q=v.card,s=v.summary
  var h='<div class="nav"><button class="nav-back oral-back" aria-label="返回首页" onclick="go(\'home\')">‹</button><div class="nav-title">面试自测</div></div><div class="interview">'
  h+='<div class="oral-intro">先用自己的话回答，再对照要点。每轮最多 5 题。</div><select class="oral-picker" aria-label="自测章节" onchange="oralChoose(this.value)">'
  CppLearning.COURSES.forEach(function(c){h+='<option value="'+c.key+'" '+(ORAL_STATE.course===c.key?'selected':'')+'>'+c.label+'</option>'})
  h+='</select><div class="oral-progress">已自测 '+s.attempted+' / '+s.total+' · 到期复习 '+s.due+' · 自评能讲清 '+s.clear+'</div>'
  if(v.completed)return h+'<div class="oral-finish"><div class="oral-title serif">这一轮自测完成</div><div class="oral-prompt">隔几天不看答案再答一次，确认自己能解释原因和边界。</div><div class="oral-note">复习日期是建议；每次进入会优先安排到期题。记录为自评，不代表自动判题或面试通过率。</div><button class="btn" onclick="openInterview(ORAL_STATE.course,true)">再练一组</button></div></div>'
  h+='<div class="oral-meta">'+v.position+' / '+v.total+' · '+q.kind+' · 建议 '+q.minutes+' 分钟</div><div class="oral-title serif">'+esc(q.title)+'</div><div class="oral-prompt">'+esc(q.prompt)+'</div>'
  if(q.starter)h+='<pre class="oral-code">'+esc(q.starter)+'</pre>'
  if(q.kind==='手写')h+='<div class="oral-note">在下方或本地编辑器写代码；本页不运行代码。</div>'
  h+='<textarea class="oral-draft" aria-label="我的回答" maxlength="12000" placeholder="写下思路或代码（可选，自动保存）" oninput="oralDraft(\''+q.id+'\',this.value)">'+esc(v.draft)+'</textarea>'
  if(!v.revealed)return h+'<button class="btn" onclick="oralReveal(\''+q.id+'\')">我答完了，看要点</button></div>'
  h+='<div class="oral-answer"><div class="oral-heading">回答时应覆盖</div>'
  q.points.forEach(function(t){h+='<div class="oral-point">• '+esc(t)+'</div>'})
  h+='<div class="oral-heading">常见误区</div>'
  q.pitfalls.forEach(function(t){h+='<div class="oral-point">• '+esc(t)+'</div>'})
  h+='<div class="oral-heading">再追问一句</div><div class="oral-prompt">'+esc(q.followUp)+'</div>'
  if(q.solution)h+='<details><summary class="oral-toggle">查看参考实现</summary><pre class="oral-code">'+esc(q.solution)+'</pre></details>'
  if(q.checks){h+='<div class="oral-heading">自己验证这些边界</div>';q.checks.forEach(function(t){h+='<div class="oral-point">• '+esc(t)+'</div>'})}
  if(q.reference&&/^https:\/\//.test(q.reference.url))h+='<a class="oral-toggle" target="_blank" rel="noopener noreferrer" href="'+esc(q.reference.url).replace(/"/g,'&quot;')+'">参考资料 · '+esc(q.reference.title)+' ↗</a>'
  h+='<div class="oral-note">按刚才的独立回答自评；读懂答案还不等于会回答。</div><div class="oral-ratings">'
  ;['还不会','需巩固','能讲清'].forEach(function(label,i){h+='<button class="oral-rate" onclick="oralRate(\''+q.id+'\','+i+')">'+label+'<span>'+['明天复习','3 天后复习','7 天后复习'][i]+'</span></button>'})
  return h+'</div></div></div>'
}

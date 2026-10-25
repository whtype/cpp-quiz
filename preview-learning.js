/* Chapter UI shared by the online browser edition. */
var LEARN_FILTER = {level:1,course:'',count:20}
var SIMPLE_LEVELS = [
  {key:1,name:'基础',desc:'语法、指针、类和常用容器，从这里开始。'},
  {key:2,name:'进阶',desc:'基础熟悉后，再练原理、代码分析与常见易错点。'},
  {key:0,name:'全部难度',desc:'混合所有难度，适合复习和查漏补缺。'}
]
var PREVIEW_DONE = {}
function learnChoose(field,value){if(field==='level'&&[0,1,2].indexOf(value)>=0)LEARN_FILTER.level=value;render()}
function learnCourse(value){
  if(!CppLearning.COURSES.some(function(c){return c.key===value}))return
  LEARN_FILTER.course=value;LEARN_FILTER.level=0;render()
}
function homeStudy(){
  if(cur.list.length&&!cur.completed&&state.mode==='study'){state.page='practice';render();return}
  learnStart()
}
function practiceAgain(){
  if(state.mode!=='study'){startPractice(state.mode,state.cat,cur.list.length);return}
  LEARN_FILTER.level=cur.studyLevel;LEARN_FILTER.course=cur.studyCourse||''
  cur.completed=true;learnStart()
}
function canContinueStudy(){return cur.list.length&&!cur.completed&&state.mode==='study'&&cur.studyLevel===LEARN_FILTER.level&&(cur.studyCourse||'')===LEARN_FILTER.course}
function learnStart(){
  if(canContinueStudy()){state.page='practice';render();return}
  var pool=CppLearning.select(quiz.QUESTIONS,LEARN_FILTER)
  pool=pool.filter(function(q){return !PREVIEW_DONE[q.id]}).concat(pool.filter(function(q){return PREVIEW_DONE[q.id]}))
  if(!pool.length){flash('暂时没有题目');return}
  state.mode='study';state.cat='';state.page='practice'
  cur.list=pool.slice(0,20);cur.idx=0;cur.answers={};cur.resumed=false;cur.completed=false;cur.studyLevel=LEARN_FILTER.level;cur.studyCourse=LEARN_FILTER.course;cur.startedAt=Date.now();cur.finishedAt=0
  render()
}
function vSimpleHome(){
  var continuing=cur.list.length&&!cur.completed&&state.mode==='study'
  var h='<div class="nav"><div class="nav-title">C++ 刷题</div><div class="nav-act" onclick="go(\'bank\')">题库</div></div>'
  h+='<div class="campus-intro"><div class="campus-title serif">每天刷一点，C++ 熟一点。</div><div class="campus-desc">从基础开始，做完一道，弄懂一道。</div></div>'
  h+='<div class="hero simple-home-card"><div class="hero-t serif">'+(continuing?'接着上次继续':'今天刷 20 题')+'</div><div class="hero-d">'+CppLearning.courseLabel(continuing?cur.studyCourse:LEARN_FILTER.course)+' · '+(continuing?'已保存答题进度':'优先练没做过的题')+'</div>'
  h+='<button class="btn daily-button" onclick="homeStudy()">'+(continuing?'继续上次 · 第 '+(cur.idx+1)+' 题':'开始刷题')+'</button><button class="difficulty-link" onclick="go(\'learn\')">按章节练习 / 调整难度 →</button></div>'
  h+='<div class="strip"><div class="st"><div class="st-n serif">'+MOCK_ANS+'</div><div class="st-l">已练题目</div></div><div class="stline"></div><div class="st"><div class="st-n serif">'+MOCK_ACC+'<span class="st-u">%</span></div><div class="st-l">正确率</div></div><div class="stline"></div><div class="st"><div class="st-n serif">'+quiz.QUESTIONS.length+'</div><div class="st-l">题库总数</div></div></div>'
  h+='<div class="sec"><span class="t">复习巩固</span></div><div class="grid"><div class="tile" onclick="go(\'wrong\')"><div class="tile-l">错题本</div><div class="tile-d">'+MOCK_WRONG.length+' 题待复习 →</div></div><div class="tile" onclick="startPractice(\'fav\',\'\',20)"><div class="tile-l">我的收藏</div><div class="tile-d">'+MOCK_FAV.length+' 题 →</div></div></div>'
  h+='<div class="simple-tools"><span onclick="go(\'books\')">C++ 书单</span><span onclick="go(\'import\')">导入题目</span></div><div class="foot">'+(typeof webStorageFailed!=='undefined'&&webStorageFailed?'浏览器无法保存记录，关闭后进度可能丢失':'网页测试版 · 记录保存在当前浏览器')+'</div>'
  return h
}
function vLearn(){
  var pool=CppLearning.select(quiz.QUESTIONS,LEARN_FILTER)
  var h='<div class="nav"><div class="nav-back" onclick="go(\'home\')">‹</div><div class="nav-title">C++ 刷题</div></div><div class="learn">'
  h+='<div class="learn-title serif">想练哪章，就选哪章。</div><div class="learn-intro">可以专项练习，也可以选全部章节从基础开始。</div>'
  h+='<label class="course-label" for="course-select">练习章节</label><select id="course-select" class="course-picker" onchange="learnCourse(this.value)">'
  CppLearning.COURSES.forEach(function(c){h+='<option value="'+c.key+'" '+(LEARN_FILTER.course===c.key?'selected':'')+'>'+c.label+'</option>'})
  h+='</select><div class="course-label">难度</div><div class="simple-choices">'
  SIMPLE_LEVELS.forEach(function(s){h+='<button class="simple-choice '+(LEARN_FILTER.level===s.key?'selected':'')+'" onclick="learnChoose(\'level\','+s.key+')"><span class="choice-name">'+s.name+'</span><span class="choice-desc">'+s.desc+'</span><span class="choice-check">'+(LEARN_FILTER.level===s.key?'✓':'')+'</span></button>'})
  h+='</div><div class="simple-progress">共 '+pool.length+' 题'+(!pool.length?' · 请切换为全部难度':'')+'</div><button class="btn" '+(!pool.length?'disabled':'')+' onclick="learnStart()">'+(canContinueStudy()?'继续上次 · 第 '+(cur.idx+1)+' 题':'开始刷题')+'</button><div class="simple-hint">每轮最多 20 题，优先未练题；退出后可以接着做。</div><div class="simple-review" onclick="go(\'wrong\')">复习错题 →</div></div>'
  return h
}

var Q = require('../../data/questions')
var L = require('../../utils/learning')
var store = require('../../utils/store')
var ui = require('../../utils/ui')
var CHOICES = [
  {key:1,name:'基础',desc:'语法、指针、类和常用容器，从这里开始。'},
  {key:2,name:'进阶',desc:'基础熟悉后，再练原理、代码分析与常见易错点。'},
  {key:0,name:'全部难度',desc:'混合所有难度，适合复习和查漏补缺。'}
]
Page({
  data:{statusBar:20,choices:CHOICES,courses:[],course:'',courseIndex:0,level:1,track:'',topic:'',search:'',count:20,matched:0,done:0,canResume:false,resumeIdx:0,description:CHOICES[0].desc},
  onLoad:function(){
    ui.attach(this)
    var saved=store.getPref('learning',{level:1})
    var courses=L.COURSES.map(function(c){return {key:c.key,label:c.label}})
    var courseIndex=0
    courses.forEach(function(c,i){if(c.key===saved.course)courseIndex=i})
    this.setData({courses:courses,courseIndex:courseIndex,course:courses[courseIndex].key,level:[0,1,2].indexOf(saved.level)>=0?saved.level:1,track:'',topic:'',search:''})
    this.refresh()
  },
  onShow:function(){this.refresh()},
  refresh:function(){
    var d=this.data, stats=store.getStats(), list=L.select(Q.QUESTIONS,d)
    var prog=store.getProgress(), choice=CHOICES.filter(function(c){return c.key===d.level})[0]
    this.setData({matched:list.length,description:choice.desc,done:list.filter(function(q){return stats.records[q.id]&&stats.records[q.id].t>0}).length,
      canResume:!!(store.resumable(prog)&&prog.mode==='study'&&!prog.cat&&L.key(prog)===L.key(d)),resumeIdx:prog?prog.idx+1:0})
    store.setPref('learning',{level:d.level,course:d.course})
  },
  chooseCourse:function(e){
    var index=Number(e.detail.value), course=this.data.courses[index]
    if(!course)return
    this.setData({course:course.key,courseIndex:index,level:0});this.refresh()
  },
  choose:function(e){
    var level=Number(e.currentTarget.dataset.value)
    if([0,1,2].indexOf(level)<0)return
    this.setData({level:level});this.refresh()
  },
  start:function(){
    if(!this.data.matched){ui.toast('暂时没有题目');return}
    if(this.data.canResume){this.resume();return}
    wx.navigateTo({url:'/pages/practice/practice?mode=study&count=20&restart=1'+L.query(this.data)})
  },
  resume:function(){
    var p=store.getProgress()
    if(!store.resumable(p)||p.mode!=='study'||p.cat||L.key(p)!==L.key(this.data)){this.refresh();return}
    wx.navigateTo({url:'/pages/practice/practice?mode=study&count='+p.count+L.query(this.data)})
  },
  goWrong:function(){wx.navigateTo({url:'/pages/wrong/wrong'})},
  goBack:function(){ui.back()}
})

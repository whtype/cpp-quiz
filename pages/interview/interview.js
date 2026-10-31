var cards=require('../../data/interview-cards')
var I=require('../../utils/interview')
var L=require('../../utils/learning')
var store=require('../../utils/store')
var ui=require('../../utils/ui')
Page({
  data:{statusBar:20,courses:[],courseIndex:0,card:{},summary:{},completed:false,revealed:false,showCode:false,draft:'',position:0,total:0},
  onLoad:function(options){
    ui.attach(this)
    this.model=store.getPref('interviewPractice',{})
    var courses=L.COURSES.filter(function(c){return !c.key||cards.some(function(q){return q.course===c.key})}).map(function(c){return {key:c.key,label:c.label}})
    this.setData({courses:courses})
    this.open(options&&options.course!==undefined?options.course:this.model.course)
  },
  open:function(course,restart){
    I.open(cards,this.model,course,Date.now(),restart)
    var index=0;this.data.courses.forEach(function(c,i){if(c.key===this.model.course)index=i},this)
    this.setData({courseIndex:index,showCode:false});this.refresh()
  },
  refresh:function(){this.setData(I.view(cards,this.model,Date.now()));this.save()},
  save:function(){store.setPref('interviewPractice',this.model)},
  chooseCourse:function(e){var c=this.data.courses[Number(e.detail.value)];if(c)this.open(c.key)},
  inputDraft:function(e){I.draft(cards,this.model,this.data.card.id,e.detail.value);this.save()},
  reveal:function(){I.reveal(cards,this.model,this.data.card.id);this.refresh()},
  rate:function(e){
    var d=e.currentTarget.dataset
    if(I.rate(cards,this.model,d.id,Number(d.grade),Date.now())){this.setData({showCode:false});this.refresh()}
  },
  nextRound:function(){this.open(this.model.course,true)},
  toggleCode:function(){this.setData({showCode:!this.data.showCode})},
  reference:function(){var r=this.data.card.reference;if(r&&/^https:\/\//.test(r.url))wx.setClipboardData({data:r.url})},
  onHide:function(){if(this.model)this.save()},
  onUnload:function(){if(this.model)this.save()},
  goBack:function(){ui.back()}
})

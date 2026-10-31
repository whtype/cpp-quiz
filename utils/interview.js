/* Pure self-assessment state. Choice-question scores are intentionally separate. */
(function(root){
  var DAY=86400000
  function pool(cards,course){return cards.filter(function(c){return !course||c.course===course})}
  function session(state){return state.sessions[state.course||'all']}
  function current(cards,state){
    var s=session(state)
    return s&&s.idx<s.ids.length?cards.filter(function(c){return c.id===s.ids[s.idx]})[0]:null
  }
  function summary(cards,records,course,now){
    var out={total:0,attempted:0,clear:0,due:0}
    pool(cards,course).forEach(function(c){
      out.total++;var r=records[c.id];if(!r)return
      out.attempted++;if(r.grade===2)out.clear++;if(r.dueAt<=now)out.due++
    })
    return out
  }
  function open(cards,state,course,now,restart){
    state.records=state.records&&typeof state.records==='object'?state.records:{}
    state.sessions=state.sessions&&typeof state.sessions==='object'?state.sessions:{}
    course=course&&cards.some(function(c){return c.course===course})?course:''
    state.course=course
    var key=course||'all',list=pool(cards,course),s=state.sessions[key]
    var valid=s&&Array.isArray(s.ids)&&s.ids.length&&s.ids.length<=5&&
      Number.isInteger(s.idx)&&s.idx>=0&&s.idx<=s.ids.length&&
      s.ids.every(function(id,i){return s.ids.indexOf(id)===i&&list.some(function(c){return c.id===id})})
    if(restart||!valid||(s.idx===s.ids.length&&summary(cards,state.records,course,now).due>0)){
      var due=[],fresh=[],later=[]
      list.forEach(function(c){var r=state.records[c.id];if(!r)fresh.push(c);else if(r.dueAt<=now)due.push(c);else later.push(c)})
      function byDue(a,b){return state.records[a.id].dueAt-state.records[b.id].dueAt}
      due.sort(byDue);later.sort(byDue)
      var queue=due.concat(fresh)
      if(!queue.length)queue=later
      s=state.sessions[key]={ids:queue.slice(0,5).map(function(c){return c.id}),idx:0,drafts:{},revealed:{}}
    }
    s.drafts=s.drafts||{};s.revealed=s.revealed||{}
    return state
  }
  function draft(cards,state,id,text){
    var c=current(cards,state);if(!c||c.id!==id)return false
    session(state).drafts[id]=String(text||'').slice(0,12000);return true
  }
  function reveal(cards,state,id){
    var c=current(cards,state);if(!c||c.id!==id)return false
    session(state).revealed[id]=true;return true
  }
  function rate(cards,state,id,grade,now){
    var c=current(cards,state),s=session(state)
    if(!c||c.id!==id||!s.revealed[id]||[0,1,2].indexOf(grade)<0)return false
    var old=state.records[id]
    state.records[id]={grade:grade,reviewedAt:now,dueAt:now+[1,3,7][grade]*DAY,attempts:(old?old.attempts:0)+1}
    s.idx++;return true
  }
  function view(cards,state,now){
    var s=session(state),c=current(cards,state)
    return {card:c||{},completed:!c,position:c?s.idx+1:s.ids.length,total:s.ids.length,
      draft:c?s.drafts[c.id]||'':'',revealed:!!(c&&s.revealed[c.id]),summary:summary(cards,state.records,state.course,now)}
  }
  var api={open:open,current:current,draft:draft,reveal:reveal,rate:rate,view:view,summary:summary}
  if(typeof module!=='undefined'&&module.exports)module.exports=api
  if(typeof window!=='undefined')window.CppInterview=api
})(this)

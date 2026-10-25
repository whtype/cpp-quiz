/* Shared by the mini-program and the browser preview. No platform dependencies. */
(function (root) {
  // Chapters can overlap: an array/pointer question belongs to both lessons.
  // Match the prompt and code only; explanations often mention unrelated chapters.
  var COURSES = [
    {key:'',label:'全部章节'},
    {key:'basics',label:'基础语法',re:/变量|常量|运算符|数据类型|整型|整数|浮点|布尔|循环|条件语句|作用域|类型转换|\b(?:if|switch|while|for|bool|int|double|float)\b/},
    {key:'arrays',label:'数组',re:/数组|\barray\b|\b(?:int|char|double|float|long|short|bool)\s+(?:\(\s*\*\s*\w+\s*\)|\w+)\s*\[/i},
    {key:'strings',label:'字符串',re:/字符串|字符数组|\b(?:string|string_view|strlen|strcpy|strcmp|getline)\b/i},
    {key:'functions',label:'函数',re:/函数|参数|重载|递归|\b(?:inline|constexpr|lambda)\b/},
    {key:'pointers',label:'指针与引用',re:/指针|引用|\b(?:nullptr|NULL|const_cast|reinterpret_cast)\b/},
    {key:'objects',label:'类与面向对象',re:/构造|析构|继承|多态|虚函数|虚表|成员|友元|封装|抽象类|基类|派生类|\b(?:class|struct|virtual|override|friend|this)\b/},
    {key:'memory',label:'内存与资源管理',re:/内存|生命周期|资源管理|所有权|智能指针|深拷贝|浅拷贝|\b(?:RAII|new|delete|unique_ptr|shared_ptr|weak_ptr|malloc|free)\b/},
    {key:'stl',label:'STL 容器与算法',re:/容器|迭代器|\b(?:STL|vector|map|set|deque|list|unordered_map|unordered_set|priority_queue|stack|queue|sort|lower_bound|upper_bound|accumulate)\b/i},
    {key:'templates',label:'模板与泛型',re:/模板|泛型|类型推导|类型萃取|完美转发|\b(?:template|SFINAE|decltype|concept|concepts)\b/},
    {key:'exceptions',label:'异常处理',re:/异常(?:安全|传播|处理|栈|保证)|抛出?异常|捕获异常|异常由|\b(?:try|catch|throw|noexcept|exception|terminate)\b/i},
    {key:'modern',label:'现代 C++',re:/C\+\+\s*(?:11|14|17|20|23)|移动语义|右值|结构化绑定|协程|\b(?:auto|constexpr|nullptr|lambda|optional|variant|concept|string_view|std::move|std::forward)\b/},
    {key:'concurrency',label:'多线程',re:/线程|并发|原子|互斥|死锁|数据竞争|\b(?:thread|mutex|atomic|lock_guard|unique_lock|condition_variable|future|async|memory_order\w*)\b/}
  ]
  function courseLabel(key) {
    var course = COURSES.filter(function(c) { return c.key === (key || '') })[0]
    return course ? course.label : '未知章节'
  }
  var TOPICS = [
    { key: 'lifetime', name: '内存与对象', hint: '指针、RAII、生命周期', re: /指针|引用|内存|构造|析构|生命周期|RAII|new |delete|拷贝|移动|虚函数|多态|继承|对象/ },
    { key: 'stl', name: 'STL 容器', hint: '容器、迭代器、失效规则', re: /STL|vector|map|set|deque|list|迭代器|容器|unordered|priority_queue|emplace/ },
    { key: 'modern', name: '现代 C++', hint: 'C++11 至 C++20', re: /C\+\+(11|14|17|20)|constexpr|nullptr|auto\b|lambda|optional|variant|concept|协程|string_view/ },
    { key: 'templates', name: '模板与类型', hint: '推导、转发、泛型约束', re: /模板|template|推导|SFINAE|decltype|转发|类型萃取|concept/ },
    { key: 'concurrency', name: '并发编程', hint: '线程、同步、内存模型', re: /并发|线程|原子|锁|竞争|atomic|mutex|condition_variable|memory_order|happens.before/ },
    { key: 'network', name: '计算机网络', hint: 'TCP、I/O、多路复用', re: /TCP|UDP|HTTP|socket|epoll|网络|粘包|握手|挥手|拥塞|select\b|poll\b|字节序/ },
    { key: 'linux', name: '操作系统', hint: '进程、虚存、Linux', re: /进程|虚拟内存|页表|缺页|Linux|fork|mmap|系统调用|信号|文件描述符|调度/ },
    { key: 'algorithms', name: '算法手写', hint: '复杂度、边界、解题思路', re: /算法|复杂度|二分|排序|链表|动态规划|滑动窗口|双指针|二叉|图论|BFS|DFS/ },
    { key: 'engineering', name: '工程与调试', hint: '定位问题、测试、项目表达', re: /调试|测试|性能|编译|链接|异常|接口|工程|设计模式|日志|gdb|sanitizer|ODR|CMake/ }
  ]
  var STAGES = [
    { key: 0, name: '全部阶段', desc: '按薄弱知识点自由练习' },
    { key: 1, name: '基础起步', desc: '说清语法与容器，先建立正确的对象和内存模型' },
    { key: 2, name: '能力进阶', desc: '解释原理与边界，把并发、网络和算法串起来' },
    { key: 3, name: '面试冲刺', desc: '推理代码、分析取舍，再口述追问与项目实践' }
  ]
  var TRACKS = [
    { key: '', name: '通用校招', desc: '先补通识，再选择岗位专项', topics: [] },
    { key: 'backend', name: '后台服务', desc: '并发 / 网络 / Linux / 性能', topics: ['concurrency','network','linux','engineering','algorithms'] },
    { key: 'client', name: '客户端基础', desc: '对象 / STL / 现代 C++ / 工程', topics: ['lifetime','stl','modern','templates','engineering','algorithms'] }
  ]
  function describe(q) {
    var tags = (q.tags || []).slice()
    var text = (q.q || '') + ' ' + (q.code || '')
    var aliases = {move:'lifetime',raii:'lifetime',references:'lifetime',oop:'lifetime',types:'templates',lambda:'modern',constexpr:'modern',performance:'engineering',exceptions:'engineering',linkage:'engineering'}
    tags.slice().forEach(function(tag) { if (aliases[tag] && tags.indexOf(aliases[tag]) < 0) tags.push(aliases[tag]) })
    // Legacy questions receive transparent keyword-based topic hints, not invented provenance.
    if (!TOPICS.some(function(t) { return tags.indexOf(t.key) >= 0 })) {
      TOPICS.forEach(function (t) { if (t.re.test(text)) tags.push(t.key) })
      if (q.cat === 'algo' && tags.indexOf('algorithms') < 0) tags.push('algorithms')
      if (q.cat === 'modern' && tags.indexOf('modern') < 0) tags.push('modern')
      if (!tags.length) tags.push(q.cat === 'interview' ? 'engineering' : 'lifetime')
    }
    if (q.cat === 'modern' && tags.indexOf('modern') < 0) tags.push('modern')
    if (q.cat === 'algo' && tags.indexOf('algorithms') < 0) tags.push('algorithms')
    return { tags: tags, labels: TOPICS.filter(function (t) { return tags.indexOf(t.key) >= 0 }).map(function (t) { return t.name }), source: q.source || '原有练习 · 未标注原始出处' }
  }
  function filters(f) {
    f = f || {}
    var level = Number(f.level) || 0
    return { level: level >= 1 && level <= 3 && Math.floor(level) === level ? level : 0, course: f.course || '', track: f.track || '', topic: f.topic || '', search: String(f.search || '').trim().slice(0,100) }
  }
  function key(f) { var x = filters(f); return [x.level,x.track,x.topic,x.search,x.course].join('|') }
  function select(list, input) {
    var f = filters(input)
    var track = TRACKS.filter(function (t) { return t.key === f.track })[0]
    var course = COURSES.filter(function(c) { return c.key === f.course })[0]
    if (!track || !course) return []
    var needle = f.search.toLowerCase()
    return list.filter(function (q) {
      if (f.level && q.level !== f.level) return false
      if (course.key && !course.re.test((q.q || '') + ' ' + (q.code || ''))) return false
      var d = describe(q)
      if (f.topic && d.tags.indexOf(f.topic) < 0) return false
      if (track.topics.length && !track.topics.some(function (t) { return d.tags.indexOf(t) >= 0 })) return false
      return !needle || [q.q,q.code,d.labels.join(' '),d.tags.join(' ')].join(' ').toLowerCase().indexOf(needle) >= 0
    })
  }
  function shuffle(list) {
    var a = list.slice()
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t
    }
    return a
  }
  function exam(list, n) {
    var buckets = {}, seen = {}, out = []
    shuffle(list).forEach(function (q) {
      if (seen[q.id]) return
      seen[q.id] = true
      if (!buckets[q.cat]) buckets[q.cat] = []
      buckets[q.cat].push(q)
    })
    var keys = Object.keys(buckets)
    while (out.length < n && keys.length) {
      keys.forEach(function (k) { if (out.length < n && buckets[k].length) out.push(buckets[k].pop()) })
      keys = keys.filter(function (k) { return buckets[k].length })
    }
    return shuffle(out)
  }
  function query(f) {
    var x = filters(f)
    return '&level=' + x.level + '&track=' + encodeURIComponent(x.track) + '&topic=' + encodeURIComponent(x.topic) + '&search=' + encodeURIComponent(x.search) + '&course=' + encodeURIComponent(x.course)
  }
  var api = { COURSES: COURSES, courseLabel: courseLabel, TOPICS: TOPICS, STAGES: STAGES, TRACKS: TRACKS, describe: describe, filters: filters, key: key, select: select, exam: exam, query: query }
  if (typeof module !== 'undefined' && module.exports) module.exports = api
  else root.CppLearning = api
  if (typeof window !== 'undefined') window.CppLearning = api
})(this)

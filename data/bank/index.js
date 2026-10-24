/**
 * 题库分片汇总
 * 每片 50 题，按分类拆开写便于维护：
 *   p1 语法（类型/指针/内存/类）  p2 STL/模板/智能指针
 *   p3 算法（一）                p4 算法（二）
 *   p5 面试（一）对象模型/编译链接 p6 面试（二）系统/网络/工程
 */
var LIST = [].concat(
  require('./p1.js'),
  require('./p2.js'),
  require('./p3.js'),
  require('./p4.js'),
  require('./p5.js'),
  require('./p6.js')
)

if (typeof module !== 'undefined' && module.exports) module.exports = LIST

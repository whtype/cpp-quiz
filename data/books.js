/**
 * 书架数据
 * ---------------------------------------------------------------
 * 只收录两类：
 *  free    作者/基金会免费授权发布的（开源书、免费 PDF、公开文档）
 *  classic 经典版权书 —— 只给书目信息与购买/借阅指引，不放文件
 *
 * 不在包里存任何 PDF：一是体积（小程序主包 2MB），二是版权。
 */

var BOOKS = [
  /* ---------------- 免费可读 ---------------- */
  {
    id: 'mcpp',
    group: 'free',
    title: '现代 C++ 教程',
    en: 'Modern C++ Tutorial: C++11/14/17/20 On the Fly',
    author: '欧长坤（Changkun Ou）',
    year: '2018 —',
    level: '进阶',
    lic: 'CC BY-NC-ND 4.0 · 作者免费发布',
    desc: '一本把 C++11/14/17/20 讲透的中文小书，200 多页，不绕弯子。',
    why: '想在现有 C++ 基础上快速补齐现代特性，这本性价比最高。语言是新特性，读起来像看博客而不是看教材。',
    action: 'pdf',
    size: '约 0.5 MB',
    url: 'https://changkun.de/modern-cpp/pdf/modern-cpp-tutorial-zh-cn.pdf'
  },
  {
    id: 'coreguidelines',
    group: 'free',
    title: 'C++ 核心准则',
    en: 'C++ Core Guidelines',
    author: 'Bjarne Stroustrup & Herb Sutter',
    year: '2015 —',
    level: '深入',
    lic: '开源文档 · isocpp 维护',
    desc: 'C++ 之父和标准委员会主席合写的工程规范，一条一条告诉你「为什么这样写」。',
    why: '刷题刷到一定量后，最该读的就是它。每条准则后面都有反例，正好是面试里最爱问的坑。',
    action: 'link',
    url: 'https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines'
  },
  {
    id: 'cppref',
    group: 'free',
    title: 'cppreference',
    en: 'C++ Reference',
    author: 'cppreference 社区',
    year: '持续更新',
    level: '工具书',
    lic: '免费在线文档',
    desc: 'C++ 标准库与语言特性的权威速查，最接近「官方说明书」的东西。',
    why: '不是拿来读的，是拿来查的。任何一道题的标准答案，最终都能在这里找到依据。',
    action: 'link',
    url: 'https://zh.cppreference.com/w/cpp'
  },
  {
    id: 'faq',
    group: 'free',
    title: 'C++ 常见问题',
    en: 'C++ FAQ / Super-FAQ',
    author: 'isocpp.org',
    year: '持续更新',
    level: '进阶',
    lic: '免费在线文档',
    desc: '把「到底该不该用异常」「为什么虚析构函数必须虚」这类问题讲到底。',
    why: '里面大量条目本身就是面试题原型，而且解释比多数博客严谨。',
    action: 'link',
    url: 'https://isocpp.org/faq'
  },
  {
    id: 'styleguide',
    group: 'free',
    title: 'Google C++ 代码规范',
    en: 'Google C++ Style Guide',
    author: 'Google',
    year: '持续更新',
    level: '进阶',
    lic: '免费公开文档',
    desc: '工业界最常被抄的一份 C++ 规范，管命名、管头文件、管所有权。',
    why: '写题时你可能不在乎风格，但面试官会让你看懂一段别人写的工程代码。',
    action: 'link',
    url: 'https://google.github.io/styleguide/cppguide.html'
  },
  {
    id: 'learncpp',
    group: 'free',
    title: 'LearnCpp',
    en: 'Learn C++',
    author: 'Alex Allain 等',
    year: '持续更新',
    level: '入门',
    lic: '免费在线教程',
    desc: '从 Hello World 讲到移动语义的免费长教程，章节编排非常循序渐进。',
    why: '如果你觉得题目里有些选项完全看不懂，先补这一套，比硬啃教材快。',
    action: 'link',
    url: 'https://www.learncpp.com/'
  },

  /* ---------------- 经典版权书（请购买 / 图书馆借阅） ---------------- */
  {
    id: 'primer',
    group: 'classic',
    title: 'C++ Primer（第 5 版）',
    en: 'C++ Primer, 5th Edition',
    author: 'Stanley B. Lippman / Josée Lajoie / Barbara E. Moo',
    year: '2012',
    level: '入门 → 进阶',
    lic: '版权书',
    desc: '一千多页的大部头，从变量讲到模板与并发，覆盖 C++11。',
    why: '公认最系统的入门书。前 6 章能打牢语法，第 7 章以后才是它真正的价值。',
    action: 'buy',
    note: '人民邮电出版社 · 中文版'
  },
  {
    id: 'effective',
    group: 'classic',
    title: 'Effective C++ / Effective Modern C++',
    en: 'Effective C++ · Effective Modern C++',
    author: 'Scott Meyers',
    year: '2005 / 2014',
    level: '进阶',
    lic: '版权书',
    desc: '一条一条的实战经验，每条都带「为什么这样，不这样会怎样」。',
    why: '和你现在刷的这些题最对症。本程序里大量「考点」的原型就在这里。',
    action: 'buy',
    note: '电子工业出版社 · 侯捷 译'
  },
  {
    id: 'tcpl',
    group: 'classic',
    title: 'C++ 程序设计语言（第 4 版）',
    en: 'The C++ Programming Language, 4th Edition',
    author: 'Bjarne Stroustrup',
    year: '2013',
    level: '深入',
    lic: '版权书',
    desc: 'C++ 之父自己写的语言参考，讲的是「设计者为什么这么设计」。',
    why: '当你想知道某个特性背后的取舍时读它。不适合从头读到尾，适合带着问题查。',
    action: 'buy',
    note: '机械工业出版社 · 王刚 等译'
  },
  {
    id: 'concurrency',
    group: 'classic',
    title: 'C++ 并发编程实战',
    en: 'C++ Concurrency in Action, 2nd Edition',
    author: 'Anthony Williams',
    year: '2019',
    level: '深入',
    lic: '版权书',
    desc: 'C++11 内存模型、原子操作、无锁数据结构，讲得最细的一本。',
    why: '并发题是面试分水岭。原子操作的 memory_order 那几章，别的地方讲不清。',
    action: 'buy',
    note: '人民邮电出版社'
  },
  {
    id: 'objectmodel',
    group: 'classic',
    title: '深度探索 C++ 对象模型',
    en: 'Inside the C++ Object Model',
    author: 'Stanley B. Lippman',
    year: '1996',
    level: '深入',
    lic: '版权书',
    desc: '对象布局、虚函数表、构造析构顺序……把编译器干的事摊开给你看。',
    why: '虚函数、继承、多重继承的题，看完这本就再也不会错。',
    action: 'buy',
    note: '侯捷 译'
  },
  {
    id: 'stlsource',
    group: 'classic',
    title: 'STL 源码剖析',
    en: 'The Annotated STL Sources',
    author: '侯捷',
    year: '2002',
    level: '深入',
    lic: '版权书',
    desc: '逐个拆解 vector / list / map / 算法与迭代器的实现。',
    why: '「vector 扩容为什么是 2 倍」「map 为什么是红黑树」，答案在这。',
    action: 'buy',
    note: '华中科技大学出版社'
  }
]

var GROUPS = [
  { key: 'free', name: '免费可读', desc: '作者授权 / 公开文档，直接打开' },
  { key: 'classic', name: '经典必读', desc: '版权书，建议购买或图书馆借阅' }
]

var BOOK_DATA = { BOOKS: BOOKS, GROUPS: GROUPS }

// 兼容：小程序 require + 浏览器 <script> 直接加载
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BOOK_DATA
}

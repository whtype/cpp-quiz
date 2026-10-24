/* 题库分片 2 · STL / 模板 / 异常 / 智能指针 50 题 */
var P2 = [
  {
    id: 's151', cat: 'syntax', type: 'single', level: 2,
    q: 'std::vector 在容量不足时扩容，主流的实现策略是？',
    options: ['每次加 1 个元素的空间', '按 1.5 倍或 2 倍增长', '按需精确分配', '固定加 100 个元素'],
    ans: [1],
    exp: '主流实现按几何级数增长（MSVC 1.5 倍、libstdc++ 2 倍），这样 push_back 的均摊复杂度是 O(1)。若按 +1 线性增长，n 次插入要拷贝 O(n²) 次，性能灾难。注意扩容时所有迭代器、指针、引用都会失效。'
  },
  {
    id: 's152', cat: 'syntax', type: 'single', level: 1,
    q: '需要按 key 有序遍历，应优先选哪个容器？',
    options: ['std::unordered_map', 'std::map', 'std::vector', 'std::list'],
    ans: [1],
    exp: 'std::map 基于红黑树，中序遍历天然有序，查找/插入/删除都是 O(log n)。unordered_map 是哈希表，平均 O(1) 但遍历顺序不确定。要「有序」只能选 map（或排序后的 vector）。'
  },
  {
    id: 's153', cat: 'syntax', type: 'single', level: 2,
    q: 'std::map 的底层数据结构是？',
    options: ['哈希表', '红黑树', '跳表', '大顶堆'],
    ans: [1],
    exp: '标准只要求 map 的查找、插入、删除为对数复杂度且迭代器稳定，主流实现（libstdc++、libc++、MSVC）都用红黑树。哈希表是 unordered_map；跳表是 Redis 的 zset 用的，标准库没有。'
  },
  {
    id: 's154', cat: 'syntax', type: 'single', level: 2,
    q: '频繁在容器中间插入删除元素，且要求迭代器不失效，应选？',
    options: ['std::vector', 'std::list', 'std::deque', 'std::array'],
    ans: [1],
    exp: 'list 是双向链表，插入删除只改相邻节点的指针，O(1) 且其他节点的迭代器不受影响。vector 中间插入要搬移后续所有元素且迭代器全失效；deque 中间插入同样代价高。代价是 list 不支持随机访问、缓存局部性差。'
  },
  {
    id: 's155', cat: 'syntax', type: 'single', level: 2,
    q: 'std::priority_queue 默认是？',
    options: ['小顶堆（最小元素在顶）', '大顶堆（最大元素在顶）', '按插入顺序出队', '双向队列'],
    ans: [1],
    exp: '默认模板参数是 priority_queue<T, vector<T>, less<T>>，less 让最大元素在 top()。要小顶堆需显式写 priority_queue<int, vector<int>, greater<int>>。注意如果用自定义比较器，语义容易写反：less 表示「a 的优先级低于 b」，所以大顶堆。'
  },
  {
    id: 's156', cat: 'syntax', type: 'single', level: 2,
    q: 'std::set 与 std::vector 相比，最本质的区别是？',
    options: [
      'set 自动去重并保持有序，元素不可直接修改',
      'set 占用内存更少',
      'set 查找一定比 vector 快',
      'set 支持随机访问'
    ],
    ans: [0],
    exp: 'set 基于红黑树，元素唯一且按比较器有序，插入后不能改元素（改了会破坏树结构），只能删除再插入。查找是 O(log n)。对小数据量的顺序容器，vector 线性查找反而更快（缓存友好），所以说「一定更快」是错的。'
  },
  {
    id: 's157', cat: 'syntax', type: 'single', level: 3,
    q: 'std::string 的短字符串优化（SSO）是指？',
    options: [
      '短字符串自动转为大写',
      '短字符串直接存在对象内部缓冲区，不做堆分配',
      '短字符串共享同一块内存',
      '短字符串不参与拷贝'
    ],
    ans: [1],
    exp: '主流实现给 string 对象内嵌一个约 15~22 字节的小缓冲区，长度不超过它就完全不做堆分配，构造/拷贝/析构都快。这解释了为什么 sizeof(std::string) 通常是 32 而不是 8，也解释了小字符串的 data() 地址在对象内部、移动它反而要「拷贝」缓冲区。'
  },
  {
    id: 's158', cat: 'syntax', type: 'single', level: 2,
    q: 'reserve 与 resize 的区别是？',
    options: [
      'reserve 改变元素个数，resize 只改容量',
      'reserve 只预先分配内存不改 size，resize 会真正构造/销毁元素',
      '两者完全一样',
      'reserve 只对 vector 有效，resize 对所有容器有效'
    ],
    ans: [1],
    exp: 'reserve(n) 只保证 capacity >= n，size 不变，不能直接访问 v[i]（i >= size 是未定义行为）；resize(n) 会把 size 改成 n，多出的部分值初始化，减少的部分销毁末尾元素。想避免反复扩容用 reserve，想直接访问下标用 resize。'
  },
  {
    id: 's159', cat: 'syntax', type: 'single', level: 2,
    q: '在 for (auto& x : v) 循环里对 v 做 push_back，会有什么问题？',
    options: [
      '没有任何问题',
      '触发扩容时迭代器/引用失效，行为未定义，可能死循环或崩溃',
      '只会漏掉新加的元素',
      '编译错误'
    ],
    ans: [1],
    exp: 'range-for 底层用 begin/end 迭代器，push_back 触发扩容后旧迭代器全部悬空，end 还是旧值，继续解引用就是未定义行为。要么先算出要加多少再 reserve，要么用下标循环 v.size() 每次重新取。'
  },
  {
    id: 's160', cat: 'syntax', type: 'single', level: 2,
    q: 'std::sort 保证稳定吗？',
    options: ['稳定', '不稳定，需要稳定排序用 std::stable_sort', '取决于数据量', '取决于编译器'],
    ans: [1],
    exp: 'std::sort 通常是内省排序（快排 + 堆排 + 插入排序），不保证相等元素的相对顺序。需要保持原有顺序时用 std::stable_sort（归并，O(n log n) 时间 + O(n) 额外空间）。list 则用自己的 list::sort（归并实现，天然稳定）。'
  },
  {
    id: 's161', cat: 'syntax', type: 'single', level: 2,
    q: 'std::lower_bound 使用的前置条件是？',
    options: [
      '序列必须升序（或按同一比较器有序）',
      '序列必须是链表',
      '序列必须无重复元素',
      '序列长度必须为 2 的幂'
    ],
    ans: [0],
    exp: 'lower_bound 是二分查找，要求区间已按同一比较器排好序，否则结果未定义（不会报错，只是答案错）。它返回第一个 >= value 的位置。对无序区间请先 sort。用自定义比较器时，传参的比较器必须与排序时一致。'
  },
  {
    id: 's162', cat: 'syntax', type: 'single', level: 3,
    q: 'erase-remove 惯用法里，为什么不能直接用 v.erase(it) 循环删除？',
    options: [
      'erase 会返回新迭代器，循环里如果不接住就会跳到已失效的位置',
      'erase 不能删除单个元素',
      'erase 会让整个容器失效',
      '没有区别，两种写法一样'
    ],
    ans: [0],
    exp: 'vector::erase 会使被删位置及之后的迭代器失效，返回值是下一个有效位置。写成 for (it = v.begin(); it != v.end(); ++it) v.erase(it); 会先 erase 让 it 失效、再 ++ 已失效的迭代器，未定义行为。正确写法是 it = v.erase(it); 或者用 erase(remove_if(...), end()) 一次性搬移再截断。'
  },
  {
    id: 's163', cat: 'syntax', type: 'single', level: 3,
    q: '为什么 std::remove 单独使用时不会真正删除元素？',
    options: [
      '它是惰性执行，需要再调用一次',
      'remove 只把要保留的元素前移，返回新的逻辑末尾，容器的 size 不变',
      'remove 只对链表有效',
      'remove 需要额外的锁'
    ],
    ans: [1],
    exp: 'std::remove 是算法，只能重排元素、把不需要的移到尾部并返回新末尾，它不知道容器的存在，无法改 size，所以要配合 erase(newEnd, end()) 才真正删除，这就是 erase-remove 惯用法。C++20 的 std::erase / std::erase_if 已经把这个组合封装好了。'
  },
  {
    id: 's164', cat: 'syntax', type: 'single', level: 2,
    q: 'emplace_back 与 push_back 的区别是？',
    options: [
      'emplace_back 效率一定更高',
      'emplace_back 用参数原地构造，push_back 先构造临时对象再移动/拷贝',
      'emplace_back 不能用于 vector',
      '两者完全等价'
    ],
    ans: [1],
    exp: 'emplace_back 把参数完美转发给元素类型的构造函数，直接在容器内存上构造，省掉一次临时对象。但如果本来就要传一个同类型对象（push_back(std::move(x))），两者差别不大。特殊场景下 emplace_back 反而更危险：vector<unique_ptr> 里 emplace_back(new T) 不是异常安全的，而且可能绕过 explicit 检查。'
  },
  {
    id: 's165', cat: 'syntax', type: 'single', level: 2,
    q: '两个 shared_ptr 互相指向对方，会发生什么？',
    options: [
      '正常释放',
      '引用计数永远不为 0，内存泄漏',
      '编译错误',
      '其中一方被自动销毁'
    ],
    ans: [1],
    exp: '循环引用时两者引用计数都至少为 1，析构时谁也不会先释放，堆内存永久泄漏。解决办法是把其中一条边改成 weak_ptr（不增加引用计数），典型场景是父节点用 shared_ptr 持有子节点、子节点用 weak_ptr 指回父节点。'
  },
  {
    id: 's166', cat: 'syntax', type: 'single', level: 2,
    q: 'weak_ptr 的作用是？',
    options: [
      '和 shared_ptr 一样管理生命周期',
      '观察 shared_ptr 管理的对象但不增加引用计数，用前需 lock 提升',
      '替代裸指针做数组访问',
      '自动释放对象'
    ],
    ans: [1],
    exp: 'weak_ptr 不持有所有权，只弱引用。因为对象可能已经销毁，不能直接解引用，必须调用 lock() 得到一个 shared_ptr（对象已销毁则返回空）。典型用途：打破循环引用、实现缓存（数据没了就重算）。'
  },
  {
    id: 's167', cat: 'syntax', type: 'single', level: 1,
    q: '为什么 unique_ptr 不能被拷贝？',
    options: [
      '因为它内部有 const 成员',
      '因为独占所有权的语义要求同一时刻只有一个所有者，拷贝构造被 delete',
      '因为它是抽象类',
      '因为它不支持移动'
    ],
    ans: [1],
    exp: 'unique_ptr 的拷贝构造和拷贝赋值被 = delete，只能 std::move 转移所有权，转移后原指针变为 nullptr。这保证了「同一块内存只有一个 unique_ptr 负责释放」，从类型层面消灭 double free。需要共享所有权时才用 shared_ptr。'
  },
  {
    id: 's168', cat: 'syntax', type: 'single', level: 3,
    q: 'make_shared 相比 shared_ptr<T>(new T) 的优势，不包括？',
    options: [
      '一次内存分配同时放对象和控制块，效率更高',
      '异常安全，不会出现 new 成功但控制块分配失败导致泄漏',
      '可以配合 weak_ptr 使用',
      '对象与控制块相邻，缓存更友好'
    ],
    ans: [2],
    exp: 'weak_ptr 与是否用 make_shared 无关，两者都能用。make_shared 的真实优势是单次分配 + 异常安全 + 缓存局部性。它的代价：对象内存要等最后一个 weak_ptr 销毁才能回收（因为控制块和对象在同一块内存上）。'
  },
  {
    id: 's169', cat: 'syntax', type: 'single', level: 2,
    q: '要让 unique_ptr 正确管理 new 出来的数组，应该？',
    options: [
      'unique_ptr<int> p(new int[10])',
      'unique_ptr<int[]> p(new int[10])',
      'unique_ptr<int> p(new int[10], default_delete<int[]>())',
      '无法用 unique_ptr 管理数组'
    ],
    ans: [1],
    exp: '必须用 delete[] 的特化版本 unique_ptr<T[]>，否则析构时调用 delete 而不是 delete[]，行为未定义。更好的做法是用 std::vector 或 std::array，智能指针管数组本身就是权宜之计。'
  },
  {
    id: 's170', cat: 'syntax', type: 'single', level: 3,
    q: '模板为什么通常不能像普通函数那样把声明放头文件、定义放 .cpp？',
    options: [
      '因为模板不能被包含',
      '因为模板在实例化时才生成代码，编译器需要看到完整定义',
      '因为 .cpp 不能写模板',
      '因为模板没有链接属性'
    ],
    ans: [1],
    exp: '模板本身不生成机器码，只有在具体类型确定后才实例化。如果定义在别的翻译单元，当前翻译单元只看到声明，无法实例化，链接期就会找不到符号。解决办法：定义放头文件；或在 .cpp 里显式实例化 template class Stack<int>;；或 C++20 用 modules。'
  },
  {
    id: 's171', cat: 'syntax', type: 'single', level: 3,
    q: '在模板里写 typename T::iterator 时，typename 的作用是？',
    options: [
      '声明类型参数',
      '告诉编译器 T::iterator 是一个类型而不是静态成员，消除依赖名的解析歧义',
      '限定命名空间',
      '表示该类型可被继承'
    ],
    ans: [1],
    exp: 'T::iterator 依赖模板参数 T，编译器在解析时不知道它是类型还是变量，默认按非类型处理，于是 T::iterator* p 会被理解成乘法。加 typename 明确告诉编译器这是类型。C++20 起在很多上下文里可以省略，但写上更安全。'
  },
  {
    id: 's172', cat: 'syntax', type: 'single', level: 2,
    q: 'template<typename T, int N> class Array; 中的 N 属于？',
    options: ['类型参数', '非类型模板参数', '默认参数', '宏参数'],
    ans: [1],
    exp: 'N 是非类型模板参数，实例化时必须给编译期常量，如 Array<int, 10>。它的好处是长度成为类型的一部分、零运行时开销，std::array 就是这么实现的。C++20 起还允许浮点和类类型作为非类型参数（有严格限制）。'
  },
  {
    id: 's173', cat: 'syntax', type: 'single', level: 3,
    q: '模板全特化与偏特化的区别是？',
    options: [
      '全特化指定所有模板参数，偏特化只指定一部分或对参数形式做限定',
      '偏特化只能用于类模板，全特化只能用于函数模板',
      '两者完全等价',
      '全特化性能更好'
    ],
    ans: [0],
    exp: '全特化 template<> class A<int> 把所有参数都写死；偏特化 template<typename T> class A<T*> 只限定形式。关键限制：函数模板不支持偏特化（只能全特化，或用重载/SFINAE 替代），类模板两者都支持。'
  },
  {
    id: 's174', cat: 'syntax', type: 'single', level: 3,
    q: 'SFINAE 的含义是？',
    options: [
      '替换失败不是错误：模板参数替换失败时只是把该候选从重载集中移除，而非编译报错',
      '所有函数调用失败都静默忽略',
      '模板实例化失败会自动重试',
      '一种运行时类型检查机制'
    ],
    ans: [0],
    exp: 'Substitution Failure Is Not An Error——推导模板参数时如果某个替换导致类型不合法，编译器只是丢弃这个候选，继续看其他重载。这正是 enable_if 能用来做编译期条件分支的原理。注意：失败必须发生在「直接上下文」中，函数体内部出错仍是硬错误。'
  },
  {
    id: 's175', cat: 'syntax', type: 'single', level: 3,
    q: 'C++20 的 concept 主要解决什么问题？',
    options: [
      '替代所有虚函数',
      '给模板参数加可读的编译期约束，错误信息更清晰，并支持重载排序',
      '让模板支持运行时多态',
      '减少模板实例化数量'
    ],
    ans: [1],
    exp: 'concept 把「这个模板要求 T 支持什么操作」写成可命名的约束，比如 requires std::integral<T>。好处：不满足时给出人话错误（而不是几百行实例化回溯）、约束参与重载决议、还能用 requires 表达式组合条件。它不改变模板是编译期展开这一本质。'
  },
  {
    id: 's176', cat: 'syntax', type: 'single', level: 2,
    q: 'catch (Exception e) 按值捕获异常，主要问题是？',
    options: [
      '不能编译',
      '会触发拷贝，且发生对象切片，派生类信息丢失',
      '无法访问 e 的成员',
      '会吞掉异常'
    ],
    ans: [1],
    exp: '按值捕获会拷贝一份异常对象，更严重的是如果抛的是派生类异常、catch 的是基类，会被切片成基类对象，虚函数失效。所以规范写法是 catch (const Exception& e)。按值捕获还会因为拷贝构造再抛异常而引出新问题。'
  },
  {
    id: 's177', cat: 'syntax', type: 'single', level: 3,
    q: '析构函数里抛出异常会怎样？',
    options: [
      '正常传播给调用者',
      '如果此时正在栈展开（已有异常未处理），会调用 std::terminate',
      '自动被忽略',
      '编译报错'
    ],
    ans: [1],
    exp: 'C++11 起析构函数默认是 noexcept。若析构中抛异常而栈上已有另一个异常在传播，两个异常同时存在，程序直接 terminate。所以析构函数绝不该抛异常，必须把可能失败的操作（如 flush、close）放到普通成员函数里显式调用。'
  },
  {
    id: 's178', cat: 'syntax', type: 'single', level: 1,
    q: '头文件保护 #ifndef / #define / #endif 的作用是？',
    options: [
      '加快编译',
      '防止同一头文件在一个翻译单元里被重复包含',
      '防止跨文件重复定义',
      '隐藏实现细节'
    ],
    ans: [1],
    exp: '它只能防止同一个 .cpp（翻译单元）里重复 include 造成的重复定义。跨文件的重复定义要靠「头文件只放声明、定义放 .cpp」或者 inline/static 来解决。#pragma once 是等价且更简洁的非标准扩展，主流编译器都支持。'
  },
  {
    id: 's179', cat: 'syntax', type: 'single', level: 3,
    q: '两个头文件互相 #include 对方，会发生什么？',
    options: [
      '正常编译',
      '配合头文件保护后不再无限递归，但可能因为类型不完整而报「incomplete type」',
      '一定死循环',
      '编译器自动解耦'
    ],
    ans: [1],
    exp: '头文件保护阻止了无限展开，但先被包含的那个文件看不到对方的完整定义。解决办法是前向声明：class B; 然后只使用 B* 或 B&。只有需要 sizeof(B)、继承 B、按值使用 B 时才必须包含完整定义。'
  },
  {
    id: 's180', cat: 'syntax', type: 'single', level: 2,
    q: '__LINE__、__FILE__ 这类宏属于？',
    options: [
      '标准库函数',
      '预定义宏，由预处理器在编译期替换成源码位置',
      '运行时反射 API',
      '编译器私有扩展'
    ],
    ans: [1],
    exp: '它们是标准规定的预定义宏，在预处理阶段就被替换成字面量（行号、文件名），没有任何运行时开销，常用于日志和断言。注意它们的值取决于宏展开的那一行，写进宏里能定位到调用点，写进普通函数里只能定位到函数内部。'
  },
  {
    id: 's181', cat: 'syntax', type: 'single', level: 2,
    q: '全局函数加 static 修饰，作用是？',
    options: [
      '让它变成常量',
      '把链接属性改为内部链接，只在本翻译单元可见',
      '让它线程安全',
      '让它不能被调用'
    ],
    ans: [1],
    exp: 'static 全局函数/变量具有内部链接，其他 .cpp 无法链接到它，避免不同文件里的同名符号冲突。现代替代方案是放进匿名命名空间 namespace { void f(); }，效果相同且对类型也适用。'
  },
  {
    id: 's182', cat: 'syntax', type: 'single', level: 3,
    q: 'extern "C" 的作用是？',
    options: [
      '让代码用 C 语法编译',
      '禁止 C++ 的名称修饰（name mangling），让符号按 C 的规则导出以便被 C 调用',
      '把函数变成内联',
      '关闭异常处理'
    ],
    ans: [1],
    exp: 'C++ 为了支持重载会对函数名做 name mangling，C 不做。extern "C" 让编译器按 C 规则生成符号名，从而能被 C 代码或动态库调用；反过来调 C 库时也要加，否则链接期找不到符号。它只影响链接名，不影响函数体内的 C++ 语义。'
  },
  {
    id: 's183', cat: 'syntax', type: 'single', level: 2,
    q: '匿名命名空间 namespace { int x; } 中的 x 具有？',
    options: ['外部链接', '内部链接，仅本翻译单元可见', '无链接', '动态链接'],
    ans: [1],
    exp: '匿名命名空间等价于给内部符号加 static，具有内部链接，每个翻译单元各有一份独立副本。它是 C++ 中替代 static 全局的首选写法，因为对类、模板、typedef 同样有效。'
  },
  {
    id: 's184', cat: 'syntax', type: 'single', level: 2,
    q: 'std::array 相比 C 风格数组的优势，不包括？',
    options: [
      '可以整体赋值和比较',
      '知道自己的长度，不会退化为指针',
      '可以动态扩容',
      '能和 STL 算法无缝配合'
    ],
    ans: [2],
    exp: 'std::array 是固定长度的栈上容器，不能扩容（要扩容得用 vector）。它的优势是：长度是类型的一部分所以不会退化、支持 = 赋值、支持 == 比较、有 begin/end 可直接用于算法，而且零开销（sizeof 和 C 数组一样）。'
  },
  {
    id: 's185', cat: 'syntax', type: 'single', level: 3,
    q: 'std::string_view 的本质是？',
    options: [
      '一个拥有字符数据的容器',
      '一个（指针 + 长度）的非拥有视图，不管理内存',
      'string 的引用计数版本',
      '只能在栈上使用的字符串'
    ],
    ans: [1],
    exp: 'string_view 只持有指针和长度，拷贝是 O(1) 且不分配内存，非常适合做只读参数。代价是它不拥有数据：如果源字符串是临时对象或已销毁，view 就悬空。所以不要把 string_view 存成成员，也不要从临时 string 构造后返回。'
  },
  {
    id: 's186', cat: 'syntax', type: 'single', level: 2,
    q: 'std::optional<T> 用来表达？',
    options: [
      '一个可能为空的 T，替代「用特殊值表示无效」的做法',
      '一个只能存一个元素的容器',
      '一个延迟初始化的全局变量',
      '一个可变参数容器'
    ],
    ans: [0],
    exp: 'optional 表示「有值 / 无值」两种状态，比返回 -1、nullptr 或空字符串更清晰安全。用 has_value() 或 if (opt) 判断，opt.value() 在无值时抛 bad_optional_access。注意它不分配堆内存，对象直接内嵌在 optional 里，所以 sizeof 会比 T 略大。'
  },
  {
    id: 's187', cat: 'syntax', type: 'single', level: 3,
    q: 'std::variant 与 union 的关键区别是？',
    options: [
      'variant 知道当前存的是哪个类型，且能安全地持有非平凡类型',
      'variant 可以同时存多个值',
      'variant 只能存 POD 类型',
      '两者没有区别'
    ],
    ans: [0],
    exp: 'variant 是类型安全的联合体：内部记录当前索引，访问用 std::get<T> 或 std::visit，类型不匹配会抛 bad_variant_access 而不是读脏数据；而且它会正确调用构造/析构，所以能放 std::string 这种非平凡类型。代价是体积等于「最大成员 + 索引」，比 union 大。'
  },
  {
    id: 's188', cat: 'syntax', type: 'single', level: 3,
    q: 'std::move(x) 实际做了什么？',
    options: [
      '把 x 的内存搬到别处',
      '把 x 转换成右值引用，本身不移动任何东西，真正的移动发生在构造/赋值时',
      '销毁 x',
      '清空 x 的内容'
    ],
    ans: [1],
    exp: 'std::move 只是一个 static_cast<T&&>，纯编译期行为，不产生任何机器码。它把左值标记成「可以被搬走」，随后调用的移动构造/移动赋值才真正转移资源。被 move 之后的对象处于有效但未指定的状态，不能假设它变空。'
  },
  {
    id: 's189', cat: 'syntax', type: 'single', level: 3,
    q: 'std::forward 的作用是？',
    options: [
      '把参数转成右值',
      '按原始值类别转发参数，左值仍是左值、右值仍是右值',
      '强制拷贝参数',
      '把参数转成常量引用'
    ],
    ans: [1],
    exp: '完美转发的核心：模板参数 T&& 是转发引用，配合 std::forward<T>(arg) 才能保留调用方传进来时的左/右值属性。如果直接用 std::move，会把左值也变成右值，导致调用方对象被意外搬空。'
  },
  {
    id: 's190', cat: 'syntax', type: 'single', level: 2,
    q: 'std::tuple 取值除了 std::get<0>(t)，C++17 起还可以？',
    options: [
      't.first',
      'auto& [a, b, c] = t; 结构化绑定',
      't[0]',
      't.get(0)'
    ],
    ans: [1],
    exp: '结构化绑定 auto [a, b] = t; 让代码可读性大增，也能用于 pair、数组和聚合类型。注意默认是拷贝，要引用需写 auto&。老代码里常用 std::tie(a, b) = t; 做解包。'
  },
  {
    id: 's191', cat: 'syntax', type: 'single', level: 2,
    q: 'std::vector<int> v; v[0] = 1; 的问题在于？',
    options: [
      '会抛 out_of_range',
      'v 为空，下标访问不做边界检查，属于未定义行为',
      '编译报错',
      '会自动扩容'
    ],
    ans: [1],
    exp: 'operator[] 不做边界检查，空 vector 上访问 [0] 是未定义行为，可能覆盖别的内存也可能「看起来正常」。需要检查时用 v.at(0)，它会抛 std::out_of_range。这是 vector 最常见的崩溃来源之一。'
  },
  {
    id: 's192', cat: 'syntax', type: 'single', level: 3,
    q: '为什么说 std::map 的 operator[] 可能「偷偷插入元素」？',
    options: [
      '因为它是引用返回',
      '因为找不到 key 时会默认构造一个 value 并插入，然后返回值引用',
      '因为它会预分配空间',
      '因为它是线程安全的'
    ],
    ans: [1],
    exp: 'map::operator[] 的语义是「不存在就插入默认值」，所以只读查询也会修改容器，对 const map 更是直接无法使用。只想查不改要用 find() 或 C++20 的 contains()。这个坑常出现在统计代码里，把不该有的 key 全插进去了。'
  },
  {
    id: 's193', cat: 'syntax', type: 'single', level: 2,
    q: 'std::deque 相对 vector 的优势是？',
    options: [
      '内存连续，缓存更友好',
      '两端插入删除都是 O(1)，且头部插入不搬移元素',
      '迭代器永不失效',
      '支持更快的随机访问'
    ],
    ans: [1],
    exp: 'deque 是分段连续的分块数组，push_front 也是 O(1)，不需要像 vector 那样整体后移。代价是内存不连续、缓存局部性差、迭代器实现复杂。标准库的 queue 和 stack 默认就用 deque 作底层容器。'
  },
  {
    id: 's194', cat: 'syntax', type: 'single', level: 3,
    q: '自定义类型作为 unordered_map 的 key，需要提供？',
    options: [
      '只需要 operator<',
      '需要哈希函数和相等比较（operator==），可用 std::hash 特化或自定义 Hash 模板参数',
      '需要 operator[]',
      '不需要任何额外定义'
    ],
    ans: [1],
    exp: 'unordered_map 先用哈希函数定位桶，再用相等比较处理冲突，所以两者都必须有。map 则只需要严格弱序的 operator<（或自定义比较器）。忘记提供哈希会得到一长串模板实例化错误，这正是 C++20 concept 想改善的体验。'
  },
  {
    id: 's195', cat: 'syntax', type: 'single', level: 2,
    q: 'auto 在推导时会丢掉什么？',
    options: [
      'const 和引用（除非写 auto& 或 const auto&）',
      '指针类型',
      '数组长度',
      '模板参数'
    ],
    ans: [0],
    exp: 'auto 遵循模板实参推导规则：顶层 const 和引用会被丢弃。const int& r = x; auto a = r; 得到的是 int 的副本。要保留需写 auto& / const auto&。另外 auto 无法推导出花括号初始化列表的类型（auto x = {1,2} 在 C++17 起才合法，且是 initializer_list）。'
  },
  {
    id: 's196', cat: 'syntax', type: 'single', level: 2,
    q: 'decltype(x) 与 auto 推导结果的主要差别是？',
    options: [
      'decltype 保留引用和 const，auto 会丢弃',
      'decltype 只能用于函数返回值',
      'auto 更精确',
      '两者完全一样'
    ],
    ans: [0],
    exp: 'decltype 给出表达式的「声明类型」，const int& 就是 const int&；auto 按值推导会剥掉引用和顶层 const。decltype((x)) 带括号时对左值返回 T&（引用），decltype(x) 返回 T——这个细节是 decltype(auto) 的基础。'
  },
  {
    id: 's197', cat: 'syntax', type: 'single', level: 3,
    q: 'C++17 的 if constexpr 与普通 if 的区别是？',
    options: [
      '前者在编译期求值，未命中的分支不会被实例化',
      '前者运行更快',
      '前者只能用于 bool',
      '两者等价，只是写法不同'
    ],
    ans: [0],
    exp: 'if constexpr 的条件必须是编译期常量，且只有命中的分支会被实例化——这让「按类型分派」变得非常干净，替代了大量 SFINAE 和 tag dispatch。普通 if 的两个分支都会参与编译，写 std::string 和 int 混用的分支会直接报错。'
  },
  {
    id: 's198', cat: 'syntax', type: 'single', level: 3,
    q: '关于 std::function 的性能，说法正确的是？',
    options: [
      '零开销，和内联函数一样快',
      '有类型擦除开销，小对象可能走 SBO，大对象会堆分配，且调用通常无法内联',
      '比函数指针慢 100 倍',
      '不能存储 lambda'
    ],
    ans: [1],
    exp: 'std::function 通过类型擦除统一存储各种可调用对象，代价是：可能堆分配、每次调用是间接调用、难以内联。热点路径上常用模板参数替代，或 C++23 的 std::move_only_function。它当然能存 lambda，这正是它的主要用途。'
  },
  {
    id: 's199', cat: 'syntax', type: 'single', level: 2,
    q: 'lambda 捕获 [&] 的风险是？',
    options: [
      '不能修改外部变量',
      '按引用捕获，若 lambda 活得比被捕获变量久就会悬空',
      '性能比 [=] 差',
      '不能有返回值'
    ],
    ans: [1],
    exp: '按引用捕获只是保存引用，如果 lambda 被存起来异步执行、或返回出去，而局部变量已销毁，就会访问悬空引用。典型事故是把 [&] 的 lambda 交给线程池。需要跨作用域存活时用 [=] 或按值捕获具体变量，C++14 起可以用初始化捕获 [p = std::move(ptr)]。'
  },
  {
    id: 's200', cat: 'syntax', type: 'single', level: 3,
    q: 'mutable 修饰 lambda 的作用是？',
    options: [
      '让 lambda 可以修改按值捕获的副本',
      '让 lambda 线程安全',
      '让 lambda 可以修改外部原变量',
      '让 lambda 可以被多次调用'
    ],
    ans: [0],
    exp: 'lambda 的 operator() 默认是 const 的，按值捕获的成员不能改。加 mutable 去掉这个 const，就能修改捕获的副本——但改的仍是副本，外部原变量不受影响（那是按引用捕获才行）。这个区分是面试常考点。'
  }
]

if (typeof module !== 'undefined' && module.exports) module.exports = P2

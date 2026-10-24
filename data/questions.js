/**
 * C++ 刷题小程序 - 题库
 * 分类：syntax(语法基础) / algo(算法与数据结构) / interview(面试真题)
 * 题型：single(单选) / multi(多选) / judge(判断)
 * 难度：1 入门 / 2 进阶 / 3 拔高
 * 说明：同时兼容小程序 require 与浏览器 <script> 直接加载
 */

const CATEGORIES = [
  { key: 'syntax', name: 'C++ 语法基础', desc: '指针引用、内存、STL、面向对象、模板与新特性', icon: '⌘' },
  { key: 'algo', name: '算法与数据结构', desc: '复杂度、排序查找、树图、动态规划', icon: '∑' },
  { key: 'interview', name: '面试真题', desc: '高频考点、经典陷阱题与易错题', icon: '★' },
  { key: 'modern', name: 'C++ 新特性', desc: '在线题库 · C++11/14/17/20 特性题，用时才加载', icon: '⌗' }
]

const CORE = [
  /* ==================== 一、C++ 语法基础 ==================== */
  {
    id: 's01', cat: 'syntax', type: 'single', level: 1,
    q: '执行以下代码，输出结果是？',
    code: 'int arr[5] = {1, 2, 3, 4, 5};\nint *p = arr;\np += 2;\ncout << *p;',
    options: ['1', '2', '3', '编译错误'],
    ans: [2],
    exp: '指针加法按所指向类型的大小步进。p 原指向 arr[0]，p += 2 后指向 arr[2]，*p 即 3。注意 arr[2] 等价于 *(arr + 2)。'
  },
  {
    id: 's02', cat: 'syntax', type: 'single', level: 1,
    q: '关于 C++ 的引用（reference），下列说法正确的是？',
    options: [
      '引用定义时可以不初始化，之后再绑定对象',
      '引用一旦绑定某个对象，就不能再绑定其他对象',
      '可以直接声明"引用的引用"，如 int& &r = a;',
      '引用可以绑定 nullptr 表示空引用'
    ],
    ans: [1],
    exp: '引用必须初始化，且绑定后不可更改指向（它只是对象的别名）。C++ 不允许直接声明"引用的引用"（int& & 非法，int&& 是右值引用）；引用折叠只发生在模板推导/typedef 场景中。引用也不能绑定 nullptr。'
  },
  {
    id: 's03', cat: 'syntax', type: 'single', level: 2,
    q: '在 64 位系统下，sizeof(s)、strlen(p)、sizeof(p) 分别是？',
    code: 'char s[] = "hello";\nchar *p = s;',
    options: ['6、5、8', '5、5、8', '6、6、4', '5、5、4'],
    ans: [0],
    exp: 's 是数组，sizeof(s) 得到整个数组大小 = 6 字节（含结尾 \'\\0\'）；strlen 统计到 \'\\0\' 之前，为 5；p 是指针，64 位下 sizeof 为 8。数组名与指针在 sizeof 下表现不同，这是经典考点。'
  },
  {
    id: 's04', cat: 'syntax', type: 'multi', level: 2,
    q: '下列声明中，"指针变量本身的值（即指向的地址）不可修改"的有哪些？（多选）',
    options: [
      'const int *p;',
      'int * const p;',
      'const int * const p;',
      'int const *p;'
    ],
    ans: [1, 2],
    exp: '判断口诀：const 在 * 左侧，修饰的是"指向的数据"；const 在 * 右侧，修饰的是"指针本身"。A 与 D 完全等价（pointer to const），指针可改、数据不可改；B 是 const pointer，指针不可改；C 是两者都不可改。'
  },
  {
    id: 's05', cat: 'syntax', type: 'multi', level: 2,
    q: '关于 new/delete 与 malloc/free，正确的说法有？（多选）',
    options: [
      'new 会调用构造函数，delete 会调用析构函数',
      'new 返回具体类型指针，不需要强制类型转换',
      'new 分配失败默认抛出 std::bad_alloc 异常，malloc 失败返回 NULL',
      '用 malloc 分配的内存可以用 delete 释放，效果相同'
    ],
    ans: [0, 1, 2],
    exp: 'new/delete 是运算符，负责构造与析构；malloc/free 是库函数，只操作原始内存。二者必须严格配对，混用属于未定义行为（new 配 free 会漏掉析构，malloc 配 delete 可能崩溃）。'
  },
  {
    id: 's06', cat: 'syntax', type: 'single', level: 2,
    q: '以下代码的输出是？',
    code: 'class Base {\npublic:\n  ~Base() { cout << "Base"; }\n};\nclass Derived : public Base {\npublic:\n  ~Derived() { cout << "Derived"; }\n};\nBase *p = new Derived();\ndelete p;',
    options: ['BaseDerived', 'DerivedBase', 'Base', 'Derived'],
    ans: [2],
    exp: '基类析构函数不是 virtual，通过基类指针 delete 派生类对象属于未定义行为，典型表现是只调用基类析构函数，派生部分资源泄漏。正确做法：把基类析构函数声明为 virtual ~Base()。'
  },
  {
    id: 's07', cat: 'syntax', type: 'multi', level: 1,
    q: '关于 struct 与 class，正确的有？（多选）',
    options: [
      'struct 的成员默认 public，class 的成员默认 private',
      'struct 的默认继承方式是 public，class 的默认继承方式是 private',
      'struct 不能定义成员函数',
      'struct 不能包含虚函数'
    ],
    ans: [0, 1],
    exp: 'C++ 中 struct 与 class 的唯一区别就是"默认访问权限"和"默认继承方式"。除此之外两者完全等价，struct 同样可以定义成员函数、虚函数、继承、使用模板。'
  },
  {
    id: 's08', cat: 'syntax', type: 'judge', level: 2,
    q: 'std::vector 执行 push_back 时如果触发了扩容（重新分配内存），此前获得的所有迭代器、引用和指针都会失效。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。扩容会分配新内存并搬移元素，原有地址全部失效。若未扩容，则只有 end() 以及插入位置之后的迭代器失效。这也是为什么循环中保存 vector 元素指针是危险操作。'
  },
  {
    id: 's09', cat: 'syntax', type: 'multi', level: 2,
    q: '关于 std::map 与 std::unordered_map，正确的说法有？（多选）',
    options: [
      'map 通常基于红黑树实现，元素按键有序',
      'unordered_map 通常基于哈希表实现，平均查找复杂度 O(1)',
      'unordered_map 的查找复杂度在任何情况下都是 O(1)',
      'map 的插入、删除、查找复杂度均为 O(log n)'
    ],
    ans: [0, 1, 3],
    exp: 'unordered_map 在哈希冲突严重时（最坏情况）单次操作退化为 O(n)，因此"任何情况下 O(1)"是错误的。此外 unordered_map 需要键支持 hash，且元素无序。'
  },
  {
    id: 's10', cat: 'syntax', type: 'single', level: 2,
    q: '两个 shared_ptr 互相持有对方会造成循环引用，导致内存泄漏。常用的解决方案是？',
    options: ['改用 unique_ptr', '将其中一方改为 weak_ptr', '手动调用 delete', '使用 auto_ptr'],
    ans: [1],
    exp: 'weak_ptr 是弱引用，不增加引用计数，因此能打破引用环。unique_ptr 独占所有权，无法在两个对象间共享；auto_ptr 已在 C++11 被弃用、C++17 移除。'
  },
  {
    id: 's11', cat: 'syntax', type: 'multi', level: 1,
    q: 'C++ 中 static 关键字的作用包括？（多选）',
    options: [
      '修饰局部变量时，延长其生命周期至程序结束，但作用域不变',
      '修饰全局变量/函数时，将其链接性限制在当前源文件（内部链接）',
      '修饰类成员变量时，该成员属于类，被所有对象共享',
      '修饰类成员函数时，该函数内部可以访问 this 指针'
    ],
    ans: [0, 1, 2],
    exp: 'static 成员函数属于类而非对象，没有 this 指针，因此只能直接访问 static 成员。static 局部变量存放在静态存储区，只初始化一次。'
  },
  {
    id: 's12', cat: 'syntax', type: 'judge', level: 2,
    q: '执行 const int a = 10; auto b = a; 之后，变量 b 的类型是 const int。',
    options: ['正确', '错误'],
    ans: [1],
    exp: '错误。auto 的类型推导默认会剥去顶层 const 和引用，b 的类型是 int（可以被修改）。若想保留常量性，需写成 const auto b = a; 或 auto& b = a;（后者保留底层 const）。'
  },
  {
    id: 's13', cat: 'syntax', type: 'judge', level: 2,
    q: 'std::move(x) 本身并不会移动任何数据，它只是把 x 无条件转换为右值引用；真正的移动由移动构造/移动赋值函数完成。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。std::move 本质是一个 static_cast<T&&>。只有类型提供了移动构造/移动赋值，且参数是右值时，才会触发真正的资源转移。被 move 后的对象处于"有效但未指定"的状态，仍可析构或重新赋值。'
  },
  {
    id: 's14', cat: 'syntax', type: 'single', level: 2,
    q: '同时声明 void f(int x); 与 void f(int x = 0); 的结果是？',
    options: [
      '构成合法重载，f(1) 调用第一个',
      '编译错误：与前一个声明冲突/重复定义',
      '构成合法重载，f() 调用第二个',
      '能通过编译，但链接时报错'
    ],
    ans: [1],
    exp: '仅靠默认参数不同无法构成重载——两个声明的函数签名（参数类型列表）完全相同，编译器视为同一函数的重复声明/冲突。重载要求参数个数或类型不同。'
  },
  {
    id: 's15', cat: 'syntax', type: 'single', level: 1,
    q: 'C++ 中 sizeof(空类) 的结果是？',
    options: ['0', '1', '4', '取决于是否有虚函数'],
    ans: [1],
    exp: '空类大小为 1 字节。C++ 标准规定任意两个不同对象的地址必须不同，若大小为 0 则数组元素会重叠，因此编译器会插入 1 字节占位。'
  },
  {
    id: 's16', cat: 'syntax', type: 'judge', level: 2,
    q: '一个类中只要声明了虚函数，该类对象通常会额外包含一个指向虚函数表（vtable）的指针 vptr，因此对象大小至少增加一个指针的大小。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。vptr 由编译器隐式加入，通常在对象起始位置（单继承下）。注意：这属于实现细节而非标准规定，但主流编译器（GCC/Clang/MSVC）都是这么做的。'
  },
  {
    id: 's17', cat: 'syntax', type: 'judge', level: 2,
    q: '函数模板和类模板的定义通常必须放在头文件中，因为编译器实例化模板时需要看到完整定义。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。模板不是普通代码，只有在实例化时才生成具体代码，因此定义必须对调用点可见。替代方案是把定义放在 .cpp 中并做显式实例化（explicit instantiation），但会限制可用类型。'
  },
  {
    id: 's18', cat: 'syntax', type: 'single', level: 2,
    q: '关于 i++ 与 ++i，下列说法错误的是？',
    options: [
      '对于内置类型，编译器通常会优化掉两者在无副作用场景下的差异',
      '前置 ++i 返回左值引用，后置 i++ 返回右值（临时对象）',
      '对 STL 迭代器应优先使用 ++it，避免临时对象开销',
      'i++ 的时间复杂度比 ++i 更低'
    ],
    ans: [3],
    exp: '两者复杂度相同。差别在于后置版本需要保存原值并返回临时对象，对自定义类型（如迭代器）有额外拷贝开销，因此无特殊需求时应习惯性写 ++it。'
  },
  {
    id: 's19', cat: 'syntax', type: 'multi', level: 2,
    q: '关于 inline，正确的说法有？（多选）',
    options: [
      'inline 只是对编译器的建议，编译器可以拒绝内联',
      '在类内部直接定义的成员函数，默认被视为 inline',
      '只要使用 inline，程序就一定运行得更快',
      '递归函数通常不会被内联展开'
    ],
    ans: [0, 1, 3],
    exp: '内联以代码体积换取调用开销，滥用会导致指令膨胀、缓存命中率下降，反而变慢。是否内联最终由编译器根据优化策略决定。'
  },
  {
    id: 's20', cat: 'syntax', type: 'single', level: 2,
    q: '执行以下代码的结果是？',
    code: 'std::vector<int> v;\nv.reserve(100);\nv[0] = 1;',
    options: [
      '正确，v[0] 被赋值为 1',
      '未定义行为：reserve 只改变容量，不改变元素个数',
      '抛出 std::out_of_range 异常',
      '编译错误'
    ],
    ans: [1],
    exp: 'reserve 只分配内存（改变 capacity），不改变 size，此时 v.size() 仍为 0，v[0] 越界且 operator[] 不做检查，属于未定义行为。需要改变元素个数应使用 resize()，或 push_back / emplace_back。'
  },
  {
    id: 's21', cat: 'syntax', type: 'judge', level: 1,
    q: 'std::string::c_str() 返回的指针，在 string 对象被修改或销毁之后会失效。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。c_str() 返回指向内部缓冲区的 const char*，一旦字符串发生修改（可能重新分配）或析构，该指针即失效。需要长期保存时应拷贝一份（如用 strcpy 或另存 std::string）。'
  },
  {
    id: 's22', cat: 'syntax', type: 'single', level: 1,
    q: '下列函数中，不能被声明为虚函数的是？',
    options: ['析构函数', '普通成员函数', '构造函数', 'const 成员函数'],
    ans: [2],
    exp: '构造函数不能是虚函数：调用构造时对象尚未完整构造，vptr 还未正确建立，多态无从谈起。析构函数则强烈建议在基类声明为 virtual。'
  },

  /* ==================== 二、算法与数据结构 ==================== */
  {
    id: 'a01', cat: 'algo', type: 'single', level: 1,
    q: '快速排序的平均时间复杂度与最坏时间复杂度分别是？',
    options: ['O(n log n) / O(n log n)', 'O(n log n) / O(n²)', 'O(n²) / O(n²)', 'O(n) / O(n²)'],
    ans: [1],
    exp: '每次划分较均衡时为 O(n log n)；若每次划分极度不平衡（如对已排序数组取首元素为 pivot），退化为 O(n²)。工程上常用随机化 pivot、三数取中或 introsort（std::sort）规避。'
  },
  {
    id: 'a02', cat: 'algo', type: 'multi', level: 2,
    q: '下列排序算法中，属于稳定排序的有？（多选）',
    options: ['归并排序', '冒泡排序', '简单选择排序', '插入排序'],
    ans: [0, 1, 3],
    exp: '简单选择排序不稳定：例如 [5a, 5b, 2] 选中最小元素 2 与 5a 交换后变成 [2, 5b, 5a]，两个 5 的相对顺序改变。快排、堆排、希尔排序同样不稳定。'
  },
  {
    id: 'a03', cat: 'algo', type: 'multi', level: 2,
    q: '关于二分查找，正确的说法有？（多选）',
    options: [
      '要求序列有序',
      '要求支持随机访问（如数组），在链表上效率低下',
      '时间复杂度为 O(log n)',
      '可以直接在任意无序数组上使用'
    ],
    ans: [0, 1, 2],
    exp: '二分的两大前提：有序 + 随机访问。链表无法 O(1) 定位中点，每次跳跃都要遍历，实际复杂度退化。实际编码要特别小心边界条件（mid 计算溢出可用 left + (right-left)/2）。'
  },
  {
    id: 'a04', cat: 'algo', type: 'single', level: 2,
    q: '下列属于哈希表冲突解决方法的是？',
    options: ['链地址法（拉链法）', '开放地址法（线性探测等）', '再哈希法', '路径压缩'],
    ans: [3],
    exp: '路径压缩是并查集的优化手段，与哈希冲突无关。负载因子过高时冲突激增，此时需要扩容（rehash）。'
  },
  {
    id: 'a05', cat: 'algo', type: 'single', level: 2,
    q: '含有 n 个节点的二叉搜索树（BST）在极端退化情况下，查找的时间复杂度为？',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    ans: [2],
    exp: '若插入序列本身有序，BST 会退化成一条链表，查找退化为 O(n)。因此需要 AVL 树、红黑树（std::map/set 的底层）等自平衡结构保证 O(log n)。'
  },
  {
    id: 'a06', cat: 'algo', type: 'multi', level: 2,
    q: '关于堆与堆排序，正确的说法有？（多选）',
    options: [
      '堆排序是不稳定排序',
      '将无序数组建成堆（建堆）的时间复杂度是 O(n)',
      '堆排序时间复杂度 O(n log n)，额外空间 O(1)',
      '要对数组升序排序，应使用小顶堆'
    ],
    ans: [0, 1, 2],
    exp: '升序排序应使用大顶堆：每次把堆顶最大值与末尾元素交换并缩小堆范围。建堆（自底向上 sift down）的总代价是 O(n) 而非 O(n log n)。'
  },
  {
    id: 'a07', cat: 'algo', type: 'multi', level: 1,
    q: '关于图的遍历，正确的说法有？（多选）',
    options: [
      'DFS 通常用栈（或递归）实现',
      'BFS 通常用队列实现',
      'BFS 可用于求解边权相同的图的单源最短路径',
      'DFS 一定比 BFS 更快找到最短路径'
    ],
    ans: [0, 1, 2],
    exp: 'BFS 按层扩展，首次到达某节点时的层数即为无权最短距离；DFS 走的是深度优先路径，不保证最短。'
  },
  {
    id: 'a08', cat: 'algo', type: 'judge', level: 2,
    q: '拓扑排序只能对有向无环图（DAG）进行；若图中存在环，则无法得到完整的拓扑序列。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。常用 Kahn 算法（维护入度为 0 的队列）或基于 DFS 的后序逆序实现；若最终输出节点数少于图中节点数，说明存在环。'
  },
  {
    id: 'a09', cat: 'algo', type: 'single', level: 2,
    q: '关于 Dijkstra 与 Bellman-Ford 算法，正确的是？',
    options: [
      'Dijkstra 可以正确处理带负权边但无负权环的图',
      'Bellman-Ford 可处理负权边并检测负权环，复杂度 O(VE)',
      '两者都无法处理负权边',
      'Bellman-Ford 的时间复杂度为 O(V + E)'
    ],
    ans: [1],
    exp: 'Dijkstra 基于"已确定最短距离的节点不再更新"这一贪心前提，负权边会破坏该前提。Bellman-Ford 对每条边松弛 V-1 轮，复杂度 O(VE)，再松弛一轮若仍有更新则说明存在负权环。'
  },
  {
    id: 'a10', cat: 'algo', type: 'single', level: 2,
    q: '并查集同时使用"路径压缩"与"按秩/按大小合并"后，单次操作的均摊复杂度接近？',
    options: ['O(n)', 'O(log n)', 'O(α(n))（可视为常数）', '最坏 O(1)'],
    ans: [2],
    exp: '两者结合后复杂度为反阿克曼函数 α(n)，在实际应用中不超过 5，可视为常数。只使用其中一种优化则为 O(log n)。'
  },
  {
    id: 'a11', cat: 'algo', type: 'multi', level: 1,
    q: '能用动态规划求解的问题通常需要具备？（多选）',
    options: ['最优子结构', '重叠子问题', '无后效性', '贪心选择性质'],
    ans: [0, 1, 2],
    exp: '贪心选择性质是贪心算法的适用条件，不是 DP 的必要条件。无后效性指"当前阶段状态一旦确定，后续决策不再受之前路径影响"。'
  },
  {
    id: 'a12', cat: 'algo', type: 'single', level: 2,
    q: '用朴素递归（不做记忆化）计算 fib(n) = fib(n-1) + fib(n-2)，时间复杂度是？',
    options: ['O(n)', 'O(n log n)', 'O(2ⁿ)', 'O(n²)'],
    ans: [2],
    exp: '递归树节点数约为 2ⁿ 量级（严格说是 O(φⁿ)，φ≈1.618）。加入记忆化（memo）或改为递推可降为 O(n)，用矩阵快速幂可降至 O(log n)。'
  },
  {
    id: 'a13', cat: 'algo', type: 'single', level: 2,
    q: '判断单链表是否存在环，最优的经典做法是？',
    options: ['用哈希表记录访问过的节点', '快慢指针（Floyd 判圈算法）', '先排序再查找重复', '递归遍历到底'],
    ans: [1],
    exp: '快慢指针只需 O(1) 额外空间：快指针每次走两步、慢指针走一步，若存在环必然相遇。哈希表法空间 O(n)；找到相遇点后还可进一步求出入环点。'
  },
  {
    id: 'a14', cat: 'algo', type: 'single', level: 2,
    q: '基于比较的排序算法，其最坏时间复杂度的理论下界是？',
    options: ['O(n)', 'O(n log n)', 'O(n^1.5)', 'O(n²)'],
    ans: [1],
    exp: '决策树模型下，n 个元素有 n! 种排列，树高至少 log₂(n!) = Ω(n log n)。计数排序、桶排序、基数排序不基于比较，可突破该下界。'
  },
  {
    id: 'a15', cat: 'algo', type: 'judge', level: 2,
    q: '已知二叉树的前序遍历与中序遍历序列（节点值互不相同），可以唯一确定这棵二叉树；但仅有前序与后序遍历，一般不能唯一确定。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。前序确定根，中序划分左右子树，二者结合可递归重建。前序 + 后序无法区分"只有左子树"和"只有右子树"的两种情况。'
  },
  {
    id: 'a16', cat: 'algo', type: 'single', level: 2,
    q: '用数组顺序存储完全二叉树（下标从 1 开始），下标为 i 的节点，其左孩子下标是？',
    options: ['2i', '2i + 1', 'i / 2', '2i - 1'],
    ans: [0],
    exp: '从 1 开始编号时：左孩子 2i，右孩子 2i+1，父节点 i/2（向下取整）。若从 0 开始编号，则左孩子 2i+1、右孩子 2i+2、父节点 (i-1)/2。'
  },
  {
    id: 'a17', cat: 'algo', type: 'single', level: 2,
    q: 'KMP 字符串匹配算法的时间复杂度是？',
    options: ['O(n × m)', 'O(n + m)', 'O(n log m)', 'O(m²)'],
    ans: [1],
    exp: 'KMP 利用 next（部分匹配表）让主串指针不回退，预处理模式串 O(m)、匹配 O(n)，总体 O(n+m)。对比暴力匹配的 O(n×m)。'
  },
  {
    id: 'a18', cat: 'algo', type: 'single', level: 1,
    q: 'C++ 中 std::priority_queue<int> 默认是？',
    options: ['小顶堆，top() 是最小值', '大顶堆，top() 是最大值', '先进先出队列', '双端队列'],
    ans: [1],
    exp: '默认使用 std::less 比较器，构成大顶堆。要得到小顶堆需写成 std::priority_queue<int, std::vector<int>, std::greater<int>>。'
  },
  {
    id: 'a19', cat: 'algo', type: 'multi', level: 2,
    q: '关于归并排序，正确的说法有？（多选）',
    options: ['时间复杂度 O(n log n)', '是稳定排序', '额外空间复杂度 O(n)', '是原地排序算法'],
    ans: [0, 1, 2],
    exp: '归并排序需要辅助数组（或递归中的临时空间），空间复杂度 O(n)，因此不是原地排序。它的优势是性能稳定且可外排序（适合大规模数据/磁盘排序）。'
  },
  {
    id: 'a20', cat: 'algo', type: 'judge', level: 2,
    q: '表达式 n & (n - 1) 的作用是消去 n 的二进制表示中最低位的 1；因此 n > 0 && (n & (n-1)) == 0 可判断 n 是否为 2 的整数次幂。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。2 的幂的二进制中恰好只有一个 1，消去后为 0。同理，该操作循环执行的次数即为 n 的二进制中 1 的个数（Brian Kernighan 算法）。'
  },
  {
    id: 'a21', cat: 'algo', type: 'single', level: 2,
    q: '递归式 T(n) = 2T(n/2) + O(n) 对应的时间复杂度是？',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    ans: [1],
    exp: '由主定理：a=2, b=2，n^(log_b a) = n，与 f(n) = O(n) 同阶，属于情形二，结果为 O(n log n)。归并排序、快排平均情况均属此类。'
  },
  {
    id: 'a22', cat: 'algo', type: 'judge', level: 1,
    q: '在数组中插入/删除元素的平均时间复杂度为 O(n)（需移动元素）；而在已知前驱节点的双向链表中插入/删除节点为 O(1)。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。数组的代价来自元素搬移；链表只需修改指针。但链表失去随机访问能力，且缓存局部性差，实际工程中 vector 往往更快。'
  },

  /* ==================== 三、面试真题 ==================== */
  {
    id: 'i01', cat: 'interview', type: 'single', level: 1,
    q: 'int *p = new int[10]; 之后，正确的释放方式是？',
    options: ['delete p;', 'delete[] p;', 'free(p);', 'p = nullptr; 即可'],
    ans: [1],
    exp: 'new[] 必须配 delete[]，否则派生类型/非平凡类型的析构函数只会对首个元素调用，属于未定义行为。置 nullptr 只避免野指针，不释放内存。'
  },
  {
    id: 'i02', cat: 'interview', type: 'multi', level: 2,
    q: '一个类中含有裸指针成员并负责动态内存，通常需要自行定义？（多选，即 Rule of Three / Rule of Five）',
    options: ['析构函数', '拷贝构造函数', '拷贝赋值运算符', '移动构造函数与移动赋值运算符（C++11 起）'],
    ans: [0, 1, 2, 3],
    exp: '编译器默认生成的拷贝是"浅拷贝"，会导致两个对象指向同一块内存、重复释放（double free）。Rule of Zero 更推荐：用 vector / string / 智能指针管理资源，从而完全不需要手写这些函数。'
  },
  {
    id: 'i03', cat: 'interview', type: 'single', level: 2,
    q: '默认对齐（int 按 4 字节对齐）下，sizeof 的结果是？',
    code: 'struct A {\n  char c;\n  int  i;\n};',
    options: ['5', '6', '8', '12'],
    ans: [2],
    exp: 'c 占 1 字节，其后需填充 3 字节使 i 对齐到 4 的倍数，共 8 字节；结构体总大小还需对齐到最大成员对齐值（4）的倍数，故为 8。可用 #pragma pack(1) 改为紧凑布局（此时为 5）。'
  },
  {
    id: 'i04', cat: 'interview', type: 'single', level: 2,
    q: 'C++ 运行时多态的实现机制主要是？',
    options: ['函数重载', '模板实例化', '虚函数表（vtable）+ 虚表指针（vptr）', '宏替换'],
    ans: [2],
    exp: '每个含虚函数的类有一张 vtable，对象内嵌 vptr 指向它；调用虚函数时在运行时通过 vtable 间接寻址，因此有轻微间接开销且通常无法内联。重载与模板属于编译期多态。'
  },
  {
    id: 'i05', cat: 'interview', type: 'multi', level: 2,
    q: '关于数组名与指针，正确的说法有？（多选）',
    options: [
      'sizeof(arr) 得到整个数组的字节数，而 sizeof(p)（p 为指针）只得到指针大小',
      '数组名在多数表达式中会退化为指向首元素的指针',
      '数组名可以被重新赋值，指向另一块内存',
      'int arr[5] 与 int* const arr 在语义与类型上完全相同'
    ],
    ans: [0, 1],
    exp: '数组名不是可修改的左值，不能被重新赋值；作为函数参数传递时会退化为指针，因此函数内 sizeof 参数得到的是指针大小——这也是数组传参要额外传长度的根源。'
  },
  {
    id: 'i06', cat: 'interview', type: 'multi', level: 1,
    q: '关于进程与线程，正确的说法有？（多选）',
    options: [
      '进程是资源分配的基本单位，线程是 CPU 调度的基本单位',
      '同一进程内的线程共享堆和全局变量，但各自拥有独立的栈',
      '线程切换的开销通常小于进程切换',
      '多进程之间天然共享同一地址空间'
    ],
    ans: [0, 1, 2],
    exp: '进程间地址空间相互隔离，需通过 IPC（管道、共享内存、socket 等）通信；线程切换无需切换页表、不刷新 TLB，因此开销更小。'
  },
  {
    id: 'i07', cat: 'interview', type: 'single', level: 2,
    q: 'TCP 建立连接需三次握手，断开需四次挥手；主动关闭方进入 TIME_WAIT 状态，通常需等待？',
    options: ['1 MSL', '2 MSL', '30 秒', '4 MSL'],
    ans: [1],
    exp: '等待 2 MSL 有两个目的：保证最后一个 ACK 能到达对端（丢失时可重传 FIN+ACK），以及让本次连接的残留报文在网络中消散，避免污染后续复用同一四元组的新连接。'
  },
  {
    id: 'i08', cat: 'interview', type: 'multi', level: 2,
    q: '产生死锁的必要条件包括？（多选）',
    options: ['互斥条件', '请求与保持条件', '不可剥夺条件', '循环等待条件'],
    ans: [0, 1, 2, 3],
    exp: '四个条件必须同时成立才会死锁，破坏任意一个即可预防。常见手段：统一加锁顺序（破循环等待）、一次性申请全部资源（破请求与保持）、超时回滚（破不可剥夺）。'
  },
  {
    id: 'i09', cat: 'interview', type: 'judge', level: 2,
    q: 'C/C++ 中的 volatile 可以保证多线程下的数据原子性与可见性，因此可以替代 std::atomic 实现线程同步。',
    options: ['正确', '错误'],
    ans: [1],
    exp: '错误。volatile 只告诉编译器"该变量可能被程序之外的因素改变，不要做寄存器缓存等优化"，不提供内存屏障，也不保证原子性（如 ++ 仍是读-改-写三步）。线程同步应使用 std::atomic 或互斥量。'
  },
  {
    id: 'i10', cat: 'interview', type: 'judge', level: 1,
    q: 'free(p) 或 delete p 之后应将 p 置为 nullptr，否则 p 成为悬垂指针（野指针），再次使用或重复释放都是未定义行为。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。注意 delete nullptr 是安全的空操作，因此置空后可安全重复 delete。使用智能指针可从根源上避免该问题。'
  },
  {
    id: 'i11', cat: 'interview', type: 'multi', level: 2,
    q: '关于 C++11 智能指针，正确的说法有？（多选）',
    options: [
      'unique_ptr 独占所有权，不可拷贝，但可通过 std::move 转移',
      'shared_ptr 通过引用计数管理，计数归零时释放资源',
      'weak_ptr 不增加引用计数，可用于打破循环引用',
      'shared_ptr 是线程安全的：引用计数与所指对象的读写都无需额外同步'
    ],
    ans: [0, 1, 2],
    exp: 'shared_ptr 的引用计数增减是原子操作，不同 shared_ptr 实例并发读写自身是安全的；但多个线程读写"同一个 shared_ptr 对象"或"所指对象的内容"仍需加锁。'
  },
  {
    id: 'i12', cat: 'interview', type: 'multi', level: 2,
    q: '关于 lambda 表达式的捕获，正确的说法有？（多选）',
    options: [
      '[=] 表示以值（拷贝）方式捕获使用的外部变量',
      '[&] 表示以引用方式捕获使用的外部变量',
      '引用捕获局部变量时，若 lambda 生命周期超过该变量，会产生悬垂引用',
      '[=] 捕获的变量在 lambda 内可以直接修改，且不影响外部原值'
    ],
    ans: [0, 1, 2],
    exp: 'lambda 的 operator() 默认为 const，值捕获的变量默认不可修改，需加 mutable 才行（且修改的是副本）。另外 [=] 捕获成员变量时实际捕获的是 this 指针，存在对象生命周期风险。'
  },
  {
    id: 'i13', cat: 'interview', type: 'single', level: 2,
    q: '遍历 std::vector 时删除满足条件的元素，正确的写法是？',
    code: '// A\nfor (auto it = v.begin(); it != v.end(); ++it)\n  if (cond(*it)) v.erase(it);\n\n// B\nfor (auto it = v.begin(); it != v.end(); )\n  if (cond(*it)) it = v.erase(it);\n  else ++it;',
    options: ['写法 A', '写法 B', '两种都可以', '两种都不行，只能用下标'],
    ans: [1],
    exp: 'erase 会使被删位置及其之后的迭代器全部失效，A 中继续使用 ++it 是未定义行为。B 用 erase 的返回值（指向下一个有效元素）重新赋值是标准做法；也可直接用 erase-remove 惯用法：v.erase(std::remove_if(...), v.end())。'
  },
  {
    id: 'i14', cat: 'interview', type: 'single', level: 2,
    q: '判断当前机器字节序（大端/小端），最直接的做法是？',
    code: 'int x = 1;\nreturn *(char*)&x == 1;',
    options: [
      '返回 true 表示小端（低字节存放在低地址）',
      '返回 true 表示大端',
      '无法判断，需要看 sizeof(int)',
      '该写法违反严格别名规则，永远返回 false'
    ],
    ans: [0],
    exp: 'int 为 1 时，其最低地址字节在 x86/ARM（小端）上是 0x01，故为真即小端。C++20 起可用 std::endian 直接查询，更规范。'
  },
  {
    id: 'i15', cat: 'interview', type: 'multi', level: 1,
    q: '关于栈与堆，正确的说法有？（多选）',
    options: [
      '栈由系统自动分配与回收，存放局部变量、函数参数与返回地址',
      '堆需要程序员手动申请释放（或借助智能指针）',
      '栈空间通常远小于堆（如 Linux 主线程默认栈约 8MB）',
      '栈的生长方向一定是从低地址向高地址'
    ],
    ans: [0, 1, 2],
    exp: '绝大多数架构（x86、ARM）中栈向低地址生长，D 的说法既不普遍也不属于标准保证。栈上分配极快（只需移动栈指针），但空间有限，大对象或运行时才确定大小的对象应放在堆上。'
  },
  {
    id: 'i16', cat: 'interview', type: 'single', level: 2,
    q: 'extern "C" 的主要作用是？',
    options: [
      '让 C++ 函数按 C 语言规则进行名字修饰，以便 C 代码链接调用',
      '提高函数执行效率',
      '让函数支持重载',
      '声明该函数为内联函数'
    ],
    ans: [0],
    exp: 'C++ 支持重载，编译时会对函数名做 name mangling；C 不会。extern "C" 关闭 mangling，使符号名与 C 一致。它内部的函数不能重载。'
  },
  {
    id: 'i17', cat: 'interview', type: 'single', level: 2,
    q: '把拷贝构造函数写成 A(A other) 会导致？',
    options: [
      '正常运行，只是多一次拷贝',
      '编译错误：无效构造函数（会引发无限递归的拷贝）',
      '运行时栈溢出崩溃',
      '自动触发移动语义'
    ],
    ans: [1],
    exp: '按值传参意味着调用时又要拷贝实参 → 再次调用拷贝构造 → 无限递归。编译器会直接报错（如 "invalid constructor; you probably meant A(const A&)"）。正确写法是 A(const A& other)。'
  },
  {
    id: 'i18', cat: 'interview', type: 'judge', level: 2,
    q: 'A* p = nullptr; p->f(); 若 f 是非虚成员函数且不访问任何成员变量，这段代码通常能正常运行；若 f 访问成员变量或为虚函数，则会崩溃。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确（但仍是未定义行为，不应依赖）。非虚成员函数调用是静态绑定，不需要读对象内存，this 为 nullptr 也能进入；访问成员（解引用 this）或调用虚函数（需读 vptr）就会段错误。'
  },
  {
    id: 'i19', cat: 'interview', type: 'judge', level: 2,
    q: '在基类的构造函数中调用虚函数，不会发生多态——实际调用的是基类自己的版本。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。构造基类子对象时，派生部分尚未构造，对象的动态类型被视为当前正在构造的类，因此虚调用解析到基类版本。析构函数同理。这也是"不要在构造/析构中调用虚函数"的原因。'
  },
  {
    id: 'i20', cat: 'interview', type: 'single', level: 2,
    q: '以下代码在 v 为空时的隐患是？',
    code: 'std::vector<int> v;\nfor (int i = v.size() - 1; i >= 0; --i) {\n  // ...\n}',
    options: [
      '编译错误',
      'v.size() 返回无符号 size_t，v.size()-1 会下溢成极大值，导致越界访问',
      '正常运行，循环体不执行',
      '抛出 std::out_of_range'
    ],
    ans: [1],
    exp: 'size() 返回 size_t（无符号），空容器时 0-1 回绕为 SIZE_MAX，i >= 0 恒成立，v[i] 越界崩溃。倒序遍历推荐用反向迭代器 rbegin/rend，或显式写成 for (size_t i = v.size(); i-- > 0;)。'
  },
  {
    id: 'i21', cat: 'interview', type: 'multi', level: 2,
    q: '关于 memcpy 与 memmove，正确的说法有？（多选）',
    options: [
      '两者都按字节进行拷贝',
      'memmove 能正确处理源与目标内存重叠的情况',
      'memcpy 在内存重叠时行为未定义',
      'memmove 一定比 memcpy 更快'
    ],
    ans: [0, 1, 2],
    exp: 'memmove 需要判断重叠方向，通常比 memcpy 略慢（现代实现在无重叠时会退化为 memcpy 路径）。另外两者都不适合拷贝非平凡（non-trivial）的 C++ 对象。'
  },
  {
    id: 'i22', cat: 'interview', type: 'single', level: 2,
    q: '关于函数返回局部对象，正确的说法是？',
    options: [
      '一定会产生一次拷贝，应尽量避免',
      '现代编译器普遍支持 RVO/NRVO 与移动语义，可消除大部分不必要的拷贝',
      '返回局部对象的引用是安全且高效的',
      '必须改为返回指针或动态分配'
    ],
    ans: [1],
    exp: 'C++17 起纯右值返回甚至保证不产生临时对象（强制拷贝消除）。返回局部对象的引用才是真正的错误——函数返回后对象已销毁。'
  },
  {
    id: 'i23', cat: 'interview', type: 'judge', level: 1,
    q: 'std::vector 的 size() 返回元素个数，capacity() 返回已分配容量；clear() 只销毁元素使 size 归零，通常不会释放已分配的内存。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。若要真正归还内存，可用 v.shrink_to_fit()（非强制绑定）或 swap 技巧：std::vector<T>().swap(v)。'
  },
  {
    id: 'i24', cat: 'interview', type: 'single', level: 2,
    q: '关于 TCP 与 UDP，下列说法错误的是？',
    options: [
      'TCP 面向连接且可靠；UDP 无连接，不保证可靠交付',
      'TCP 有拥塞控制与流量控制，UDP 没有',
      'UDP 首部开销比 TCP 小',
      'UDP 一定比 TCP 慢'
    ],
    ans: [3],
    exp: 'UDP 没有握手、确认、重传与拥塞控制，通常延迟更低、开销更小，因此"一定更慢"是错误的。代价是不保证可靠与有序，需要应用层自己补齐。'
  },

  /* ==================== 四、C++ 语法基础 · 扩展 ==================== */
  {
    id: 's23', cat: 'syntax', type: 'single', level: 2,
    q: '派生类中定义了与基类同名同参的函数，但基类该函数不是虚函数，这种现象称为？',
    options: ['重载（overload）', '覆盖/重写（override）', '隐藏（name hiding）', '编译错误'],
    ans: [2],
    exp: '同名同参但基类非 virtual → 派生类函数隐藏了基类版本，通过基类指针调用仍走基类实现。重载要求同一作用域且参数不同；覆盖要求基类函数为 virtual。可用 using Base::f; 把基类版本引入派生作用域。'
  },
  {
    id: 's24', cat: 'syntax', type: 'single', level: 1,
    q: '关于纯虚函数与抽象类，下列说法正确的是？',
    options: [
      '含有纯虚函数的类可以正常实例化',
      '纯虚函数的写法是 virtual void f() = 0;',
      '派生类可以不实现基类的纯虚函数而直接实例化',
      '纯虚函数必须有函数体'
    ],
    ans: [1],
    exp: '含纯虚函数（= 0）的类是抽象类，不能实例化；派生类必须实现全部纯虚函数才能实例化。纯虚函数也可以提供函数体（类外定义），供派生类显式调用 Base::f()。'
  },
  {
    id: 's25', cat: 'syntax', type: 'single', level: 3,
    q: '菱形继承（D→B、D→C，B、C 都继承 A）带来的主要问题与解决方式是？',
    options: [
      '命名冲突，用命名空间解决',
      '基类子对象重复、访问二义性，用虚继承解决',
      '无法多态，用虚函数解决',
      '构造顺序混乱，用初始化列表解决'
    ],
    ans: [1],
    exp: '普通继承下 D 中会存在两份 A 子对象，访问 A::x 产生二义性且浪费空间。写作 class B : virtual public A 后，派生体系中只保留一份共享的基类子对象，由最底层派生类负责初始化虚基类。'
  },
  {
    id: 's26', cat: 'syntax', type: 'single', level: 2,
    q: '将基类指针安全地向下转型为派生类指针，并在失败时返回 nullptr，应使用？',
    options: ['static_cast', 'dynamic_cast', 'reinterpret_cast', 'const_cast'],
    ans: [1],
    exp: 'dynamic_cast 在运行时检查类型，指针转换失败返回 nullptr，引用转换失败抛出 std::bad_cast。它要求基类含有虚函数（多态类型）；static_cast 不做运行时检查，向下转型不安全。'
  },
  {
    id: 's27', cat: 'syntax', type: 'multi', level: 2,
    q: '关于 C++ 四种强制类型转换，正确的说法有？（多选）',
    options: [
      'static_cast 用于相关类型间的转换（如数值转换、void* 回原类型），不做运行时检查',
      'dynamic_cast 依赖 RTTI，用于多态类型的安全向下转型',
      'const_cast 用于去除或添加 const / volatile 属性',
      'reinterpret_cast 做低层位模式重解释，可移植性最差'
    ],
    ans: [0, 1, 2, 3],
    exp: '四者分工明确：static_cast 最常用且编译期检查；dynamic_cast 唯一带运行时检查；const_cast 只改常量性（修改真正的 const 对象仍是 UB）；reinterpret_cast 仅用于低层场景，结果通常与平台相关。'
  },
  {
    id: 's28', cat: 'syntax', type: 'judge', level: 2,
    q: 'reinterpret_cast 只是按位重新解释对象的类型，不会改变对象内容；使用它通常不可移植，应尽量避免。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。典型用途是把指针转成 uintptr_t 做地址运算，或与 C API 交互。它不做任何对齐或类型安全检查，跨编译器/平台行为可能不同。'
  },
  {
    id: 's29', cat: 'syntax', type: 'single', level: 2,
    q: '对基类指针 Base* p 指向 Derived 对象，typeid(*p) 得到的结果是？',
    options: [
      '一定是 Base 的类型信息',
      '多态类型下得到运行时真实类型 Derived',
      '编译错误',
      '得到 void 类型'
    ],
    ans: [1],
    exp: 'typeid 作用于多态类型（含虚函数的类）的表达式时会在运行时求值，返回对象真实类型；作用于非多态类型或类型名时只做编译期推导。RTTI 可在部分工程中被编译器选项关闭。'
  },
  {
    id: 's30', cat: 'syntax', type: 'single', level: 2,
    q: '多个 catch 块同时存在时，正确的排列顺序是？',
    options: [
      '基类异常在前，派生类异常在后',
      '派生类异常在前，基类异常在后',
      '顺序无所谓，编译器自动匹配最优',
      '只能写一个 catch(...)'
    ],
    ans: [1],
    exp: '异常匹配按 catch 出现顺序自上而下检查，若基类在前，派生类异常会被提前捕获（甚至编译告警 unreachable）。catch(...) 必须放最后以兜底。'
  },
  {
    id: 's31', cat: 'syntax', type: 'judge', level: 2,
    q: '被 noexcept 修饰的函数如果抛出异常，程序会调用 std::terminate 直接终止，而不会正常展开栈。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。noexcept 是给编译器的承诺，可用于优化（如 vector 扩容时选择移动而非拷贝）。析构函数默认隐式 noexcept。'
  },
  {
    id: 's32', cat: 'syntax', type: 'single', level: 2,
    q: '在常见实现下，sizeof 的结果是？',
    code: 'struct S {\n  unsigned a : 3;\n  unsigned b : 5;\n};',
    options: ['1', '2', '4', '8'],
    ans: [2],
    exp: '位域成员共用同一个 unsigned 存储单元，共 8 位，结构体大小按 unsigned（4 字节）对齐，因此为 4。位域的布局顺序、跨单元规则由实现定义，不适合做跨平台序列化。'
  },
  {
    id: 's33', cat: 'syntax', type: 'single', level: 2,
    q: '默认对齐下，sizeof 的结果是？',
    code: 'union U {\n  int  i;\n  char c[5];\n};',
    options: ['5', '4', '8', '1'],
    ans: [2],
    exp: 'union 大小至少容纳最大成员（char[5] = 5 字节），再按最大成员对齐值（int → 4）向上取整，得到 8。所有成员共享同一段内存，同一时刻只有一个成员有效。'
  },
  {
    id: 's34', cat: 'syntax', type: 'multi', level: 1,
    q: '相比普通 enum，enum class（限定作用域枚举）的优势有？（多选）',
    options: [
      '枚举值不会泄漏到外层作用域，避免命名污染',
      '是强类型的，不会隐式转换为整型',
      '可以指定底层类型，如 enum class E : uint8_t',
      '可以自动参与算术运算而无需转换'
    ],
    ans: [0, 1, 2],
    exp: 'enum class 需显式写 E::A，也不能直接当整数用（需 static_cast），换来的是类型安全与可控的底层存储大小，这正是它优于传统 enum 的地方。'
  },
  {
    id: 's35', cat: 'syntax', type: 'single', level: 1,
    q: '#include <header> 与 #include "header" 的主要区别是？',
    options: [
      '尖括号优先在当前目录查找，引号优先在系统目录查找',
      '尖括号优先在系统/标准目录查找，引号优先在当前源文件所在目录查找',
      '两者完全等价',
      '尖括号会递归展开，引号不会'
    ],
    ans: [1],
    exp: '约定俗成：自己项目的头文件用引号，标准库与第三方库用尖括号。具体搜索路径可由编译器的 -I 选项扩展。'
  },
  {
    id: 's36', cat: 'syntax', type: 'judge', level: 1,
    q: '#pragma once 与 #ifndef 头文件守卫都能防止头文件被重复包含；#pragma once 不属于标准，但主流编译器都支持。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。#pragma once 更简洁且能避免宏名冲突，但在极少数场景（同一文件通过不同路径软链接引入）可能失效；现代工程两者任选其一即可。'
  },
  {
    id: 's37', cat: 'syntax', type: 'single', level: 2,
    q: '构造函数初始化列表中各成员的初始化顺序取决于？',
    options: [
      '初始化列表中的书写顺序',
      '成员在类中的声明顺序',
      '编译器优化决定',
      '成员的访问级别（public 优先）'
    ],
    ans: [1],
    exp: '真实顺序永远是声明顺序，与初始化列表书写顺序无关。若成员间存在依赖（如用 b 初始化 a）而列表顺序写反，会产生未定义行为，编译器通常会给出 -Wreorder 警告。'
  },
  {
    id: 's38', cat: 'syntax', type: 'single', level: 2,
    q: 'explicit 关键字用于？',
    options: [
      '禁止类的拷贝构造',
      '防止单参数构造函数参与隐式类型转换',
      '强制内联展开',
      '声明函数为虚函数'
    ],
    ans: [1],
    exp: 'class A { explicit A(int); }; 后，A a = 1; 不再合法，必须写 A a(1)。这能避免意外的隐式转换导致的语义歧义。C++11 起 explicit 也可用于转换运算符。'
  },
  {
    id: 's39', cat: 'syntax', type: 'judge', level: 2,
    q: '友元关系既不能继承，也不具有传递性：A 是 B 的友元、B 是 C 的友元，并不能推出 A 可以访问 C 的私有成员。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。友元破坏了封装，应谨慎使用；常见合理场景是重载 << 运算符、单元测试访问内部状态。'
  },
  {
    id: 's40', cat: 'syntax', type: 'single', level: 2,
    q: '在 const 成员函数中，仍希望某个成员可以被修改，应给该成员加什么修饰？',
    options: ['static', 'mutable', 'volatile', 'constexpr'],
    ans: [1],
    exp: 'mutable 成员可在 const 成员函数中修改，典型用途是缓存（lazy eval）、互斥量、访问计数。原理上它把该成员排除在对象的"逻辑常量性"之外。'
  },
  {
    id: 's41', cat: 'syntax', type: 'single', level: 2,
    q: '把派生类对象按值赋给基类对象时会发生什么？',
    options: [
      '完整拷贝，派生部分保留',
      '对象切片（slicing）：派生部分被切掉，只剩基类部分',
      '编译错误',
      '自动调用虚函数保持多态'
    ],
    ans: [1],
    exp: '按值赋值/传参只会拷贝基类子对象，派生独有成员丢失，也不会有多态行为。若需要保留动态类型，应使用基类指针或引用。'
  },
  {
    id: 's42', cat: 'syntax', type: 'multi', level: 2,
    q: '下列会调用拷贝构造函数的场景有？（多选）',
    options: [
      '用一个已存在的对象初始化新对象：A b(a); 或 A b = a;',
      '把对象按值传给函数参数',
      '函数按值返回对象（可能被 RVO 优化掉）',
      '两个已存在对象之间赋值：b = a;'
    ],
    ans: [0, 1, 2],
    exp: 'D 调用的是拷贝赋值运算符。注意 C++17 起纯右值返回已保证不再产生临时对象，因此第三项在现代编译器下常常观察不到拷贝。'
  },
  {
    id: 's43', cat: 'syntax', type: 'single', level: 2,
    q: '下列运算符中，不能被重载的是？',
    options: ['operator+', 'operator[]', 'operator::', 'operator<<'],
    ans: [2],
    exp: '不能重载的有 ::（作用域解析）、.（成员访问）、.*（成员指针访问）、?:（三目）、sizeof、typeid 等，重载它们会破坏语言基本语义。'
  },
  {
    id: 's44', cat: 'syntax', type: 'single', level: 2,
    q: '重载输出运算符 << 时，通常应定义为？',
    options: [
      '类的成员函数',
      '非成员（常为友元）函数，参数顺序为 (ostream&, const T&)',
      '静态成员函数',
      '全局的宏'
    ],
    ans: [1],
    exp: '成员函数的左操作数固定为 this（即 T），会导致 cout << t 无法匹配，只能写成 t << cout。因此流运算符必须定义为非成员函数，需要访问私有成员时声明为友元。'
  },
  {
    id: 's45', cat: 'syntax', type: 'single', level: 3,
    q: '重载后置 ++ 运算符时，为了与前置版本区分，需要？',
    options: [
      '返回值不同即可',
      '额外声明一个 int 类型的哑元参数',
      '加 const 修饰',
      '命名为 operator++2'
    ],
    ans: [1],
    exp: 'T& operator++(); 为前置，T operator++(int); 为后置（int 哑元仅用于区分，不参与调用）。后置版本需保存原值并返回临时对象，因此返回 T 而非 T&。'
  },
  {
    id: 's46', cat: 'syntax', type: 'multi', level: 1,
    q: '一个完整的 lambda 表达式可以包含哪些部分？（多选）',
    options: ['捕获列表 []', '参数列表 ()', 'mutable / noexcept 说明', '返回类型 -> T 与函数体'],
    ans: [0, 1, 2, 3],
    exp: '形式：[capture](params) specifiers -> ret { body }。捕获列表与函数体必填，其余可省略；编译器会为 lambda 生成一个唯一的闭包类型。'
  },
  {
    id: 's47', cat: 'syntax', type: 'single', level: 2,
    q: 'std::function 的作用是？',
    options: [
      '定义函数模板',
      '以统一的类型擦除方式保存任意可调用对象（函数指针、lambda、函数对象、bind 结果）',
      '替代虚函数实现多态',
      '把函数内联展开'
    ],
    ans: [1],
    exp: 'std::function<int(int)> 可以接收任何签名匹配的可调用物，代价是类型擦除带来的间接调用与可能的堆分配。性能敏感且类型固定时，用模板参数或 auto 更合适。'
  },
  {
    id: 's48', cat: 'syntax', type: 'multi', level: 2,
    q: '下列容器的迭代器属于随机访问迭代器的有？（多选）',
    options: ['std::vector', 'std::deque', 'std::list', 'std::array'],
    ans: [0, 1, 3],
    exp: 'vector/deque/array 支持 it + n、it1 - it2 等随机访问操作；list 是双向迭代器（只能 ++/--），forward_list 是前向迭代器。std::sort 只接受随机访问迭代器。'
  },
  {
    id: 's49', cat: 'syntax', type: 'single', level: 2,
    q: '关于 std::deque，正确的描述是？',
    options: [
      '内存完全连续，与 vector 相同',
      '头尾插入删除均为 O(1)，支持随机访问，内存分段连续',
      '不支持随机访问',
      '插入会使所有迭代器失效'
    ],
    ans: [1],
    exp: 'deque 由若干固定大小的缓冲区（分段）组成，通过中控映射表定位，因此头尾增删高效且支持 O(1) 随机访问；中间插入仍是 O(n)。'
  },
  {
    id: 's50', cat: 'syntax', type: 'multi', level: 2,
    q: '关于 std::list 与 std::vector 的对比，正确的有？（多选）',
    options: [
      'list 在已知位置的插入删除为 O(1)，vector 为 O(n)',
      'vector 支持 O(1) 随机访问，list 不支持',
      '删除 list 元素只会使被删元素的迭代器失效',
      '由于缓存局部性差，list 在小数据量下的实际性能常不如 vector'
    ],
    ans: [0, 1, 2, 3],
    exp: '理论上 list 的插入删除更优，但节点分散导致缓存命中率低、每节点还有指针开销。工程实践中默认选 vector，只有确实需要稳定的元素地址/频繁中间插入时才考虑 list。'
  },
  {
    id: 's51', cat: 'syntax', type: 'judge', level: 2,
    q: 'std::sort 要求随机访问迭代器，因此不能直接用于 std::list；list 提供了自己的成员函数 sort()。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。list::sort() 用归并实现，稳定且不需要随机访问；容器的成员函数版本通常比通用算法更适合自身结构（同理还有 list::remove、list::splice）。'
  },
  {
    id: 's52', cat: 'syntax', type: 'single', level: 2,
    q: '在已排序数组上使用 lower_bound 与 upper_bound，返回值分别是？',
    options: [
      '第一个 > value 的位置 / 第一个 >= value 的位置',
      '第一个 >= value 的位置 / 第一个 > value 的位置',
      '等于 value 的位置 / 最后一个等于 value 的位置',
      '最后一个 < value 的位置 / 第一个 > value 的位置'
    ],
    ans: [1],
    exp: 'lower_bound 返回首个 >= value 的位置，upper_bound 返回首个 > value 的位置；二者之差即等于 value 的元素个数。它们要求区间已按同样比较器排好序。'
  },
  {
    id: 's53', cat: 'syntax', type: 'multi', level: 2,
    q: '关于 std::set / std::multiset，正确的说法有？（多选）',
    options: [
      'set 中元素唯一，multiset 允许重复',
      '两者元素都按键有序',
      '底层通常为红黑树，插入删除查找为 O(log n)',
      '可以直接修改 set 中已有元素的值'
    ],
    ans: [0, 1, 2],
    exp: 'set 的迭代器是 const 的，不能原地修改元素（会破坏有序性），正确做法是先 erase 再 insert。C++11 起 extract + 修改 + insert 是更高效的方式。'
  },
  {
    id: 's54', cat: 'syntax', type: 'judge', level: 2,
    q: 'std::pair 的比较规则是先比较 first，first 相等时再比较 second。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。因此 pair 天然适合作为"按主次关键字排序"的载体；std::tuple 的比较也是按成员顺序逐个进行。'
  },
  {
    id: 's55', cat: 'syntax', type: 'multi', level: 2,
    q: '相比 shared_ptr<T>(new T(...))，使用 make_shared<T>(...) 的优势有？（多选）',
    options: [
      '只进行一次内存分配，对象与控制块连续存放',
      '异常安全：不会因参数求值顺序导致内存泄漏',
      '可以指定自定义删除器',
      '缓存局部性更好'
    ],
    ans: [0, 1, 3],
    exp: 'C 是 make_shared 的短板：它不支持自定义删除器，需要时应直接构造 shared_ptr(ptr, deleter)。另外 make_shared 的弱点还有 weak_ptr 存活时整块内存无法释放。'
  },
  {
    id: 's56', cat: 'syntax', type: 'single', level: 2,
    q: '关于自定义删除器，正确的说法是？',
    options: [
      'unique_ptr 的删除器是类型的一部分，shared_ptr 的删除器不是',
      '两者的删除器都属于类型的一部分',
      'unique_ptr 不支持自定义删除器',
      'shared_ptr 的删除器必须是函数指针'
    ],
    ans: [0],
    exp: 'unique_ptr<T, D> 把删除器作为模板参数（零开销，但不同类型不兼容）；shared_ptr 的删除器类型被擦除，可以在运行时指定，代价是控制块多一次间接调用。'
  },
  {
    id: 's57', cat: 'syntax', type: 'single', level: 3,
    q: '关于模板特化，下列说法正确的是？',
    options: [
      '函数模板可以偏特化',
      '只有类模板可以偏特化，函数模板只能重载或全特化',
      '类模板不能全特化',
      '模板特化必须在调用点之后声明'
    ],
    ans: [1],
    exp: 'C++ 不支持函数模板偏特化（会带来重载解析歧义），需要时改用重载。类模板既可全特化（template<>）也可偏特化（如针对指针类型 T*）。'
  },
  {
    id: 's58', cat: 'syntax', type: 'single', level: 3,
    q: '可变参数模板中获取参数包个数、展开参数包的正确方式是？',
    options: [
      'sizeof(Args) 与 args...',
      'sizeof...(Args) 与 args...（C++17 起可用折叠表达式）',
      'args.length 与 for 循环',
      '无法获取'
    ],
    ans: [1],
    exp: 'sizeof...(Args) 得到参数个数；展开可用递归（C++11）、初始化列表技巧或 C++17 的折叠表达式 (... op args)。典型应用是 std::make_shared、printf 风格日志、emplace 系列。'
  },
  {
    id: 's59', cat: 'syntax', type: 'single', level: 2,
    q: '关于 constexpr，正确的说法是？',
    options: [
      'constexpr 函数一定在编译期执行',
      'constexpr 函数当参数是常量表达式时可在编译期求值，否则退化为运行时',
      'constexpr 只能用于变量',
      'constexpr 与 const 完全等价'
    ],
    ans: [1],
    exp: 'constexpr 是"具备编译期求值能力"，是否真的在编译期求值取决于上下文是否需要（如用作数组长度、模板参数时必须编译期确定）。const 只表示不可修改。'
  },
  {
    id: 's60', cat: 'syntax', type: 'single', level: 2,
    q: 'decltype(a) 与 decltype((a)) 的区别是？',
    options: [
      '两者完全相同',
      '前者得到变量的声明类型，后者得到左值引用类型 T&',
      '前者是值，后者是指针',
      '后者会编译错误'
    ],
    ans: [1],
    exp: 'decltype 对"未加括号的标识符"返回其声明类型；对任意表达式返回表达式的类型并保留值类别（左值 → T&，亡值 → T&&，纯右值 → T）。这个细节在写泛型代码时经常踩坑。'
  },
  {
    id: 's61', cat: 'syntax', type: 'judge', level: 1,
    q: 'nullptr 的类型是 std::nullptr_t，可以转换为任意指针类型但不能转换为整型，因此比 NULL 更安全。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。NULL 通常是 0，在重载 f(int) 与 f(char*) 时会错误地匹配到 f(int)；nullptr 只匹配指针版本，消除了这类歧义。'
  },
  {
    id: 's62', cat: 'syntax', type: 'single', level: 2,
    q: '关于范围 for 循环，下列说法错误的是？',
    options: [
      'for (auto x : v) 会拷贝元素，for (auto& x : v) 不会',
      '遍历过程中增删容器元素可能导致迭代器失效',
      'for (const auto& x : v) 适合只读大对象',
      '范围 for 可以用于任意自定义类型，无需提供 begin/end'
    ],
    ans: [3],
    exp: '范围 for 要求类型提供 begin()/end()（成员或自由函数），或为数组。自定义容器必须实现这两者才能使用。'
  },
  {
    id: 's63', cat: 'syntax', type: 'judge', level: 3,
    q: 'C++17 的结构化绑定 auto [a, b] = expr; 可用于 std::pair、std::tuple、数组以及所有成员均为 public 的聚合类型。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。也可用于自定义类型（需特化 tuple_size/tuple_element/get）。遍历 map 时写成 for (auto& [k, v] : m) 可读性远超 it->first / it->second。'
  },
  {
    id: 's64', cat: 'syntax', type: 'single', level: 3,
    q: 'std::optional<int> o; 在未含值时调用 o.value() 会？',
    options: ['返回 0', '抛出 std::bad_optional_access 异常', '返回未定义值', '编译错误'],
    ans: [1],
    exp: 'value() 带检查，无值时抛异常；operator* 不做检查（UB）。安全用法：if (o) use(*o); 或 o.value_or(默认值)。optional 常用于"可能失败的返回值"，比输出参数或哨兵值更清晰。'
  },
  {
    id: 's65', cat: 'syntax', type: 'single', level: 3,
    q: '实现完美转发时，模板参数与转发函数的正确写法是？',
    code: 'template <typename T>\nvoid wrapper(T&& x) {\n  target(/* ? */);\n}',
    options: ['target(x);', 'target(std::forward<T>(x));', 'target(std::move(x));', 'target(static_cast<T>(x));'],
    ans: [1],
    exp: 'T&& 在模板中是转发引用（引用折叠后既能绑左值也能绑右值）。std::forward<T> 会按 T 的推导结果恢复原值类别：T 推导为 U& 时返回左值，推导为 U 时返回右值。'
  },
  {
    id: 's66', cat: 'syntax', type: 'judge', level: 2,
    q: '具名的右值引用变量本身是一个左值，因此把它传给另一个函数时仍需 std::move 才能保持右值属性。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。void f(int&& x) 内部，x 是有名字的变量 → 左值。这也是为什么层层转发必须配合 std::move / std::forward，否则会意外触发拷贝。'
  },
  {
    id: 's67', cat: 'syntax', type: 'single', level: 2,
    q: '=default 与 =delete 的作用分别是？',
    options: [
      '=default 删除函数，=delete 生成默认实现',
      '=default 显式要求编译器生成默认实现，=delete 禁止该函数被使用',
      '两者都用于禁用函数',
      '两者都用于强制内联'
    ],
    ans: [1],
    exp: 'A(A&&) = delete; 可禁用移动从而只保留拷贝；~A() = default; 常见于把析构函数声明在 .cpp 中以满足 pimpl 惯用法的完整类型要求。'
  },
  {
    id: 's68', cat: 'syntax', type: 'multi', level: 2,
    q: '关于 override 与 final，正确的说法有？（多选）',
    options: [
      'override 让编译器检查是否真的覆盖了基类虚函数，签名不符时报错',
      'final 修饰虚函数表示禁止派生类再覆盖它',
      'final 修饰类表示该类不能被继承',
      'override 可以用于非虚函数'
    ],
    ans: [0, 1, 2],
    exp: 'override 只能用于虚函数，是防止"签名写错导致意外隐藏"的利器（例如基类是 const 成员函数而派生类漏写 const）。final 还能配合优化去虚拟化。'
  },
  {
    id: 's69', cat: 'syntax', type: 'single', level: 2,
    q: '委托构造函数指的是？',
    options: [
      '构造函数调用基类的构造函数',
      '同一类的某构造函数在初始化列表中调用本类的另一个构造函数',
      '用 =default 生成的构造函数',
      '把构造工作委托给工厂函数'
    ],
    ans: [1],
    exp: 'A() : A(0, "") {} 可消除多个构造函数间的重复代码。注意委托不能形成环，且一旦委托执行完毕即视为该对象构造完成。'
  },
  {
    id: 's70', cat: 'syntax', type: 'single', level: 2,
    q: 'RAII 的核心思想是？',
    options: [
      '资源在堆上分配，由 GC 回收',
      '用对象的生命周期管理资源：构造时获取，析构时释放',
      '资源必须手动 new/delete 配对',
      '所有资源都必须是静态的'
    ],
    ans: [1],
    exp: '典型应用：std::lock_guard 管理锁、std::fstream 管理文件句柄、智能指针管理内存。RAII 保证异常发生时也能正确释放资源，是 C++ 异常安全的基石。'
  },
  {
    id: 's71', cat: 'syntax', type: 'judge', level: 2,
    q: '类内声明的 static 成员变量通常还需要在类外单独定义一次（C++17 的 inline static 除外），否则链接时报未定义符号。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。类内只是声明，定义需写在 .cpp：int A::count = 0;。static const 整型成员可类内初始化（若未被取地址），C++17 的 inline static 则彻底解决了这个问题。'
  },
  {
    id: 's72', cat: 'syntax', type: 'single', level: 2,
    q: 'int (*p)[10] 与 int *p[10] 分别表示？',
    options: [
      '指针数组 / 数组指针',
      '数组指针（指向含 10 个 int 的数组） / 指针数组（含 10 个 int*）',
      '两者含义相同',
      '函数指针 / 数组'
    ],
    ans: [1],
    exp: '判断口诀：先看括号——(*p) 说明 p 是指针，再看后面 [10] 说明指向数组；*p[10] 中 [] 优先级更高，p 先是数组，元素是 int*。'
  },
  {
    id: 's73', cat: 'syntax', type: 'single', level: 2,
    q: '指向"参数为 int、返回 void"的函数的指针，正确声明是？',
    options: ['void *f(int);', 'void (*f)(int);', 'void (f*)(int);', 'void f(*)(int);'],
    ans: [1],
    exp: '括号不可省：void *f(int) 会被解析为"返回 void*、参数为 int 的函数"。现代 C++ 更推荐用 using F = void(int); F* f; 或 std::function<void(int)> 提高可读性。'
  },
  {
    id: 's74', cat: 'syntax', type: 'judge', level: 1,
    q: '在 C++11 及以后，char* p = "hello"; 这种写法已无法通过编译，必须写成 const char* p = "hello";',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。字符串字面量类型为 const char[N]，存放在只读段；赋给 char* 在 C 中合法但 C++03 起已弃用、C++11 起非法。试图修改它（p[0]=...）是未定义行为，通常触发段错误。'
  },
  {
    id: 's75', cat: 'syntax', type: 'single', level: 3,
    q: '异常安全的三种保证中，最强的是？',
    options: [
      '基本保证：不泄漏资源，对象保持有效状态',
      '强保证：操作要么完全成功，要么回滚到操作前状态',
      '不抛保证（nothrow）：承诺绝不抛出异常',
      '三种没有强弱之分'
    ],
    ans: [2],
    exp: '强度顺序：不抛 > 强 > 基本。std::vector::push_back 对"元素拷贝不抛"的类型提供强保证；swap、析构函数通常应提供不抛保证（析构抛异常会导致 terminate）。'
  },
  {
    id: 's76', cat: 'syntax', type: 'single', level: 2,
    q: 'alignas 与 alignof 的作用分别是？',
    options: [
      '获取对齐要求 / 设置对齐要求',
      '设置对齐要求 / 获取对齐要求',
      '两者都是设置对齐',
      '两者都是获取对齐'
    ],
    ans: [1],
    exp: 'alignas(16) 指定变量或类型的对齐字节数，alignof(T) 返回 T 的对齐要求。典型用途：SIMD 数据对齐、缓存行对齐避免伪共享（false sharing）。'
  },
  {
    id: 's77', cat: 'syntax', type: 'single', level: 3,
    q: 'placement new 的作用是？',
    options: [
      '在堆上分配并构造对象',
      '在已分配的指定内存地址上构造对象，需手动调用析构函数',
      '原地修改已有对象',
      '创建新线程'
    ],
    ans: [1],
    exp: 'void* buf = ::operator new(sizeof(T)); T* p = new (buf) T(args); 使用完后必须写 p->~T(); ::operator delete(buf);。常见于内存池、对象池、小对象分配器。'
  },
  {
    id: 's78', cat: 'syntax', type: 'judge', level: 2,
    q: 'register 关键字在 C++11 中被弃用、C++17 中被移除；现代代码中它已无实际意义。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。编译器早已能自动完成寄存器分配，register 只是历史遗留。同理，auto 在 C++11 前表示存储期说明符，现在被复用为类型推导，语义完全不同。'
  },
  {
    id: 's79', cat: 'syntax', type: 'single', level: 2,
    q: '自定义类型转换运算符的正确写法是？',
    options: [
      'int operator()() const;',
      'operator int() const;',
      'int operator=() const;',
      'explicit int() const;'
    ],
    ans: [1],
    exp: 'operator T() 定义"本类型 → T"的隐式转换，没有返回类型说明（名字已隐含）。C++11 起可写 explicit operator bool() 避免意外的整型比较——智能指针与 iostream 的状态检查正是这么做的。'
  },
  {
    id: 's80', cat: 'syntax', type: 'multi', level: 2,
    q: '选择 STL 容器时的常见经验有？（多选）',
    options: [
      '默认首选 vector，除非有明确理由',
      '需要频繁查找且无需有序：unordered_map / unordered_set',
      '需要有序遍历或范围查询：map / set',
      '需要头尾双端增删：deque'
    ],
    ans: [0, 1, 2, 3],
    exp: '还有两个实用细节：vector 用 reserve 预留容量可避免多次扩容；unordered_* 在高冲突场景要注意自定义 hash 与负载因子（max_load_factor / rehash）。'
  },

  /* ==================== 五、算法与数据结构 · 扩展 ==================== */
  {
    id: 'a23', cat: 'algo', type: 'single', level: 1,
    q: '以下代码片段的时间复杂度是？',
    code: 'for (int i = 0; i < n; ++i)\n  for (int j = i; j < n; ++j)\n    sum += a[i] * a[j];',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
    ans: [2],
    exp: '内层平均执行 n/2 次，总次数约 n(n+1)/2，主导项为 n²，故为 O(n²)。注意内层从 j = i 开始并不改变数量级。'
  },
  {
    id: 'a24', cat: 'algo', type: 'judge', level: 1,
    q: '分析空间复杂度时，递归调用栈所占用的空间也应计入。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。递归深度为 h 的算法通常需要 O(h) 的栈空间；快排平均 O(log n)、最坏 O(n) 的栈空间正来源于此。'
  },
  {
    id: 'a25', cat: 'algo', type: 'single', level: 2,
    q: '迭代法反转单链表的时间与空间复杂度分别是？',
    options: ['O(n) / O(1)', 'O(n) / O(n)', 'O(n log n) / O(1)', 'O(n²) / O(1)'],
    ans: [0],
    exp: '只需三个指针（pre / cur / next）原地改指向，遍历一次即可，空间为 O(1)。递归写法则需要 O(n) 栈空间。'
  },
  {
    id: 'a26', cat: 'algo', type: 'single', level: 2,
    q: '判断两个无环单链表是否相交，空间 O(1) 的经典做法是？',
    options: [
      '双重循环逐一比较节点地址',
      '双指针分别从两条链表头出发，走到末尾后切换到另一条链表，相遇点即交点',
      '先排序再比较',
      '无法在 O(1) 空间内完成'
    ],
    ans: [1],
    exp: '两个指针各走 (lenA + lenB) 步后必然同时到达交点（或同时为 nullptr），因为两者走过的总路程相同，消除了长度差。'
  },
  {
    id: 'a27', cat: 'algo', type: 'single', level: 2,
    q: '求单链表倒数第 k 个节点，最优做法是？',
    options: [
      '先遍历求长度 n，再从头走 n-k 步',
      '快慢指针：快指针先走 k 步，然后两者同步前进，快指针到尾时慢指针即所求',
      '反转链表后求第 k 个',
      '递归到尾再回溯计数'
    ],
    ans: [1],
    exp: '快慢指针只需一次遍历（O(n)、O(1) 空间），且代码简洁。要先处理 k 大于链表长度的边界情况（快指针提前到达 nullptr）。'
  },
  {
    id: 'a28', cat: 'algo', type: 'multi', level: 2,
    q: '实现 O(1) 的 LRU 缓存，通常需要组合？（多选）',
    options: [
      '哈希表：O(1) 定位节点',
      '双向链表：O(1) 调整节点顺序',
      '在链表头保持最近使用、尾部为最久未使用',
      '大顶堆维护访问频次'
    ],
    ans: [0, 1, 2],
    exp: '哈希表负责查找，双向链表负责顺序（删除需 O(1)，因此必须双向）。堆用于 LFU 而非 LRU。'
  },
  {
    id: 'a29', cat: 'algo', type: 'single', level: 2,
    q: '求滑动窗口最大值（每个窗口长度为 k），最优解是？',
    options: [
      '每个窗口内线性扫描，O(nk)',
      '维护单调队列（双端队列），O(n)',
      '对每个窗口排序，O(nk log k)',
      '大顶堆，O(n log n) 且无法处理过期元素'
    ],
    ans: [1],
    exp: '单调队列队首始终是当前窗口最大值，元素只入队出队各一次，因此 O(n)。堆方案需额外处理"已滑出窗口"的过期元素，实现更繁琐。'
  },
  {
    id: 'a30', cat: 'algo', type: 'multi', level: 1,
    q: '栈的典型应用场景包括？（多选）',
    options: ['括号匹配', '表达式求值（中缀转后缀）', '函数调用与递归', '单调栈求下一个更大元素'],
    ans: [0, 1, 2, 3],
    exp: '栈的本质是"后进先出"，适合处理嵌套结构与需要回溯最近状态的场景。DFS 的递归实现本质上也是栈。'
  },
  {
    id: 'a31', cat: 'algo', type: 'single', level: 2,
    q: '用两个栈实现一个队列，核心思路是？',
    options: [
      '入队时压入 s1；出队时若 s2 为空就把 s1 全部倒入 s2，再从 s2 弹出',
      '入队时压入两个栈，出队时各弹一个',
      '两个栈无法模拟队列',
      '入队压 s2，出队从 s1，永不倒腾'
    ],
    ans: [0],
    exp: '每个元素最多被"倒腾"一次，因此均摊复杂度为 O(1)。这是均摊分析的经典例子。'
  },
  {
    id: 'a32', cat: 'algo', type: 'multi', level: 2,
    q: '关于二叉树的遍历，正确的说法有？（多选）',
    options: [
      '递归遍历的空间复杂度为 O(h)，h 为树高',
      'Morris 遍历可以在 O(1) 额外空间内完成中序遍历',
      '层序遍历需要借助队列',
      '非递归的中序遍历需要显式栈'
    ],
    ans: [0, 1, 2, 3],
    exp: 'Morris 遍历通过临时修改指针（线索化）实现 O(1) 空间，遍历结束后恢复树结构，是面试加分项。'
  },
  {
    id: 'a33', cat: 'algo', type: 'judge', level: 1,
    q: '二叉树的层序遍历（广度优先）需要借助队列实现，按层从左到右访问。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。队列保证"先访问的节点其孩子也先被访问"，从而实现按层扩展；若要按层输出需记录每层节点数。'
  },
  {
    id: 'a34', cat: 'algo', type: 'judge', level: 2,
    q: '已知二叉树的中序遍历与后序遍历序列（节点值互不相同），同样可以唯一确定这棵二叉树。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。后序的最后一个元素是根，再借中序划分左右子树，递归重建即可。只有"前序 + 后序"无法确定唯一树形。'
  },
  {
    id: 'a35', cat: 'algo', type: 'single', level: 2,
    q: '含有 n 个节点的二叉树，其最小可能高度（层数）是？',
    options: ['1', '⌊log₂n⌋ + 1', 'n', 'n/2'],
    ans: [1],
    exp: '最"矮"的情况是完全/满二叉树，层数为 ⌊log₂n⌋ + 1；最"高"是退化为链，层数为 n。因此平衡树的高度维持在 O(log n)。'
  },
  {
    id: 'a36', cat: 'algo', type: 'single', level: 3,
    q: '含有 n 个节点的完全二叉树，其叶子节点个数为？',
    options: ['⌈n / 2⌉', '⌊n / 2⌋', 'n - 1', 'log₂n'],
    ans: [0],
    exp: '完全二叉树中，编号 > ⌊n/2⌋ 的节点均为叶子，因此叶子数为 n - ⌊n/2⌋ = ⌈n/2⌉。度为 1 的节点最多只有 1 个。'
  },
  {
    id: 'a37', cat: 'algo', type: 'multi', level: 2,
    q: '判断一棵二叉树是否为合法二叉搜索树（BST），可行的做法有？（多选）',
    options: [
      '中序遍历，检查结果序列是否严格递增',
      '递归时为每个节点传递允许的取值上下界 (min, max)',
      '只检查每个节点是否大于左孩子且小于右孩子',
      '前序遍历检查递增'
    ],
    ans: [0, 1],
    exp: '只比较左右孩子是不够的：右子树中的某个节点可能小于更上层的祖先，从而违反 BST 定义。上下界递归法是标准解法。'
  },
  {
    id: 'a38', cat: 'algo', type: 'single', level: 2,
    q: 'AVL 树中，插入节点后出现在"左子树的左侧"（LL 型）失衡，应采取？',
    options: ['单次右旋', '单次左旋', '先左旋后右旋', '先右旋后左旋'],
    ans: [0],
    exp: 'LL → 右旋；RR → 左旋；LR → 先对左孩子左旋、再对根右旋；RL → 先对右孩子右旋、再对根左旋。AVL 的平衡更严格，查询略快于红黑树但插入删除旋转更多。'
  },
  {
    id: 'a39', cat: 'algo', type: 'multi', level: 2,
    q: '红黑树需要满足的性质包括？（多选）',
    options: [
      '根节点为黑色',
      '红色节点的子节点必须为黑色（不能有连续红节点）',
      '从任一节点到其所有后代空节点的简单路径上，黑色节点数相同',
      '每个节点要么是红色要么是黑色'
    ],
    ans: [0, 1, 2, 3],
    exp: '这几条约束共同保证了"最长路径不超过最短路径的两倍"，从而把树高控制在 O(log n)。std::map / std::set 的底层实现即红黑树。'
  },
  {
    id: 'a40', cat: 'algo', type: 'single', level: 2,
    q: '哈夫曼（Huffman）编码属于哪种算法思想，时间复杂度是？',
    options: [
      '动态规划，O(n²)',
      '贪心（每次合并权值最小的两棵子树），O(n log n)',
      '分治，O(n)',
      '回溯，O(2ⁿ)'
    ],
    ans: [1],
    exp: '用小顶堆每次取出两个最小权值合并，重复 n-1 次，总复杂度 O(n log n)。它产生的是前缀编码（任一编码都不是另一编码的前缀），用于数据压缩。'
  },
  {
    id: 'a41', cat: 'algo', type: 'multi', level: 2,
    q: '关于最小生成树（MST）算法，正确的说法有？（多选）',
    options: [
      'Prim 算法适用于稠密图，堆优化版本为 O(E log V)',
      'Kruskal 算法按边权排序后贪心选取，通常配合并查集，复杂度 O(E log E)',
      '两者都基于贪心思想',
      '最小生成树的边集合一定唯一'
    ],
    ans: [0, 1, 2],
    exp: '当存在多条权值相同的边时，MST 的具体边集合可能不唯一，但最小权值和是唯一的。'
  },
  {
    id: 'a42', cat: 'algo', type: 'judge', level: 2,
    q: '一个图的最小生成树可能不唯一（存在等权边时），但其权值总和一定相同。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。由切割性质与回路性质可证：无论选择哪条等权边，最终总权值都等于所有 MST 的共同值。'
  },
  {
    id: 'a43', cat: 'algo', type: 'single', level: 2,
    q: 'Kahn 算法实现拓扑排序的时间复杂度是？',
    options: ['O(V)', 'O(V + E)', 'O(V × E)', 'O(E log V)'],
    ans: [1],
    exp: '每个顶点入队一次、每条边被松弛一次，因此为 O(V+E)。若最终输出顶点数少于 V，说明图中存在环。'
  },
  {
    id: 'a44', cat: 'algo', type: 'multi', level: 2,
    q: '关于背包问题的动态规划实现，正确的说法有？（多选）',
    options: [
      '01 背包（每件物品只有一个）需倒序遍历容量',
      '完全背包（物品无限个）需正序遍历容量',
      '01 背包的一维写法为 dp[j] = max(dp[j], dp[j - w] + v)',
      '两者遍历方向相同，可通用'
    ],
    ans: [0, 1, 2],
    exp: '遍历方向决定了"每件物品是否可重复使用"：倒序保证 dp[j-w] 来自上一轮（未选本物品），正序则允许重复选取。这是最容易记混的细节之一。'
  },
  {
    id: 'a45', cat: 'algo', type: 'single', level: 2,
    q: '求最长递增子序列（LIS）的长度，最优时间复杂度是？',
    options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(n log² n)'],
    ans: [1],
    exp: '维护 tails[i] 表示长度为 i+1 的递增子序列的最小结尾，对每个元素用二分查找更新，总复杂度 O(n log n)。朴素 DP 为 O(n²)。'
  },
  {
    id: 'a46', cat: 'algo', type: 'single', level: 2,
    q: '最长公共子序列（LCS）的经典 DP 复杂度，以及空间优化结果是？',
    options: [
      '时间 O(nm)，空间可优化到 O(min(n, m))',
      '时间 O(n + m)，空间 O(1)',
      '时间 O(nm)，空间必须 O(nm) 无法优化',
      '时间 O(n log m)，空间 O(n)'
    ],
    ans: [0],
    exp: 'dp[i][j] 只依赖上一行与当前行，因此可滚动数组压缩到 O(m)；若需还原具体子序列则必须保留完整表。'
  },
  {
    id: 'a47', cat: 'algo', type: 'single', level: 2,
    q: '编辑距离（把一个字符串变成另一个的最少增删改次数）使用的算法是？',
    options: ['贪心', '二维动态规划', '并查集', '拓扑排序'],
    ans: [1],
    exp: 'dp[i][j] 表示 s 前 i 个字符变到 t 前 j 个字符的最小代价，转移取"插入/删除/替换"三者最小值，复杂度 O(nm)。'
  },
  {
    id: 'a48', cat: 'algo', type: 'multi', level: 2,
    q: '适合用回溯（DFS + 状态恢复）求解的问题有？（多选）',
    options: ['全排列 / 子集 / 组合', 'N 皇后', '数独求解', '矩阵连乘最优括号化'],
    ans: [0, 1, 2],
    exp: '矩阵连乘是区间 DP，不是回溯。回溯的通用模板是"做选择 → 递归 → 撤销选择"，剪枝（可行性剪枝、去重剪枝）是提速关键。'
  },
  {
    id: 'a49', cat: 'algo', type: 'single', level: 2,
    q: '快速幂（二进制 exponentiation）计算 aⁿ 的时间复杂度是？',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    ans: [1],
    exp: '把指数按二进制拆开，每轮底数平方、指数右移，最多 log₂n 轮。同理可用于矩阵快速幂，把线性递推（如斐波那契）优化到 O(log n)。'
  },
  {
    id: 'a50', cat: 'algo', type: 'judge', level: 2,
    q: '分治与动态规划的主要区别在于：动态规划解决的问题通常具有重叠子问题，而分治的子问题一般互不重叠。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。归并排序是分治（子区间互不重叠）；斐波那契记忆化搜索是 DP（子问题重复出现，需要记忆化）。'
  },
  {
    id: 'a51', cat: 'algo', type: 'single', level: 2,
    q: '统计数组中逆序对的个数，高效做法是？',
    options: [
      '双重循环枚举，O(n²)',
      '归并排序过程中统计，O(n log n)',
      '排序后二分，O(n log n) 但结果不对',
      '哈希表，O(n)'
    ],
    ans: [1],
    exp: '归并两个有序子区间时，若左边元素大于右边元素，则左边剩余元素都能与它构成逆序对，一次可累加多个，总复杂度 O(n log n)。也可用树状数组 + 离散化。'
  },
  {
    id: 'a52', cat: 'algo', type: 'multi', level: 2,
    q: '求数组中第 K 大（TopK）元素的常见解法有？（多选）',
    options: [
      '小顶堆维护 K 个元素，O(n log K)，适合海量数据',
      '基于快排 partition 的选择算法，平均 O(n)',
      '先整体排序再取下标，O(n log n)',
      '并查集，O(n)'
    ],
    ans: [0, 1, 2],
    exp: '海量数据（内存装不下）场景只能用堆或分治；quickselect 平均 O(n) 但最坏 O(n²)，工程上可用 BFPRT 保证最坏线性。'
  },
  {
    id: 'a53', cat: 'algo', type: 'single', level: 2,
    q: '在数据流中动态维护中位数，最合适的数据结构是？',
    options: [
      '一个大顶堆',
      '两个堆：大顶堆存较小的一半，小顶堆存较大的一半，并保持大小平衡',
      '有序数组',
      '哈希表'
    ],
    ans: [1],
    exp: '两堆堆顶即"中间的两个候选"，插入 O(log n)、查询 O(1)。注意需保证两堆大小差不超过 1，否则要搬运堆顶。'
  },
  {
    id: 'a54', cat: 'algo', type: 'judge', level: 2,
    q: '计数排序适合"数据范围不大"的整数序列，时间复杂度 O(n + k)（k 为值域大小），且是稳定排序。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。它用额外数组统计频次再前缀累加定位，是稳定的；若 k 远大于 n 则空间浪费严重，此时应改用比较排序。'
  },
  {
    id: 'a55', cat: 'algo', type: 'single', level: 2,
    q: '基数排序的特点描述正确的是？',
    options: [
      '基于比较，时间 O(n log n)',
      '非比较排序，按位（个位→十位…）稳定排序，时间 O(d(n + k))',
      '只能排正整数且不稳定',
      '原地排序，空间 O(1)'
    ],
    ans: [1],
    exp: 'd 为最大位数、k 为基数（十进制为 10）。每一轮必须是稳定的（通常用计数排序），否则前面排好的位序会被打乱。'
  },
  {
    id: 'a56', cat: 'algo', type: 'multi', level: 2,
    q: '常见的字符串匹配算法包括？（多选）',
    options: ['暴力匹配 O(nm)', 'KMP O(n + m)', 'Boyer-Moore（坏字符/好后缀规则）', '字符串哈希（Rabin-Karp）'],
    ans: [0, 1, 2, 3],
    exp: 'BM 在实际文本中通常比 KMP 更快（可跳跃式移动），是很多语言标准库的实现选择；Rabin-Karp 便于扩展到二维/多模式匹配。'
  },
  {
    id: 'a57', cat: 'algo', type: 'single', level: 2,
    q: 'Trie（前缀树）的主要优势是？',
    options: [
      '空间开销极小',
      '插入与前缀查询均为 O(L)（L 为字符串长度），适合前缀统计与自动补全',
      '可以排序',
      '支持范围查询'
    ],
    ans: [1],
    exp: 'Trie 用"边表示字符、节点表示前缀"，典型应用：词频统计、自动补全、敏感词过滤。缺点是每个节点都要存子节点指针，空间较大（可用压缩 Trie 优化）。'
  },
  {
    id: 'a58', cat: 'algo', type: 'multi', level: 2,
    q: '下列位运算技巧正确的是？（多选）',
    options: [
      'a ^ a = 0，a ^ 0 = a（常用于成对消去）',
      'n & (n - 1) 消去最低位的 1',
      'n & (-n) 取出最低位的 1',
      '用异或交换两个变量是推荐写法'
    ],
    ans: [0, 1, 2],
    exp: '异或交换（a^=b; b^=a; a^=b）可读性差、且当两变量是同一块内存时会清零，现代编译器下也没有性能优势，不应使用。'
  },
  {
    id: 'a59', cat: 'algo', type: 'single', level: 2,
    q: '数组中除一个数字只出现一次外，其余都出现两次，找出这个数字的最优解是？',
    options: [
      '哈希表计数，O(n) 空间',
      '全部元素异或，成对元素相消，结果即答案，O(1) 空间',
      '排序后扫描',
      '二分查找'
    ],
    ans: [1],
    exp: '异或满足交换律与结合律，且 x^x=0、0^x=x，因此全部异或后只剩那个落单的数字。若其余出现三次，则需按位统计模 3（或用位运算状态机）。'
  },
  {
    id: 'a60', cat: 'algo', type: 'judge', level: 2,
    q: '布隆过滤器（Bloom Filter）判断"元素不存在"一定准确，判断"元素存在"可能误判；标准实现不支持删除。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。多个哈希函数把元素映射到位数组的多个位置：只要有一位为 0 就一定没插入过；全为 1 可能是碰撞导致。计数布隆过滤器（用计数器代替位）可支持删除。'
  },
  {
    id: 'a61', cat: 'algo', type: 'multi', level: 3,
    q: '关于树状数组（Fenwick Tree）与线段树，正确的说法有？（多选）',
    options: [
      '树状数组擅长"单点更新 + 前缀查询"，两者都是 O(log n)',
      '线段树功能更通用，可支持区间修改与任意区间聚合（加、最大、最小）',
      '树状数组代码更短、常数更小',
      '二者都不能处理动态更新'
    ],
    ans: [0, 1, 2],
    exp: '核心操作是 lowbit(x) = x & (-x)。线段树可用懒标记（lazy propagation）把区间修改降到 O(log n)，代价是代码量与常数。'
  },
  {
    id: 'a62', cat: 'algo', type: 'single', level: 3,
    q: '跳表（Skip List）的特点描述正确的是？',
    options: [
      '严格的 O(log n) 最坏复杂度，实现复杂',
      '多层有序链表 + 随机晋升，期望 O(log n)，实现简单，Redis 有序集合使用',
      '只能顺序查找 O(n)',
      '是一种哈希表'
    ],
    ans: [1],
    exp: '跳表靠"概率平衡"而非旋转保持性能，支持范围查询（哈希表做不到），且并发修改比平衡树更容易实现，因此被 Redis、LevelDB（MemTable）采用。'
  },
  {
    id: 'a63', cat: 'algo', type: 'multi', level: 2,
    q: 'B+ 树被广泛用于数据库索引，原因包括？（多选）',
    options: [
      '多路平衡，树高低，磁盘 IO 次数少',
      '所有数据都在叶子节点，且叶子间用链表相连，便于范围扫描',
      '非叶子节点只存键，单节点可容纳更多索引项',
      '支持 O(1) 的哈希式点查'
    ],
    ans: [0, 1, 2],
    exp: 'B+ 树是为磁盘/页式存储设计的：一个节点通常对应一个页（如 16KB），树高维持在 3~4 层即可索引千万级数据。O(1) 点查是哈希索引的特点。'
  },
  {
    id: 'a64', cat: 'algo', type: 'single', level: 3,
    q: '在内存受限情况下，对 40 亿个不重复无符号整数判重/查存在，最常用的结构是？',
    options: ['哈希表', '位图（Bitmap / bitset）', '红黑树', '并查集'],
    ans: [1],
    exp: '位图用一个 bit 表示一个整数是否出现，40 亿整数仅需约 500MB，且支持快速位运算（如求交集）。常见变体：Roaring Bitmap、布隆过滤器（允许误判时）。'
  },
  {
    id: 'a65', cat: 'algo', type: 'judge', level: 2,
    q: '对多关键字排序（如先按年龄、再按姓名）时，使用稳定排序逐关键字"从次要到主要"依次排序即可得到正确结果。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。稳定排序会保留上一轮的相对顺序，因此先排次要关键字、再排主要关键字即可。基数排序正是这一思想的典型应用。'
  },
  {
    id: 'a66', cat: 'algo', type: 'single', level: 2,
    q: '能够使用"二分答案"求解的问题，需要满足的关键条件是？',
    options: [
      '答案具有单调性：若某个值可行，则比它更宽松的值也可行',
      '数据必须已排序',
      '问题必须是图论问题',
      '答案必须是整数且范围小于 100'
    ],
    ans: [0],
    exp: '把"求最优解"转化为"判定可行性"，再对答案空间二分。典型题：木头切割（最大化长度）、传送带（最小化时间）、最小化最大值。'
  },
  {
    id: 'a67', cat: 'algo', type: 'multi', level: 2,
    q: '关于图的存储方式，正确的说法有？（多选）',
    options: [
      '邻接矩阵适合稠密图，判断两点是否邻接为 O(1)，空间 O(V²)',
      '邻接表适合稀疏图，空间 O(V + E)',
      '需要频繁遍历某点的所有邻居时，邻接表更高效',
      '邻接矩阵一定比邻接表省空间'
    ],
    ans: [0, 1, 2],
    exp: '选择依据是边数与点数的关系：E 接近 V² 时用矩阵，E 远小于 V² 时用邻接表。'
  },
  {
    id: 'a68', cat: 'algo', type: 'judge', level: 2,
    q: '贪心算法总能得到全局最优解，只要每一步都做出局部最优选择即可。',
    options: ['正确', '错误'],
    ans: [1],
    exp: '错误。贪心必须同时满足"贪心选择性质"与"最优子结构"才成立。反例：0-1 背包用贪心（按价值密度）得不到最优解，必须用 DP。'
  },
  {
    id: 'a69', cat: 'algo', type: 'single', level: 2,
    q: '递归层数过深导致栈溢出时，常见的处理方式不包括？',
    options: [
      '改写为迭代 + 显式栈',
      '尾递归改写（部分编译器可优化）',
      '增大线程栈空间',
      '把递归改成更多层的递归'
    ],
    ans: [3],
    exp: '前三种都是有效手段。此外还可做剪枝、记忆化减少无效分支，或改用 Morris 遍历等 O(1) 空间算法。'
  },
  {
    id: 'a70', cat: 'algo', type: 'multi', level: 2,
    q: '常见的算法优化手段包括？（多选）',
    options: ['前缀和 / 差分数组预处理', '空间换时间（哈希、缓存）', '剪枝减少搜索空间', '状态压缩'],
    ans: [0, 1, 2, 3],
    exp: '还有一个高频手段是"降维"：把二维 DP 用滚动数组压成一维，把 O(n²) 的枚举用双指针降到 O(n)。'
  },
  {
    id: 'a71', cat: 'algo', type: 'single', level: 3,
    q: '状态压缩动态规划（状压 DP）通常用位掩码表示集合，其复杂度量级一般是？',
    options: ['O(n)', 'O(n × 2ⁿ) 或 O(2ⁿ)', 'O(n log n)', 'O(1)'],
    ans: [1],
    exp: 'n 个元素的子集有 2ⁿ 个，配合转移通常是 O(n × 2ⁿ)。适用于 n ≤ 20 左右的问题，如 TSP（旅行商）、集合划分、互不相邻的选点。'
  },
  {
    id: 'a72', cat: 'algo', type: 'judge', level: 2,
    q: '差分数组可以在 O(1) 内完成"区间同时加上一个值"的操作，最后通过一次前缀和还原出结果数组。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。对区间 [l, r] 加 v：d[l] += v, d[r+1] -= v。适合"多次区间修改、最后一次查询"的场景，如航班预订统计、区间覆盖次数。'
  },
  {
    id: 'a73', cat: 'algo', type: 'multi', level: 2,
    q: '前缀和数组可以高效解决的问题有？（多选）',
    options: [
      '多次查询任意区间 [l, r] 的元素和，O(1) 每次',
      '统计和为 K 的子数组个数',
      '二维矩阵的子矩阵求和（二维前缀和）',
      '区间内元素的最大值查询'
    ],
    ans: [0, 1, 2],
    exp: '区间最值不能用普通前缀和（加法不可逆），需要线段树、ST 表（RMQ，O(1) 查询但不支持更新）或稀疏表。'
  },
  {
    id: 'a74', cat: 'algo', type: 'single', level: 2,
    q: '统计二维网格中"岛屿数量"的标准做法是？',
    options: [
      '并查集或 DFS/BFS 洪水填充：每发现一块陆地就把它连通的所有陆地标记掉',
      '动态规划逐行扫描',
      '对每个格子排序',
      '二分查找'
    ],
    ans: [0],
    exp: '每访问一个未标记的陆地格，计数加一并把连通区域全部沉没（置为水或标记 visited），保证每块岛屿只被计数一次。'
  },
  {
    id: 'a75', cat: 'algo', type: 'single', level: 2,
    q: '单调栈最适合解决下列哪类问题？',
    options: [
      '求数组中每个元素"下一个更大/更小元素"的位置',
      '求全局最大值',
      '排序',
      '最短路径'
    ],
    ans: [0],
    exp: '单调栈保持栈内元素单调，每个元素出入栈各一次故为 O(n)。延伸应用：柱状图最大矩形、接雨水、每日温度。'
  },
  {
    id: 'a76', cat: 'algo', type: 'judge', level: 2,
    q: '接雨水问题可以用"双指针"或"单调栈"在 O(n) 时间内求解。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。核心是"每个位置能接的水量取决于左右两侧最高柱子中的较小者"，双指针通过移动较矮一侧即可在线性时间确定所有位置的积水量。'
  },
  {
    id: 'a77', cat: 'algo', type: 'multi', level: 2,
    q: '关于排序算法的工程选择，合理的建议有？（多选）',
    options: [
      '小规模数据（n < 50）或近乎有序的数据，插入排序往往最快',
      '通用场景优先使用标准库的 sort（通常是 introsort，避免快排最坏情况）',
      '内存受限且不能递归时，堆排序是稳妥选择',
      '需要稳定性时用 std::stable_sort（归并）'
    ],
    ans: [0, 1, 2, 3],
    exp: 'introsort = 快排 + 深度超过阈值时转堆排 + 小区间插入排序，兼顾了平均性能与最坏情况保证，这正是 std::sort 的做法。'
  },
  {
    id: 'a78', cat: 'algo', type: 'single', level: 2,
    q: '三路快排（3-way partitioning）主要解决的问题是？',
    options: [
      '数组过大',
      '数组中存在大量重复元素时，普通二路快排会退化，三路分区可显著提升',
      '数组已排序',
      '数组含负数'
    ],
    ans: [1],
    exp: '三路快排把数组分成 < pivot、== pivot、> pivot 三段，重复元素一次性归位，避免了对所有相等元素继续递归，对含大量重复键的数据是 O(n)。'
  },
  {
    id: 'a79', cat: 'algo', type: 'multi', level: 2,
    q: '判断一个图是否为二分图，可行的方法有？（多选）',
    options: [
      'DFS / BFS 染色：相邻节点染不同颜色，出现冲突则不是二分图',
      '并查集：把每个点的邻居合并到同一集合，再检查点是否与邻居同集合',
      '求最短路径',
      '拓扑排序'
    ],
    ans: [0, 1],
    exp: '染色法最直观（也适用于非连通图，需对每个连通分量都做一遍）；并查集法适合需要动态加边的场景。'
  },
  {
    id: 'a80', cat: 'algo', type: 'single', level: 2,
    q: '使用堆优化的 Dijkstra 算法，其时间复杂度是？',
    options: ['O(V²)', 'O((V + E) log V)', 'O(V + E)', 'O(E log E)'],
    ans: [1],
    exp: '每个顶点入堆一次、每条边可能触发一次松弛（decrease-key 或重复入堆），因此为 O((V+E) log V)。稠密图用朴素 O(V²) 反而更优。'
  },
  {
    id: 'a81', cat: 'algo', type: 'judge', level: 1,
    q: '算法的时间复杂度是 O(1)，并不意味着它一定比 O(n) 的算法更快——还需考虑常数因子与实际数据规模。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。渐进复杂度描述的是增长趋势。例如哈希表的 O(1) 查找在缓存不命中、哈希冲突严重时，可能不如对小数组的线性扫描。'
  },
  {
    id: 'a82', cat: 'algo', type: 'single', level: 2,
    q: '哈希表中"负载因子"过高会导致什么，通常如何处理？',
    options: [
      '查询变慢（冲突增多），通过扩容 rehash 降低负载因子',
      '内存浪费，通过缩容解决',
      '没有任何影响',
      '元素丢失'
    ],
    ans: [0],
    exp: '负载因子 = 元素数 / 桶数。链地址法下超过 1 后查找退化为链表遍历；通常设阈值（如 0.75）触发扩容并重新散列，扩容代价均摊后仍为 O(1)。'
  },
  {
    id: 'a83', cat: 'algo', type: 'multi', level: 2,
    q: '关于递归与迭代的转换，正确的说法有？（多选）',
    options: [
      '任何递归都可以用显式栈改写为迭代',
      '尾递归形式更容易被编译器优化为循环（但 C++ 不保证）',
      '递归代码通常更简洁，但存在栈溢出与函数调用开销',
      '递归一定比迭代更快'
    ],
    ans: [0, 1, 2],
    exp: 'C++ 标准不保证尾调用优化（依赖编译器与优化等级），因此深度递归仍可能爆栈，不能依赖 TCO。'
  },
  {
    id: 'a84', cat: 'algo', type: 'single', level: 2,
    q: '在有序数组中原地去重（保留一个）的最优做法是？',
    options: [
      '借助哈希集合，O(n) 空间',
      '双指针（快慢指针），O(n) 时间、O(1) 空间',
      '排序后二分',
      '逐个删除'
    ],
    ans: [1],
    exp: '慢指针指向"下一个可写位置"，快指针扫描；只有遇到与已写入部分不同的元素才写入。同理可用于"移除指定元素""移动零"等问题。'
  },
  {
    id: 'a85', cat: 'algo', type: 'judge', level: 2,
    q: '在有序数组中查找"第一个大于等于 target 的位置"和"最后一个小于等于 target 的位置"，属于二分查找的边界变体，需专门处理返回值。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。普通二分只判断"是否存在"，边界二分要区分 <、<=、>、>= 四种语义，是面试中出错率最高的一类模板题。'
  },
  {
    id: 'a86', cat: 'algo', type: 'single', level: 2,
    q: '滑动窗口技术最适合解决下列哪类问题？',
    options: [
      '求满足某条件的连续子数组 / 子串（如最长无重复子串）',
      '求全排列',
      '求图的最短路径',
      '求逆序对'
    ],
    ans: [0],
    exp: '当"右移右指针扩大窗口、右移左指针缩小窗口"能保持单调性（加入元素使条件更易满足、移除使条件更难）时可用，复杂度通常是 O(n)。'
  },
  {
    id: 'a87', cat: 'algo', type: 'multi', level: 2,
    q: '判断图中两个节点是否连通，可选的方法有？（多选）',
    options: ['DFS', 'BFS', '并查集（尤其适合动态加边、多次查询）', 'Dijkstra'],
    ans: [0, 1, 2],
    exp: '单次查询用 DFS/BFS（O(V+E)）；需要频繁查询或动态加边时，并查集可将均摊复杂度降到接近常数。Dijkstra 解决的是带权最短路径，不适用于连通性判定。'
  },
  {
    id: 'a88', cat: 'algo', type: 'single', level: 2,
    q: 'Floyd 算法用于求解？',
    options: [
      '单源最短路径',
      '任意两点间的最短路径，复杂度 O(V³)',
      '最小生成树',
      '拓扑排序'
    ],
    ans: [1],
    exp: '三重循环枚举中转点 k，可处理负权边（但不能有负权环）。V 较小时（数百以内）代码简洁是其主要优势。'
  },
  {
    id: 'a89', cat: 'algo', type: 'multi', level: 2,
    q: '关于字符串哈希（滚动哈希 / Rabin-Karp），正确的说法有？（多选）',
    options: [
      '可在 O(1) 内比较两个子串是否相同（预处理后）',
      '存在哈希碰撞风险，工程中常用双哈希降低概率',
      '可用于最长重复子串、回文子串判定等问题',
      '哈希值永远不会冲突'
    ],
    ans: [0, 1, 2],
    exp: '单模数哈希（如 1e9+7）在长文本下碰撞概率不可忽略，双哈希/大质数取模是常用做法；对正确性要求极高的场景应使用后缀数组或 KMP。'
  },
  {
    id: 'a90', cat: 'algo', type: 'single', level: 3,
    q: '求最长回文子串，中心扩展法与 Manacher 算法的复杂度分别是？',
    options: [
      'O(n²) / O(n)',
      'O(n) / O(n)',
      'O(n²) / O(n log n)',
      'O(n³) / O(n²)'
    ],
    ans: [0],
    exp: '中心扩展枚举 2n-1 个中心、每个向两侧扩展 O(n)，总 O(n²)；Manacher 利用已计算的回文半径做镜像复用，把总复杂度降到 O(n)。'
  },
  {
    id: 'a91', cat: 'algo', type: 'judge', level: 2,
    q: '快速排序通常被认为是"原地排序"，但它需要 O(log n) 的递归栈空间（平均情况）。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。严格来说它是"原地但非 O(1) 辅助空间"；最坏递归深度 O(n) 时栈空间也变为 O(n)，这也是 introsort 要限制递归深度的原因。'
  },
  {
    id: 'a92', cat: 'algo', type: 'single', level: 2,
    q: '对"海量数据（如 100GB 文件）排序"，最常用的思路是？',
    options: [
      '一次性读入内存快排',
      '外部归并排序：分块排序后多路归并，配合败者树/堆',
      '冒泡排序',
      '计数排序'
    ],
    ans: [1],
    exp: '外排序的核心矛盾是内存与磁盘 IO：按内存大小切分成有序小文件（run），再用 K 路归并（小顶堆选择最小）合并，是数据库与大数据框架的标准做法。'
  },
  {
    id: 'a93', cat: 'algo', type: 'multi', level: 3,
    q: '下列哪些问题属于 NP 完全 / 难以多项式求解，实践中常用近似或搜索算法？（多选）',
    options: ['旅行商问题（TSP）', '0-1 背包（伪多项式 DP 可解，但仍属 NP 难）', '集合覆盖', '求数组最大值'],
    ans: [0, 1, 2],
    exp: 'NP 完全问题在 n 较大时无法精确求解，实践中用分支限界、启发式（遗传/模拟退火）、近似算法（如集合覆盖的贪心 ln n 近似）换取可接受的解。'
  },
  {
    id: 'a94', cat: 'algo', type: 'single', level: 2,
    q: '归并排序在最好、最坏、平均情况下的时间复杂度分别是？',
    options: [
      'O(n) / O(n²) / O(n log n)',
      '均为 O(n log n)',
      'O(n log n) / O(n²) / O(n log n)',
      'O(n) / O(n log n) / O(n log n)'
    ],
    ans: [1],
    exp: '归并的递归树形状与输入数据无关（总是二分），因此性能非常稳定，这也是它被选作 std::stable_sort 与外排序基础的原因；代价是 O(n) 额外空间。'
  },
  {
    id: 'a95', cat: 'algo', type: 'judge', level: 2,
    q: '对 n 个元素建堆（自底向上 sift down）的时间复杂度是 O(n)，而不是 O(n log n)。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。底层节点多但下沉高度小，按层求和后为 O(n)。若改用"逐个插入建堆"（sift up）则是 O(n log n)。'
  },
  {
    id: 'a96', cat: 'algo', type: 'single', level: 2,
    q: '拓扑排序的典型应用不包括？',
    options: [
      '课程安排（先修课依赖）',
      '编译系统的依赖顺序确定',
      '任务调度中的依赖解析',
      '求带权图的最短路径'
    ],
    ans: [3],
    exp: '拓扑排序处理的是"有向无环图的线性序"，与边权无关。带权最短路应使用 Dijkstra / Bellman-Ford / Floyd。'
  },
  {
    id: 'a97', cat: 'algo', type: 'multi', level: 2,
    q: '关于并查集的应用，正确的有？（多选）',
    options: [
      '判断图的连通分量',
      'Kruskal 最小生成树中判断是否形成环',
      '动态连通性问题（如社交网络好友关系合并）',
      '求单源最短路径'
    ],
    ans: [0, 1, 2],
    exp: '并查集只维护"是否属于同一集合"，不保存距离或路径信息，因此不能用于最短路（带权并查集是其变体，可维护相对关系）。'
  },
  {
    id: 'a98', cat: 'algo', type: 'single', level: 2,
    q: '算法分析中"均摊复杂度"的典型例子是？',
    options: [
      'vector::push_back 的扩容：单次最坏 O(n)，但连续 n 次操作的平均代价为 O(1)',
      '二分查找 O(log n)',
      '冒泡排序 O(n²)',
      '归并排序 O(n log n)'
    ],
    ans: [0],
    exp: '容量按倍数（通常 2 倍）增长时，扩容总拷贝次数不超过 2n，因此 n 次 push_back 的均摊代价为 O(1)。这是"几何扩容"策略的价值所在。'
  },
  {
    id: 'a99', cat: 'algo', type: 'judge', level: 1,
    q: '算法设计中的"空间换时间"指通过额外存储（缓存、哈希、预处理结果）来降低时间复杂度。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。典型案例：哈希表把查找从 O(n) 降到 O(1)、前缀和把区间查询从 O(n) 降到 O(1)、记忆化搜索避免重复子问题。'
  },
  {
    id: 'a100', cat: 'algo', type: 'single', level: 2,
    q: '分析递归式 T(n) = T(n/2) + O(1) 的时间复杂度是？',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    ans: [1],
    exp: '每层只处理常数工作量、规模减半，共 log n 层，因此 O(log n)。这正是二分查找的递归式；若每层工作量是 O(n) 且只有一个子问题（如某些分治），则也是 O(n log n)。'
  },

  /* ==================== 六、面试真题 · 扩展 ==================== */
  {
    id: 'i25', cat: 'interview', type: 'single', level: 2,
    q: '下列进程间通信（IPC）方式中，通常效率最高的是？',
    options: [
      '管道（pipe）',
      '消息队列',
      '共享内存',
      '信号（signal）'
    ],
    ans: [2],
    exp: '共享内存把同一块物理内存映射到多个进程地址空间，数据无需在内核与用户态之间拷贝，因此最快；代价是需要额外机制（信号量、互斥锁）保证同步。'
  },
  {
    id: 'i26', cat: 'interview', type: 'multi', level: 2,
    q: '常见的 Linux 进程间通信方式有？（多选）',
    options: ['管道与命名管道（FIFO）', '消息队列', '共享内存 + 信号量', 'Unix Domain Socket'],
    ans: [0, 1, 2, 3],
    exp: '管道适合父子进程流式传输；消息队列按消息边界传递且自带优先级；共享内存 + 信号量适合高频大数据；Unix Domain Socket 支持双向且可传递文件描述符。'
  },
  {
    id: 'i27', cat: 'interview', type: 'single', level: 2,
    q: 'fork() 系统调用的返回值特点是？',
    options: [
      '父进程返回子进程 PID，子进程返回 0，失败返回 -1',
      '父子进程都返回子进程 PID',
      '父进程返回 0，子进程返回自己 PID',
      '两者都返回 0'
    ],
    ans: [0],
    exp: '这正是"一次调用、两次返回"的由来。fork 后子进程获得父进程地址空间的写时拷贝（COW）副本，父子从 fork 返回处继续执行，通过返回值区分身份。'
  },
  {
    id: 'i28', cat: 'interview', type: 'judge', level: 2,
    q: '僵尸进程是指子进程已退出但父进程尚未调用 wait/waitpid 回收，其进程表项仍然占用；大量僵尸进程会耗尽 PID 资源。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。解决方式：父进程 wait、或捕获 SIGCHLD 并忽略（由 init 收养回收）。孤儿进程则是父进程先退出、子进程被 init(PID 1) 收养，不会成为僵尸。'
  },
  {
    id: 'i29', cat: 'interview', type: 'multi', level: 2,
    q: '常见的进程/线程调度算法包括？（多选）',
    options: ['先来先服务（FCFS）', '时间片轮转（RR）', '多级反馈队列', '最短作业优先（SJF）与优先级调度'],
    ans: [0, 1, 2, 3],
    exp: '多级反馈队列综合了 RR 与优先级：新任务高优先级短时间片，用完降级，兼顾响应时间与吞吐量，是通用 OS 的主流方案。'
  },
  {
    id: 'i30', cat: 'interview', type: 'single', level: 2,
    q: '银行家算法属于死锁处理中的哪一类？',
    options: ['死锁预防（prevention）', '死锁避免（avoidance）', '死锁检测与恢复', '死锁忽略'],
    ans: [1],
    exp: '它在资源分配前先"试分配"并检测系统是否仍处于安全状态，不安全则拒绝。预防是通过破坏四个必要条件（如统一加锁顺序）来杜绝；检测恢复则允许发生后再回滚。'
  },
  {
    id: 'i31', cat: 'interview', type: 'single', level: 2,
    q: '关于虚拟内存与页面置换，正确的说法是？',
    options: [
      'LRU 是理论上最优的置换算法',
      'OPT（最佳置换）不可实现，仅作评价基准；LRU 是常用近似',
      'FIFO 不会出现 Belady 异常',
      '缺页中断不需要操作系统介入'
    ],
    ans: [1],
    exp: 'OPT 需要预知未来访问序列，无法实现。FIFO 存在 Belady 异常（增加物理块反而可能增加缺页次数），LRU 没有该问题。缺页中断由 MMU 触发、OS 的缺页处理程序负责调页。'
  },
  {
    id: 'i32', cat: 'interview', type: 'judge', level: 2,
    q: '分页管理会产生内部碎片（最后一页未用满），分段管理会产生外部碎片（段与段之间的空隙）。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。现代 OS 多采用"段页式"：先按逻辑分段（便于共享与保护），再把每段分页（便于物理内存管理），兼顾两者优点。'
  },
  {
    id: 'i33', cat: 'interview', type: 'multi', level: 2,
    q: '下列哪些情况会导致 CPU 从用户态切换到内核态？（多选）',
    options: ['系统调用（如 read/write）', '异常（如除零、缺页）', '外部中断（如网卡数据到达）', '普通的函数调用'],
    ans: [0, 1, 2],
    exp: '前三种都需要陷入内核执行特权代码，涉及栈切换与上下文保存，因此系统调用开销远大于普通函数调用——这也是高性能程序要减少系统调用次数的原因。'
  },
  {
    id: 'i34', cat: 'interview', type: 'single', level: 2,
    q: '自旋锁与互斥锁的适用场景区别是？',
    options: [
      '自旋锁适合临界区很长的情况',
      '互斥锁适合临界区很短的情况',
      '自旋锁适合临界区很短、且不希望发生线程切换的场景（会占用 CPU 忙等）',
      '两者完全相同'
    ],
    ans: [2],
    exp: '互斥锁获取失败会睡眠（有上下文切换开销）；自旋锁忙等消耗 CPU，若锁持有时间长或临界区可阻塞则严重浪费。单核非抢占场景下自旋锁甚至可能死锁。'
  },
  {
    id: 'i35', cat: 'interview', type: 'multi', level: 2,
    q: '常用的线程同步机制包括？（多选）',
    options: ['互斥量（mutex）', '读写锁（shared_mutex）', '条件变量（condition_variable）', '原子操作与内存序（std::atomic）'],
    ans: [0, 1, 2, 3],
    exp: '条件变量必须与互斥量配合使用，且等待时应使用带谓词的 wait(lambda) 以处理虚假唤醒（spurious wakeup）。'
  },
  {
    id: 'i36', cat: 'interview', type: 'single', level: 2,
    q: '关于 select / poll / epoll，正确的说法是？',
    options: [
      '三者都会随连接数增加线性退化，性能相同',
      'epoll 用红黑树管理 fd、就绪事件放入链表，获取就绪 fd 的代价与总连接数无关',
      'epoll 在 Windows 上同样可用',
      'select 没有 fd 数量限制'
    ],
    ans: [1],
    exp: 'select/poll 每次都要把整个 fd 集合拷入内核并线性扫描，为 O(n)；epoll 通过回调把就绪 fd 加入就绪队列，epoll_wait 只取就绪项，适合大量连接、少量活跃的场景（C10K）。'
  },
  {
    id: 'i37', cat: 'interview', type: 'judge', level: 2,
    q: 'epoll 的边缘触发（ET）模式要求 socket 设置为非阻塞，并且要一次性把数据读完（循环 read 直到 EAGAIN）。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。ET 只在状态变化时通知一次，若没读完剩余数据就会丢失事件；LT（水平触发）则只要缓冲区有数据就持续通知，编程更友好但效率略低。'
  },
  {
    id: 'i38', cat: 'interview', type: 'multi', level: 2,
    q: 'select 的主要缺点包括？（多选）',
    options: [
      'fd 数量受 FD_SETSIZE（通常 1024）限制',
      '每次调用都要把 fd 集合从用户态拷贝到内核态',
      '返回后需 O(n) 遍历全部 fd 才能找出就绪者',
      '不支持可读/可写/异常事件分离'
    ],
    ans: [0, 1, 2],
    exp: 'select 其实支持 readfds/writefds/exceptfds 三类事件分离，D 不是缺点。poll 用链表突破了数量限制，但仍需遍历。'
  },
  {
    id: 'i39', cat: 'interview', type: 'single', level: 2,
    q: '关于同步/异步与阻塞/非阻塞，正确的是？',
    options: [
      'select/epoll 属于异步 IO',
      'select/epoll 是同步 IO（读写仍由应用程序自己完成），真正的异步 IO 由内核完成并通知',
      '非阻塞 IO 一定是异步 IO',
      '阻塞 IO 一定比非阻塞慢'
    ],
    ans: [1],
    exp: 'POSIX 定义：同步 IO 中应用程序需自己执行 read/write；异步 IO（aio、IOCP）由内核完成数据拷贝后再通知。IO 多路复用是同步 IO（只是等待就绪的方式更高效）。'
  },
  {
    id: 'i40', cat: 'interview', type: 'single', level: 2,
    q: 'TCP 建立连接需要三次握手，最核心的原因是？',
    options: [
      '确认双方的初始序列号，并验证双向通信能力',
      '为了传输更多数据',
      '因为 UDP 需要两次',
      '为了实现拥塞控制'
    ],
    ans: [0],
    exp: '两次握手无法让双方都确认"对方能收到自己的信息"；三次握手同时完成了双方初始序列号（ISN）的同步，并为防止历史重复连接请求提供基础。'
  },
  {
    id: 'i41', cat: 'interview', type: 'multi', level: 2,
    q: 'TCP 断开连接需要四次挥手的原因包括？（多选）',
    options: [
      'TCP 是全双工的，每个方向都要单独关闭',
      '被动关闭方在收到 FIN 后可能还有数据未发送完，需等发完再发自己的 FIN',
      'ACK 与 FIN 通常不能合并（除非开启延迟确认且恰好同时关闭）',
      '因为要等待 2MSL'
    ],
    ans: [0, 1, 2],
    exp: 'TIME_WAIT 的 2MSL 等待发生在挥手之后，不是挥手需要四次的原因。'
  },
  {
    id: 'i42', cat: 'interview', type: 'single', level: 2,
    q: '主动关闭方进入 TIME_WAIT 并等待 2MSL 的目的不包括？',
    options: [
      '保证最后一个 ACK 能到达对端（丢失时对方可重发 FIN）',
      '让本次连接的残留报文在网络中消散，避免污染新连接',
      '保证连接能被可靠地重复建立',
      '防止旧连接的延迟报文被新连接接收'
    ],
    ans: [2],
    exp: 'TIME_WAIT 会带来端口占用问题（高并发短连接服务上常见），可通过 SO_REUSEADDR、长连接或让客户端主动关闭来缓解。'
  },
  {
    id: 'i43', cat: 'interview', type: 'multi', level: 2,
    q: 'TCP 拥塞控制的四个阶段包括？（多选）',
    options: ['慢启动（slow start）', '拥塞避免（congestion avoidance）', '快速重传（fast retransmit）', '快速恢复（fast recovery）'],
    ans: [0, 1, 2, 3],
    exp: '慢启动指数增长直到 ssthresh，之后线性增长（拥塞避免）；收到 3 个重复 ACK 触发快重传而非等超时，随后进入快恢复。'
  },
  {
    id: 'i44', cat: 'interview', type: 'judge', level: 2,
    q: 'TCP 的滑动窗口用于流量控制（接收方通告窗口大小限制发送速率），而拥塞窗口用于拥塞控制，实际发送窗口取二者较小值。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。窗口为 0 时发送方停止并启动持续定时器探测（避免死锁）；糊涂窗口综合征（Silly Window Syndrome）需要通过 Nagle 算法等手段缓解。'
  },
  {
    id: 'i45', cat: 'interview', type: 'single', level: 2,
    q: 'TCP 出现"粘包/拆包"的根本原因是？',
    options: [
      'TCP 是字节流协议，不保留消息边界',
      'TCP 不可靠',
      '网络延迟过大',
      '使用了 UDP'
    ],
    ans: [0],
    exp: '解决方式：固定长度消息、分隔符（如 \n）、或在头部加长度字段（最常用）。UDP 是面向报文的，不会粘包，但也不保证可靠与有序。'
  },
  {
    id: 'i46', cat: 'interview', type: 'multi', level: 2,
    q: 'TCP 保证可靠传输的机制包括？（多选）',
    options: ['序列号与确认应答', '超时重传与快速重传', '校验和', '排序去重、流量控制与拥塞控制'],
    ans: [0, 1, 2, 3],
    exp: '这些机制叠加使 TCP 成为可靠有序的字节流服务；代价是首部开销大、握手与重传带来延迟，因此实时音视频常用 UDP + 自定义可靠性策略。'
  },
  {
    id: 'i47', cat: 'interview', type: 'single', level: 1,
    q: 'HTTP 状态码 502 表示？',
    options: [
      '服务器内部错误',
      '作为网关/代理的服务器从上游收到了无效响应',
      '请求的资源不存在',
      '服务不可用'
    ],
    ans: [1],
    exp: '常见对照：500 服务器内部错误、404 资源不存在、403 无权限、401 未认证、503 服务不可用（过载或维护）、504 网关超时、301/302 重定向。'
  },
  {
    id: 'i48', cat: 'interview', type: 'multi', level: 2,
    q: '关于 GET 与 POST，正确的说法有？（多选）',
    options: [
      '语义上 GET 用于获取资源且应为幂等，POST 用于提交并可能改变服务器状态',
      'GET 请求通常可被缓存、可收藏为书签，参数出现在 URL 中',
      'HTTP 协议本身并未硬性限制 GET 的 URL 长度，限制来自浏览器与服务器实现',
      'POST 一定比 GET 安全'
    ],
    ans: [0, 1, 2],
    exp: '两者都不安全（明文传输，除非用 HTTPS）；POST 参数在 body 中只是"不易被直接看到"，不能替代加密。'
  },
  {
    id: 'i49', cat: 'interview', type: 'single', level: 2,
    q: 'HTTPS 的握手与数据传输特点是？',
    options: [
      '全程使用非对称加密',
      '握手阶段用非对称加密协商会话密钥，之后的业务数据用对称加密传输',
      '全程明文，仅校验域名',
      '不使用证书'
    ],
    ans: [1],
    exp: '非对称计算开销大，仅用于身份认证与密钥交换；真正的数据传输用 AES 等对称算法。CA 证书用于防止中间人攻击，证书链验证失败会导致连接被拒。'
  },
  {
    id: 'i50', cat: 'interview', type: 'judge', level: 2,
    q: 'HTTP/2 通过二进制分帧与多路复用解决了 HTTP/1.1 的队头阻塞问题，并支持头部压缩（HPACK）。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。但它仍基于 TCP，TCP 层的丢包重传仍会造成队头阻塞；HTTP/3 改用基于 UDP 的 QUIC，把流级别的可靠性上移，彻底解决了这一问题。'
  },
  {
    id: 'i51', cat: 'interview', type: 'single', level: 2,
    q: 'Cookie 与 Session 的主要区别是？',
    options: [
      'Cookie 存在客户端、Session 数据通常存在服务器，客户端只保存 Session ID',
      'Cookie 一定比 Session 安全',
      'Session 不需要 Cookie 配合',
      '两者都存储在浏览器中'
    ],
    ans: [0],
    exp: 'Session 通常依赖 Cookie 传递 Session ID（也可 URL 重写）。Cookie 可设 HttpOnly（防 JS 读取）、Secure（仅 HTTPS）、SameSite（防 CSRF）。'
  },
  {
    id: 'i52', cat: 'interview', type: 'multi', level: 2,
    q: '关于 DNS，正确的说法有？（多选）',
    options: [
      '查询通常基于 UDP 53 端口，响应过大或区域传送时使用 TCP',
      '解析顺序通常是：浏览器缓存 → 系统缓存/hosts → 本地 DNS 服务器 → 根/顶级/权威服务器',
      'DNS 结果会被 TTL 控制缓存时长',
      'DNS 一定返回唯一 IP'
    ],
    ans: [0, 1, 2],
    exp: '一个域名可对应多个 IP（如 CDN、负载均衡），DNS 也可基于来源返回不同结果（智能解析）。'
  },
  {
    id: 'i53', cat: 'interview', type: 'single', level: 2,
    q: '从浏览器输入 URL 到页面呈现，正确的先后顺序是？',
    options: [
      '渲染 → DNS → TCP → HTTP',
      'DNS 解析 → TCP 连接（HTTPS 还需 TLS 握手）→ 发送 HTTP 请求 → 服务器响应 → 解析渲染',
      'HTTP → DNS → TCP',
      'TCP → DNS → 渲染'
    ],
    ans: [1],
    exp: '完整链路还包括：URL 解析、缓存判断、可能的重定向、连接复用（keep-alive）、资源下载、DOM/CSSOM 构建、布局与绘制。'
  },
  {
    id: 'i54', cat: 'interview', type: 'multi', level: 2,
    q: '关于 WebSocket 与 HTTP 长轮询，正确的说法有？（多选）',
    options: [
      'WebSocket 是全双工长连接，服务端可主动推送',
      'WebSocket 通过 HTTP Upgrade 握手建立，之后使用独立的帧协议',
      '长轮询是客户端反复发起请求模拟推送，开销更大',
      'WebSocket 无法穿过代理'
    ],
    ans: [0, 1, 2],
    exp: 'WebSocket 使用 ws/wss（80/443），通常可穿透常规代理；需要心跳（ping/pong）保活并处理断线重连。'
  },
  {
    id: 'i55', cat: 'interview', type: 'single', level: 1,
    q: 'TCP 服务端 socket 编程的正确调用顺序是？',
    options: [
      'bind → socket → listen → accept',
      'socket → bind → listen → accept → recv/send',
      'listen → socket → bind → accept',
      'socket → connect → listen'
    ],
    ans: [1],
    exp: '客户端侧是 socket → connect。服务端 accept 返回的是新 socket（与监听 socket 分开），监听 socket 只负责接受连接。'
  },
  {
    id: 'i56', cat: 'interview', type: 'judge', level: 2,
    q: '数据库索引可以显著加快查询，但会降低写入（INSERT/UPDATE/DELETE）性能并占用额外存储空间。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。每次写入都要维护索引结构（B+ 树的分裂合并）。因此要为高频查询列建索引，避免对低区分度列（如性别）或很少被查询的列建索引。'
  },
  {
    id: 'i57', cat: 'interview', type: 'multi', level: 1,
    q: '数据库事务的 ACID 分别指？（多选）',
    options: ['原子性（Atomicity）', '一致性（Consistency）', '隔离性（Isolation）', '持久性（Durability）'],
    ans: [0, 1, 2, 3],
    exp: '实现手段：原子性靠 undo log，持久性靠 redo log，隔离性靠锁与 MVCC，一致性是前三者的共同结果。'
  },
  {
    id: 'i58', cat: 'interview', type: 'single', level: 2,
    q: '下列哪种现象与隔离级别的对应是正确的？',
    options: [
      '脏读：读未提交级别下可能读到未提交的数据',
      '不可重复读：只可能在串行化下出现',
      '幻读：只在读未提交下出现',
      '读已提交可以完全避免幻读'
    ],
    ans: [0],
    exp: '读未提交 → 脏读；读已提交 → 避免脏读但存在不可重复读；可重复读 → 避免不可重复读，仍可能幻读（MySQL InnoDB 靠 MVCC + 间隙锁缓解）；串行化 → 全部避免但并发度最低。'
  },
  {
    id: 'i59', cat: 'interview', type: 'judge', level: 3,
    q: 'MySQL InnoDB 的默认隔离级别是可重复读（RR），它同时依赖 MVCC（快照读）与 next-key 锁（当前读）来避免幻读。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。快照读（普通 SELECT）通过 ReadView 看到事务开始时的版本；当前读（SELECT ... FOR UPDATE、UPDATE、DELETE）通过行锁 + 间隙锁锁住区间，阻止新行插入。'
  },
  {
    id: 'i60', cat: 'interview', type: 'multi', level: 2,
    q: '下列哪些写法可能导致索引失效？（多选）',
    options: [
      '在索引列上使用函数或表达式，如 WHERE YEAR(date_col) = 2024',
      'LIKE 以通配符开头，如 LIKE "%abc"',
      '联合索引未从最左列开始使用',
      '索引列发生隐式类型转换（如字符串列传入数字）'
    ],
    ans: [0, 1, 2, 3],
    exp: '排查手段：EXPLAIN 查看 type/key/rows/Extra（Using filesort、Using temporary 通常是告警信号）。'
  },
  {
    id: 'i61', cat: 'interview', type: 'single', level: 2,
    q: '联合索引 (a, b, c) 的"最左前缀原则"意味着？',
    options: [
      '查询条件必须包含 a 才能有效利用该索引（除非满足索引覆盖等特殊情况）',
      '必须按 a、b、c 的顺序书写 WHERE 条件',
      '只能使用第一列',
      '与顺序无关，任意列组合都能用上'
    ],
    ans: [0],
    exp: '索引按 (a,b,c) 字典序排列，因此必须从最左列开始匹配；WHERE 中书写顺序不影响，优化器会重排。范围查询之后的列无法继续使用索引（如 a=1 AND b>2 后的 c 失效）。'
  },
  {
    id: 'i62', cat: 'interview', type: 'multi', level: 1,
    q: 'Redis 常用的数据类型包括？（多选）',
    options: ['String', 'Hash / List', 'Set / Sorted Set（ZSet）', 'Bitmap / HyperLogLog / Stream'],
    ans: [0, 1, 2, 3],
    exp: 'ZSet 用跳表 + 哈希表实现，支持按分数范围查询，是排行榜与延迟队列的基础；HyperLogLog 用极小内存做基数统计（有约 0.81% 误差）。'
  },
  {
    id: 'i63', cat: 'interview', type: 'multi', level: 2,
    q: '关于 Redis 持久化，正确的说法有？（多选）',
    options: [
      'RDB 是某一时刻的内存快照，恢复快但可能丢失最后一次快照后的数据',
      'AOF 以追加日志方式记录写命令，数据更安全但文件更大',
      '可以同时开启两者，Redis 重启时优先使用 AOF 恢复',
      'RDB 每次写操作都会落盘'
    ],
    ans: [0, 1, 2],
    exp: '生产环境常采用混合持久化（AOF 重写时以 RDB 格式写入头部），兼顾恢复速度与数据安全。'
  },
  {
    id: 'i64', cat: 'interview', type: 'multi', level: 2,
    q: '缓存穿透、击穿、雪崩的常见应对手段包括？（多选）',
    options: [
      '穿透：布隆过滤器过滤不存在的 key、缓存空值并设置短过期',
      '击穿：热点 key 过期时用互斥锁或逻辑过期，只允许一个请求回源',
      '雪崩：过期时间加随机抖动、多级缓存、限流降级',
      '三者都可以通过无限增大缓存容量解决'
    ],
    ans: [0, 1, 2],
    exp: '核心思路：让"到数据库的请求"可控可预测。此外还有预热、熔断（如 Sentinel/Hystrix 思路）等手段。'
  },
  {
    id: 'i65', cat: 'interview', type: 'single', level: 2,
    q: 'Redis 的过期键删除策略是？',
    options: [
      '定时删除（到期立即删）',
      '惰性删除 + 定期删除相结合',
      '永不过期，靠内存淘汰',
      '每次访问全部扫描'
    ],
    ans: [1],
    exp: '惰性删除在访问时判断是否过期（省 CPU），定期删除随机抽样清理（避免内存堆积）。内存不足时再由 maxmemory-policy（如 allkeys-lru）淘汰。'
  },
  {
    id: 'i66', cat: 'interview', type: 'judge', level: 3,
    q: '用 Redis 实现分布式锁时，加锁必须设置过期时间且要保证"加锁与设过期"的原子性，释放锁时应先校验持有者再删除（通常用 Lua 脚本保证原子）。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。否则会出现"业务超时导致锁被别人获取后又被误删"的问题。SET key value NX PX 30000 是标准写法；Redlock 在时钟漂移等场景下存在争议，需谨慎评估。'
  },
  {
    id: 'i67', cat: 'interview', type: 'multi', level: 2,
    q: '常见的负载均衡策略包括？（多选）',
    options: ['轮询与加权轮询', '最少连接数', '源地址哈希', '一致性哈希（节点变化时仅少量 key 需要迁移）'],
    ans: [0, 1, 2, 3],
    exp: '一致性哈希通过虚拟节点解决数据倾斜；它在分布式缓存扩缩容场景下能把重分布代价从 O(n) 降到约 1/n。'
  },
  {
    id: 'i68', cat: 'interview', type: 'single', level: 2,
    q: 'CAP 理论指的是分布式系统无法同时完美满足？',
    options: [
      '一致性、可用性、分区容错性（三者最多同时满足两项，且 P 通常必须接受）',
      '并发、原子、持久',
      '缓存、异步、分区',
      '成本、可用、性能'
    ],
    ans: [0],
    exp: '网络分区（P）在现实中不可避免，因此实际取舍多在 C 与 A 之间：CP 系统（如 etcd/ZooKeeper）保证一致，AP 系统（如 Cassandra）保证可用并追求最终一致。'
  },
  {
    id: 'i69', cat: 'interview', type: 'judge', level: 1,
    q: '引入消息队列的主要收益是削峰填谷、异步处理与系统解耦，代价是引入了额外的复杂性与一致性考量。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。配套问题包括：消息丢失（持久化 + 确认）、重复消费（幂等设计）、顺序性（分区内有序）、堆积（扩容消费者 + 限流）。'
  },
  {
    id: 'i70', cat: 'interview', type: 'multi', level: 2,
    q: 'C/C++ 程序从源码到可执行文件，通常经历的阶段有？（多选）',
    options: ['预处理（宏展开、头文件包含）', '编译（词法/语法/语义分析、优化、生成汇编）', '汇编（生成目标文件 .o）', '链接（符号解析与重定位，合并静态库与动态库）'],
    ans: [0, 1, 2, 3],
    exp: '链接错误常见两类：undefined reference（找不到定义）与 multiple definition（重复定义）。'
  },
  {
    id: 'i71', cat: 'interview', type: 'single', level: 2,
    q: '静态库（.a/.lib）与动态库（.so/.dll）的主要区别是？',
    options: [
      '静态库在链接时被复制进可执行文件，动态库在运行时加载并被多个程序共享',
      '动态库一定更快',
      '静态库不能被多个程序同时使用',
      '两者完全相同'
    ],
    ans: [0],
    exp: '静态库使程序体积大但部署简单、无依赖；动态库省磁盘与内存、可独立更新（热修复），但需处理版本兼容与 LD_LIBRARY_PATH/rpath 查找路径。'
  },
  {
    id: 'i72', cat: 'interview', type: 'multi', level: 2,
    q: '常见的设计模式及其用途，匹配正确的有？（多选）',
    options: [
      '单例：全局唯一实例（如配置管理、日志器）',
      '工厂/抽象工厂：把对象创建与使用解耦',
      '观察者：一对多的发布订阅通知',
      '策略：把可替换的算法封装起来，运行时选择'
    ],
    ans: [0, 1, 2, 3],
    exp: '面试常追问"线程安全单例"：C++11 起最简洁的写法是函数内静态局部变量（Meyers Singleton），标准保证其初始化线程安全。'
  },
  {
    id: 'i73', cat: 'interview', type: 'single', level: 2,
    q: 'SOLID 中的"开闭原则"指的是？',
    options: [
      '对扩展开放、对修改关闭：通过抽象与多态增加新功能而不改动已有代码',
      '类应该尽量小',
      '所有方法都要 public',
      '禁止使用继承'
    ],
    ans: [0],
    exp: '其余四条：单一职责（一个类只有一个变化原因）、里氏替换（子类可替换父类）、接口隔离（小而专的接口）、依赖倒置（依赖抽象而非具体实现）。'
  },
  {
    id: 'i74', cat: 'interview', type: 'judge', level: 2,
    q: '#define MAX(a, b) ((a) > (b) ? (a) : (b)) 在 MAX(i++, j++) 这样的调用中会产生副作用（参数被多次求值）。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。宏是文本替换，参数会被求值两次。应使用 inline 函数或模板（std::max），它们只求值一次且带类型检查。'
  },
  {
    id: 'i75', cat: 'interview', type: 'multi', level: 1,
    q: '常见的 C/C++ 内存错误包括？（多选）',
    options: ['内存泄漏（分配后未释放）', '越界访问与缓冲区溢出', '使用已释放内存（悬垂指针）与重复释放', '读取未初始化的内存'],
    ans: [0, 1, 2, 3],
    exp: '防御手段：优先使用智能指针与容器、RAII、边界检查；排查工具：AddressSanitizer、Valgrind、静态分析。'
  },
  {
    id: 'i76', cat: 'interview', type: 'single', level: 2,
    q: '检测 C++ 程序内存泄漏与越界，最常用且对性能影响较小的手段是？',
    options: [
      'printf 打日志',
      'AddressSanitizer（-fsanitize=address，编译期插桩）',
      '重启程序',
      '增加内存'
    ],
    ans: [1],
    exp: 'ASan 能检测越界、use-after-free、double-free，开销约 2 倍；Valgrind 无需重新编译但慢 10~50 倍；LeakSanitizer 专注泄漏。线上通常用采样型 profiler。'
  },
  {
    id: 'i77', cat: 'interview', type: 'judge', level: 2,
    q: '协程的切换在用户态完成，不需要陷入内核，因此比线程切换开销更小，适合高并发 IO 密集型场景。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。协程拥有独立的栈（可以是分段栈或有栈/无栈实现），由程序自己调度；C++20 提供 co_await/co_yield 语言级协程支持。'
  },
  {
    id: 'i78', cat: 'interview', type: 'single', level: 2,
    q: '使用线程池的主要目的是？',
    options: [
      '让线程数量无限增长',
      '复用线程、减少频繁创建销毁的开销，并控制并发度防止资源耗尽',
      '保证线程执行顺序',
      '替代进程'
    ],
    ans: [1],
    exp: '核心参数：核心线程数、最大线程数、队列容量、拒绝策略。IO 密集型可设较多线程，CPU 密集型通常设为核数左右。'
  },
  {
    id: 'i79', cat: 'interview', type: 'multi', level: 2,
    q: '提升高并发服务性能的常见手段有？（多选）',
    options: ['多级缓存（本地缓存 + 分布式缓存）', '池化（连接池、线程池、对象池）', '异步化与批量处理', '限流、降级、熔断与读写分离'],
    ans: [0, 1, 2, 3],
    exp: '优化的顺序应是"先测量再优化"：用压测与 profiling 找到真正的瓶颈，避免过早优化。'
  },
  {
    id: 'i80', cat: 'interview', type: 'single', level: 2,
    q: '网络编程中"网络字节序"是？',
    options: [
      '小端序',
      '大端序（高位字节在低地址），需用 htonl/htons 等进行转换',
      '由 CPU 决定，无需转换',
      '随机序'
    ],
    ans: [1],
    exp: '主机字节序因架构而异（x86/ARM 多为小端），因此跨平台通信前必须统一转换为网络字节序，否则多字节字段会被解析错。'
  },
  {
    id: 'i81', cat: 'interview', type: 'judge', level: 1,
    q: 'sizeof 是编译期运算符而不是函数，其操作数不会被求值（如 sizeof(i++) 不会真的执行自增）。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。除变长数组（VLA，C99，C++ 不支持）外，sizeof 的结果在编译期确定，因此也能用于数组长度、模板参数等常量上下文。'
  },
  {
    id: 'i82', cat: 'interview', type: 'multi', level: 2,
    q: '影响一个 C++ 类对象大小的因素包括？（多选）',
    options: ['非静态数据成员的大小与内存对齐', '含虚函数时引入的虚表指针 vptr', '继承带来的基类子对象', '虚继承引入的虚基类指针及相关开销'],
    ans: [0, 1, 2, 3],
    exp: '静态成员与成员函数不占对象空间（静态成员在静态存储区，函数代码在代码段）。多重继承可能引入多个 vptr。'
  },
  {
    id: 'i83', cat: 'interview', type: 'single', level: 3,
    q: 'C++11 中最简洁且线程安全的单例实现方式是？',
    options: [
      '双重检查锁定 + volatile',
      '函数内的静态局部变量（Meyers Singleton），标准保证其初始化线程安全',
      '全局变量裸指针',
      '每次使用时 new'
    ],
    ans: [1],
    exp: 'C++11 起静态局部变量初始化由编译器加锁保护（magic statics），且第一次调用时才构造（懒加载）；析构顺序问题可通过返回指针/引用并避免析构依赖来规避。'
  },
  {
    id: 'i84', cat: 'interview', type: 'judge', level: 2,
    q: '虚函数可以被声明为 inline，但通过基类指针/引用的多态调用无法内联；只有在编译期能确定对象真实类型时才可能被内联。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。这个组合看似矛盾实则常见：inline 只是建议，多数情况下虚函数不会内联，除非编译器做了去虚拟化（devirtualization）优化或使用了 final。'
  },
  {
    id: 'i85', cat: 'interview', type: 'single', level: 3,
    q: '关于 C++ 的 ABI（应用二进制接口），正确的说法是？',
    options: [
      'C++ 有跨编译器的标准 ABI',
      'C++ 没有标准化的 ABI，不同编译器/版本/编译选项产出的目标文件通常不能混用',
      '只要操作系统相同就能混用',
      'C++ ABI 与 C 完全相同'
    ],
    ans: [1],
    exp: '这正是动态库接口常要写成 extern "C" 的原因：C 的 ABI 相对稳定。此外标准库实现（libstdc++ vs libc++）、编译选项（如 _GLIBCXX_USE_CXX11_ABI）也会影响兼容性。'
  },
  {
    id: 'i86', cat: 'interview', type: 'multi', level: 2,
    q: '加快 C++ 大型项目编译速度的常用手段有？（多选）',
    options: ['前置声明代替不必要的 #include', 'pimpl 惯用法隐藏实现细节', '预编译头文件（PCH）', '减少模板实例化与启用增量/并行编译'],
    ans: [0, 1, 2, 3],
    exp: 'C++20 的模块（modules）从机制上替代头文件文本包含，是解决编译慢的根本方向；工程上还可用 ccache 缓存编译结果。'
  },
  {
    id: 'i87', cat: 'interview', type: 'single', level: 2,
    q: '区分左值与右值最实用的判据是？',
    options: [
      '能出现在赋值号左边的就是左值',
      '能取地址（&）、有名字、有持久状态的是左值；临时对象、字面量（除字符串字面量）通常是右值',
      '类型以 & 结尾的就是左值',
      '常量一定是右值'
    ],
    ans: [1],
    exp: '字符串字面量是左值（它有静态存储期，可以取地址）；const 变量也是左值。右值引用 T&& 只能绑定右值，这是移动语义的基础。'
  },
  {
    id: 'i88', cat: 'interview', type: 'judge', level: 2,
    q: 'vector<T>::emplace_back(args...) 直接在容器内存中构造元素，相比 push_back(T(args)) 通常可省去一次临时对象的构造与移动。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。但对已存在的对象调用 emplace_back(obj) 与 push_back(obj) 效果相同（都是拷贝）。注意 emplace 系列也可能因扩容导致迭代器失效。'
  },
  {
    id: 'i89', cat: 'interview', type: 'multi', level: 2,
    q: '下列属于未定义行为（UB）的有？（多选）',
    options: ['数组越界访问', '解引用空指针', '有符号整数溢出', '读取未初始化的变量'],
    ans: [0, 1, 2, 3],
    exp: 'UB 的可怕之处在于"看似能跑"：编译器可基于"UB 不会发生"做激进优化，导致开启 -O2 后行为突变。无符号整数回绕是有定义的，不属于 UB。'
  },
  {
    id: 'i90', cat: 'interview', type: 'single', level: 2,
    q: 'RAII 与垃圾回收（GC）的本质区别是？',
    options: [
      'RAII 依赖运行时追踪，GC 依赖编译期分析',
      'RAII 是确定性的：资源在作用域结束（析构）时立即释放；GC 的回收时机不确定',
      '两者完全相同',
      'RAII 只能管理内存'
    ],
    ans: [1],
    exp: '确定性析构是 C++ 的核心优势：文件句柄、锁、网络连接都能在作用域结束时立刻释放，而 GC 语言通常需要 try-with-resources / using 来模拟。'
  },
  {
    id: 'i91', cat: 'interview', type: 'judge', level: 2,
    q: '在头文件中定义非 inline 的全局变量或函数，被多个 .cpp 包含后会导致链接阶段的重复定义错误。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。正确做法：头文件只放声明（extern / 函数原型），定义放在单一 .cpp；或把定义写成 inline / constexpr / static（各自独立副本）/ C++17 inline 变量。'
  },
  {
    id: 'i92', cat: 'interview', type: 'multi', level: 2,
    q: 'C++ 性能优化的常见方向包括？（多选）',
    options: [
      '减少不必要拷贝：const 引用传参、移动语义、reserve 预留容量',
      '减少动态内存分配：对象池、arena、小对象优化',
      '提高缓存命中：数据布局紧凑、顺序访问、结构体拆分（SoA）',
      '减少分支与利用 SIMD 向量化'
    ],
    ans: [0, 1, 2, 3],
    exp: '务必先用 perf / VTune 等工具定位热点：多数程序的瓶颈集中在少数代码路径上，盲目优化往往适得其反。'
  },
  {
    id: 'i93', cat: 'interview', type: 'single', level: 3,
    q: '现代 CPU 中分支预测失败的主要代价是？',
    options: [
      '编译变慢',
      '需要清空流水线并重新取指，损失十余到数十个时钟周期',
      '内存泄漏',
      '没有代价'
    ],
    ans: [1],
    exp: '优化手段：让分支具有规律性、用查表或位运算消除分支、使用 [[likely]]/[[unlikely]]（C++20）或编译器的 __builtin_expect 引导布局。'
  },
  {
    id: 'i94', cat: 'interview', type: 'judge', level: 2,
    q: '链表的缓存局部性优于数组，因为节点是按需分配的。',
    options: ['正确', '错误'],
    ans: [1],
    exp: '错误。恰恰相反：数组元素连续存放，可充分利用预取与缓存行（一次加载 64 字节能用上多个元素）；链表节点分散且带指针开销，遍历时缓存命中率低。这也是"理论复杂度更优的链表实际常慢于 vector"的主因。'
  },
  {
    id: 'i95', cat: 'interview', type: 'multi', level: 2,
    q: '线上程序崩溃（coredump）后的常用排查手段有？（多选）',
    options: [
      'gdb 加载 core 文件并用 bt 查看调用栈',
      '结合编译时的调试符号（-g）与日志定位',
      '用 AddressSanitizer 复现内存类问题',
      '直接重启机器'
    ],
    ans: [0, 1, 2],
    exp: '实践中还要保留符号表（分离 debug info）、开启 ulimit -c、记录崩溃时的版本与输入，才能有效复现。'
  },
  {
    id: 'i96', cat: 'interview', type: 'single', level: 1,
    q: 'CMake 的主要作用是？',
    options: [
      '替代编译器直接生成可执行文件',
      '跨平台的构建系统生成器：用 CMakeLists.txt 描述工程，生成 Makefile/Ninja/VS 工程',
      '用于代码格式化',
      '用于单元测试'
    ],
    ans: [1],
    exp: '现代 CMake 强调 target 化：target_link_libraries、target_include_directories，避免全局变量污染。'
  },
  {
    id: 'i97', cat: 'interview', type: 'judge', level: 2,
    q: '头文件中定义全局变量时，加上 static 可以让每个包含它的 .cpp 各持有一份独立副本，从而避免链接冲突（但会造成"变量不共享"的陷阱）。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。static 把链接性限制为内部链接，因此不冲突，但每个翻译单元各有一份，修改互不可见——用于常量尚可，用于状态则会产生难以察觉的 bug。'
  },
  {
    id: 'i98', cat: 'interview', type: 'multi', level: 1,
    q: '关于面向对象与多态，正确的说法有？（多选）',
    options: [
      '封装、继承、多态是三大基本特性',
      '编译期多态：函数重载与模板；运行期多态：虚函数',
      '多态让调用方依赖抽象而非具体实现，降低耦合',
      '多态没有任何运行时开销'
    ],
    ans: [0, 1, 2],
    exp: '运行期多态的代价：每个对象多一个 vptr、虚调用多一次间接寻址、通常无法内联。这也是性能敏感代码偏向模板（编译期多态）的原因。'
  },
  {
    id: 'i99', cat: 'interview', type: 'single', level: 2,
    q: '实现深拷贝的赋值运算符时，最容易忽略的两个要点是？',
    options: [
      '返回类型与异常安全',
      '自赋值安全（a = a）与"先分配新资源再释放旧资源"的异常安全顺序',
      '是否加 const',
      '是否使用 inline'
    ],
    ans: [1],
    exp: '经典写法是 copy-and-swap：先拷贝构造一个临时对象，再与 *this 交换，天然具备自赋值安全与强异常安全保证。'
  },
  {
    id: 'i100', cat: 'interview', type: 'judge', level: 2,
    q: '拷贝赋值运算符通常应返回 T&（以支持链式赋值 a = b = c），并检查自赋值。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。返回引用避免了无谓的临时对象；返回 void 虽然能编译，但会破坏与内置类型一致的使用习惯，也不符合容器的要求。'
  },

  /* ==================== 七、C++ 语法基础 · 补充 ==================== */
  {
    id: 's81', cat: 'syntax', type: 'judge', level: 3,
    q: 'f(i++, ++i) 这类"同一变量在一次表达式中被多次修改"的写法属于未定义行为。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确（C++17 之前明确是 UB）。C++17 规定了某些运算符（如 <<、赋值、下标）的求值顺序，但函数参数的求值顺序依然未指定，因此仍不应写出依赖求值顺序的代码。'
  },
  {
    id: 's82', cat: 'syntax', type: 'judge', level: 2,
    q: 'C++17 起函数实参之间的求值顺序仍然未指定（只是不再允许交错执行），因此 g(f1(), f2()) 中 f1 与 f2 的先后不可依赖。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。不同编译器的求值顺序可能不同（常见为从右到左）。若两参数存在副作用依赖，应拆成两条语句，明确顺序。'
  },
  {
    id: 's83', cat: 'syntax', type: 'single', level: 2,
    q: '对含有 std::string 成员或虚函数的对象使用 memset(this, 0, sizeof(*this)) 初始化，结果是？',
    options: [
      '安全且高效',
      '未定义行为：会破坏对象内部状态（如把字符串指针清零、覆盖 vptr）',
      '等同于默认构造',
      '只是性能略差'
    ],
    ans: [1],
    exp: '只有平凡可拷贝（trivially copyable）类型才能用 memset/ memcpy 处理。非平凡类型必须走构造函数；判断可用 std::is_trivially_copyable。'
  },
  {
    id: 's84', cat: 'syntax', type: 'single', level: 2,
    q: 'typedef 与 using 在定义"模板别名"时的区别是？',
    options: [
      '两者都支持模板别名',
      '只有 using 支持模板别名：template<class T> using Vec = std::vector<T>;',
      '只有 typedef 支持',
      '模板别名需要宏实现'
    ],
    ans: [1],
    exp: 'typedef 无法直接声明带参数的别名（只能借助模板结构体间接实现）。using 语法更直观且可用于模板，现代 C++ 推荐统一使用 using。'
  },
  {
    id: 's85', cat: 'syntax', type: 'multi', level: 2,
    q: '关于迭代器失效，正确的说法有？（多选）',
    options: [
      'vector 插入/删除（含扩容）会使被操作位置及其之后的迭代器、引用、指针失效',
      'list 删除元素只使指向被删元素的迭代器失效',
      'map / set 的 insert 不会使任何迭代器失效；erase 只使被删元素迭代器失效',
      'unordered_map 发生 rehash 时所有迭代器失效'
    ],
    ans: [0, 1, 2, 3],
    exp: '记住这条规律：节点式容器（list、map、set）只在删除时失效单个迭代器；连续/半连续容器（vector、deque、string）插入删除都可能大范围失效；哈希表在 rehash 时全部失效。'
  },
  {
    id: 's86', cat: 'syntax', type: 'single', level: 2,
    q: '调用 vector::shrink_to_fit() 后，capacity 一定会等于 size 吗？',
    options: [
      '一定相等',
      '不一定：标准只说它是"非强制的请求"，实现可忽略',
      '一定会释放全部内存',
      '会导致元素丢失'
    ],
    ans: [1],
    exp: '想要确定性地释放内存，惯用写法是 std::vector<T>().swap(v);（与临时空向量交换）。'
  },
  {
    id: 's87', cat: 'syntax', type: 'multi', level: 2,
    q: '关于 emplace 系列（emplace_back / emplace），正确的说法有？（多选）',
    options: [
      '直接在容器内存中构造元素，省去临时对象的构造与移动/拷贝',
      '参数是构造函数的参数，而不是元素对象本身',
      'emplace_back(obj) 与 push_back(obj) 效果相同（都是拷贝）',
      'emplace 一定比 push_back 快，应无条件替换'
    ],
    ans: [0, 1, 2],
    exp: 'D 过于绝对：对已存在的对象两者无差别，且 emplace 可能绕过 explicit 构造带来可读性/安全性问题（如 emplace_back("abc") 会被解析为构造参数）。'
  },
  {
    id: 's88', cat: 'syntax', type: 'single', level: 3,
    q: 'decltype(auto) 的作用是？',
    options: [
      '与 auto 完全相同',
      '按 decltype 的规则推导，可保留引用与 const，常用于返回类型推导',
      '强制推导为值类型',
      '只能用于变量'
    ],
    ans: [1],
    exp: 'auto 会剥去引用与顶层 const，而 decltype(auto) 保留表达式的确切类型。返回容器元素的函数常用它避免意外拷贝。'
  },
  {
    id: 's89', cat: 'syntax', type: 'judge', level: 3,
    q: 'if constexpr 的条件必须在编译期确定，且不满足的分支会被丢弃（在模板中不会被实例化），因此可替代部分 SFINAE 写法。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。注意它只能用于模板上下文才能真正"丢弃"分支（非模板中另一分支仍要做语法与类型检查）。'
  },
  {
    id: 's90', cat: 'syntax', type: 'single', level: 3,
    q: 'C++17 折叠表达式 (args + ...) 的作用是？',
    options: [
      '折叠所有参数为一个值，如求和 ((a + b) + c)',
      '递归展开参数包',
      '把参数反转',
      '计算参数个数'
    ],
    ans: [0],
    exp: '一元右折叠 (args op ...) 展开为 (a1 op (a2 op a3))，一元左折叠 (... op args) 为 ((a1 op a2) op a3)，还可带初值做二元折叠。它大幅简化了可变参数模板的写法。'
  },
  {
    id: 's91', cat: 'syntax', type: 'multi', level: 3,
    q: '下列属于 C++20 引入的特性有？（多选）',
    options: ['概念（Concepts）与 requires 约束', '范围库（Ranges）与管道式组合', '协程（co_await / co_yield / co_return）', '三向比较运算符 <=>'],
    ans: [0, 1, 2, 3],
    exp: 'C++20 是继 C++11 之后最大的一次更新，另外还有模块（Modules）、指定初始化、consteval、std::span、std::format 等重要特性。'
  },
  {
    id: 's92', cat: 'syntax', type: 'single', level: 3,
    q: 'C++20 的三向比较运算符 <=> 的返回值属于哪类比较类别？',
    options: [
      'bool',
      'std::strong_ordering / weak_ordering / partial_ordering',
      'int',
      'void'
    ],
    ans: [1],
    exp: 'strong_ordering 表示全序等价（如整数），weak_ordering 允许等价但可区分（如大小写不敏感字符串），partial_ordering 支持"不可比较"（如浮点 NaN）。定义 <=> 后编译器可自动合成 <、<=、>、>=。'
  },
  {
    id: 's93', cat: 'syntax', type: 'judge', level: 2,
    q: '移动构造函数应尽可能声明为 noexcept，否则 std::vector 扩容时可能因为无法保证不抛异常而退回使用拷贝。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。vector 需要在扩容时提供强异常保证，只有移动操作不抛时才敢用移动；否则改用拷贝（可能显著变慢）。这是"随手加 noexcept"收益最明显的场景之一。'
  },
  {
    id: 's94', cat: 'syntax', type: 'single', level: 2,
    q: '匿名命名空间（namespace { ... }）的作用是？',
    options: [
      '让其中的名字具有内部链接，仅在当前翻译单元可见（替代 C 风格的 static）',
      '让名字全局可见',
      '加快编译',
      '定义内联函数'
    ],
    ans: [0],
    exp: 'C++11 起匿名命名空间成员自动具有内部链接，可用于定义只在本 .cpp 内使用的辅助函数/变量，避免污染全局符号表。'
  },
  {
    id: 's95', cat: 'syntax', type: 'multi', level: 3,
    q: '关于单一定义规则（ODR），正确的说法有？（多选）',
    options: [
      '同一翻译单元内，一个类/模板/内联函数可以被多次声明但只能有一次定义',
      '整个程序中，非内联函数与变量只能有一个定义',
      'inline 函数与类模板可以在多个翻译单元中定义，但各处的定义必须完全一致',
      '头文件里随意定义普通函数不会有任何问题'
    ],
    ans: [0, 1, 2],
    exp: '违反 ODR（如两个 .cpp 中的同名类定义不同）属于未定义行为，且往往不报错，是极难排查的一类 bug。'
  },
  {
    id: 's96', cat: 'syntax', type: 'single', level: 2,
    q: 'std::variant 与 std::any 的主要区别是？',
    options: [
      '两者完全相同',
      'variant 是类型安全的"有限类型联合"（编译期已知候选类型），any 可保存任意类型（运行期查询）',
      'any 更快且无分配',
      'variant 只能存一个 int'
    ],
    ans: [1],
    exp: 'variant<int, string> 可用 std::visit 做类型安全的分发，编译器可检查是否覆盖所有分支；any 需 any_cast，写错类型会抛 bad_any_cast。'
  },
  {
    id: 's97', cat: 'syntax', type: 'judge', level: 2,
    q: '函数返回局部对象的引用是错误的（悬垂引用），但返回局部对象的值是正确的（有 RVO/移动语义兜底）。',
    options: ['正确', '错误'],
    ans: [0],
    exp: '正确。返回静态局部对象或成员/全局对象的引用是合法的；返回临时对象的引用则一定错误。编译器通常会对"返回局部变量引用"给出警告。'
  },
  {
    id: 's98', cat: 'syntax', type: 'single', level: 2,
    q: '循环中拼接大量字符串（s += part）效率较低，主要原因是？',
    options: [
      '字符串不可拼接',
      '可能多次重新分配内存与拷贝，应先用 reserve 预留容量',
      '+= 运算符有锁',
      '编译器禁止'
    ],
    ans: [1],
    exp: 'std::string 多有小字符串优化（SSO，通常 15 字节内联），超过后才会堆分配；预计算总长度后 reserve 可把拼接降到单次分配，是最直接的优化手段。'
  },
  {
    id: 's99', cat: 'syntax', type: 'multi', level: 1,
    q: '下列有助于写出更安全、更现代的 C++ 代码的实践有？（多选）',
    options: [
      '用 RAII 与智能指针管理资源，避免裸 new/delete',
      '尽量使用 const 与引用传参，减少拷贝与意外修改',
      '用容器与算法代替裸数组与手写循环',
      '用 const / constexpr / enum class / inline 代替宏'
    ],
    ans: [0, 1, 2, 3],
    exp: '现代 C++ 的核心准则可以概括为：让编译器帮你检查错误，让类型系统表达意图，让资源的生命周期绑定到作用域。'
  },
  {
    id: 's100', cat: 'syntax', type: 'single', level: 2,
    q: '数组作为函数参数时会退化为什么？如何在函数中保留数组长度信息？',
    options: [
      '退化为指向首元素的指针，sizeof 失效；改用 std::array / vector，或用数组引用参数 void f(int (&a)[10])',
      '仍是完整数组类型',
      '退化为 void*',
      '会自动传入长度'
    ],
    ans: [0],
    exp: 'void f(int a[10]) 与 void f(int* a) 完全等价，10 会被忽略，这是 C 风格数组最常见的坑。数组引用参数能在编译期保留长度，也可配合模板推导 template<size_t N> void f(int (&a)[N])。'
  }
]

/* ---- 工具方法 ---- */
// 扩充题库分片（data/bank/*.js）：小程序走 require，浏览器走全局 BANK_ALL
var BANK = []
if (typeof BANK_ALL !== 'undefined') {
  BANK = BANK_ALL
} else if (typeof require === 'function') {
  try { BANK = require('./bank/index.js') } catch (e) { BANK = [] }
}

var BASE = CORE.concat(BANK)

// 说明：开源题库不再打包进小程序包体。
// 用户第一次进入时由 utils/sources.js 在线拉取（jsDelivr / 开放 API），
// 转换为本格式后缓存到本地 Storage，包体里只有中文基础题。
var EXTRA = []                 // 在线加载 + 粘贴导入的题目（运行时才有）
var QUESTIONS = BASE.concat(EXTRA)
var MAP = {}

function rebuild() {
  QUESTIONS = BASE.concat(EXTRA)
  MAP = {}
  QUESTIONS.forEach(function (q) { MAP[q.id] = q })
  if (typeof CppQuizData !== 'undefined' && CppQuizData) {
    CppQuizData.QUESTIONS = QUESTIONS
  }
}

/** 设置在线导入的题库，传入空数组即恢复内置题库 */
function setExtra(list) {
  EXTRA = (list && list.length) ? list : []
  rebuild()
  return QUESTIONS.length
}

function getExtra() { return EXTRA }

/**
 * 按 id 查题：先查索引，查不到再线性找一遍并顺手补进索引。
 * —— 索引（MAP）没建好时也要能用，绝不能让错题本 / 收藏 / 结果页静默变空。
 */
function findById(id) {
  if (!id) return null
  var q = MAP[id]
  if (q) return q
  for (var i = 0; i < QUESTIONS.length; i++) {
    if (QUESTIONS[i].id === id) {
      MAP[id] = QUESTIONS[i]
      return QUESTIONS[i]
    }
  }
  return null
}

function getById(id) { return findById(id) }

function getByIds(ids) {
  var out = []
  ;(ids || []).forEach(function (id) {
    var q = findById(id)
    if (q) out.push(q)
  })
  return out
}

function filterByCat(cat) {
  if (!cat) return QUESTIONS.slice()
  return QUESTIONS.filter(function (q) { return q.cat === cat })
}

function countByCat(cat) { return filterByCat(cat).length }

var CppQuizData = {
  CATEGORIES: CATEGORIES,
  QUESTIONS: QUESTIONS,
  getById: getById,
  getByIds: getByIds,
  filterByCat: filterByCat,
  countByCat: countByCat,
  setExtra: setExtra,
  getExtra: getExtra
}

// 模块加载时先建一次索引。
// 之前只在 setExtra() 里 rebuild，而没有在线题库缓存时永远不会走到那里，
// 导致 MAP 一直是空对象 —— 错题本、收藏、结果页的逐题解析全部查不到题（v2.5 修）。
rebuild()

// 兼容：小程序 require + 浏览器 <script> 直接加载
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CppQuizData
}

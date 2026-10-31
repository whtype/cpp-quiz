/* 题库分片 1 · C++ 语法基础（类型 / 指针 / 内存 / 类） 50 题 */
var P1 = [
  {
    id: 's101', cat: 'syntax', type: 'single', level: 1,
    q: '对于 class Empty {};，C++ 标准对 sizeof(Empty) 的保证是？',
    options: ['一定为 0', '至少 1 字节，常见实现为 1', '一定等于指针大小', '编译错误'],
    ans: [1],
    exp: '完整空类对象必须占据空间，所以 sizeof(Empty) 至少为 1；常见实现为 1，但标准没有规定固定值，对齐等实现要求可能影响大小。空基类优化（EBO）允许空基类子对象不额外占用派生类空间，并不意味着 sizeof(Empty) 为 0。'
  },
  {
    id: 's102', cat: 'syntax', type: 'single', level: 1,
    q: '关于指针和引用的区别，下列说法错误的是？',
    options: [
      '引用必须在定义时初始化，指针可以不初始化',
      '引用一旦绑定就不能改绑到别的对象，指针可以改变指向',
      '可以声明指向引用的指针，例如 int&* p',
      'sizeof 一个引用得到的是被引用对象的大小，sizeof 指针得到指针本身大小'
    ],
    ans: [2],
    exp: 'C 项错误：引用不是对象，「引用的指针」int&* 不合法。指针的引用却合法，例如 int* p = nullptr; int*& r = p;。对引用表达式取地址得到的是被引用对象的地址，sizeof 引用表达式得到的也是被引用类型的大小。'
  },
  {
    id: 's103', cat: 'syntax', type: 'single', level: 2,
    q: '以下指针类型中，p 本身不可改指向，但所指 int 可通过 p 修改的是？（假设定义时已正确初始化）',
    options: ['const int* p', 'int const* p', 'int* const p', 'const int* const p'],
    ans: [2],
    exp: '看 const 在 * 的哪一侧：在左边（const int* / int const*）修饰的是所指对象，指针本身可改，所以 p 可以指向别处但不能改 *p；在右边（int* const）修饰的是指针本身，p 不能改指向但可以改 *p。两边都有（const int* const）则是双保险。口诀「const 在 * 右边，指针锁死」。'
  },
  {
    id: 's104', cat: 'syntax', type: 'single', level: 1,
    q: '函数内的 static 局部变量，其存储期是？',
    options: ['函数调用期间', '整个程序运行期间', '从第一次调用到程序结束', '由编译器决定，不可预期'],
    ans: [1],
    exp: 'static 局部变量具有静态存储期，其存储持续整个程序运行期间。存储期不同于对象生命周期：生命周期通常在初始化完成后才开始。需要动态初始化的局部 static 在控制流首次经过声明时初始化；C++11 起并发首次进入时会等待初始化完成，若初始化抛异常则下次会重试。'
  },
  {
    id: 's105', cat: 'syntax', type: 'single', level: 2,
    q: 'void f(int a[10]) 中的 10 有什么作用？',
    options: ['限定只能传长度 10 的数组', '没有作用，等价于 void f(int* a)', '在编译期检查长度是否匹配', '让 sizeof(a) 返回 40'],
    ans: [1],
    exp: '数组作形参会退化为指向首元素的指针，方括号里的长度被完全忽略，void f(int a[10]) 与 void f(int* a) 等价，sizeof(a) 得到的是指针大小。想真正保留长度得用数组引用 void f(int (&a)[10])，或用模板 template<size_t N> void f(int (&a)[N])。'
  },
  {
    id: 's106', cat: 'syntax', type: 'single', level: 1,
    q: '字符串字面量 "hello" 的类型是什么？',
    options: ['const char*', 'char*', 'const char[6]', 'std::string'],
    ans: [2],
    exp: '在 C++ 中普通字符串字面量的类型是 const char[N]，N 包含结尾的 \\0，所以 "hello" 是 const char[6]。它可退化成 const char*，但数组类型与指针类型不同。C++11 前允许但已弃用到 char* 的转换，C++11 起不再允许该隐式转换；任何 C++ 版本中，试图修改字符串字面量都是未定义行为。'
  },
  {
    id: 's107', cat: 'syntax', type: 'single', level: 1,
    q: '表达式 5 & 3 的结果是？',
    options: ['1', '7', '8', '2'],
    ans: [0],
    exp: '按位与：5 = 101，3 = 011，逐位相与得 001 = 1。容易和逻辑与混淆：5 && 3 的结果是 true（非零即真）。相关的还有 5 | 3 = 7，5 ^ 3 = 6，~5 = -6（补码）。'
  },
  {
    id: 's108', cat: 'syntax', type: 'single', level: 2,
    q: 'sizeof(char) + sizeof(short) 的值一定是？',
    options: ['固定为 3', '至少 2，具体看平台', '固定为 4', '可以是任意非负值'],
    ans: [1],
    exp: '标准保证 sizeof(char) == 1、sizeof(short) >= 1，所以和至少为 2。short 至少 16 位，但字节的位数 CHAR_BIT 不一定是 8；若 CHAR_BIT 为 16，sizeof(short) 可以是 1，和就是 2。常见 8 位字节、2 字节 short 的实现中结果为 3。'
  },
  {
    id: 's109', cat: 'syntax', type: 'single', level: 2,
    q: '用 == 比较两个 double 是否相等，最容易出的问题是？',
    options: [
      'double 不能使用 == 运算符',
      '浮点误差会让数学上相等的两个值比较出不相等',
      '== 比较的是地址',
      '会触发隐式类型转换导致结果反转'
    ],
    ans: [1],
    exp: '0.1 + 0.2 != 0.3 是经典例子：二进制无法精确表示 0.1，累加后末位有误差。正确做法是判断 |a - b| < epsilon（如 1e-9），或用 std::abs 配合相对误差。注意 == 本身可以编译通过，只是结果不可靠。'
  },
  {
    id: 's110', cat: 'syntax', type: 'single', level: 2,
    q: 'new 与 malloc 的关键区别，不包括下面哪一条？',
    options: [
      'new 会调用构造函数，malloc 只分配内存',
      'new 失败抛 bad_alloc，malloc 失败返回 NULL',
      'new 分配的内存必须用 delete 释放',
      'new 只能分配单个对象，不能分配数组'
    ],
    ans: [3],
    exp: 'new 完全可以分配数组：new int[10]，配套 delete[]。其余三条都是真实区别：new 是运算符、会构造对象、失败抛异常；malloc 是函数、只给原始内存、失败返回 NULL。混用 new/delete 与 malloc/free 是未定义行为。'
  },
  {
    id: 's111', cat: 'syntax', type: 'single', level: 1,
    q: 'int* p = new int(7); delete p; 之后立即解引用 p 读取原对象，属于？',
    options: ['合法，delete 会自动把 p 置空', '未定义行为，p 成为悬垂指针', '编译错误', '运行时一定崩溃，可放心依赖'],
    ans: [1],
    exp: 'delete 只释放所指内存，不会把指针本身置为 nullptr，之后 p 就是悬垂指针（dangling pointer），解引用是未定义行为——可能读到脏数据、可能崩溃、也可能「看起来正常」。所以惯用法是 delete p; p = nullptr;。'
  },
  {
    id: 's112', cat: 'syntax', type: 'single', level: 2,
    q: '调用方在被引用的原对象仍存活时使用返回值，下列哪种返回引用的方式不会因函数返回而悬空？',
    options: ['返回函数内普通局部变量的引用', '返回已 delete 的堆对象的引用', '返回传入的左值引用参数所引用对象的引用', '返回函数按值形参的引用'],
    ans: [2],
    exp: 'C 项引用的仍是调用方提供的原对象，题设保证该对象在使用时仍存活，因此不会悬空。普通局部对象和按值形参不会持续存活到调用方后续使用时，已 delete 的对象也已结束生命周期。返回引用本身不延长对象的生命周期；返回 static 局部对象的引用通常也不会因函数返回而悬空。'
  },
  {
    id: 's113', cat: 'syntax', type: 'judge', level: 2,
    q: '编译器会为每个类自动生成默认构造函数、拷贝构造函数、拷贝赋值运算符和析构函数。',
    options: ['正确', '错误'],
    ans: [1],
    exp: '只在「需要且未被用户声明」时才隐式生成。只要你写了任何一个构造函数，默认构造函数就不再生成；写了析构函数，编译器仍会生成拷贝构造，但这个行为已被标记为过时（deprecated）。此外声明了移动操作后，拷贝操作会被删除。所以说「每个类都会自动生成」是错的。'
  },
  {
    id: 's114', cat: 'syntax', type: 'single', level: 2,
    q: '假设 A 的拷贝构造与拷贝赋值均可用、未声明移动操作，且下列场景不发生拷贝消除，哪项不调用拷贝构造函数？',
    options: [
      '用同类型对象初始化新对象：A b = a;',
      '以同类型左值调用按值传参函数：f(a)，其中 void f(A);',
      '函数按值返回同类型普通局部对象',
      '把对象赋给已存在的同类型对象：b = a;'
    ],
    ans: [3],
    exp: 'b = a 对已存在的对象调用拷贝赋值运算符。题设排除了移动操作与拷贝消除，其余三项均需构造新对象，因此调用拷贝构造。实际代码中按值返回局部对象还可能发生 NRVO 或隐式移动，不能一概认定为拷贝。'
  },
  {
    id: 's115', cat: 'syntax', type: 'single', level: 1,
    q: '赋值表达式 a = b = c 按运算符结合性如何分组？',
    options: ['从左到右', '从右到左', '由编译器决定', '同时求值'],
    ans: [1],
    exp: '赋值运算符从右向左结合，表达式分组为 a = (b = c)。结合性只描述分组，不是任意操作数的求值顺序规则。例如 a = f() + g() 中，C++17 起 f 与 g 的调用先后仍未指定。'
  },
  {
    id: 's116', cat: 'syntax', type: 'single', level: 2,
    q: 'int a[5]; sizeof(a) / sizeof(a[0]) 的结果是？',
    options: ['5', '1', '指针大小除以 4', '取决于是否发生数组退化'],
    ans: [0],
    exp: 'a 的类型是 int[5]，sizeof(a) = 5 * sizeof(int)，除以 sizeof(a[0]) 后恒为 5，不需要假设 int 的字节数。若函数形参声明为 int a[]，它会被调整为 int*，函数内 sizeof(a) 得到指针大小，不能再用此公式求原数组长度。数组引用参数则能保留长度信息。'
  },
  {
    id: 's117', cat: 'syntax', type: 'single', level: 2,
    q: 'int (*p)[10] 和 int* p[10] 的区别是？',
    options: [
      '前者是数组，后者是指针',
      '前者是指向含 10 个 int 的数组的指针，后者是含 10 个 int 指针的数组',
      '两者完全等价',
      '前者非法，后者合法'
    ],
    ans: [1],
    exp: 'int (*p)[10] 中括号使 p 先与 * 结合，p 是指向 int[10] 的指针，sizeof(*p) = 10 * sizeof(int)。int* p[10] 中 p 先与 [] 结合，p 是含 10 个 int* 的数组，sizeof(p) = 10 * sizeof(int*)。具体字节数依赖目标实现，不能仅凭系统位数推导。'
  },
  {
    id: 's118', cat: 'syntax', type: 'single', level: 2,
    q: 'typedef void (*Func)(int); 声明的是？',
    options: ['一个返回 void* 的函数', '一个指向「参数为 int、返回 void」的函数的指针类型', '一个函数声明', '一个返回函数指针的函数'],
    ans: [1],
    exp: 'Func 是一个类型别名，代表「函数指针类型」，所以 Func f = &myFunc; 是合法的。对比 void (*signal(int, void(*)(int)))(int) 那种「返回函数指针的函数」——那才是函数声明。用 using Func = void(*)(int); 可读性更好，C++11 起推荐 using。'
  },
  {
    id: 's119', cat: 'syntax', type: 'single', level: 1,
    q: '宏 #define MAX(a,b) ((a)>(b)?(a):(b)) 的主要缺陷是？',
    options: [
      '不能用于浮点数',
      '参数会被重复求值，且没有类型检查',
      '展开后一定比内联函数慢',
      '宏不能带参数'
    ],
    ans: [1],
    exp: 'MAX(i++, j) 会展开成 ((i++)>(j)?(i++):(j))，i 可能自增两次；而且宏在预处理阶段做纯文本替换，没有类型检查、难以调试。正确做法是 inline 函数或模板（C++20 起还有 std::max 的 constexpr 版本）。宏只适合做条件编译和字符串化。'
  },
  {
    id: 's120', cat: 'syntax', type: 'single', level: 2,
    q: '关于 inline 函数，说法正确的是？',
    options: [
      'inline 保证函数一定被内联展开',
      'inline 是对编译器的建议，是否展开由编译器决定',
      'inline 函数不能有返回值',
      'inline 只能用于成员函数'
    ],
    ans: [1],
    exp: 'inline 的现代含义主要是「允许在多个翻译单元中重复定义而不违反 ODR」，是否真的展开完全由编译器权衡（函数体过大、含递归、取地址时通常不展开）。它不能保证性能，也不是语法上的强制。'
  },
  {
    id: 's121', cat: 'syntax', type: 'single', level: 2,
    q: 'void f(int); void f(double); 调用 f(1) 会？',
    options: ['编译错误，产生二义性', '调用 f(int)', '调用 f(double)', '调用哪个不确定'],
    ans: [1],
    exp: '1 的类型是 int，与 f(int) 精确匹配，优先级最高，所以选 f(int)。如果只有 f(double) 和 f(long)，f(1) 就产生二义性了——因为 int→double 与 int→long 都是标准转换，谁也不比谁更优。重载决议的顺序是：精确匹配 > 提升 > 标准转换 > 用户自定义转换。'
  },
  {
    id: 's122', cat: 'syntax', type: 'single', level: 2,
    q: 'void f(int a, int b = 1, int c); 这样的声明？',
    options: ['合法', '不合法：默认参数右侧不能再有无默认值的参数'],
    ans: [1],
    exp: '默认参数必须从右往左连续给出。f(int a, int b = 1, int c) 中 b 有默认值而它右边的 c 没有，调用 f(1, 2) 时无法确定 c，所以非法。另外默认参数只能在一个声明中指定（通常在头文件），不能在声明和定义里各写一份。'
  },
  {
    id: 's123', cat: 'syntax', type: 'single', level: 2,
    q: '类中 static 成员变量的特点是？',
    options: [
      '每个对象一份，随对象创建',
      '属于类而不属于对象，所有对象共享同一份',
      '只能在构造函数里初始化',
      '不能被 const 修饰'
    ],
    ans: [1],
    exp: 'static 成员变量不属于任何对象，存在静态区，必须在类外定义（C++17 起可用 inline static 在类内定义）。它没有 this 指针，所以 static 成员函数不能访问非静态成员。常见坑：类内写 static int n = 0; 在 C++17 前只是声明，链接期会报未定义。'
  },
  {
    id: 's124', cat: 'syntax', type: 'single', level: 2,
    q: '在 const 成员函数里，this 指针的类型是？',
    options: ['A*', 'const A*', 'A* const', 'const A* const'],
    ans: [3],
    exp: '非 const 成员函数里 this 的类型是 A* const（指针本身不可改），const 成员函数里则变成 const A* const——既不能改指向，也不能通过它修改对象。这正是 const 成员函数不能修改普通成员变量的原因。想在里面改某个成员，需要把它声明成 mutable。'
  },
  {
    id: 's125', cat: 'syntax', type: 'single', level: 2,
    q: 'mutable 关键字的作用是？',
    options: [
      '让成员变量可以被 const 成员函数修改',
      '让变量成为线程局部的',
      '让成员变量不参与拷贝',
      '让变量可以被多个线程同时写'
    ],
    ans: [0],
    exp: 'mutable 成员可以在 const 成员函数里被修改，典型用途是缓存、引用计数、互斥锁——它们逻辑上不改变对象的「可见状态」。注意它和线程安全无关：mutable 只是绕开 const 检查，多个线程同时写仍然需要自己加锁。'
  },
  {
    id: 's126', cat: 'syntax', type: 'single', level: 2,
    q: '构造函数加 explicit 的目的是？',
    options: [
      '禁止该构造函数被用于隐式类型转换',
      '让构造函数执行更快',
      '禁止拷贝构造',
      '让构造函数可以被继承'
    ],
    ans: [0],
    exp: 'explicit 阻止单参构造函数参与隐式转换。比如 explicit A(int); 之后 A a = 1; 和 void f(A); f(1); 都会编译失败，必须显式写 A(1)。这是防止「意外的隐式转换」最有效的手段，标准库里的 vector<int> v(10) 能过而 v = 10 不行就是这个道理。'
  },
  {
    id: 's127', cat: 'syntax', type: 'single', level: 2,
    q: '基类析构函数不加 virtual 会怎样？',
    options: [
      '没有任何影响',
      '通过基类指针 delete 派生类对象时，派生类析构函数不会被调用，导致资源泄漏',
      '派生类无法析构',
      '编译报错'
    ],
    ans: [1],
    exp: 'delete basePtr 时，如果析构函数不是虚的，只按静态类型调用 Base::~Base，派生类的析构逻辑被跳过，派生类独有的资源（堆内存、文件句柄）泄漏——这是未定义行为。规则：只要类可能被当作基类多态使用，析构函数就必须 virtual。'
  },
  {
    id: 's128', cat: 'syntax', type: 'single', level: 1,
    q: '含有纯虚函数的类称为？',
    options: ['密封类', '抽象类，不能直接实例化', '模板类', '友元类'],
    ans: [1],
    exp: '纯虚函数 virtual void f() = 0; 使类成为抽象类，不能创建对象，只能作为接口被继承。注意抽象类可以有构造函数（供派生类调用）、可以有普通成员函数和数据成员，只是不能直接实例化。派生类必须实现所有纯虚函数才能实例化。'
  },
  {
    id: 's129', cat: 'syntax', type: 'single', level: 3,
    q: '多重继承中，类 D 同时继承 B1 和 B2，而 B1、B2 都继承自 A，此时 D 中有几份 A 的子对象？',
    options: ['1 份', '2 份', '0 份', '取决于 A 是否有虚函数'],
    ans: [1],
    exp: '普通多重继承会产生「菱形继承」，D 里有两份 A 子对象，访问 A 的成员时产生二义性，需要写 d.B1::x 消歧。解决办法是虚继承 class B1 : virtual public A，这样只保留一份 A，D 的构造里必须由最派生类直接初始化 A。'
  },
  {
    id: 's130', cat: 'syntax', type: 'single', level: 2,
    q: '对象切片（object slicing）指什么？',
    options: [
      '把大对象拆成小对象存储',
      '派生类对象按值赋给基类对象时，派生类部分被丢弃',
      '把对象分成多个内存块',
      '虚函数表被截断'
    ],
    ans: [1],
    exp: 'Base b = derived; 或 void f(Base b) 传派生类对象时，只会拷贝基类那一部分，派生类的成员和「派生类的虚函数覆盖」全部丢失，之后调用虚函数走的是基类版本。避免方法：用引用或指针（Base& / Base*）传参，或者用智能指针。'
  },
  {
    id: 's131', cat: 'syntax', type: 'single', level: 2,
    q: '类中有指针成员，只写默认拷贝构造函数会有什么后果？',
    options: [
      '编译失败',
      '两个对象指向同一块内存，析构时 double free',
      '自动变成深拷贝',
      '指针会被置空'
    ],
    ans: [1],
    exp: '默认拷贝构造是逐成员的值拷贝，指针成员只是复制地址，于是两个对象共享同一块堆内存：一处修改另一处跟着变，两个对象析构时会对同一块内存 delete 两次，造成崩溃。这就需要自己写拷贝构造做深拷贝，或者用智能指针/容器来管理资源（Rule of Three/Five）。'
  },
  {
    id: 's132', cat: 'syntax', type: 'single', level: 2,
    q: '拷贝赋值运算符里为什么必须先判断自赋值（this != &rhs）？',
    options: [
      '为了提高性能',
      '因为自赋值时先释放自身资源会把源数据也删掉，拷贝到的是野指针',
      'C++ 语法强制要求',
      '防止递归调用'
    ],
    ans: [1],
    exp: '典型写法先 delete[] data; 再按 rhs 的长度分配并拷贝。如果 &rhs == this，delete 之后 rhs.data 也成了野指针，接着 memcpy 就是访问已释放内存。所以要么先判断自赋值，要么用 copy-and-swap 惯用法（先拷贝出临时对象再交换）天然免疫自赋值。'
  },
  {
    id: 's133', cat: 'syntax', type: 'single', level: 2,
    q: '一个函数在获取互斥锁后有多个 return 分支。怎样用 RAII 避免遗漏 unlock？',
    options: [
      '用局部 lock_guard 获取锁，离开作用域时由其析构释放锁',
      '手动记录每次申请和释放',
      '用垃圾回收器回收内存',
      '所有资源都放在全局变量里'
    ],
    ans: [0],
    exp: '局部 lock_guard 在构造时加锁，正常离开作用域或发生异常栈展开时解锁，避免每个 return 分支都手工清理。RAII 的核心是绑定对象生命周期，并不要求所有资源或管理对象都位于栈上；也不保证 abort 等异常终止路径会析构。'
  },
  {
    id: 's134', cat: 'syntax', type: 'single', level: 3,
    q: '关于 noexcept，说法正确的是？',
    options: [
      '标记为 noexcept 的函数绝对不会抛异常',
      '异常试图逸出 noexcept(true) 函数时，会调用 std::terminate',
      'noexcept 只影响性能，不影响行为',
      'noexcept 函数不能调用其他函数'
    ],
    ans: [1],
    exp: 'noexcept（等价于 noexcept(true)）保证异常不逸出函数，函数内部可以抛出并捕获异常。若异常试图逸出则调用 std::terminate；调用前是否展开栈是实现定义的，不能依赖局部对象必定析构。noexcept(false) 允许异常逸出。应按真实异常契约标注，移动构造的 noexcept 也会影响 vector 扩容时的迁移选择。'
  },
  {
    id: 's135', cat: 'syntax', type: 'single', level: 2,
    q: '四种 C++ 转换中，哪个在运行时有类型检查开销？',
    options: ['static_cast', 'dynamic_cast', 'const_cast', 'reinterpret_cast'],
    ans: [1],
    exp: 'dynamic_cast 需要 RTTI，在运行时查虚函数表里的类型信息，转换失败时对指针返回 nullptr、对引用抛 bad_cast。它要求源类型是多态类型（至少有一个虚函数）。其余三种都是编译期的：static_cast 做相关类型转换，const_cast 只改 const/volatile 属性，reinterpret_cast 直接重解释二进制位。'
  },
  {
    id: 's136', cat: 'syntax', type: 'single', level: 3,
    q: '用 const_cast 去掉 const 后修改一个真正定义成 const 的对象，属于？',
    options: ['合法操作', '未定义行为', '编译错误', '只读不写才合法'],
    ans: [1],
    exp: '如果对象本身被定义为 const（如 const int x = 10;），它可能被放在只读段或被编译器常量折叠，此时通过 const_cast 拿到非 const 引用去写，是未定义行为。只有当原对象本身不是 const、只是通过 const 引用/指针传进来时，去掉 const 再写才合法。'
  },
  {
    id: 's137', cat: 'syntax', type: 'single', level: 3,
    q: 'volatile 关键字在 C++ 中的主要作用是？',
    options: [
      '保证多线程访问的原子性',
      '告诉编译器该变量可能被外部改变，禁止优化掉对它的读写',
      '让变量存到寄存器里加速',
      '保证内存顺序'
    ],
    ans: [1],
    exp: 'volatile 只解决「编译器优化」问题，用于内存映射寄存器、信号处理函数共享变量等场景。它不保证原子性、不提供内存屏障、不解决缓存一致性——用它做线程同步是错误的，那是 std::atomic 的职责。这是面试高频陷阱。'
  },
  {
    id: 's138', cat: 'syntax', type: 'single', level: 2,
    q: 'enum class Color { Red, Green }; 与 enum Color { Red, Green }; 相比，优势是？',
    options: [
      '作用域限定，且不会隐式转换成 int',
      '占用内存更小',
      '可以用作模板参数',
      '支持赋值运算符重载'
    ],
    ans: [0],
    exp: 'enum class（scoped enum）的枚举值在枚举类型作用域内，必须写 Color::Red，不会与外部名字冲突；也不会隐式转成整数，避免了与 int 混算的隐患。要转整数必须显式 static_cast<int>。传统 enum 的枚举值会泄漏到外层作用域，而且可隐式转 int。'
  },
  {
    id: 's139', cat: 'syntax', type: 'single', level: 2,
    q: 'union 的所有成员？',
    options: ['各自占用独立内存', '共享同一块内存，同一时刻只有一个成员有效', '必须都是指针类型', '不能包含构造函数'],
    ans: [1],
    exp: 'union 的大小等于最大成员的大小，成员共享起始地址，写入一个成员会覆盖其他成员。C++11 起 union 可以有构造函数和成员函数，但含非平凡成员的 union 需要自己管理构造与析构。常见用途是类型双关（虽然标准做法是 memcpy 或 std::bit_cast）。'
  },
  {
    id: 's140', cat: 'syntax', type: 'single', level: 3,
    q: '关于内存对齐，说法错误的是？',
    options: [
      '成员按声明顺序排列，编译器可能插入填充字节',
      '结构体大小通常是其最大成员对齐值的整数倍',
      '调整成员顺序可能减小结构体大小',
      '使用 #pragma pack(1) 一定能提升访问速度'
    ],
    ans: [3],
    exp: '紧凑打包（pack(1)）会取消对齐填充，让结构体变小，但代价是 CPU 访问未对齐数据可能变慢甚至在部分架构上触发异常，所以它不是「一定能提速」，通常反而更慢。前三条都正确：把 double 放最前面常能减少填充。'
  },
  {
    id: 's141', cat: 'syntax', type: 'single', level: 2,
    q: '下列哪个不是类的默认成员函数？',
    options: ['默认构造函数', '析构函数', '拷贝赋值运算符', 'operator=='],
    ans: [3],
    exp: '编译器只隐式生成六个：默认构造、析构、拷贝构造、拷贝赋值、移动构造、移动赋值（后两个 C++11 起）。operator== 不会自动生成（C++20 可以用 = default 让编译器合成，但也要你显式写）。同理 operator<、operator<< 都不会自动来。'
  },
  {
    id: 's142', cat: 'syntax', type: 'single', level: 2,
    q: '友元函数的特点是？',
    options: [
      '是类的成员函数',
      '不是成员函数，但能访问类的私有成员',
      '只能访问公有成员',
      '会被派生类继承'
    ],
    ans: [1],
    exp: '友元函数定义在类外、没有 this 指针，但被授予访问私有成员的权限。友元关系不被继承，也不能传递（A 是 B 的友元、B 是 C 的友元，不代表 A 能访问 C）。典型用途是重载 operator<<，因为它需要左操作数是 ostream。'
  },
  {
    id: 's143', cat: 'syntax', type: 'single', level: 3,
    q: '为什么 operator<< 通常要重载成非成员函数？',
    options: [
      '成员函数不能重载 <<',
      '因为左操作数是 ostream 而不是本类对象，成员函数形式要求左操作数是本类',
      '非成员函数性能更好',
      '为了支持链式调用'
    ],
    ans: [1],
    exp: '成员函数形式的 operator<< 会被解释成 obj << cout，左操作数必须是本类对象。而我们要写 cout << obj，左操作数是 std::ostream，所以只能写成非成员函数（常声明为 friend 以便访问私有成员）。返回 ostream& 才能链式调用。'
  },
  {
    id: 's144', cat: 'syntax', type: 'single', level: 2,
    q: '类 A 中声明 virtual void f() = 0; 但同时又给了函数体，这意味着？',
    options: [
      '语法错误',
      'A 仍是抽象类，但派生类可以显式调用 A::f()',
      'A 变成普通类',
      'f 变成普通虚函数'
    ],
    ans: [1],
    exp: '纯虚函数可以带函数体（必须在类外定义），类依然是抽象类，派生类仍必须覆盖它。提供函数体的用途是给派生类一个「默认实现」，派生类在覆盖版本里可以写 A::f(); 显式调用。析构函数常这么写：纯虚析构 + 提供定义。'
  },
  {
    id: 's145', cat: 'syntax', type: 'single', level: 2,
    q: '成员初始化列表的顺序由什么决定？',
    options: ['初始化列表里的书写顺序', '成员在类中的声明顺序', '由编译器优化决定', '按成员大小排序'],
    ans: [1],
    exp: '成员按声明顺序初始化，与初始化列表的书写顺序无关。所以如果列表里写 b(a), a(1)，而 a 声明在 b 前面，实际是先初始化 a 再 b——编译器通常给出 -Wreorder 警告。依赖初始化顺序的代码很容易埋 bug，最好让书写顺序与声明顺序一致。'
  },
  {
    id: 's146', cat: 'syntax', type: 'single', level: 3,
    q: '构造函数中可以调用虚函数吗？',
    options: [
      '可以，且会正确调用派生类版本',
      '可以，但此时对象还是基类，调用的是基类版本，不是派生类',
      '不可以，编译报错',
      '只能调用纯虚函数'
    ],
    ans: [1],
    exp: '构造基类子对象期间，对象的动态类型仍是基类，虚函数表还指向基类版本，所以调用的是基类实现。如果调的是纯虚函数且没有定义，会直接崩溃。同理析构期间也一样。这是「不要在构造/析构函数里调用虚函数」这条规则的原因。'
  },
  {
    id: 's147', cat: 'syntax', type: 'single', level: 2,
    q: '关于 const 成员函数重载，说法正确的是？',
    options: [
      'const 与非 const 版本不能同时存在',
      '可以同时存在，const 对象调用 const 版本，非 const 对象优先调用非 const 版本',
      '只有返回值不同才能重载',
      'const 版本会被自动忽略'
    ],
    ans: [1],
    exp: 'const 是函数签名的一部分（修饰隐含的 this），所以 void f(); 与 void f() const; 可以共存并构成重载。非 const 对象调用时优先选非 const 版本。标准库大量用这个技巧，比如 vector::operator[] 的 const 版本返回 const_reference。'
  },
  {
    id: 's148', cat: 'syntax', type: 'single', level: 2,
    q: '以下哪个操作会触发隐式类型转换的坑？',
    options: [
      'if (-1 < sizeof(int)) 恒为真（在 64 位下比较结果与直觉相反）',
      'int x = 3.9; 得到 4',
      'char c = 300;',
      '以上都会'
    ],
    ans: [3],
    exp: '三个都是经典坑。-1 < sizeof(int)：sizeof 返回 size_t（无符号），-1 被转成极大无符号数，比较结果为假，所以这个条件其实是 false。int x = 3.9 是截断得 3，不是四舍五入。char c = 300 溢出，结果由实现定义。开启 -Wconversion 能发现大部分。'
  },
  {
    id: 's149', cat: 'syntax', type: 'single', level: 3,
    q: '为什么 std::vector<bool> 常被认为是「特殊容器」？',
    options: [
      '它不支持 push_back',
      '它按位压缩存储，operator[] 返回代理对象而非 bool&',
      '它不能动态扩容',
      '它不是标准库的一部分'
    ],
    ans: [1],
    exp: 'vector<bool> 为省空间做了位压缩，每个元素只占 1 bit，因此无法返回 bool&，只能返回 std::vector<bool>::reference 代理。由此带来一堆问题：不能取地址、auto 推导出代理类型、多线程写同一字节内的不同位会数据竞争。需要真 bool 数组时用 vector<char> 或 deque<bool>。'
  },
  {
    id: 's150', cat: 'syntax', type: 'single', level: 2,
    q: '前置 ++ 与后置 ++ 在自定义类型上，通常推荐用哪个？为什么？',
    options: [
      '后置，因为语义更自然',
      '前置，因为后置要返回旧值的副本，多一次拷贝构造',
      '两者完全等价',
      '后置，因为可以链式调用'
    ],
    ans: [1],
    exp: '后置 operator++(int) 必须保存旧值并返回副本，多一次构造 + 析构；前置直接自增后返回引用，没有额外开销。对 int 这种内置类型编译器会优化掉，但对迭代器/大对象差别明显。所以循环里习惯写 ++it。'
  }
]

if (typeof module !== 'undefined' && module.exports) module.exports = P1

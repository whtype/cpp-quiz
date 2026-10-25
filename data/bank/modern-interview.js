/* 原创校招/实习面试练习。代码题默认已包含所需标准头文件；引用用于延伸阅读。 */
var MODERN_INTERVIEW = [
  {
    id: 'mi001', cat: 'modern', type: 'single', level: 1,
    q: 'C++14：文件包装类 File 已正确实现析构关闭文件，且析构不抛异常。下列函数提前返回时，局部变量 f 管理的文件会怎样？',
    code: 'int parse() {\n  File f("input.txt"); // 假设打开成功\n  if (!valid_header(f)) return -1;\n  return read_body(f);\n}',
    options: ['退出作用域时由 f 的析构函数关闭', '只有正常运行到最后一个 return 才关闭', '必须在每条 return 前手动关闭', '等待垃圾回收器关闭'], ans: [0],
    exp: '已构造的自动存储期对象在离开作用域时析构，包括提前 return。把资源所有权放进对象后，各个返回路径共享清理逻辑；这不依赖垃圾回收。',
    tags: ['lifetime', 'raii'], followUp: '若 read_body 抛异常呢？要点：异常传播并展开本作用域时也会析构 f；析构应避免抛出异常。',
    reference: {title: 'cppreference RAII', url: 'https://en.cppreference.com/w/cpp/language/raii'}, source: '原创练习'
  },
  {
    id: 'mi002', cat: 'modern', type: 'single', level: 1,
    q: 'C++11：服务启动时用 unique_ptr 创建配置，再转交给另一个独占所有者。下列代码执行后，可以保证什么？',
    code: 'std::unique_ptr<int> a(new int(7));\nstd::unique_ptr<int> b = std::move(a);',
    options: ['a、b 共享同一个所有权控制块', 'a 为空，b 拥有值为 7 的 int', 'a 仍拥有对象，b 只借用指针', 'std::move 会立即销毁这个 int'], ans: [1],
    exp: 'unique_ptr 的移动构造转移所有权，并保证源 unique_ptr 变空。此处应使用该类型明确规定的移动后状态，不能泛化成所有类型被移动后都为空。',
    tags: ['modern', 'raii'], followUp: '为什么接收参数可以写 unique_ptr<T>？要点：按值接口明确接收所有权，调用方通常用 std::move 转交。',
    reference: {title: 'cppreference unique_ptr constructors', url: 'https://en.cppreference.com/w/cpp/memory/unique_ptr/unique_ptr'}, source: '原创练习'
  },
  {
    id: 'mi003', cat: 'modern', type: 'single', level: 1,
    q: 'C++11：接口分别接收整数编号和指针。执行 f(nullptr) 选择哪个重载？',
    code: 'void f(int);\nvoid f(const char*);\n// 调用：f(nullptr);',
    options: ['f(int)', '两个重载都匹配，产生歧义', 'f(const char*)', 'nullptr 不能作为函数实参'], ans: [2],
    exp: 'nullptr 的类型是 std::nullptr_t，可以转换为指针，但不能隐式转换为 int。因此选择指针重载。整数常量 0 则会优先匹配 int 重载。',
    tags: ['modern', 'types'], followUp: '若另加 void f(int*) 呢？要点：两个指针转换都可行，f(nullptr) 会歧义，需要明确目标指针类型。',
    reference: {title: 'cppreference nullptr', url: 'https://en.cppreference.com/w/cpp/language/nullptr'}, source: '原创练习'
  },
  {
    id: 'mi004', cat: 'modern', type: 'single', level: 1,
    q: 'C++17：想原地修改 pair 的第一个元素。执行以下代码后 p.first 是多少？',
    code: 'std::pair<int, int> p{2, 3};\nauto [x, y] = p;\nx = 9;\nauto& [a, b] = p;\na = 6;',
    options: ['2', '9', '代码无法编译', '6'], ans: [3],
    exp: '第一组绑定使用按值创建的隐藏对象，修改 x 不影响 p。第二组 auto& 绑定到 p，修改 a 就修改 p.first，所以结果是 6。',
    tags: ['modern', 'types'], followUp: '遍历 map 时怎样避免复制每个键值对？要点：只读用 const auto& [key, value]，修改映射值可用 auto&。',
    reference: {title: 'cppreference Structured binding declaration', url: 'https://en.cppreference.com/w/cpp/language/structured_binding'}, source: '原创练习'
  },
  {
    id: 'mi005', cat: 'modern', type: 'single', level: 1,
    q: 'C++11：把普通枚举替换为 enum class 后，下面哪条语句能够通过编译？',
    code: 'enum class Status { Ready = 1, Busy = 2 };\nStatus s = Status::Ready;',
    options: ['int n = static_cast<int>(s);', 'int n = s;', 'Status t = 1;', 'bool ok = (s == 1);'], ans: [0],
    exp: '作用域枚举不会隐式转换为整数，整数也不会隐式转换为该枚举。需要整数表示时应显式转换；这有助于避免将状态码和普通数字误混用。',
    tags: ['modern', 'types'], followUp: '如何固定底层类型？要点：声明 enum class Status : unsigned char；仍需考虑枚举值范围。',
    reference: {title: 'cppreference Enumeration declaration', url: 'https://en.cppreference.com/w/cpp/language/enum'}, source: '原创练习'
  },
  {
    id: 'mi006', cat: 'modern', type: 'single', level: 1,
    q: 'C++17：缓存查询用 optional<int> 区分“没有结果”和“结果为零”。以下哪个判断正确？',
    code: 'std::optional<int> result = 0;',
    options: ['if (result) 为假，因为保存的整数为零', 'if (result) 为真，因为 optional 含有值', 'result 必须动态分配一个 int', 'result.value() 会抛 bad_optional_access'], ans: [1],
    exp: 'optional 的布尔转换检查是否含值，不检查内部整数是否为零。这里含有合法结果 0，value() 可以读取它；optional 对象内部保存 T，不为这个 T 单独分配动态存储。',
    tags: ['modern', 'stl'], followUp: '何时使用 value_or(-1)？要点：缺值时提供默认值，但不要让默认值掩盖业务上必须处理的缺失情况。',
    reference: {title: 'cppreference optional operator bool', url: 'https://en.cppreference.com/w/cpp/utility/optional/operator_bool'}, source: '原创练习'
  },
  {
    id: 'mi007', cat: 'modern', type: 'single', level: 1,
    q: 'C++11：为何类 A 中标注 override 的声明编译失败？',
    code: 'struct Base { virtual void run() const {} };\nstruct A : Base { void run() override {} };',
    options: ['override 只能写在基类', '派生类不能覆盖 const 成员函数', '缺少 const，签名不匹配，未覆盖基类虚函数', '必须再次显式写 virtual 才能使用 override'], ans: [2],
    exp: '成员函数的 const 限定参与覆盖匹配。A::run() 没有覆盖 Base::run() const，override 将这个错误暴露在编译期。补上 const 即可，不必重复 virtual。',
    tags: ['modern', 'oop'], followUp: '去掉 override 会怎样？要点：代码可能编译，但 run() 隐藏同名基类函数，通过 Base 引用调用仍走基类实现。',
    reference: {title: 'cppreference override specifier', url: 'https://en.cppreference.com/w/cpp/language/override'}, source: '原创练习'
  },
  {
    id: 'mi008', cat: 'modern', type: 'single', level: 1,
    q: 'C++11：下面计数器执行后，外部 n 与 a、b 的值分别是什么？',
    code: 'int n = 5;\nauto next = [n]() mutable { return ++n; };\nint a = next();\nint b = next();',
    options: ['7、6、7', '5、6、6', '代码无法编译', '5、6、7'], ans: [3],
    exp: '按值捕获在闭包内保存 n 的副本，mutable 允许修改这个副本。两次调用同一闭包会累积状态，但外部 n 仍是 5。',
    tags: ['modern', 'lambda'], followUp: '复制 next 后两个计数器共享计数吗？要点：本题捕获的是 int，闭包复制后各自保存独立副本。',
    reference: {title: 'cppreference Lambda expressions', url: 'https://en.cppreference.com/w/cpp/language/lambda'}, source: '原创练习'
  },
  {
    id: 'mi009', cat: 'modern', type: 'single', level: 1,
    q: 'C++11：希望阻止 Client 被复制，保留其默认构造。哪组声明直接表达此要求？',
    options: ['Client() = default; Client(const Client&) = delete;', 'Client() = delete; Client(const Client&) = default;', 'Client() = default; Client(const Client&) = default;', '只声明 ~Client() = default;'], ans: [0],
    exp: '= delete 明确使所选函数不可用，复制时会得到编译诊断。默认析构不禁止复制；删除默认构造也不等于禁止复制。若要求不可复制赋值，还应删除拷贝赋值运算符。',
    tags: ['modern', 'oop'], followUp: '删掉拷贝构造后移动会自动产生吗？要点：不会，用户声明拷贝构造会抑制隐式移动构造，需要按设计显式提供。',
    reference: {title: 'cppreference Function declaration', url: 'https://en.cppreference.com/w/cpp/language/function'}, source: '原创练习'
  },
  {
    id: 'mi010', cat: 'modern', type: 'single', level: 1,
    q: 'C++11：为防止用户把小数配置误当整数阈值，以下声明中哪一个必须被诊断为不合法？',
    options: ['int n = 3.0;', 'int n{3.0};', 'double n{3};', 'int n{3};'], ans: [1],
    exp: '列表初始化禁止从浮点数到整数的窄化转换，即使 3.0 的数值恰好能表示成整数也不例外。普通拷贝初始化 int n = 3.0 则允许该转换。',
    tags: ['modern', 'types'], followUp: 'int 到 double 总是允许列表初始化吗？要点：需符合窄化规则，常量表达式能精确表示时允许，不能无条件推广。',
    reference: {title: 'cppreference List initialization', url: 'https://en.cppreference.com/w/cpp/language/list_initialization'}, source: '原创练习'
  },
  {
    id: 'mi011', cat: 'modern', type: 'multi', level: 1,
    q: 'C++11：独占资源句柄 Guard 的对象已成功构造且析构不抛异常。关于正常控制流和异常栈展开，哪些说法正确？（多选）',
    options: ['任何局部对象都必须用 new 创建才会析构', '从函数 return 会跳过局部 Guard 的析构', '内层作用域结束时，自动存储期 Guard 会析构', '异常传播并展开所在作用域时，Guard 会析构'], ans: [2, 3],
    exp: '自动对象在正常离开作用域及异常栈展开时清理；资源不必放在堆上。不要把这一保证扩展到 std::abort、std::_Exit 等不执行通常作用域清理的结束方式。',
    tags: ['raii', 'lifetime'], followUp: 'RAII 能保证资源申请成功吗？要点：不能，它保证已获取资源与对象生命周期绑定，申请失败仍需异常或错误处理。',
    reference: {title: 'cppreference Destructors', url: 'https://en.cppreference.com/w/cpp/language/destructor'}, source: '原创练习'
  },
  {
    id: 'mi012', cat: 'modern', type: 'multi', level: 1,
    q: 'C++17：编写只读字符串处理函数 consume(std::string_view s)。调用方保证函数执行期间字符存储有效。哪些说法正确？（多选）',
    options: ['可从 string 或字符串字面量构造视图，避免为视图复制字符', '视图的 data() 一定指向以空字符结尾的完整字符串', '函数若保存视图供以后使用，就需要额外分析底层存储的生命周期', 'string_view 会自动延长任意临时 string 的生命周期'], ans: [0, 2],
    exp: 'string_view 非拥有，可以表示字符串的子区间，因此 data() 后的字符序列不一定在 size() 处有空字符。调用期间有效不代表保存到调用之后仍有效，视图本身不延长源对象寿命。',
    tags: ['lifetime', 'stl'], followUp: '怎样传给要求零结尾的 C 接口？要点：先确认源存储与边界，必要时创建拥有内容并零结尾的 std::string。',
    reference: {title: 'cppreference basic_string_view', url: 'https://en.cppreference.com/w/cpp/string/basic_string_view'}, source: '原创练习'
  },
  {
    id: 'mi013', cat: 'modern', type: 'single', level: 2,
    q: 'C++14：下面 g 对同一个参数先直接传递、再用 forward 传递。g(5) 输出什么？',
    code: 'void f(int&) { std::cout << "L"; }\nvoid f(int&&) { std::cout << "R"; }\ntemplate<class T> void g(T&& x) {\n  f(x);\n  f(std::forward<T>(x));\n}\n// 调用：g(5);',
    options: ['LL', 'LR', 'RR', 'RL'], ans: [1],
    exp: 'g(5) 推导 T 为 int，参数类型为 int&&，但具名表达式 x 是左值，因此首次选择 int&。forward<int>(x) 产生 xvalue，第二次选择 int&&。',
    tags: ['templates', 'move'], followUp: '改成 int a=5; g(a) 呢？要点：T 推导为 int&，引用折叠后两次都传左值，输出 LL。',
    reference: {title: 'cppreference forward', url: 'https://en.cppreference.com/w/cpp/utility/forward'}, source: '原创练习'
  },
  {
    id: 'mi014', cat: 'modern', type: 'single', level: 2,
    q: 'C++11：移动一个 const 对象时，下列构造选择及其原因是什么？',
    code: 'struct X {\n  X() = default;\n  X(const X&) { std::cout << "copy"; }\n  X(X&&) { std::cout << "move"; }\n};\nconst X a;\nX b(std::move(a));',
    options: ['输出 move，因为调用了 std::move', '无法编译，因为 const 对象不能复制', '输出 copy，因为 const X&& 不能绑定到 X&&', '输出 copy 和 move，先复制再移动'], ans: [2],
    exp: 'std::move 保留 const，结果为 const X&&。移动构造的 X&& 不能去掉 const，而 const X& 能绑定该表达式，因此选择拷贝构造。move 只是转换值类别，不能强制选移动构造。',
    tags: ['move', 'types'], followUp: '为什么常见移动构造不接收 const X&&？要点：转移资源通常要修改源对象，const 会阻止这种操作。',
    reference: {title: 'cppreference move', url: 'https://en.cppreference.com/w/cpp/utility/move'}, source: '原创练习'
  },
  {
    id: 'mi015', cat: 'modern', type: 'single', level: 2,
    q: 'C++17：只评估 f 与 g 的返回类型，下面哪个结论正确？',
    code: 'int value = 4;\ndecltype(auto) f() { return value; }\ndecltype(auto) g() { return (value); }',
    options: ['两者都返回 int', '两者都返回 int&', 'f 返回 int&，g 返回 int', 'f 返回 int，g 返回 int&'], ans: [3],
    exp: 'decltype(auto) 使用 decltype 规则。不加括号的名字 value 使用所声明类型 int；(value) 是普通左值表达式，得到 int&。这里 value 是全局对象，g 返回的引用不会因函数返回悬空。',
    tags: ['types', 'modern'], followUp: '若 value 是 g 的局部变量会怎样？要点：g 返回悬空引用，后续通过它访问已经销毁的对象会产生未定义行为。',
    reference: {title: 'cppreference decltype', url: 'https://en.cppreference.com/w/cpp/language/decltype'}, source: '原创练习'
  },
  {
    id: 'mi016', cat: 'modern', type: 'single', level: 2,
    q: 'C++17：下面两个变量的类型分别是什么？采用包含已采纳缺陷修正的 C++17 规则。',
    code: 'auto a{7};\nauto b = {7};',
    options: ['int；std::initializer_list<int>', '两者都是 int', '两者都是 std::initializer_list<int>', 'std::initializer_list<int>；int'], ans: [0],
    exp: 'auto 的单元素直接列表初始化推导为元素类型 int；带等号的列表初始化推导为 initializer_list<int>。花括号的不同写法并不总具有相同推导语义。',
    tags: ['types', 'modern'], followUp: 'auto a{1,2} 呢？要点：直接列表初始化推导 auto 要求恰好一个元素，此声明不合法。',
    reference: {title: 'cppreference Placeholder type specifiers', url: 'https://en.cppreference.com/w/cpp/language/auto'}, source: '原创练习'
  },
  {
    id: 'mi017', cat: 'modern', type: 'single', level: 2,
    q: 'C++17：函数 A 和 B 都试图返回字符串视图，下列判断正确的是？',
    code: 'std::string_view A() { return "ready"; }\nstd::string_view B() { return std::string("ready"); }',
    options: ['A、B 返回的视图都拥有字符', 'A 指向静态存储期字符；B 返回后视图悬空', 'A 返回后悬空；B 的临时 string 会自动延寿', '两者都必须编译失败'], ans: [1],
    exp: '字符串字面量具有静态存储期，A 的视图保持有效。B 的临时 string 在返回表达式所在完整表达式结束时销毁，视图不拥有它；不能为之后访问指定确定输出。',
    tags: ['lifetime', 'stl'], followUp: 'B 应如何修改？要点：若需要返回新生成的字符串，应返回 std::string，让调用方拥有数据。',
    reference: {title: 'cppreference basic_string_view', url: 'https://en.cppreference.com/w/cpp/string/basic_string_view'}, source: '原创练习'
  },
  {
    id: 'mi018', cat: 'modern', type: 'single', level: 2,
    q: 'C++17：此引用参数原样返回函数是否能继续延长临时 string 的生命周期？在初始化 r 的分号之后，哪项正确？',
    code: 'const std::string& echo(const std::string& s) { return s; }\nconst std::string& r = echo(std::string("abc"));',
    options: ['临时对象与 r 同寿命', '临时对象在 echo 进入前已销毁', '临时对象已销毁，r 悬空', '编译器必须把临时对象复制到 r'], ans: [2],
    exp: '绑定到引用参数的临时对象存活到包含调用的完整表达式结束，即初始化 r 的分号。通过返回引用再次绑定不能传递延寿效果；函数内部使用 s 是有效的，之后访问 r 不安全。',
    tags: ['lifetime', 'references'], followUp: '直接写 const std::string& r = std::string("abc") 呢？要点：直接绑定可把该临时对象寿命延长至局部引用的寿命。',
    reference: {title: 'cppreference Reference initialization', url: 'https://en.cppreference.com/w/cpp/language/reference_initialization'}, source: '原创练习'
  },
  {
    id: 'mi019', cat: 'modern', type: 'single', level: 2,
    q: 'C++14：如何理解下面初始化捕获之后 p 和 task 的所有权状态？',
    code: 'auto p = std::make_unique<int>(8);\nauto task = [owned = std::move(p)] { return *owned; };',
    options: ['p 与 owned 共享引用计数', 'task 仅借用 p，所以 p 必须活得更久', 'task 可以复制，因为所有 lambda 都可复制', 'p 为空，闭包拥有对象，task 不可复制但可移动'], ans: [3],
    exp: '初始化捕获把 unique_ptr 移动进闭包成员。闭包是否可复制取决于其成员；unique_ptr 不可复制，因此该闭包不可复制，但移动构造可转移所有权。',
    tags: ['lambda', 'move', 'raii'], followUp: '能存入 C++17 的 std::function<int()> 吗？要点：不能，该包装要求目标可复制；可改接口或使用其他支持仅移动目标的包装。',
    reference: {title: 'cppreference Lambda expressions', url: 'https://en.cppreference.com/w/cpp/language/lambda'}, source: '原创练习'
  },
  {
    id: 'mi020', cat: 'modern', type: 'single', level: 2,
    q: 'C++17：make() 返回的类型禁止复制和移动，以下程序是否可以通过编译？析构函数可访问且未删除。',
    code: 'struct Token {\n  Token() = default;\n  Token(const Token&) = delete;\n  Token(Token&&) = delete;\n};\nToken make() { return Token{}; }\nToken t = make();',
    options: ['可以，同类型纯右值直接构造结果对象', '不可以，返回对象必定调用移动构造', '只有开启编译器优化才能通过', '可以，但运行时会调用已删除的拷贝构造'], ans: [0],
    exp: 'C++17 的纯右值语义保证这里直接构造目标对象，无需可用的复制或移动构造。这不同于返回具名局部变量时可选的 NRVO，不能混为“编译器可能优化”。',
    tags: ['modern', 'lifetime', 'move'], followUp: '改为 Token x; return x; 呢？要点：NRVO 不是强制保证；在本题复制、移动都删除的条件下不能依赖 NRVO 使程序合法。',
    reference: {title: 'cppreference Copy elision', url: 'https://en.cppreference.com/w/cpp/language/copy_elision'}, source: '原创练习'
  },
  {
    id: 'mi021', cat: 'modern', type: 'single', level: 2,
    q: 'C++17：为“优化”返回值，把 return result 改成 return std::move(result)。针对同返回类型的非 volatile 局部对象，哪项评审意见准确？',
    options: ['必须这样写，否则总是发生深拷贝', '该改动会使此处不满足 NRVO 的形式条件，可能适得其反', '该改动强制开启 NRVO', 'std::move 会把局部对象的生命周期延长到调用方'], ans: [1],
    exp: 'NRVO 要求返回表达式是符合条件的局部对象名字；std::move(result) 不再是这个形式。原来的 return result 已有针对返回场景的移动重载决议规则，通常无须手动 move。',
    tags: ['move', 'performance'], followUp: '返回成员变量也自动适用 NRVO 吗？要点：不适用；成员不是满足 NRVO 条件的局部自动对象，是否移动应按接口语义判断。',
    reference: {title: 'cppreference Copy elision', url: 'https://en.cppreference.com/w/cpp/language/copy_elision'}, source: '原创练习'
  },
  {
    id: 'mi022', cat: 'modern', type: 'single', level: 2,
    q: 'C++11：X 可拷贝，但移动构造可能抛异常。std::move_if_noexcept(x) 的表达式类型是什么？',
    code: 'struct X {\n  X(const X&);\n  X(X&&) noexcept(false);\n};\n// x 是一个非 const 的 X 左值',
    options: ['X', 'X&&', 'const X&', 'const X&&'], ans: [2],
    exp: '当移动不保证不抛且类型可复制时，move_if_noexcept 返回 const X&，让后续构造可以采用拷贝，帮助维持异常保证。它自身不执行复制或移动。',
    tags: ['move', 'exceptions'], followUp: '若拷贝构造也被删除呢？要点：只能选择移动，因此返回 X&&；容器某些异常保证可能受限。',
    reference: {title: 'cppreference move_if_noexcept', url: 'https://en.cppreference.com/w/cpp/utility/move_if_noexcept'}, source: '原创练习'
  },
  {
    id: 'mi023', cat: 'modern', type: 'single', level: 2,
    q: 'C++11：给只含 unique_ptr 成员的类补上一个默认析构函数后，为什么 std::move 构造可能失败？',
    code: 'struct Owner {\n  std::unique_ptr<int> p;\n  ~Owner() = default;\n};\nOwner a;\nOwner b(std::move(a));',
    options: ['unique_ptr 从来不可移动', '默认析构函数会把 p 变成 const', 'std::move 只能用于函数参数', '用户声明析构函数抑制隐式移动构造，而拷贝因 unique_ptr 被删除'], ans: [3],
    exp: '即使析构函数写成 = default，仍是用户声明的析构函数，会阻止隐式移动构造的生成。退而尝试的拷贝构造又因 unique_ptr 不可复制而被删除。',
    tags: ['move', 'oop'], followUp: '怎样修复？要点：不需要特殊析构时遵循零法则；确实需要时显式设计默认构造、移动构造及移动赋值等特殊成员。',
    reference: {title: 'cppreference Move constructor', url: 'https://en.cppreference.com/w/cpp/language/move_constructor'}, source: '原创练习'
  },
  {
    id: 'mi024', cat: 'modern', type: 'single', level: 2,
    q: 'C++17：第二个成员的构造函数抛异常。假定异常由调用方捕获，哪些析构函数会因这次失败的构造而执行？',
    code: 'struct A { A(); ~A(); };\nstruct B { B() { throw 1; } ~B(); };\nstruct Whole { A a; B b; ~Whole(); };\n// 执行 Whole w;，A 的构造成功',
    options: ['A::~A()；不调用 B::~B() 和 Whole::~Whole()', '仅 Whole::~Whole()', '依次调用 B::~B()、A::~A()、Whole::~Whole()', '没有任何析构函数执行'], ans: [0],
    exp: '完整构造成功的子对象 a 会清理。b 没完成构造，不调用它自身的析构函数；Whole 也未构造完成，不调用 Whole 的析构函数。这正是把资源放进 RAII 成员的价值。',
    tags: ['raii', 'exceptions', 'lifetime'], followUp: '若 a 只是已分配资源的裸指针呢？要点：指针成员自身销毁不会释放所指资源，应使用资源包装类或显式异常清理。',
    reference: {title: 'cppreference try block', url: 'https://en.cppreference.com/w/cpp/language/try'}, source: '原创练习'
  },
  {
    id: 'mi025', cat: 'modern', type: 'single', level: 2,
    q: 'C++11：下面构造函数执行后 a、b 分别是多少？',
    code: 'struct Pair {\n  int a;\n  int b;\n  Pair() : b(9), a(3) { b += a; }\n};\nPair p;',
    options: ['9、12', '3、12', '3、9', '结果未定义，因为初始化列表顺序不同'], ans: [1],
    exp: '非静态数据成员按类内声明顺序初始化，因此先 a=3 再 b=9，然后执行函数体得到 b=12。单纯把初始化列表写反不会造成未定义行为，但容易隐藏成员间依赖错误。',
    tags: ['lifetime', 'oop'], followUp: '为何建议初始化列表与声明顺序一致？要点：便于检查依赖关系，也避免误以为书写顺序控制初始化次序。',
    reference: {title: 'cppreference Constructors and member initializer lists', url: 'https://en.cppreference.com/w/cpp/language/initializer_list'}, source: '原创练习'
  },
  {
    id: 'mi026', cat: 'modern', type: 'single', level: 2,
    q: 'C++11：基类构造期间调用普通虚函数（非纯虚），下面构造 D 时输出什么？',
    code: 'struct B {\n  B() { f(); }\n  virtual void f() { std::cout << "B"; }\n};\nstruct D : B {\n  D() { f(); }\n  void f() override { std::cout << "D"; }\n};\nD d;',
    options: ['DD', 'BB', 'BD', 'DB'], ans: [2],
    exp: 'B 的构造函数执行时虚调用不会分派到尚未完成构造的派生部分，所以先调用 B::f。进入 D 的构造函数体后调用 D::f，输出 BD。',
    tags: ['oop', 'lifetime'], followUp: '基类析构期间会调到派生覆盖吗？要点：不会分派到已经析构的派生部分；构造、析构中的虚调用都受当前阶段限制。',
    reference: {title: 'cppreference Virtual function', url: 'https://en.cppreference.com/w/cpp/language/virtual'}, source: '原创练习'
  },
  {
    id: 'mi027', cat: 'modern', type: 'single', level: 2,
    q: 'C++17：临时记录用大括号初始化引用成员。下列函数内，使用 h.ref 时字符串是否仍存活？',
    code: 'struct Holder { const std::string& ref; };\nvoid test() {\n  Holder h{std::string("data")};\n  std::cout << h.ref;\n}',
    options: ['分号后字符串已销毁', '必须把 ref 改为指针才能延寿', '引用成员永远不能绑定临时对象', '仍存活，大括号聚合初始化在此延长临时对象寿命'], ans: [3],
    exp: '这个自动对象通过大括号聚合初始化，其引用成员绑定的临时对象寿命延长到 h 的寿命。不能把结论无条件迁移到返回对象、new 初始化或构造函数传参绑定等不同场景。',
    tags: ['lifetime', 'references'], followUp: '复制 h 得到另一个 Holder 会再次延寿吗？要点：不会，第二个引用只是指向同一对象，临时对象仍按原来的延寿关系销毁。',
    reference: {title: 'cppreference Reference initialization', url: 'https://en.cppreference.com/w/cpp/language/reference_initialization'}, source: '原创练习'
  },
  {
    id: 'mi028', cat: 'modern', type: 'single', level: 2,
    q: 'C++17：类型别名 R 是 int&。变量 x 的声明类型以及表达式 x 的值类别分别是什么？',
    code: 'int n = 2;\nusing R = int&;\nR&& x = n;',
    options: ['int&；左值', 'int&&；右值', 'int&；右值', '该引用组合不合法'], ans: [0],
    exp: '通过类型别名形成的引用组合会折叠：int& && 得到 int&。表达式 x 是具名变量表达式，为左值。不能用文本中出现 && 就判断其最终类型或表达式类别。',
    tags: ['templates', 'types'], followUp: '哪种组合折叠后仍为右值引用？要点：只有 && 与 && 组合仍为 &&，其余含 & 的组合都折叠为 &。',
    reference: {title: 'cppreference Reference declaration', url: 'https://en.cppreference.com/w/cpp/language/reference'}, source: '原创练习'
  },
  {
    id: 'mi029', cat: 'modern', type: 'single', level: 2,
    q: 'C++17：函数模板需要支持整数和指针。调用 value(3) 的结论是什么？',
    code: 'template<class T> auto value(T x) {\n  if constexpr (std::is_pointer_v<T>) return *x;\n  else return x;\n}',
    options: ['无法编译，因为 *3 不合法', '可编译，T=int 时丢弃依赖类型的指针分支，返回 int 值 3', '可编译，但两个分支在运行时都执行', '返回 int&，因为第一个分支使用了解引用'], ans: [1],
    exp: '实例化 T=int 时，if constexpr 丢弃未选中的依赖分支，不实例化 *x。auto 返回类型仅由未丢弃的返回语句推导，此处为 int。丢弃并不意味着任意语法错误都可隐藏。',
    tags: ['templates', 'modern'], followUp: '改成普通 if 呢？要点：两个分支都需对 T=int 有效，*x 无效，实例化失败。',
    reference: {title: 'cppreference if statement', url: 'https://en.cppreference.com/w/cpp/language/if'}, source: '原创练习'
  },
  {
    id: 'mi030', cat: 'modern', type: 'single', level: 2,
    q: 'C++17：下列无参调用 sum() 的结果是什么？',
    code: 'template<class... Ts> auto sum(Ts... xs) {\n  return (0 + ... + xs);\n}',
    options: ['模板参数包不得为空，编译失败', '未定义行为', '得到 int 值 0', '得到 void'], ans: [2],
    exp: '这是带初始值 0 的二元折叠表达式。空包时结果是初始值，故返回 int 0。若改成不带初始值的加法一元折叠，则空包不合法。',
    tags: ['templates', 'modern'], followUp: '空包一元折叠有哪些内置恒等结果？要点：&& 为 true，|| 为 false，逗号为 void()；不能把加法默认当作 0。',
    reference: {title: 'cppreference Fold expressions', url: 'https://en.cppreference.com/w/cpp/language/fold'}, source: '原创练习'
  },
  {
    id: 'mi031', cat: 'modern', type: 'single', level: 2,
    q: 'C++17：variant 当前保存 string，而业务代码用 get<int> 读取。下列判断正确的是？',
    code: 'std::variant<int, std::string> v = std::string("42");\nint x = std::get<int>(v);',
    options: ['自动把字符串解析为整数 42', '返回整数备选项的默认值 0', '编译错误，因为 int 不是备选类型', '抛出 std::bad_variant_access'], ans: [3],
    exp: 'int 确实是备选类型，但不是当前活跃类型，因此 std::get<int> 抛 bad_variant_access。variant 不负责字符串解析，也不会偷偷切换到所请求的类型。',
    tags: ['stl', 'modern'], followUp: '怎样避免异常式查询？要点：用 std::get_if<int>(&v) 得到指针，类型不匹配时返回 nullptr。',
    reference: {title: 'cppreference get (variant)', url: 'https://en.cppreference.com/w/cpp/utility/variant/get'}, source: '原创练习'
  },
  {
    id: 'mi032', cat: 'modern', type: 'single', level: 2,
    q: 'C++17：移动 optional<unique_ptr<int>> 后，下面哪项是标准保证的状态？',
    code: 'std::optional<std::unique_ptr<int>> a{std::make_unique<int>(4)};\nauto b = std::move(a);',
    options: ['a 仍含值，但其中的 unique_ptr 为空；b 拥有整数 4', 'a 自动变成 nullopt', 'a 和 b 各自拥有一个值为 4 的新 int', '因为 optional 不能存 unique_ptr，所以编译失败'], ans: [0],
    exp: 'optional 的移动构造不清除源 optional 的含值标记，而是移动其内部 T。本题 T 为 unique_ptr，移动后源指针保证为空，所以 a.has_value() 为真但 *a 为空指针。',
    tags: ['move', 'stl'], followUp: '若接口要求取走后无值该怎么做？要点：明确调用 reset，或用 std::exchange 将源 optional 替换为 nullopt。',
    reference: {title: 'cppreference optional constructors', url: 'https://en.cppreference.com/w/cpp/utility/optional/optional'}, source: '原创练习'
  },
  {
    id: 'mi033', cat: 'modern', type: 'single', level: 2,
    q: 'C++20：函数参数为 std::span<int>，由仍存活且未重分配的 vector<int> 构造。函数通过 span 修改元素会怎样？',
    options: ['仅修改 span 保存的元素副本', '修改原 vector 的对应元素，span 自身不拥有这些元素', 'span 会自动获得 vector 的所有权', 'span<int> 只能读取元素'], ans: [1],
    exp: 'span 是连续序列的非拥有视图，span<int> 允许修改底层 int。拷贝 span 只复制视图信息，不复制元素；底层对象销毁或存储失效仍会让视图失效。',
    tags: ['modern', 'stl', 'lifetime'], followUp: 'const std::span<int> 与 std::span<const int> 有何不同？要点：前者视图对象不可赋值但元素仍可改，后者禁止通过视图修改元素。',
    reference: {title: 'cppreference span', url: 'https://en.cppreference.com/w/cpp/container/span'}, source: '原创练习'
  },
  {
    id: 'mi034', cat: 'modern', type: 'single', level: 2,
    q: 'C++20：应用希望用户自定义类型满足“可以把 a+b 转成 T”的要求。下列约束检查发生在什么时候？',
    code: 'template<class T>\nconcept Addable = requires(T a, T b) {\n  { a + b } -> std::convertible_to<T>;\n};',
    options: ['第一次运行到加法时', '每次调用都在运行时计算 a+b', '模板约束检查期间，不会为了检查而执行加法', '只有链接时才能检查'], ans: [2],
    exp: 'requires 表达式在编译期间检查表达式是否有效及结果是否满足类型约束，不执行 a+b。语法可用不等于加法一定无异常或满足交换律，这些需要额外约定。',
    tags: ['templates', 'modern'], followUp: '如何再要求加法表达式不抛异常？要点：复合要求写成 { a + b } noexcept -> std::convertible_to<T>。',
    reference: {title: 'cppreference requires expression', url: 'https://en.cppreference.com/w/cpp/language/requires'}, source: '原创练习'
  },
  {
    id: 'mi035', cat: 'modern', type: 'multi', level: 2,
    q: 'C++14：下面函数在返回之后才被调用的闭包，会遇到哪些生命周期问题？（多选）',
    code: 'auto make_reader() {\n  int local = 9;\n  return [&local] { return local; };\n}',
    options: ['闭包返回时会自动把引用捕获变成值捕获', '闭包对象可以仍存活，但它引用的 local 已销毁', '随后读取 local 属于未定义行为，不能承诺输出 9', '只要闭包可移动，引用对象的生命周期就会延长'], ans: [1, 2],
    exp: '闭包的生命期与被引用对象的生命期独立。引用捕获不会拥有 local，也不会延寿；调用返回后的闭包读取已销毁对象是未定义行为，观察到 9 也不能证明安全。',
    tags: ['lambda', 'lifetime'], followUp: '最直接的修复是什么？要点：本题可按值捕获 local；若要共享可变状态，应明确选择具有合适寿命的所有权机制。',
    reference: {title: 'cppreference Lambda expressions', url: 'https://en.cppreference.com/w/cpp/language/lambda'}, source: '原创练习'
  },
  {
    id: 'mi036', cat: 'modern', type: 'multi', level: 2,
    q: 'C++11：局部 unique_ptr p 原本唯一拥有一个 new 创建的对象。执行 auto raw = p.release(); 后，哪些说法正确？（多选）',
    options: ['p 变空', 'release 立即删除了对象', 'raw 自动获得智能指针的析构行为', '必须把 raw 交给合适所有者或正确释放，否则可能泄漏'], ans: [0, 3],
    exp: 'release 放弃所有权并返回原指针，不调用删除器。p 析构不会再释放这个对象，而裸指针 raw 也不自动清理；这与 reset 的销毁旧对象语义不同。',
    tags: ['raii', 'lifetime'], followUp: '什么时候需要 release？要点：通常是把所有权交给明确接管释放责任的旧式接口，必须确认它使用兼容的释放方式。',
    reference: {title: 'cppreference unique_ptr release', url: 'https://en.cppreference.com/w/cpp/memory/unique_ptr/release'}, source: '原创练习'
  },
  {
    id: 'mi037', cat: 'modern', type: 'multi', level: 2,
    q: 'C++17：头文件中定义 inline int counter = 0;，多个翻译单元均包含它，定义满足 ODR 要求且无动态库边界问题。哪些说法正确？（多选）',
    options: ['所有翻译单元中的该变量必须具有不同地址', '整个程序中是同一个具有外部链接的变量实体', 'inline 自动使 counter++ 具有原子性', '该机制允许符合规则的相同定义出现在多个翻译单元'], ans: [1, 3],
    exp: 'C++17 inline 变量允许多翻译单元定义一个实体，各翻译单元看到同一地址。inline 处理的是定义与链接规则，不提供原子性、锁或线程同步。',
    tags: ['modern', 'linkage'], followUp: '改成头文件中的 static int 呢？要点：内部链接会使每个翻译单元分别拥有一份对象，语义不同。',
    reference: {title: 'cppreference inline specifier', url: 'https://en.cppreference.com/w/cpp/language/inline'}, source: '原创练习'
  },
  {
    id: 'mi038', cat: 'modern', type: 'multi', level: 2,
    q: 'C++20：针对 constexpr 与 consteval 函数，以下说法哪些正确？（多选）',
    options: ['普通 constexpr 函数可以用运行时实参调用', '声明 constexpr 就强制每次调用都在编译期执行', '常量表达式上下文中的 consteval 调用必须满足其立即求值规则', 'consteval 会让返回对象自动具有静态存储期'], ans: [0, 2],
    exp: 'constexpr 允许在满足条件时用于常量求值，也能运行时调用。consteval 定义立即函数，其普通立即调用必须产生常量表达式；这并不会给返回对象赋予静态存储期。',
    tags: ['modern', 'constexpr'], followUp: 'constinit 与 const 有何不同？要点：constinit 要求静态或线程存储期对象进行静态初始化，并不令对象不可修改。',
    reference: {title: 'cppreference consteval specifier', url: 'https://en.cppreference.com/w/cpp/language/consteval'}, source: '原创练习'
  },
  {
    id: 'mi039', cat: 'modern', type: 'single', level: 3,
    q: 'C++17：下面探测重载用于优先选择拥有 size() 的类型。probe(7) 选择哪个候选？',
    code: 'template<class T>\nauto probe(const T& t) -> decltype(t.size(), int{}) { return 1; }\nint probe(...) { return 2; }\n// 调用：probe(7)',
    options: ['返回 1，因为函数模板总是优先', '整个程序编译失败，绝不会考虑省略号重载', '返回 2，返回类型直接上下文中的替换失败移除模板候选', '未定义行为，因为整数没有 size()'], ans: [2],
    exp: 'T=int 时，返回类型中的 t.size() 无效，发生直接上下文中的替换失败，模板候选被移除。省略号重载仍可行，返回 2；这不是运行时对成员进行探测。',
    tags: ['templates', 'types'], followUp: '把 t.size() 移到函数体能保持此效果吗？要点：通常不能；选中模板后函数体实例化错误是硬错误，不属于该处 SFINAE。',
    reference: {title: 'cppreference SFINAE', url: 'https://en.cppreference.com/w/cpp/language/sfinae'}, source: '原创练习'
  },
  {
    id: 'mi040', cat: 'modern', type: 'single', level: 3,
    q: 'C++17：下面转发引用包装器调用 sink 的结果是什么？',
    code: 'void sink(int&) { std::cout << "L"; }\nvoid sink(const int&) { std::cout << "C"; }\nvoid sink(int&&) { std::cout << "R"; }\ntemplate<class T> void wrap(T&& x) { sink(std::forward<T>(x)); }\nconst int n = 1;\nwrap(n);\nwrap(std::move(n));',
    options: ['LR', 'CR', 'CC，但第二次发生了去 const 转换', 'CC，第二次的 const int&& 也只能匹配 const int&'], ans: [3],
    exp: '第一次 T 为 const int&，转发得到 const 左值。第二次 T 为 const int，转发得到 const int&&，不能绑定 int&&，仍匹配 const int&。forward 保留值类别与 const，而不是消除类型限制。',
    tags: ['templates', 'move', 'types'], followUp: '增加 sink(const int&&) 后呢？要点：第二次会选择新增的右值引用重载；是否有业务价值需要另外判断。',
    reference: {title: 'cppreference forward', url: 'https://en.cppreference.com/w/cpp/utility/forward'}, source: '原创练习'
  },
  {
    id: 'mi041', cat: 'modern', type: 'single', level: 3,
    q: 'C++17：三个候选如下。f(p) 的模板偏序与普通重载决议最终选择哪个函数？',
    code: 'template<class T> int f(T) { return 1; }\ntemplate<class T> int f(T*) { return 2; }\nint f(const int*) { return 3; }\nint* p = nullptr;\n// 调用：f(p)',
    options: ['返回 2，T* 模板更特化且无需添加 const', '返回 3，非模板永远优先', '返回 1，按值模板最通用所以优先', '必定歧义'], ans: [0],
    exp: '对 int* 实参，两个模板都可精确匹配，其中 T* 模板通过偏序更特化。普通 f(const int*) 需要限定转换；“非模板优先”不是凌驾于转换序列比较之上的绝对规则。',
    tags: ['templates', 'types'], followUp: '实参改成 const int* 呢？要点：普通重载与模板的转换都精确匹配，非模板优先，选择返回 3 的版本。',
    reference: {title: 'cppreference Overload resolution', url: 'https://en.cppreference.com/w/cpp/language/overload_resolution'}, source: '原创练习'
  },
  {
    id: 'mi042', cat: 'modern', type: 'single', level: 3,
    q: 'C++17：尝试用初始化列表创建仅移动元素的 vector，为什么通常无法编译？',
    code: 'std::vector<std::unique_ptr<int>> items{\n  std::make_unique<int>(1),\n  std::make_unique<int>(2)\n};',
    options: ['vector 根本不允许保存仅移动类型', 'initializer_list 的底层元素是 const，容器不能从中调用 unique_ptr 的普通移动构造', 'make_unique 不能出现在花括号中', 'vector 必须先 reserve 才能初始化'], ans: [1],
    exp: 'initializer_list 暴露 const 元素。vector 的该构造过程需要从这些 const unique_ptr 复制构造元素，而 unique_ptr 不可复制；const 也阻止普通移动。可改用空 vector 后逐个 push_back 移动值。',
    tags: ['move', 'stl', 'types'], followUp: '对初始化列表元素写 std::move 能解决吗？要点：若元素已是 const，move 仍保留 const，不能获得可用的 unique_ptr 移动构造。',
    reference: {title: 'cppreference initializer_list', url: 'https://en.cppreference.com/w/cpp/utility/initializer_list'}, source: '原创练习'
  },
  {
    id: 'mi043', cat: 'modern', type: 'single', level: 3,
    q: 'C++17：shared_ptr 的别名构造用于暴露对象成员。owner.reset() 后，下列 member 的状态是什么？无其他线程访问。',
    code: 'struct Node { int value = 6; };\nauto owner = std::make_shared<Node>();\nstd::shared_ptr<int> member(owner, &owner->value);\nowner.reset();',
    options: ['member 立即悬空，因为 Node 已被删除', 'member 指向一个自动复制出来的新 int', 'member 仍可读到 6，共享所有权保持整个 Node 存活', 'member 最后析构时只对 value 执行 delete'], ans: [2],
    exp: '别名 shared_ptr 的存储指针指向 value，而所有权控制块仍管理 Node。owner reset 后 member 保留共享所有权，Node 继续存活；最后释放时销毁管理的 Node，不是单独 delete 成员地址。',
    tags: ['raii', 'lifetime', 'stl'], followUp: 'get() 地址相同能证明共享一个控制块吗？要点：不能，存储指针与所有权关系是两个维度，不应由相同裸指针重复建立独立所有权。',
    reference: {title: 'cppreference shared_ptr constructors', url: 'https://en.cppreference.com/w/cpp/memory/shared_ptr/shared_ptr'}, source: '原创练习'
  },
  {
    id: 'mi044', cat: 'modern', type: 'single', level: 3,
    q: 'C++17：Node 公开继承 enable_shared_from_this<Node>，但对象仅作为局部栈对象创建。调用 n.shared_from_this() 的结果是什么？',
    code: 'struct Node : std::enable_shared_from_this<Node> {};\nNode n;\nauto p = n.shared_from_this();',
    options: ['自动把栈对象变成堆对象', '返回不拥有对象的空 shared_ptr', '创建一个会安全释放栈对象的 shared_ptr', '抛出 std::bad_weak_ptr，因为尚未建立共享所有权'], ans: [3],
    exp: 'enable_shared_from_this 不自行创建所有权。只有适当的 shared_ptr 管理对象时才建立内部弱引用关系；本题内部弱引用为空，C++17 shared_from_this 抛 bad_weak_ptr。',
    tags: ['raii', 'lifetime'], followUp: '在 make_shared 调用的构造函数里调用它是否已安全？要点：通常尚未建立该关系，应在成功创建共享所有者后再调用或通过工厂后置初始化。',
    reference: {title: 'cppreference enable_shared_from_this shared_from_this', url: 'https://en.cppreference.com/w/cpp/memory/enable_shared_from_this/shared_from_this'}, source: '原创练习'
  },
  {
    id: 'mi045', cat: 'modern', type: 'single', level: 3,
    q: 'C++20：两个函数模板分别约束 integral 与 signed_integral。对 int 实参调用 f(1) 会选择哪一个？',
    code: 'template<std::integral T> int f(T) { return 1; }\ntemplate<std::signed_integral T> int f(T) { return 2; }',
    options: ['返回 2，标准 signed_integral 约束包含 integral 并增加有符号要求', '返回 1，写在前面的模板优先', '返回 1，较弱约束永远优先', '必定歧义，因为 int 同时满足两个约束'], ans: [0],
    exp: '标准 signed_integral 使用 integral 加上有符号判定定义，因此它的规范化约束包含 integral 的同一原子约束，并更严格。重载排序可利用这种 subsumption 关系选择返回 2 的函数。',
    tags: ['templates', 'modern'], followUp: '逻辑上更强的任意布尔表达式都能被识别吗？要点：不能，约束包含关系依据规范化原子约束的身份，不是一般数学定理证明。',
    reference: {title: 'cppreference Constraints and concepts', url: 'https://en.cppreference.com/w/cpp/language/constraints'}, source: '原创练习'
  },
  {
    id: 'mi046', cat: 'modern', type: 'single', level: 3,
    q: 'C++17：需要让临时对象返回拥有的字符串，而具名对象返回借用引用。以下重载执行后 a 与 b 的类型分别是什么？',
    code: 'struct Record {\n  std::string data = "ok";\n  const std::string& name() const & { return data; }\n  std::string name() && { return std::move(data); }\n};\nRecord r;\ndecltype(auto) a = r.name();\ndecltype(auto) b = Record{}.name();',
    options: ['两者都是 const std::string&', 'a 是 const std::string&，b 是 std::string', 'a 是 std::string，b 是 std::string&&', '两者都是 std::string&&'], ans: [1],
    exp: 'r 是左值，选择 const & 限定重载并返回引用；Record{} 是右值，优先选择 && 限定重载并按值返回 string。decltype(auto) 保留这一区别，使临时 Record 销毁后 b 仍拥有字符串。',
    tags: ['lifetime', 'move', 'types'], followUp: '若 && 重载也返回 const std::string& 呢？要点：引用会指向即将销毁的临时 Record 的成员，不能用引用变量接收后长期使用。',
    reference: {title: 'cppreference Non-static member functions', url: 'https://en.cppreference.com/w/cpp/language/member_functions'}, source: '原创练习'
  },
  {
    id: 'mi047', cat: 'modern', type: 'multi', level: 3,
    q: 'C++17：下面函数是依赖基类的类模板成员。假定 Base<int> 有 public 成员 void run()。哪些修改能正确表达对依赖基类成员的调用？（多选）',
    code: 'template<class T> struct Base;\ntemplate<class T> struct Worker : Base<T> {\n  void work() { /* 此处调用基类 run */ }\n};',
    options: ['直接写 run();，非依赖名字查找必然自动搜索依赖基类', '写 this->run();', '写 Base<T>::run();', '写 typename run();'], ans: [1, 2],
    exp: '模板定义阶段不会按普通非依赖查找搜索依赖基类。this->run() 将访问变为依赖成员访问，Base<T>::run() 显式限定依赖基类；typename 用于指示类型，不能把未声明函数变成可调用成员。',
    tags: ['templates', 'oop'], followUp: '若 run 是虚函数，两种修复完全等价吗？要点：显式限定 Base<T>::run() 会抑制虚分派；this->run() 保留通常的虚调用语义。',
    reference: {title: 'cppreference Dependent names', url: 'https://en.cppreference.com/w/cpp/language/dependent_name'}, source: '原创练习'
  },
  {
    id: 'mi048', cat: 'modern', type: 'multi', level: 3,
    q: 'C++17：PImpl 类在头文件仅前向声明 Impl，并以 unique_ptr<Impl> 持有实现，使用默认删除器。哪些工程处理正确？（多选）',
    code: 'class Service {\n  struct Impl;\n  std::unique_ptr<Impl> impl;\npublic:\n  Service();\n  ~Service();\n};',
    options: ['可在源文件先定义 Impl，再定义 Service::~Service() = default;', 'unique_ptr 的成员声明本身要求 Impl 必须已完整定义', '前向声明足够让所有默认删除器删除操作都合法', '需要执行默认删除器的地方必须能看到完整 Impl，应据此安排析构等函数定义位置'], ans: [0, 3],
    exp: 'unique_ptr 可以持有不完整类型，但默认删除器真正被使用时要求类型完整。把析构定义放在看到 Impl 定义的源文件可满足要求；构造异常清理、reset 和移动赋值等路径也需关注。',
    tags: ['raii', 'types', 'oop'], followUp: '为什么仅把析构声明放到头文件有价值？要点：让调用方不必看到 Impl 细节，同时让删除代码在完整类型可见的位置生成。',
    reference: {title: 'cppreference unique_ptr', url: 'https://en.cppreference.com/w/cpp/memory/unique_ptr'}, source: '原创练习'
  },
  {
    id: 'mi049', cat: 'modern', type: 'single', level: 3,
    q: 'C++17：希望复制赋值有强异常保证。下面 copy-and-swap 方案中，假定 swap 不抛异常且析构不抛，复制临时参数 rhs 失败时左侧对象怎样？',
    code: 'Widget& Widget::operator=(Widget rhs) {\n  swap(*this, rhs);\n  return *this;\n}\n// 执行 lhs = source;，source 是另一 Widget 左值',
    options: ['lhs 已经被清空', 'lhs 一定变成部分复制状态', '赋值函数体尚未进入，lhs 保持原状态', '编译器必须捕获并忽略复制异常'], ans: [2],
    exp: '按值参数先由 source 复制构造，失败时尚未进入赋值函数体，因此 lhs 不变。复制成功后再用不抛异常的 swap 提交新状态，旧状态由临时对象析构回收；不抛 swap 是关键假设。',
    tags: ['exceptions', 'raii', 'oop'], followUp: '这种方案有何性能代价？要点：每次赋值可能额外分配与复制，不能像定制赋值那样总能复用 lhs 的已有容量。',
    reference: {title: 'cppreference Copy assignment operator', url: 'https://en.cppreference.com/w/cpp/language/as_operator'}, source: '原创练习'
  },
  {
    id: 'mi050', cat: 'modern', type: 'single', level: 3,
    q: 'C++20：泛型函数可接收容器左值，但下面 rvalue 容器调用返回的类型为何不能作为可解引用的迭代器使用？',
    code: 'auto result = std::ranges::find(std::vector<int>{1, 2, 3}, 2);',
    options: ['ranges::find 不支持 vector', '算法会把整个 vector 复制进返回迭代器', 'result 一定是 vector<int>::iterator，且元素永久存活', '临时 vector 不是 borrowed_range，返回类型为 std::ranges::dangling'], ans: [3],
    exp: 'ranges 算法针对右值且非 borrowed_range 的范围返回 dangling，防止把即将失效的迭代器当成有效结果。临时 vector 在完整表达式结束时销毁；该机制不负责延长容器生命周期。',
    tags: ['modern', 'stl', 'lifetime'], followUp: '怎样获取可用迭代器？要点：把 vector 存在具名变量中，再对该左值调用算法，并保证容器及相关存储继续有效。',
    reference: {title: 'cppreference ranges dangling', url: 'https://en.cppreference.com/w/cpp/ranges/dangling'}, source: '原创练习'
  }
];

if (typeof module !== 'undefined' && module.exports) module.exports = MODERN_INTERVIEW;

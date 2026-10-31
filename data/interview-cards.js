// 原创面试训练卡；参考链接用于查阅语言规则，并非题目来源或公司真题。
(function () {
  var cards = [
    {
      id: 'oral01', course: 'basics', title: '说清 const 的三种位置', kind: '口述', minutes: 2,
      prompt: '分别解释 const int* p、int* const p、const int* const p 限制了什么。再说明 const 引用能否保证被引用对象永远不变，并举一个合法修改对象的例子。',
      points: ['const int* 禁止通过该指针修改 int，但指针可以改指向。', 'int* const 固定指针本身，仍可通过它修改非 const 的 int。', 'const int* const 同时限制指针改指向与通过它写入。', 'const 引用限制这一访问路径；若原对象非 const，仍可由其他非 const 引用或原变量修改。'],
      pitfalls: ['把指向 const 的指针误认为指针本身不能变。', '认为只要存在 const 引用，对象所有访问路径都会变为只读。'],
      followUp: '如果对象原本就是 const，通过 const_cast 去掉 const 后写入，会发生什么？',
      reference: { title: 'cppreference：cv 限定符', url: 'https://en.cppreference.com/w/cpp/language/cv.html' }
    },
    {
      id: 'oral02', course: 'basics', title: '初始化、窄化与整数溢出', kind: '口述', minutes: 2,
      prompt: '比较局部变量 int x;、int x{};、int x{3.7}; 的含义。解释有符号整数溢出和无符号回绕的差异，假设乘积可由 long long 表示，再说明计算两个 int 的乘积并保存到 long long 时如何避免中间 int 溢出。',
      points: ['普通局部 int x; 不初始化其值，在 C++17 中读取其不确定值通常导致未定义行为；int x{} 初始化为 0。', 'int x{3.7} 是列表初始化中的窄化转换，程序不合法，需要编译诊断。', '有符号整数溢出属于未定义行为；无符号运算按其类型位宽对应的模数回绕。', '在乘法前把操作数提升到 long long，例如 1LL * a * b；运算完成后再转换无法补救已发生的 int 溢出；提升类型也不能解决乘积超出 long long 范围的问题。'],
      pitfalls: ['以为局部基本类型变量默认都是 0。', '把有符号溢出当作标准保证的回绕。'],
      followUp: '为什么检查 i < v.size() 时，要留意 i 为负数以及有符号与无符号比较？',
      reference: { title: 'cppreference：列表初始化', url: 'https://en.cppreference.com/w/cpp/language/list_initialization.html' }
    },
    {
      id: 'oral03', course: 'arrays', title: '数组传参后还剩哪些信息', kind: '口述', minutes: 2,
      prompt: '在 int a[5] 的定义处和 void f(int a[]) 的函数体内，sizeof(a) 分别表示什么？解释数组到指针转换，并给出两种能把长度信息交给函数的接口。',
      points: ['数组定义处 sizeof(a) 是整个数组的字节数，即 5 * sizeof(int)。', '函数形参 int a[] 会调整为 int*，在函数体内 sizeof(a) 得到指针大小。', '数组在多数表达式中转换为指向首元素的指针，sizeof 和绑定数组引用等情形例外。', '可传指针与长度，也可用数组引用模板或 std::array<T, N>；C++17 中还可按需要传 std::vector。'],
      pitfalls: ['在指针形参中用 sizeof(a) / sizeof(a[0]) 求元素数。', '认为数组退化会复制整个数组。'],
      followUp: '如果使用 template<std::size_t N> void f(const int (&a)[N])，N 是怎样获得的？',
      reference: { title: 'cppreference：数组声明', url: 'https://en.cppreference.com/w/cpp/language/array.html' }
    },
    {
      id: 'oral04', course: 'arrays', title: '原地压缩有序数组', kind: '手写', minutes: 5,
      prompt: '实现 std::size_t compact(std::vector<int>& a)：输入已按非降序排序，把不同元素按原顺序放到前 k 个位置并返回 k；不改变 vector 的 size，k 之后内容不限。支持空数组，不另建数组，要求 O(n) 时间、O(1) 额外空间。',
      points: ['读指针扫描原数组，写位置 k 表示当前不同元素的个数。', '将当前值与最后一个已保留元素比较；不同时写入 a[k] 并递增 k。', '空数组返回 0，避免访问 a[0] 或 a[k - 1]。', '返回的是有效前缀长度；调用方需要缩容时可再 resize(k)。'],
      pitfalls: ['反复调用 erase，造成整体 O(n²) 移动。', '把有序前提遗漏后仍声称能去除所有重复值。'],
      followUp: '如果允许每个值最多保留两次，比较条件应该怎样修改？',
      starter: '#include <cstddef>\n#include <vector>\nstd::size_t compact(std::vector<int>& a) {\n    // 返回有效前缀长度，不改变 size\n}',
      solution: '#include <cassert>\n#include <cstddef>\n#include <vector>\nstd::size_t compact(std::vector<int>& a) {\n    std::size_t k = 0;\n    for (std::size_t i = 0; i < a.size(); ++i) {\n        if (k == 0 || a[i] != a[k - 1]) a[k++] = a[i];\n    }\n    return k;\n}\nint main() {\n    std::vector<int> a{1, 1, 2, 2, 3};\n    assert(compact(a) == 3);\n    assert(a.size() == 5 && a[0] == 1 && a[1] == 2 && a[2] == 3);\n    std::vector<int> empty;\n    assert(compact(empty) == 0);\n    std::vector<int> same{4, 4, 4};\n    assert(compact(same) == 1);\n}',
      checks: ['空数组返回 0。', '全相同元素返回 1。', '无重复时返回原长度且顺序不变。', '含负数、零及重复值时有效前缀正确，size 不变。'],
      reference: { title: 'cppreference：std::vector', url: 'https://en.cppreference.com/w/cpp/container/vector.html' }
    },
    {
      id: 'oral05', course: 'strings', title: 'string_view 的生命周期', kind: '口述', minutes: 2,
      prompt: '一个函数返回指向其局部 std::string 的 std::string_view，为什么危险？说明 string_view 是否拥有字符、是否保证末尾有空字符，以及原 string 修改后需要检查什么。',
      points: ['string_view 只保存字符区间的视图，不拥有字符，也不延长原字符串的生命周期。', '局部 string 析构后，返回的视图悬空；访问其字符不安全。', '视图可能只是字符串的一段，data() 不能直接当作保证以空字符结尾的 C 字符串使用。', '原 string 的修改若使底层地址失效，视图也失效；即使地址有效，字符内容也可能改变。'],
      pitfalls: ['认为 const string_view 会让底层字符永久有效。', '用临时 string 初始化长期保存的 string_view。'],
      followUp: '返回 std::string 与返回指向字符串字面量的 string_view，各自适合什么场景？',
      reference: { title: 'cppreference：std::basic_string_view', url: 'https://en.cppreference.com/w/cpp/string/basic_string_view.html' }
    },
    {
      id: 'oral06', course: 'strings', title: '逐字节判断回文', kind: '手写', minutes: 5,
      prompt: '实现 bool isPalindrome(const std::string& s)。按字节精确比较，区分大小写，空格和标点也参与比较；空串返回 true，字符串可能包含内嵌空字符。无需处理 Unicode 字符语义。要求 O(n) 时间、O(1) 额外空间。',
      points: ['左右边界向中间移动，遇到不同字节立即返回 false。', '用右开区间 [left, right) 表示剩余范围，避免空串时 size() - 1 下溢。', '使用 size() 而不是 strlen，因此内嵌空字符也参与比较。'],
      pitfalls: ['直接用无符号下标初始化 right = s.size() - 1，遗漏空串。', '擅自忽略空格或大小写，改变题目要求。'],
      followUp: '如果改为按 UTF-8 字符判断，为什么不能简单交换或比较单个字节？',
      starter: '#include <string>\nbool isPalindrome(const std::string& s) {\n    // 按字节比较\n}',
      solution: '#include <cassert>\n#include <cstddef>\n#include <string>\nbool isPalindrome(const std::string& s) {\n    std::size_t left = 0, right = s.size();\n    while (left < right) {\n        --right;\n        if (s[left] != s[right]) return false;\n        ++left;\n    }\n    return true;\n}\nint main() {\n    assert(isPalindrome(""));\n    assert(isPalindrome("a"));\n    assert(isPalindrome("abba"));\n    assert(!isPalindrome("Abba"));\n    assert(isPalindrome(std::string("a\\0a", 3)));\n    assert(!isPalindrome("ab"));\n}',
      checks: ['空串与单字节字符串返回 true。', '奇数与偶数长度回文均正确。', '大小写不同、空格不同不能被忽略。', '内嵌空字符仍按 size() 范围参与比较。'],
      reference: { title: 'cppreference：std::basic_string', url: 'https://en.cppreference.com/w/cpp/string/basic_string.html' }
    },
    {
      id: 'oral07', course: 'functions', title: '参数传值、引用还是 const 引用', kind: '口述', minutes: 2,
      prompt: '设计三个函数：只读一个 int、只读一个较大的 std::vector<int>、修改调用者的 vector。分别选择参数类型并说明理由。如果函数要保存传入的数据，接口又要考虑什么？',
      points: ['小型 int 通常直接传值，接口简单且不会修改调用者。', '只读较大 vector 通常用 const std::vector<int>&，避免不必要的复制。', '明确修改调用者时使用 std::vector<int>&，并描述修改语义。', '保存引用会引入生命周期约束；若需要拥有数据，可复制或采用按值接收后移动等方式。'],
      pitfalls: ['认为所有类型都应该用 const 引用，忽略小类型和所有权需求。', '把传入引用保存到成员后，未约定调用者对象必须存活多久。'],
      followUp: '一个构造函数要拥有 vector，按值接收再 std::move 到成员，对左值和右值调用各有什么成本？',
      reference: { title: 'cppreference：引用声明', url: 'https://en.cppreference.com/w/cpp/language/reference.html' }
    },
    {
      id: 'oral08', course: 'functions', title: '返回引用与返回值的边界', kind: '口述', minutes: 2,
      prompt: '为什么不能返回局部变量的引用？比较返回 std::vector<int> 值与返回对象成员的 const 引用。说明 C++17 中复制消除与 NRVO 的基本区别，以及 return std::move(local) 的常见问题。',
      points: ['局部自动对象在函数结束时销毁，返回其引用或指针会悬空。', '返回 vector 值使调用方获得独立所有权，通常可借助复制消除或移动实现高效返回。', '返回成员引用依赖所属对象的生命周期，成员被替换等操作也可能使引用失效。', 'C++17 对返回同类型纯右值等场景保证直接构造；返回具名局部对象的 NRVO 仍是可选优化。', 'return std::move(local) 通常会阻止对该局部变量的 NRVO，直接 return local 更合适。'],
      pitfalls: ['把返回局部对象的值与返回其引用混为一谈。', '声称 C++17 对所有返回路径都强制 NRVO。'],
      followUp: '从临时对象调用一个返回成员引用的成员函数，保存这个引用可能出现什么问题？',
      reference: { title: 'cppreference：复制消除', url: 'https://en.cppreference.com/w/cpp/language/copy_elision.html' }
    },
    {
      id: 'oral09', course: 'pointers', title: '用指针前先讲清所有权', kind: '口述', minutes: 2,
      prompt: '一个接口接收 Widget*，仅凭类型能否知道它是否可空、谁负责释放？说明空指针、悬空指针与有效指针的区别，再说明引用为什么也可能悬空。',
      points: ['裸指针类型本身不完整表达可空约定和所有权，需接口契约；非拥有观察用途很常见。', '空指针不指向对象，解引用非法；悬空指针曾指向的对象已经失效。', '指针不为空并不代表所指对象仍存活，判空无法检测所有悬空问题。', '引用通常必须初始化并绑定对象，但不会自动延长任意对象的生命周期，引用也可能悬空。'],
      pitfalls: ['认为 delete 后其他别名也会自动变成 nullptr。', '把引用理解为自动管理生命周期的安全指针。'],
      followUp: '如果函数要接管一个独占对象，为什么 unique_ptr<Widget> 参数比 Widget* 更清楚？',
      reference: { title: 'cppreference：指针声明', url: 'https://en.cppreference.com/w/cpp/language/pointer.html' }
    },
    {
      id: 'oral10', course: 'pointers', title: '反转不拥有节点的单链表', kind: '手写', minutes: 5,
      prompt: '给定 struct Node { int value; Node* next; };，实现 Node* reverse(Node* head)，原地反转无环单链表并返回新头。允许空链表；函数不分配、不释放节点，调用者管理生命周期。要求 O(n) 时间、O(1) 额外空间。',
      points: ['用 prev、cur、next 分别保存已反转头、当前节点和未处理部分。', '改写 cur->next 前先保存旧后继，避免丢失剩余链。', '循环结束返回 prev；原头变为尾且 next 为 nullptr。', '算法只改变链接，节点的分配与释放责任不变。'],
      pitfalls: ['改写 next 后才寻找后继，导致丢链或形成环。', '把空指针判定放在解引用之后。'],
      followUp: '若输入可能有环，如何在反转前检测，并说明时间和空间复杂度？',
      starter: 'struct Node { int value; Node* next; };\nNode* reverse(Node* head) {\n    // 不分配、不释放节点\n}',
      solution: '#include <cassert>\nstruct Node { int value; Node* next; };\nNode* reverse(Node* head) {\n    Node* prev = nullptr;\n    while (head != nullptr) {\n        Node* next = head->next;\n        head->next = prev;\n        prev = head;\n        head = next;\n    }\n    return prev;\n}\nint main() {\n    assert(reverse(nullptr) == nullptr);\n    Node only{7, nullptr};\n    assert(reverse(&only) == &only && only.next == nullptr);\n    Node c{3, nullptr}, b{2, &c}, a{1, &b};\n    Node* head = reverse(&a);\n    assert(head == &c && c.next == &b && b.next == &a);\n    assert(a.next == nullptr);\n}',
      checks: ['空链表返回 nullptr。', '单节点返回原节点且 next 仍为空。', '多节点顺序逆转，原头 next 变为空。', '节点地址不变，没有新增或释放节点。'],
      reference: { title: 'cppreference：指针声明', url: 'https://en.cppreference.com/w/cpp/language/pointer.html' }
    },
    {
      id: 'oral11', course: 'objects', title: '多态删除为什么需要虚析构', kind: '口述', minutes: 2,
      prompt: 'Base 有虚函数 run()，Derived 覆盖它。通过 Base* 调用 run() 为什么可能执行派生版本？如果这个指针实际指向 new Derived，通过它 delete 时基类析构函数应如何声明？再说明按值传 Base 的风险。',
      points: ['通过基类指针或引用进行虚调用时，根据对象动态类型选择最终覆盖函数；override 可让编译器检查覆盖关系。', 'C++17 中通过基类指针删除派生对象，需要基类具有适当的虚析构函数，否则该删除行为未定义。', '常见可多态删除的接口写 virtual ~Base() = default;，以确保完整析构。', '按值复制到 Base 会切片，派生部分丢失，后续虚调用也只针对得到的 Base 对象。'],
      pitfalls: ['认为基类有任意一个虚函数，析构函数就自动变成虚函数。', '把切片误解成仅损失性能而不改变行为。'],
      followUp: '在 Base 的构造函数里调用虚函数，会派发到尚未构造的 Derived 部分吗？',
      reference: { title: 'cppreference：虚函数', url: 'https://en.cppreference.com/w/cpp/language/virtual.html' }
    },
    {
      id: 'oral12', course: 'objects', title: 'Rule of Zero 如何减少资源错误', kind: '口述', minutes: 2,
      prompt: '一个类只需保存文本和一组整数。为什么优先使用 string 和 vector 成员，而不是 char* 与 int*？解释 Rule of Zero；如果类确实直接管理资源，自定义析构后还需审视哪些特殊成员？',
      points: ['string 和 vector 自行管理资源，让成员组合承担析构与复制等工作。', 'Rule of Zero 建议业务类尽量不自定义析构、复制和移动等特殊成员，把资源管理交给合适的成员类型。', '直接拥有裸资源时，默认浅复制可能导致重复释放，必须明确复制或禁止复制的语义。', '自定义析构、复制操作会影响隐式移动的生成，需整体审视析构、复制构造/赋值、移动构造/赋值。'],
      pitfalls: ['自定义析构释放裸指针，却仍默认允许浅复制。', '认为 Rule of Five 意味着任何类都必须手写五个函数。'],
      followUp: '如果类拥有 unique_ptr 成员而没有自定义特殊成员，默认复制与移动能力分别如何？',
      reference: { title: 'cppreference：Rule of three/five/zero', url: 'https://en.cppreference.com/w/cpp/language/rule_of_three.html' }
    },
    {
      id: 'oral13', course: 'memory', title: 'unique_ptr、shared_ptr 和 weak_ptr', kind: '口述', minutes: 2,
      prompt: '分别用一句话解释 unique_ptr、shared_ptr、weak_ptr 的所有权语义。两个对象互相持有 shared_ptr 为什么可能泄漏？解释 weak_ptr::lock() 的用途，以及 shared_ptr 的计数安全是否等于对象本身线程安全。',
      points: ['unique_ptr 表示独占所有权，可移动但不可复制；shared_ptr 允许多个拥有者共享同一对象。', 'weak_ptr 观察共享对象而不增加强引用计数，lock() 尝试取得 shared_ptr，失败时得到空指针。', '强引用环会让强计数无法归零；把合适的非拥有反向边改为 weak_ptr 可打破环。', '共享控制块的计数同步不等于被管理对象线程安全；对象读写仍需同步，同一个 shared_ptr 变量的并发修改也需保护。'],
      pitfalls: ['为方便而把所有指针都换为 shared_ptr。', '用同一个裸指针独立构造两个 shared_ptr，造成两个控制块和重复释放。'],
      followUp: '为什么先检查 expired() 再使用对象不如直接检查 lock() 的结果可靠？',
      reference: { title: 'cppreference：std::shared_ptr', url: 'https://en.cppreference.com/w/cpp/memory/shared_ptr.html' }
    },
    {
      id: 'oral14', course: 'memory', title: '用 RAII 管理文件句柄', kind: '手写', minutes: 8,
      prompt: '在 CHAR_BIT == 8 的平台上，实现 long firstByte(const char* path)：以二进制只读方式打开文件，打开失败返回 -1；读一个字节，成功返回 0～255，遇到 EOF 或读取错误也返回 -1。path 保证非空且以空字符结尾。用带自定义删除器的 unique_ptr 管理 FILE*，保证所有返回路径都会关闭已打开文件。不要求区分 EOF 与错误；只读取一个字节、额外空间 O(1)。',
      points: ['fopen 返回的 FILE* 必须由 fclose 释放，不能使用 delete。', '获取文件后立即交给带 fclose 删除器的 unique_ptr，建立唯一所有权。', '读取结果保存在 int 中，先比较 EOF，再返回字节值，避免 char 无法区分 255 与 EOF。', '析构自动关闭文件，新增提前返回或异常路径也不需要手工补 fclose。'],
      pitfalls: ['对 FILE* 使用默认删除器。', '把 fgetc 的结果先转成 char，丢失 EOF 信息。'],
      followUp: '如果需求必须检查 fclose 是否成功，应如何增加显式关闭与错误报告，同时避免重复关闭？',
      starter: '#include <cstdio>\n#include <memory>\nlong firstByte(const char* path) {\n    // 失败或 EOF 返回 -1\n}',
      solution: '#include <cstdio>\n#include <memory>\nlong firstByte(const char* path) {\n    using File = std::unique_ptr<std::FILE, decltype(&std::fclose)>;\n    File file(std::fopen(path, "rb"), &std::fclose);\n    if (!file) return -1;\n    int ch = std::fgetc(file.get());\n    return ch == EOF ? -1L : static_cast<long>(ch);\n}\nint main(int argc, char** argv) {\n    if (argc != 2) return 0;\n    std::printf("%ld\\n", firstByte(argv[1]));\n}',
      checks: ['不存在或无法打开的路径返回 -1。', '空文件返回 -1。', '首字节为 0 或 255 时分别返回 0 或 255。', '打开成功后，正常返回与读取失败路径均由 RAII 关闭。'],
      reference: { title: 'cppreference：std::unique_ptr', url: 'https://en.cppreference.com/w/cpp/memory/unique_ptr.html' }
    },
    {
      id: 'oral15', course: 'stl', title: 'vector 失效规则与容器选择', kind: '口述', minutes: 5,
      prompt: 'vector 保存元素地址后调用 push_back，什么情况下地址会失效？erase 会影响哪些迭代器和引用？再比较 map 与 unordered_map 的查找复杂度、顺序保证，并说明 operator[] 查询可能产生的副作用。',
      points: ['vector 扩容重新分配时，所有元素指针、引用与迭代器失效；未重新分配的 push_back 保留原元素的引用和迭代器，但旧 end() 失效。', 'erase 使被擦除位置及其后面的迭代器和引用失效，应使用 erase 返回的迭代器继续遍历。', 'map 按比较器保持键顺序，查找、插入与按键删除为 O(log n)。', 'unordered_map 不保证键有序，查找平均 O(1)，最坏 O(n)，性能与哈希及装载情况有关。', 'map 和 unordered_map 的 operator[] 在键缺失时会插入默认构造的映射值；只查询可用 find 或 at。'],
      pitfalls: ['认为 reserve 后永远不会失效，忽略超过 capacity 和 erase。', '把 unordered_map 的平均 O(1) 说成无条件最坏 O(1)。'],
      followUp: 'reserve(n) 与 resize(n) 对 size、capacity 以及已构造元素分别有什么影响？',
      reference: { title: 'cppreference：容器库与迭代器失效', url: 'https://en.cppreference.com/w/cpp/container.html' }
    },
    {
      id: 'oral16', course: 'stl', title: '遍历时安全删除元素', kind: '手写', minutes: 5,
      prompt: '实现 void removeNegative(std::vector<int>& a)，删除所有负数，保留非负数的相对顺序；必须改变 size。支持空数组，要求 O(n) 时间、O(1) 额外空间，可使用标准算法，不得在循环中逐个 erase。',
      points: ['remove_if 把要保留的元素稳定压到前部并返回新的逻辑末尾。', 'remove_if 不改变容器 size，需要随后 erase(newEnd, end)。', '尾部元素的值无需依赖；用一次区间 erase 完成真正删除。'],
      pitfalls: ['仅调用 remove_if，以为 vector 的 size 已变小。', '逐项 erase 后继续递增失效迭代器。'],
      followUp: 'C++20 的 std::erase_if 如何表达同一操作？如果容器是 map，遍历删除模式又有什么不同？',
      starter: '#include <vector>\nvoid removeNegative(std::vector<int>& a) {\n    // 保持非负数相对顺序\n}',
      solution: '#include <algorithm>\n#include <cassert>\n#include <vector>\nvoid removeNegative(std::vector<int>& a) {\n    auto end = std::remove_if(a.begin(), a.end(),\n                              [](int x) { return x < 0; });\n    a.erase(end, a.end());\n}\nint main() {\n    std::vector<int> a{-1, 0, 3, -2, 3};\n    removeNegative(a);\n    assert((a == std::vector<int>{0, 3, 3}));\n    std::vector<int> empty;\n    removeNegative(empty);\n    assert(empty.empty());\n    std::vector<int> all{-1, -2};\n    removeNegative(all);\n    assert(all.empty());\n}',
      checks: ['空数组保持为空。', '全为负数时 size 变为 0。', '无负数时内容与顺序不变。', '零、重复值及交错正负值均正确处理。'],
      reference: { title: 'cppreference：std::remove / std::remove_if', url: 'https://en.cppreference.com/w/cpp/algorithm/remove.html' }
    },
    {
      id: 'oral17', course: 'templates', title: '模板推导与转发引用', kind: '口述', minutes: 5,
      prompt: '对于 template<class T> void f(T&& x)，分别传入 int 左值、const int 左值、int 右值时 T 如何推导？为什么函数体中的 x 是左值表达式？解释 std::forward<T>(x) 与 std::move(x) 的区别。',
      points: ['这里 T 由调用推导，T&& 是转发引用；三种调用中 T 分别推导为 int&、const int&、int。', '引用折叠后形参类型分别为 int&、const int&、int&&。', '具名变量表达式 x 是左值，即使变量类型为右值引用。', 'std::forward<T> 按推导得到的 T 恢复调用参数的值类别；std::move 无条件转换为相应右值引用表达式，不负责真正搬运资源。'],
      pitfalls: ['认为任何 T&& 都是转发引用，例如已确定 T 的类模板成员参数。', '在通用转发函数中总用 std::move，使调用者左值意外被移动。'],
      followUp: '为什么 template<class T> void g(const T&&) 不能作为同样的转发引用接口？',
      reference: { title: 'cppreference：std::forward', url: 'https://en.cppreference.com/w/cpp/utility/forward.html' }
    },
    {
      id: 'oral18', course: 'templates', title: '写一个边界明确的查找模板', kind: '手写', minutes: 5,
      prompt: '实现 template<class T> std::size_t findFirst(const std::vector<T>& a, const T& target)。返回首个等于 target 的下标，找不到返回 a.size()；T 支持结果可用于条件判断的 ==，两个参数的 T 须一致。支持空数组，不修改或复制元素。执行至多 n 次比较、O(1) 额外空间；若一次比较为 O(1)，总时间为 O(n)。',
      points: ['使用 const 引用传容器与目标，避免整个容器或元素的不必要复制。', '下标类型使用 std::size_t，与 size() 一致。', '找到首个相等元素后立即返回；未找到统一返回 size() 哨兵。', '模板要求来自实现使用的操作，C++17 中这里不必引入复杂约束机制。'],
      pitfalls: ['用无符号返回值 -1，却没有说明哨兵约定。', '不区分比较次数 O(n) 与复杂元素相等比较的实际成本。'],
      followUp: '若改为接受一对迭代器并返回迭代器，怎样让同一算法支持更多容器？',
      starter: '#include <cstddef>\n#include <vector>\ntemplate<class T>\nstd::size_t findFirst(const std::vector<T>& a, const T& target) {\n    // 找不到返回 a.size()\n}',
      solution: '#include <cassert>\n#include <cstddef>\n#include <string>\n#include <vector>\ntemplate<class T>\nstd::size_t findFirst(const std::vector<T>& a, const T& target) {\n    for (std::size_t i = 0; i < a.size(); ++i) {\n        if (a[i] == target) return i;\n    }\n    return a.size();\n}\nint main() {\n    std::vector<int> a{4, 2, 4};\n    assert(findFirst(a, 4) == 0);\n    assert(findFirst(a, 9) == a.size());\n    std::vector<int> empty;\n    assert(findFirst(empty, 0) == 0);\n    std::vector<std::string> words{"one", "two"};\n    assert(findFirst(words, std::string("two")) == 1);\n}',
      checks: ['空数组返回 0，即 size()。', '重复目标返回首次出现的位置。', '不存在目标时返回 size()，不得用此值访问元素。', 'int 与 std::string 实例均满足接口；字符串字面量需按接口转成 std::string。'],
      reference: { title: 'cppreference：函数模板', url: 'https://en.cppreference.com/w/cpp/language/function_template.html' }
    },
    {
      id: 'oral19', course: 'exceptions', title: '用失败场景解释异常保证', kind: '口述', minutes: 5,
      prompt: '一个操作需要修改配置并分配内存，分配可能抛异常。说明无抛出保证、强保证、基本保证分别要求什么，并描述一种实现强保证的思路。异常传播时 RAII 对已构造的局部对象有什么作用？',
      points: ['无抛出保证意味着操作不会把异常传播给调用者；基本保证要求失败后资源不泄漏、对象仍满足不变量。', '强保证要求失败时操作没有可观察的状态改变，类似事务回滚。', '可先在临时对象中完成可能失败的工作，成功后以不会失败的交换或提交步骤更新状态。', '异常导致栈展开时，已完成构造的自动对象按逆序析构，RAII 成员负责释放资源。'],
      pitfalls: ['把强保证误解为捕获后忽略所有异常。', '只保证不泄漏，却声称操作失败后对象状态完全不变。'],
      followUp: '如果最后的提交操作本身也可能抛异常，为什么“先做临时副本”还不足以证明强保证？',
      reference: { title: 'cppreference：异常安全', url: 'https://en.cppreference.com/w/cpp/language/exceptions.html' }
    },
    {
      id: 'oral20', course: 'exceptions', title: 'noexcept 不是异常处理器', kind: '口述', minutes: 2,
      prompt: 'noexcept 函数中发生异常会怎样？解释“发生异常”和“异常逃出函数”之间的区别，以及 vector 扩容时为什么会关心元素移动构造是否 noexcept。',
      points: ['noexcept 声明不允许异常逃出该函数；若异常传播到此边界会调用 std::terminate。', '函数内部仍可执行会抛出的操作，只要相应异常在内部被妥善捕获，不逃出即可。', 'vector 为维护异常保证，在可复制且移动可能抛出时可能选择复制；不会抛出的移动更有利于安全转移元素。', '若类型仅可移动且移动会抛出，某些 vector 操作的强保证会受到限制，不能笼统保证回滚。'],
      pitfalls: ['认为 noexcept 会自动捕获异常或让代码不再抛出。', '为追求性能把可能向外抛出的函数强行标成 noexcept。'],
      followUp: '为什么析构函数通常不应向外抛异常，尤其是在另一异常的栈展开期间？',
      reference: { title: 'cppreference：noexcept 说明符', url: 'https://en.cppreference.com/w/cpp/language/noexcept_spec.html' }
    },
    {
      id: 'oral21', course: 'modern', title: 'std::move 之后对象还能做什么', kind: '口述', minutes: 2,
      prompt: 'std::move(v) 是否立即清空一个 vector？说明实际移动何时发生、移动后标准库对象通常能做什么，以及对 const 对象使用 std::move 为什么常常触发复制。',
      points: ['std::move 只是值类别转换，不执行资源转移；后续选中的构造、赋值或其他操作才决定是否移动。', '若后续操作确实移动，除另有规定外标准库对象处于有效但未指定状态，仍可析构、赋值或执行满足前置条件的操作。', '不能普遍假定移动后为空；访问 front() 等操作前仍需满足非空前置条件。', 'const 对象转换后仍带 const，常见 T(T&&) 不能绑定 const T&&，于是可行的 const T& 复制构造可能被选择。'],
      pitfalls: ['把 std::move 理解为强制调用移动构造或销毁原对象。', '使用已经移动的对象时假定其原始内容还在。'],
      followUp: '自定义类型的移动后状态由谁约定？如何设计一个便于调用者继续使用的状态？',
      reference: { title: 'cppreference：std::move', url: 'https://en.cppreference.com/w/cpp/utility/move.html' }
    },
    {
      id: 'oral22', course: 'modern', title: 'lambda 捕获与回调生命周期', kind: '口述', minutes: 2,
      prompt: '一个函数返回 lambda，lambda 使用函数里的局部变量。比较按值捕获和按引用捕获的生命周期。再解释成员函数中的 [this] 捕获为什么不能保证对象存活，以及什么时候可考虑捕获 weak_ptr。',
      points: ['按引用捕获不拥有局部对象，回调执行时局部对象可能已销毁，产生悬空引用。', '按值捕获通常把对象副本存入闭包；复制裸指针或视图只复制地址或视图，不会延长被指对象生命周期。', '[this] 捕获指针，不复制完整对象，也不延长原对象生命周期。', '若对象由 shared_ptr 管理，可捕获 weak_ptr，在回调中 lock 后使用，避免强引用环且能识别对象已销毁。'],
      pitfalls: ['认为 [=] 在成员函数中等于复制整个对象；C++17 可显式使用 [*this]。', '为修复悬空一律捕获 shared_ptr，却引入对象与回调之间的强引用环。'],
      followUp: 'C++14 起的初始化捕获如何把 unique_ptr 移入 lambda？这样的闭包是否还能被复制？',
      reference: { title: 'cppreference：lambda 表达式', url: 'https://en.cppreference.com/w/cpp/language/lambda.html' }
    },
    {
      id: 'oral23', course: 'concurrency', title: 'atomic、volatile 与 mutex 的分工', kind: '口述', minutes: 5,
      prompt: '两个线程同时执行普通 int 的 ++ 为什么不安全？volatile 能否修复？比较 atomic<int> 与 mutex 的适用范围，说明为什么分别保护两个字段还不足以保证它们之间的不变量。',
      points: ['不同线程对同一普通对象存在未同步的冲突访问，且至少一个是写入，会形成数据竞争，行为未定义；++ 也不是不可分割操作。', 'volatile 不提供线程同步、原子性或线程间的 happens-before 关系，不能用来修复数据竞争。', 'atomic 可对单个原子对象提供原子操作，fetch_add 可实现不会丢失更新的计数；并不保证所有实现都无锁。', 'mutex 可保护涉及多个读写步骤或多个字段的临界区，应把维持同一不变量的操作放在同一锁保护下。', '多个独立 atomic 操作各自原子，不自动组成一个原子的整体事务。'],
      pitfalls: ['认为一次机器字长读写必然让整个 ++ 线程安全。', '把 memory_order_relaxed 用作发布其他普通共享数据的同步机制。'],
      followUp: '如果计数仅用于统计，和其他数据没有发布关系，relaxed 为什么可能够用？',
      reference: { title: 'cppreference：内存模型与数据竞争', url: 'https://en.cppreference.com/w/cpp/language/multithread.html' }
    },
    {
      id: 'oral24', course: 'concurrency', title: '用锁实现可并发读取的计数器', kind: '手写', minutes: 8,
      prompt: '实现 Counter 类，初值为 0，提供 void increment() 和 int value() const，可被多个线程同时调用。所有计数访问都用同一个 mutex 保护，并用 RAII 管锁。测试中两个线程各加 1000 次，等待结束后断言为 2000；假设总计数不超过 int 上限且线程成功启动。每次调用执行 O(1) 次操作，锁等待时长不作上界承诺。',
      points: ['把计数与 mutex 封装在类内，不向外暴露未同步的数据访问。', 'increment 和 value 都必须持有同一把锁；读操作也要与写操作同步。', 'std::lock_guard 在作用域结束时自动解锁，避免提前返回漏解锁。', 'const 的 value 可通过 mutable mutex 获取锁；main 中 join 后再验证最终计数。'],
      pitfalls: ['只给写操作加锁，读操作仍直接读取普通 int。', '用手工 lock/unlock 却遗漏异常或提前返回路径。'],
      followUp: '如果改用 atomic<int>，仅统计计数时可以使用什么内存顺序？如果还需保护其他字段，又有什么变化？',
      starter: '#include <mutex>\nclass Counter {\npublic:\n    void increment();\n    int value() const;\nprivate:\n    mutable std::mutex mutex_;\n    int value_ = 0;\n};',
      solution: '#include <cassert>\n#include <mutex>\n#include <thread>\nclass Counter {\npublic:\n    void increment() {\n        std::lock_guard<std::mutex> guard(mutex_);\n        ++value_;\n    }\n    int value() const {\n        std::lock_guard<std::mutex> guard(mutex_);\n        return value_;\n    }\nprivate:\n    mutable std::mutex mutex_;\n    int value_ = 0;\n};\nint main() {\n    Counter counter;\n    assert(counter.value() == 0);\n    auto work = [&counter] {\n        for (int i = 0; i < 1000; ++i) counter.increment();\n    };\n    std::thread a(work);\n    std::thread b(work);\n    a.join();\n    b.join();\n    assert(counter.value() == 2000);\n}',
      checks: ['尚未增加时 value() 返回 0。', '单线程多次增加后计数正确。', '两个线程均 join 后结果为 2000。', '并发读取与增加均经同一 mutex；线程结束前 Counter 始终存活。'],
      reference: { title: 'cppreference：std::lock_guard', url: 'https://en.cppreference.com/w/cpp/thread/lock_guard.html' }
    }
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = cards;
  if (typeof window !== 'undefined') window.CppInterviewCards = cards;
})();

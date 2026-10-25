/* 校招/实习算法与工程面试：原创练习，不代表任何公司真题。 */
var ALGORITHM_INTERVIEW = [
  {
    "id": "ai001",
    "cat": "algo",
    "type": "single",
    "level": 1,
    "q": "去重函数处理已排序数组后，产品要求返回的 vector 只保留不同元素。下面代码还缺哪一步？",
    "code": "std::vector<int> a{1,1,2,2,3};\nauto last = std::unique(a.begin(), a.end());",
    "options": [
      "a.erase(last, a.end());",
      "a.clear();",
      "a.reserve(last - a.begin());",
      "无需操作，unique 已修改 size"
    ],
    "ans": [
      0
    ],
    "exp": "unique 将相邻不重复元素移动到前部，返回逻辑末尾，并不改变容器大小。erase 删除尾部后 size 才变成 3。整体时间 O(n)。",
    "tags": [
      "algorithms",
      "stl"
    ],
    "followUp": "未排序数据如何去重？要保留首次出现顺序可用集合记录已见值并顺序写回；直接排序会改变顺序。",
    "reference": {
      "title": "cppreference: std::unique",
      "url": "https://en.cppreference.com/w/cpp/algorithm/unique.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai002",
    "cat": "algo",
    "type": "single",
    "level": 1,
    "q": "查询某个分数是否存在，输入已升序排列。下面实现在哪种查询下可能越界？",
    "code": "auto it = std::lower_bound(a.begin(), a.end(), score);\nreturn *it == score;",
    "options": [
      "查询值小于所有元素",
      "数组为空或查询值大于所有元素",
      "数组包含重复分数",
      "数组只有一个且恰好相等"
    ],
    "ans": [
      1
    ],
    "exp": "lower_bound 找不到不小于目标的元素时返回 end，不能解引用。应先判断 it != a.end()，利用 && 的短路再比较。vector 上查询 O(log n)。",
    "tags": [
      "algorithms",
      "stl"
    ],
    "followUp": "lower_bound 能判断是否存在吗？返回位置还须判等；它可能指向一个比目标大的元素。",
    "reference": {
      "title": "cppreference: std::lower_bound",
      "url": "https://en.cppreference.com/w/cpp/algorithm/lower_bound.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai003",
    "cat": "algo",
    "type": "single",
    "level": 1,
    "q": "项目按分数升序排序。某次输入包含大量同分记录时异常，下面比较器应怎样修正？",
    "code": "std::sort(a.begin(), a.end(),\n    [](const Item& x, const Item& y) { return x.score <= y.score; });",
    "options": [
      "换成 >=",
      "只要把 sort 改为 stable_sort",
      "使用 x.score < y.score",
      "同分时随机返回 true 或 false"
    ],
    "ans": [
      2
    ],
    "exp": "排序比较器须满足严格弱序，特别是 comp(x,x) 必须为 false。<= 违反这一前提；stable_sort 同样要求合法比较器，不能修复比较关系。",
    "tags": [
      "algorithms",
      "stl"
    ],
    "followUp": "同分按编号排序怎么写？先比较 score，不同时按 score；相同时比较 id，或比较 std::tie(score,id)。",
    "reference": {
      "title": "cppreference: Compare requirements",
      "url": "https://en.cppreference.com/w/cpp/named_req/Compare.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai004",
    "cat": "algo",
    "type": "single",
    "level": 1,
    "q": "以下最小堆依次弹出的结果是什么？",
    "code": "std::priority_queue<int, std::vector<int>, std::greater<int>> q;\nfor (int x : {4, 1, 3}) q.push(x);\nwhile (!q.empty()) { std::cout << q.top(); q.pop(); }",
    "options": [
      "431",
      "314",
      "413",
      "134"
    ],
    "ans": [
      3
    ],
    "exp": "priority_queue 默认最大元素在堆顶，greater<int> 使最小元素在顶。top 为 O(1)，每次 push/pop 为 O(log n)，这里只观察堆顶不能推断底层数组完全有序。",
    "tags": [
      "algorithms",
      "stl"
    ],
    "followUp": "任务优先级相同要保持先来先出怎么办？把递增序号纳入比较键，明确相同优先级的次序。",
    "reference": {
      "title": "cppreference: std::priority_queue",
      "url": "https://en.cppreference.com/w/cpp/container/priority_queue.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai005",
    "cat": "algo",
    "type": "single",
    "level": 2,
    "q": "排行榜只需输出得分最高的 100 人且这 100 人内部降序，允许重排百万条输入。哪段操作能直接满足输出次序？",
    "options": [
      "partial_sort(begin, begin+100, end, greater<>()); 然后取前 100 项",
      "仅 nth_element(begin, begin+100, end, greater<>()); 然后按当前顺序输出",
      "仅 make_heap 后直接读取前 100 项",
      "仅 reverse 全部输入"
    ],
    "ans": [
      0
    ],
    "exp": "partial_sort 保证前 k 项是所需的 k 个元素且已按比较器排序，约 O(n log k) 次比较。nth_element 仅做划分，前 k 项内部不保证有序；堆数组也不是排序数组。",
    "tags": [
      "algorithms",
      "stl"
    ],
    "followUp": "nth_element 如何补齐？对前 k 项再 sort，平均 O(n)+O(k log k)，并先检查 k 不超过 size。",
    "reference": {
      "title": "cppreference: std::partial_sort",
      "url": "https://en.cppreference.com/w/cpp/algorithm/partial_sort.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai006",
    "cat": "algo",
    "type": "single",
    "level": 1,
    "q": "有序数组 a={1,2,2,2,4} 中，要用两次边界查询得到值 2 的出现次数，应取哪个表达式？",
    "options": [
      "lower_bound(a,2)-upper_bound(a,2)",
      "upper_bound(a,2)-lower_bound(a,2)",
      "lower_bound(a,3)-lower_bound(a,1)",
      "upper_bound(a,4)-lower_bound(a,2)"
    ],
    "ans": [
      1
    ],
    "exp": "此处 a 表示同一数组的完整迭代器区间。lower_bound 指向第一个 >=2 的元素，upper_bound 指向第一个 >2 的元素，两者之间恰有 3 项。随机访问迭代器相减 O(1)。",
    "tags": [
      "algorithms",
      "stl"
    ],
    "followUp": "值不存在时怎么办？两个边界相等，差为 0，无须解引用。",
    "reference": {
      "title": "cppreference: std::equal_range",
      "url": "https://en.cppreference.com/w/cpp/algorithm/equal_range.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai007",
    "cat": "algo",
    "type": "single",
    "level": 2,
    "q": "评审发现下面对 std::list 的查找代码比较次数很少，却仍随数据量明显变慢。最准确的解释是？",
    "code": "std::list<int> xs = /* 升序数据 */;\nauto it = std::lower_bound(xs.begin(), xs.end(), target);",
    "options": [
      "lower_bound 不接受 list 迭代器，必然编译失败",
      "比较次数和迭代器移动次数都是 O(log n)",
      "比较次数 O(log n)，但迭代器递增总次数为 O(n)",
      "链表上每次比较必须扫描全表，因此必然 O(n log n)"
    ],
    "ans": [
      2
    ],
    "exp": "lower_bound 接受前向迭代器。对于非随机访问迭代器，寻找中点需要移动迭代器，总移动次数为线性，因此不能把对数次比较等同于对数总时间。",
    "tags": [
      "algorithms",
      "stl"
    ],
    "followUp": "换成 std::set 呢？优先调用 set::lower_bound，它直接沿树查找，复杂度 O(log n)。",
    "reference": {
      "title": "cppreference: std::lower_bound complexity",
      "url": "https://en.cppreference.com/w/cpp/algorithm/lower_bound.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai008",
    "cat": "algo",
    "type": "multi",
    "level": 2,
    "q": "将升序数组中的两数之和与 target 比较，要求使用两个不同位置。关于左右指针实现，哪些说法正确？",
    "options": [
      "循环使用 l <= r 就能保证不重复使用同一位置",
      "和偏大时右指针左移，可排除当前右端与所有更大左端的组合",
      "和偏小时左指针右移，可排除当前左端与所有更小右端的组合",
      "若 int 相加可能溢出，应在相加前将至少一个操作数提升到足够宽的类型"
    ],
    "ans": [
      1,
      2,
      3
    ],
    "exp": "单调性支撑每次排除一整行或一整列候选，两个指针总移动 O(n)。必须使用 l<r 保证位置不同；long long sum=a[l]+a[r] 不能修复已经在 int 中发生的溢出。",
    "tags": [
      "algorithms"
    ],
    "followUp": "重复值能否组成答案？只要来自不同下标就可以；去重答案和避免复用同一位置是不同要求。",
    "reference": {
      "title": "cppreference: usual arithmetic conversions",
      "url": "https://en.cppreference.com/w/cpp/language/usual_arithmetic_conversions.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai009",
    "cat": "algo",
    "type": "single",
    "level": 3,
    "q": "求和至少为 3 的最短非空连续子数组。以下“达到目标才收缩”的正数窗口算法用于 [1,-1,3] 会返回 3，但正确长度是 1。根本原因是什么？",
    "code": "for (int r=0; r<n; ++r) {\n  sum += a[r];\n  while (sum >= target) {\n    best = std::min(best, r-l+1);\n    sum -= a[l++];\n  }\n}",
    "options": [
      "存在负数时，窗口不达标后继续删除左端元素仍可能重新达标",
      "while 改成 if 即可正确处理任意负数",
      "只要把 sum 改成 double 就能修复",
      "该算法只能处理 target 为偶数的情况"
    ],
    "ans": [
      0
    ],
    "exp": "例中删除 1 后 sum=2，循环停止；若再删除 -1，sum 又变成 3，得到更短答案。含负数时普通窗口缺少所需单调性，可用前缀和加单调双端队列做到 O(n)。",
    "tags": [
      "algorithms"
    ],
    "followUp": "队列为什么维护前缀和递增？较晚且前缀和更小的下标，在未来既提供更大区间和又提供更短长度，可淘汰被支配下标。",
    "reference": {
      "title": "cppreference: std::deque",
      "url": "https://en.cppreference.com/w/cpp/container/deque.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai010",
    "cat": "algo",
    "type": "single",
    "level": 1,
    "q": "统计和等于 k 的连续子数组数量时，前缀和频次表为什么要先写 freq[0]=1？",
    "code": "long long prefix=0, count=0;\nstd::unordered_map<long long,long long> freq;\nfreq[0]=1;\nfor (int x : a) {\n  prefix += x;\n  count += freq[prefix-k];\n  ++freq[prefix];\n}",
    "options": [
      "为了禁止数组出现 0",
      "表示数组开始之前的空前缀，使从下标 0 开始的合法子数组被计入",
      "为了让哈希表所有查找都成为最坏 O(1)",
      "表示必须把空子数组也计入答案"
    ],
    "ans": [
      1
    ],
    "exp": "区间和等于当前前缀和减去某个过去的前缀和。空前缀是合法左边界，不表示输出空子数组。先查询再登记当前前缀，避免 k=0 时把当前前缀与自己匹配。平均时间 O(n)。",
    "tags": [
      "algorithms"
    ],
    "followUp": "计数为什么用 long long？全零数组且 k=0 时有 n(n+1)/2 个合法区间，可能超过 int。",
    "reference": {
      "title": "cppreference: std::unordered_map",
      "url": "https://en.cppreference.com/w/cpp/container/unordered_map.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai011",
    "cat": "algo",
    "type": "single",
    "level": 2,
    "q": "下面按最近出现位置计算最长无重复字节子串。输入 \"abba\" 时 left 会错误回退，应该如何修正更新语句？",
    "code": "int left=0, best=0;\n// last 初始化为 -1；ch 已转为 unsigned char\nfor (int r=0; r<(int)s.size(); ++r) {\n  unsigned char ch=s[r];\n  left=last[ch]+1;\n  last[ch]=r;\n  best=std::max(best,r-left+1);\n}",
    "options": [
      "left=std::min(left,last[ch]+1);",
      "left=r;",
      "left=std::max(left,last[ch]+1);",
      "只在 ch 是字母时更新 left"
    ],
    "ans": [
      2
    ],
    "exp": "旧出现位置可能已在窗口外，不能因此让左边界倒退。max 保证 left 单调递增，每个字符只处理一次，固定字节表下时间 O(n)、辅助空间 O(1)。",
    "tags": [
      "algorithms"
    ],
    "followUp": "UTF-8 文本可以直接按 char 算字符吗？这里统计的是字节；要按 Unicode 码点或用户可见字符，需先明确单位并解码。",
    "reference": {
      "title": "cppreference: std::max",
      "url": "https://en.cppreference.com/w/cpp/algorithm/max.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai012",
    "cat": "algo",
    "type": "single",
    "level": 2,
    "q": "求非负整数数组前缀和中第一个 >= target 的下标，采用 [l,r) 二分。下面哪种更新保持不变量且保证区间严格缩小？",
    "code": "int l=0, r=(int)p.size();\nwhile (l<r) {\n  int m=l+(r-l)/2;\n  // 补充更新\n}\nreturn l;",
    "options": [
      "若 p[m]>=target，r=m-1；否则 l=m",
      "若 p[m]>=target，r=m；否则 l=m",
      "若 p[m]>=target，l=m+1；否则 r=m",
      "若 p[m]>=target，r=m；否则 l=m+1"
    ],
    "ans": [
      3
    ],
    "exp": "候选首个满足位置在 [l,r] 中，r 可以是 size 哨兵。满足时 m 仍可能是答案，令 r=m；不满足时排除 m，令 l=m+1。无结果时返回 size，不能直接访问 p[l]。",
    "tags": [
      "algorithms"
    ],
    "followUp": "数组元素允许负数会怎样？前缀和不一定单调，二分前提失效，必须换方法或利用其他约束。",
    "reference": {
      "title": "cppreference: std::lower_bound",
      "url": "https://en.cppreference.com/w/cpp/algorithm/lower_bound.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai013",
    "cat": "algo",
    "type": "single",
    "level": 2,
    "q": "包裹重量均为正数，必须保持顺序并在 D 天内运完。二分每天最小载重 C 时，哪组搜索边界与判定条件正确？",
    "options": [
      "下界为最大单件重量，上界为总重量；贪心所需天数 <= D 则 C 可行",
      "下界为最小重量，上界为最大重量；所需天数 >= D 则可行",
      "下界为 0，上界为平均重量；必须恰好用 D 天",
      "必须先按重量排序，再将天数当作单调递增函数"
    ],
    "ans": [
      0
    ],
    "exp": "任何载重不能小于最大包裹，总重量可一天运完。按顺序尽量装满每一天能求该载重的最少天数，C 增大不会使所需天数增加。每次判定 O(n)，总 O(n log S)，S 为总重量范围。",
    "tags": [
      "algorithms"
    ],
    "followUp": "D 大于包裹数怎么办？允许 D 天内完成，仍返回最大单件重量；总重量和中间运算应使用足够宽整数。",
    "reference": {
      "title": "CP-Algorithms: binary search on the answer",
      "url": "https://cp-algorithms.com/num_methods/binary_search.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai014",
    "cat": "algo",
    "type": "multi",
    "level": 3,
    "q": "非负边权图用“允许重复入堆”的 Dijkstra。已正确维护 dist，哪些做法正确？",
    "options": [
      "出堆时若 d != dist[u]，可跳过该过期条目",
      "节点第一次入堆就标记为最终确定，后续不再允许松弛",
      "每次成功松弛都把新的距离和节点一起压入最小堆",
      "计算 d+w 前需确保类型和无穷大约定不会造成溢出"
    ],
    "ans": [
      0,
      2,
      3
    ],
    "exp": "第一次入堆只表示发现了一条路径，不一定最短。出堆时丢弃过期记录可避免反复扫描邻接边；非负权保证最小有效距离可最终确定。距离加法还必须满足整数安全边界。",
    "tags": [
      "algorithms"
    ],
    "followUp": "堆最多多大？懒删除实现可保留 O(E) 个条目，复杂度常写 O((V+E) log(E+1))；简单图中可化为常见的 log V 表达。",
    "reference": {
      "title": "CP-Algorithms: sparse Dijkstra",
      "url": "https://cp-algorithms.com/graph/dijkstra_sparse.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai015",
    "cat": "algo",
    "type": "single",
    "level": 1,
    "q": "在无权图中 BFS 求最短路，多个父节点可能同时发现同一个邻居。最稳妥的访问标记时机是什么？",
    "options": [
      "每次出队后都清除 visited",
      "整个 BFS 结束后再统一标记",
      "第一次把节点加入队列时标记，并设置距离",
      "只有节点没有邻居时才标记"
    ],
    "ans": [
      2
    ],
    "exp": "入队时标记可确保每个顶点只入队一次。FIFO 保证首次发现即得到最少边数距离，邻接表实现时间 O(V+E)、辅助空间 O(V)。",
    "tags": [
      "algorithms"
    ],
    "followUp": "允许权重 0 和 1 呢？普通 FIFO BFS 不再适用，可用 0-1 BFS，0 边从队首加入、1 边从队尾加入并按距离松弛。",
    "reference": {
      "title": "CP-Algorithms: breadth-first search",
      "url": "https://cp-algorithms.com/graph/breadth-first-search.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai016",
    "cat": "algo",
    "type": "single",
    "level": 2,
    "q": "网格里多个起火点同时在第 0 秒起火，每秒向上下左右传播，墙不能通过。要计算每格最早起火时刻，应如何初始化 BFS？",
    "options": [
      "任意选择一个起火点，其余点忽略",
      "所有格子距离初始化为 0",
      "先分别 BFS，再把距离相加",
      "所有起火点距离设为 0 并同时入队，其他可达状态设为未访问"
    ],
    "ans": [
      3
    ],
    "exp": "多源 BFS 等价于从一个连接所有源的虚拟起点同时扩展，但各源初始距离为 0。首次到达是到任意起火点的最短距离，每格最多入队一次，时间 O(行数×列数)。",
    "tags": [
      "algorithms"
    ],
    "followUp": "人能否和火同一秒到达某格？必须由题意定义；严格早于火和允许同秒会改变边界判定。",
    "reference": {
      "title": "CP-Algorithms: breadth-first search",
      "url": "https://cp-algorithms.com/graph/breadth-first-search.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai017",
    "cat": "algo",
    "type": "single",
    "level": 2,
    "q": "面试代码用下面函数判断“严格二叉搜索树”。哪棵树能揭示只检查直接孩子的问题？",
    "code": "bool valid(Node* u) {\n  if (!u) return true;\n  if (u->left && u->left->v >= u->v) return false;\n  if (u->right && u->right->v <= u->v) return false;\n  return valid(u->left) && valid(u->right);\n}",
    "options": [
      "根 10，左孩子 5，5 的右孩子 12",
      "根 10，左孩子 5，右孩子 15",
      "只有一个值为 10 的根",
      "根 10，右孩子 15，15 的左孩子 11"
    ],
    "ans": [
      0
    ],
    "exp": "12 虽大于父节点 5，却处在 10 的左子树，违反全局范围。应在递归时传递祖先限定的开区间，或验证中序遍历严格递增。时间 O(n)，辅助栈 O(h)。",
    "tags": [
      "algorithms"
    ],
    "followUp": "int 极值节点如何处理边界？可用可选上下界或更宽的边界类型，避免以 INT_MIN/INT_MAX 充当被排除的合法值。",
    "reference": {
      "title": "CP-Algorithms: treap and binary search tree property",
      "url": "https://cp-algorithms.com/data_structures/treap.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai018",
    "cat": "algo",
    "type": "single",
    "level": 1,
    "q": "树高按节点数计，空树高度为 0。求高度时下面返回语句应填什么？",
    "code": "int height(Node* u) {\n  if (!u) return 0;\n  int lh=height(u->left), rh=height(u->right);\n  return /* ? */;\n}",
    "options": [
      "lh+rh",
      "1+std::max(lh,rh)",
      "std::min(lh,rh)",
      "lh==rh"
    ],
    "ans": [
      1
    ],
    "exp": "高度是根到最深叶子的节点数，所以选择较高子树再加根。每个节点访问一次，时间 O(n)；递归栈为 O(h)，退化链状树时可达 O(n)。",
    "tags": [
      "algorithms"
    ],
    "followUp": "如何避免很深的递归？用显式栈做后序，或用队列按层遍历统计层数，并说明相应空间上界。",
    "reference": {
      "title": "cppreference: std::max",
      "url": "https://en.cppreference.com/w/cpp/algorithm/max.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai019",
    "cat": "algo",
    "type": "single",
    "level": 2,
    "q": "依赖图中两个任务互相依赖，但还有 8 个独立任务。Kahn 拓扑排序只输出了这 8 个任务，正确结论是什么？",
    "options": [
      "输出非空就说明所有任务均可执行",
      "必须强行把剩余任务补在末尾",
      "剩余子图存在有向环，无法生成覆盖全部任务的合法拓扑序",
      "独立任务导致算法失效，应删除独立任务再判断"
    ],
    "ans": [
      2
    ],
    "exp": "Kahn 不断移除零入度节点。若处理数小于总顶点数，剩余部分没有零入度起点，必含环。独立任务可以正常执行，但不能据此宣称整个依赖图可完成。",
    "tags": [
      "algorithms"
    ],
    "followUp": "剩余所有节点都在环上吗？不一定，某些节点只是依赖于环；要定位环可进一步用 DFS 或强连通分量。",
    "reference": {
      "title": "CP-Algorithms: topological sorting",
      "url": "https://cp-algorithms.com/graph/topological-sort.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai020",
    "cat": "algo",
    "type": "multi",
    "level": 3,
    "q": "严格递增子序列长度用 tails 数组维护。处理输入 [2,2,2] 时，哪些判断正确？",
    "options": [
      "替换第一个 >=x 的位置可得到严格递增 LIS 长度 1",
      "改成替换第一个 >x 的位置仍必定得到严格递增 LIS",
      "tails[i] 表示长度 i+1 的候选递增子序列中最小的末尾值",
      "对任意输入，tails 的最终内容都保证是原数组中某个实际子序列"
    ],
    "ans": [
      0,
      2
    ],
    "exp": "严格递增需要 lower_bound，重复 2 只替换同一位置。upper_bound 对应非递减版本，会把三个 2 都保留。tails 保存各长度的最优末尾，不保存同一条路径，恢复序列还需前驱信息。时间 O(n log n)。",
    "tags": [
      "algorithms",
      "stl"
    ],
    "followUp": "为什么较小末尾更好？相同长度下末尾越小，未来能接上的元素集合越大，替换不会损失更长解。",
    "reference": {
      "title": "CP-Algorithms: longest increasing subsequence",
      "url": "https://cp-algorithms.com/dynamic_programming/longest_increasing_subsequence.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai021",
    "cat": "algo",
    "type": "single",
    "level": 2,
    "q": "硬币面值 {1,2}，每种无限个，统计凑出金额 3 的“组合数”，不区分 1+2 与 2+1。哪个遍历顺序得到 2？",
    "options": [
      "先枚举硬币，再将金额从 coin 到 target 递增更新 dp[s]+=dp[s-coin]",
      "先枚举金额，再枚举每种硬币并累加",
      "先枚举硬币，再将金额从 target 到 coin 递减更新",
      "将 dp 的所有元素初始化成 1 后任选顺序"
    ],
    "ans": [
      0
    ],
    "exp": "初始化 dp[0]=1、其余 0。外层按硬币建立固定类别顺序，避免不同排列重复计数；内层递增允许当前硬币重复使用。外层金额会数出 111、12、21 三种排列。",
    "tags": [
      "algorithms"
    ],
    "followUp": "数量可能很大怎么办？先明确取模还是精确计数，选足够宽整数或大整数，并处理面值去重和非法的零面值。",
    "reference": {
      "title": "CP-Algorithms: complete knapsack",
      "url": "https://cp-algorithms.com/dynamic_programming/knapsack.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai022",
    "cat": "algo",
    "type": "single",
    "level": 1,
    "q": "最大连续子数组必须非空。对 [-5,-2,-8]，下面把答案初始化为 0 的实现会返回错误结果，正确答案是多少？",
    "code": "int best=0, cur=0;\nfor (int x : a) { cur=std::max(x,cur+x); best=std::max(best,cur); }",
    "options": [
      "0",
      "-2",
      "-15",
      "8"
    ],
    "ans": [
      1
    ],
    "exp": "非空条件下全负数组也必须选择元素，最优是单个 -2。可用第一个元素初始化 cur 和 best，再从第二个遍历；空数组需另行定义契约。时间 O(n)、空间 O(1)。",
    "tags": [
      "algorithms"
    ],
    "followUp": "要返回左右端点怎么做？重新从当前元素开始时更新候选起点，刷新全局最优时记录候选范围，并明确同分规则。",
    "reference": {
      "title": "CP-Algorithms: maximum subarray sum",
      "url": "https://cp-algorithms.com/others/maximum_average_segment.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai023",
    "cat": "algo",
    "type": "single",
    "level": 2,
    "q": "求两个字符串的编辑距离，把二维 DP 压成一行。更新 dp[j] 前为什么还要保存旧的左上角值？",
    "options": [
      "因为 dp[j-1] 永远代表旧行",
      "因为替换操作不需要上一行信息",
      "因为 dp[j-1] 已变为当前行，而匹配/替换转移需要上一行的 dp[j-1]",
      "为了把时间从 O(nm) 降为 O(n+m)"
    ],
    "ans": [
      2
    ],
    "exp": "从左向右更新时 dp[j] 尚是旧行上方，dp[j-1] 已是当前行左方，左上方会被覆盖。用临时变量保留旧值才能计算匹配/替换。时间仍 O(nm)，额外空间可降为 O(min(n,m))。",
    "tags": [
      "algorithms"
    ],
    "followUp": "初始化有什么含义？第 0 行和第 0 列对应把空串变成前缀的插入次数，或把前缀删成空串的删除次数。",
    "reference": {
      "title": "CP-Algorithms: introduction to dynamic programming",
      "url": "https://cp-algorithms.com/dynamic_programming/intro-to-dp.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai024",
    "cat": "algo",
    "type": "single",
    "level": 3,
    "q": "树上选若干带权节点，相邻节点不能同时选，允许一个都不选。dp[u][0/1] 分别表示不选/选 u 的最大权重。对孩子 v，正确转移是哪组？",
    "options": [
      "dp[u][0] += dp[v][0]；dp[u][1] += dp[v][1]",
      "两个状态都加 max(dp[v][0],dp[v][1])",
      "dp[u][0] += dp[v][1]；dp[u][1] += dp[v][1]",
      "dp[u][0] += max(dp[v][0],dp[v][1])；dp[u][1] += dp[v][0]"
    ],
    "ans": [
      3
    ],
    "exp": "选 u 时孩子不能选；不选 u 时每个孩子可以独立选择较优状态。初始化 dp[u][0]=0、dp[u][1]=weight[u]，按后序合并，根取两者最大。树中无跨子树边，时间 O(n)。",
    "tags": [
      "algorithms"
    ],
    "followUp": "负权节点怎么办？允许空集时不选状态保持可行；普通图存在跨子树约束，不能直接套这组独立合并公式。",
    "reference": {
      "title": "CP-Algorithms: introduction to dynamic programming",
      "url": "https://cp-algorithms.com/dynamic_programming/intro-to-dp.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai025",
    "cat": "algo",
    "type": "single",
    "level": 2,
    "q": "下面循环看似两层，假设 a 全为 1、n 为正数且所有算术安全，时间复杂度是多少？",
    "code": "int r=0;\nfor (int l=0; l<n; ++l) {\n  while (r<n && a[r]==1) ++r;\n}",
    "options": [
      "O(n)，因为 r 在整个执行过程中只递增 n 次",
      "O(n²)，因为有两层循环",
      "O(log n)，因为 r 不回退",
      "O(1)，因为内层很快结束"
    ],
    "ans": [
      0
    ],
    "exp": "内层并不是每轮从零开始；r 首轮到达 n 后不再移动。外层 n 次加内层累计 n 次，总 O(n)。应按状态变量的总变化次数分析，而非仅数循环嵌套层数。",
    "tags": [
      "algorithms"
    ],
    "followUp": "把 int r=0 移到 for 循环内部呢？每轮重新扫描全部 n 个元素，此输入下会变成 O(n²)。",
    "reference": {
      "title": "cppreference: while statement",
      "url": "https://en.cppreference.com/w/cpp/language/while.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai026",
    "cat": "algo",
    "type": "multi",
    "level": 2,
    "q": "假设 int 为 32 位、long long 为 64 位，n=100000。哪些写法能正确算出 n(n+1)/2？",
    "code": "int n=100000;",
    "options": [
      "long long s=n*(n+1)/2;",
      "long long s=1LL*n*(n+1)/2;",
      "long long s=static_cast<long long>(n*(n+1))/2;",
      "long long s=static_cast<long long>(n)*(n+1)/2;"
    ],
    "ans": [
      1,
      3
    ],
    "exp": "必须在乘法之前提升操作数。仅接收结果时转成 long long，或在乘法完成后强转，都无法挽救 int 有符号溢出。这里 n+1 仍在 int 范围内，最终值 5000050000 可由 64 位整数表示。",
    "tags": [
      "algorithms"
    ],
    "followUp": "n 可接近 LLONG_MAX 时呢？提升到 long long 已不够；需检查范围、先约分并检查乘法，或使用更宽/任意精度类型。",
    "reference": {
      "title": "cppreference: arithmetic operators",
      "url": "https://en.cppreference.com/w/cpp/language/operator_arithmetic.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai027",
    "cat": "algo",
    "type": "single",
    "level": 3,
    "q": "滑动窗口最大值的单调队列存下标。在处理下标 i、窗口长度 k 时，若弹出所有 <=a[i] 的队尾元素，为什么保留更晚的相同值是安全的？",
    "options": [
      "相同值在数组中只能出现一次",
      "更晚下标一定让最大值变大",
      "新下标的值不小且更晚过期，旧下标不会再比它更有用",
      "这样能把所有查询降到最坏 O(1) 且每次入队也最坏 O(1)"
    ],
    "ans": [
      2
    ],
    "exp": "对于未来仍包含旧下标的窗口，新下标也仍在窗口内且值相同，因此旧下标被支配。队首还需移除 <=i-k 的过期下标。每个下标进出一次，总 O(n)，单次入队可能弹出很多元素。",
    "tags": [
      "algorithms"
    ],
    "followUp": "只弹严格小于新值的元素行不行？也正确，但会保留相同值的多个下标；仍需按下标处理过期。",
    "reference": {
      "title": "CP-Algorithms: minimum queue",
      "url": "https://cp-algorithms.com/data_structures/stack_queue_modification.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai028",
    "cat": "algo",
    "type": "single",
    "level": 2,
    "q": "日志中每条无向连接都执行一次 union，可能重复出现相同边。维护连通分量计数 components 时，正确的减少时机是？",
    "options": [
      "每读取一条边就减 1",
      "两个端点编号不同时就减 1",
      "只有两个端点均未出现过时才减 1",
      "find(u) != find(v) 且合并成功时才减 1"
    ],
    "ans": [
      3
    ],
    "exp": "已经连通的两个节点再次 union 不改变分量数，即便端点不同也可能已有间接路径。初始化为顶点数，每次成功合并两个不同根才减 1；路径压缩和按大小合并使操作均摊接近常数。",
    "tags": [
      "algorithms"
    ],
    "followUp": "能直接支持删除边吗？普通并查集不能拆分集合；离线删除可倒序变成加边，或使用回滚并查集处理更复杂场景。",
    "reference": {
      "title": "CP-Algorithms: disjoint set union",
      "url": "https://cp-algorithms.com/data_structures/disjoint_set_union.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai029",
    "cat": "algo",
    "type": "single",
    "level": 2,
    "q": "下列代码试图用 vector 预留一百万个桶位再按下标赋值。为什么仍然越界？",
    "code": "std::vector<int> count;\ncount.reserve(1000000);\ncount[999999]=1;",
    "options": [
      "reserve 只增加容量，不创建元素；需要 resize 或按需 push_back",
      "reserve 最大只能分配 65535 个元素",
      "vector 不支持随机访问",
      "必须把下标改为 1000000"
    ],
    "ans": [
      0
    ],
    "exp": "reserve 后 size 仍为 0，operator[] 要求下标小于 size。若需要一百万个初值为零的整数，可构造 vector<int>(1000000) 或 resize(1000000)，相应初始化时间 O(n)。",
    "tags": [
      "algorithms",
      "stl"
    ],
    "followUp": "为什么批量 push_back 前常用 reserve？减少扩容和已有元素搬移，但它并不改变 push_back 应插入的位置。",
    "reference": {
      "title": "cppreference: std::vector::reserve",
      "url": "https://en.cppreference.com/w/cpp/container/vector/reserve.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai030",
    "cat": "algo",
    "type": "single",
    "level": 3,
    "q": "用前缀和求 [l,r) 区间和，所有单个元素均可放入 int，但 n 可达 200000、每项绝对值可达 10^9。哪种设计正确覆盖题设范围？",
    "options": [
      "vector<int> p(n+1)，查询时再将差转成 long long",
      "vector<long long> p(n+1,0)，逐项在 long long 中累加，返回 p[r]-p[l]",
      "vector<unsigned int> p，因为无符号溢出有定义所以结果精确",
      "用 float 前缀和，因其范围较大所以整数结果总精确"
    ],
    "ans": [
      1
    ],
    "exp": "前缀和绝对值可达 2×10^14，超出 32 位整数，64 位有符号整数足够。构建 O(n)，查询 O(1)。无符号回绕不等于精确整数和，float 也不能精确表示所有该范围内整数。",
    "tags": [
      "algorithms"
    ],
    "followUp": "能把闭区间 [l,r] 写成什么？p[r+1]-p[l]；检查 r+1 的合法范围，并统一接口的区间约定。",
    "reference": {
      "title": "cppreference: fundamental types",
      "url": "https://en.cppreference.com/w/cpp/language/types.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai031",
    "cat": "syntax",
    "type": "single",
    "level": 1,
    "q": "你给“返回有序数组第一个目标位置”的函数补测试。哪组最能覆盖边界，而不只是重复验证普通样例？",
    "options": [
      "十个长度相同且目标都在中间的随机数组",
      "只测一个长度一百万的数组",
      "只测已经在线上成功运行过的输入",
      "空数组、单元素、全相等、目标小于最小值和大于最大值"
    ],
    "ans": [
      3
    ],
    "exp": "这些用例直接覆盖空区间、重复值、左右边界及无结果哨兵，能暴露解引用 end、错误收缩和未返回首个位置等问题。大规模测试主要补充性能信息，不能替代边界覆盖。",
    "tags": [
      "engineering"
    ],
    "followUp": "如何验证大量随机输入？用简单线性扫描作为独立参考实现，固定并记录随机种子，失败后缩小反例。",
    "reference": {
      "title": "C++ Core Guidelines: P.2 Write in ISO Standard C++",
      "url": "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#p2-write-in-iso-standard-c"
    },
    "source": "原创练习"
  },
  {
    "id": "ai032",
    "cat": "syntax",
    "type": "multi",
    "level": 2,
    "q": "一个排序优化在随机测试中偶发失败。哪些做法有助于得到可复现、可信的回归用例？",
    "options": [
      "保存完整失败输入、编译参数和随机种子",
      "将失败输入最小化，同时保持触发同一错误",
      "每次失败都换一个种子，丢弃原输入",
      "同时验证有序性与输出元素多重集合未改变"
    ],
    "ans": [
      0,
      1,
      3
    ],
    "exp": "保存环境和输入可重现问题，缩小反例有助于定位原因。有序性只能证明排列顺序，不能发现丢元素或改值，因此还须验证输出是输入的排列。不能用丢弃失败输入来判定成功。",
    "tags": [
      "engineering"
    ],
    "followUp": "参考实现也可能有 bug 怎么办？结合不同实现、独立性质检查和手工小例；避免把同一段逻辑复制成所谓基准。",
    "reference": {
      "title": "cppreference: std::is_permutation",
      "url": "https://en.cppreference.com/w/cpp/algorithm/is_permutation.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai033",
    "cat": "syntax",
    "type": "single",
    "level": 1,
    "q": "程序在读入失败后重复处理了上一条记录。下面循环的直接问题是什么？",
    "code": "int x=0;\nwhile (!std::cin.eof()) {\n  std::cin >> x;\n  process(x);\n}",
    "options": [
      "应改成 while (std::cin >> x) process(x)，仅在本次读取成功后处理",
      "只要把 x 初始化成 -1 即可",
      "eof 在读取最后一个有效数之前总会自动置位",
      "增加 std::endl 就能刷新输入状态"
    ],
    "ans": [
      0
    ],
    "exp": "eof 状态通常要在读取触及文件末尾后才更新，循环条件不能保证下一次提取成功；格式错误也不一定设置 eof。应检查提取操作本身的成功状态。",
    "tags": [
      "engineering"
    ],
    "followUp": "要区分正常结束和非法输入怎么办？循环后检查 eof、fail、bad，并根据接口约定报告解析或 I/O 错误。",
    "reference": {
      "title": "cppreference: std::basic_ios::operator bool",
      "url": "https://en.cppreference.com/w/cpp/io/basic_ios/operator_bool.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai034",
    "cat": "syntax",
    "type": "single",
    "level": 2,
    "q": "Linux 上一个 C++ 服务偶发 heap-use-after-free，能在测试环境复现。哪项最适合作为第一轮定位手段？",
    "options": [
      "反复加 sleep，直到错误不再出现",
      "使用 AddressSanitizer 构建运行复现用例，结合分配、释放和访问调用栈定位",
      "只把所有 int 改为 long long",
      "看到重跑通过就删除该回归用例"
    ],
    "ans": [
      1
    ],
    "exp": "AddressSanitizer 可检测许多堆越界和释放后使用，报告通常包含相关访问和分配/释放栈，能把现象关联到对象生命周期。重跑通过或改变时序不能证明缺陷已消除。",
    "tags": [
      "engineering",
      "lifetime"
    ],
    "followUp": "ASan 没有报告是否说明内存安全？不是，它只能覆盖已执行路径和可检测的错误类型，还需回归测试、审查所有权等证据。",
    "reference": {
      "title": "Clang: AddressSanitizer",
      "url": "https://clang.llvm.org/docs/AddressSanitizer.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai035",
    "cat": "syntax",
    "type": "single",
    "level": 1,
    "q": "为了避免复制配置内容，函数返回 string_view。下面实现为什么不安全？",
    "code": "std::string_view configName() {\n  std::string name=\"release\";\n  return name;\n}",
    "options": [
      "string_view 只能引用字符串字面量",
      "return 会自动把 name 变成全局对象",
      "name 离开函数时销毁，返回的视图悬空",
      "因为 \"release\" 的长度不是 8"
    ],
    "ans": [
      2
    ],
    "exp": "string_view 不拥有字符存储；局部 string 的生命周期结束后，视图不能继续用于访问字符。返回拥有数据的 std::string，或让视图引用生命周期明确且足够长的存储。",
    "tags": [
      "engineering",
      "lifetime"
    ],
    "followUp": "局部 string 使用 SSO 能让它安全吗？不能，存储位于对象内部或堆上都不会延长生命周期。",
    "reference": {
      "title": "cppreference: std::basic_string_view",
      "url": "https://en.cppreference.com/w/cpp/string/basic_string_view.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai036",
    "cat": "syntax",
    "type": "single",
    "level": 2,
    "q": "读取文件的函数有多个提前 return，后续还可能抛异常。怎样管理文件句柄最不易漏释放？",
    "options": [
      "只在最后一行 fclose，要求所有人记得不要提前返回",
      "把句柄保存为永久全局变量",
      "每次 return 前复制一段释放逻辑，并忽略异常路径",
      "使用析构时关闭句柄的 RAII 封装，例如 std::ifstream 或带 fclose 删除器的 unique_ptr"
    ],
    "ans": [
      3
    ],
    "exp": "RAII 将资源生命周期绑定到自动对象，正常离开作用域和异常栈展开都会执行析构。相比手工覆盖每个出口，封装更易维护；同时仍须按业务需要检查打开和读写结果。",
    "tags": [
      "engineering",
      "lifetime"
    ],
    "followUp": "析构里发现关闭失败怎么办？析构通常不抛异常；重要写入可提供显式 close/flush 来报告失败，析构承担兜底释放。",
    "reference": {
      "title": "C++ Core Guidelines: R.1 Manage resources automatically using RAII",
      "url": "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r1-manage-resources-automatically-using-resource-handles-and-raii-resource-acquisition-is-initialization"
    },
    "source": "原创练习"
  },
  {
    "id": "ai037",
    "cat": "syntax",
    "type": "single",
    "level": 2,
    "q": "接口只同步读取一组大对象且不保存引用。若调用者的数据已经在 vector 中，哪种签名最直接避免复制并表达只读意图？",
    "options": [
      "void analyze(std::vector<Record> records);",
      "void analyze(const std::vector<Record>& records);",
      "void analyze(std::vector<Record>&& records);，并要求所有调用都 std::move",
      "void analyze(std::vector<Record>* records);，并在函数内删除指针"
    ],
    "ans": [
      1
    ],
    "exp": "const 引用避免按值复制，并限制通过该参数修改容器。右值引用不是只读借用的必要条件，裸指针删除也不符合借用契约。若需要支持多种连续容器，可考虑 C++20 span<const Record>。",
    "tags": [
      "engineering",
      "lifetime"
    ],
    "followUp": "为什么按值传参有时反而合适？当函数需要拥有副本并保存数据时，按值后 move 入成员可兼顾左值复制和右值移动。",
    "reference": {
      "title": "C++ Core Guidelines: F.16 input parameters",
      "url": "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#f16-for-in-parameters-pass-cheaply-copied-types-by-value-and-others-by-reference-to-const"
    },
    "source": "原创练习"
  },
  {
    "id": "ai038",
    "cat": "syntax",
    "type": "multi",
    "level": 3,
    "q": "实现线程池后，任务队列偶发卡死。生产者和消费者使用同一个 mutex 保护 ready 和队列。关于条件变量，哪些说法正确？",
    "options": [
      "wait(lock,predicate) 会在等待时释放锁，返回前重新获得锁",
      "谓词应在持锁状态下检查，以处理虚假唤醒及其他消费者抢先取走任务",
      "停止标志也要纳入等待谓词，并定义退出时是否处理剩余任务",
      "每次被 notify 唤醒，都保证队列一定非空"
    ],
    "ans": [
      0,
      1,
      2
    ],
    "exp": "唤醒不是资源所有权的移交。虚假唤醒和多个消费者竞争都可能导致醒来时条件仍不满足，因此使用谓词循环，并在同一同步协议中管理停止状态。",
    "tags": [
      "engineering"
    ],
    "followUp": "notify 时必须持锁吗？通常不必；关键是共享状态受同一互斥保护，状态更新与等待谓词形成正确同步，且对象生命周期有效。",
    "reference": {
      "title": "cppreference: std::condition_variable::wait",
      "url": "https://en.cppreference.com/w/cpp/thread/condition_variable/wait.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai039",
    "cat": "syntax",
    "type": "single",
    "level": 1,
    "q": "面试官问“你的缓存优化快了多少”，手上只有一次 Debug 构建的耗时。哪种回答和补测方式更可信？",
    "options": [
      "把这一次结果直接当作线上提升比例",
      "只测试最适合新实现的输入并省略数据规模",
      "说明当前证据有限，用相同 Release 配置、数据和环境重复比较，同时验证结果一致",
      "根据代码行数减少比例估计性能提升"
    ],
    "ans": [
      2
    ],
    "exp": "性能结论必须绑定构建方式、输入分布、规模和测量方法。固定比较条件并重复测量可减少噪声影响；还须确保实现结果一致，否则“变快”可能只是少做了必需工作。",
    "tags": [
      "engineering"
    ],
    "followUp": "平均值足够吗？视业务补充中位数、尾延迟、吞吐和内存等指标，报告样本量与波动，不只挑最好的一次。",
    "reference": {
      "title": "Google Benchmark user guide",
      "url": "https://google.github.io/benchmark/user_guide.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai040",
    "cat": "syntax",
    "type": "single",
    "level": 2,
    "q": "接口延迟升高，但 CPU 使用率很低。下一步哪种调查最能区分等待问题与计算问题？",
    "options": [
      "立刻把所有循环改成多线程",
      "立即更换排序算法，不检查调用路径",
      "仅凭 CPU 低就断言不存在性能瓶颈",
      "分解请求各阶段耗时，检查锁等待、磁盘/网络 I/O、连接池排队等阻塞"
    ],
    "ans": [
      3
    ],
    "exp": "低 CPU 可能表示线程在等 I/O、锁或外部容量。应先用分段计时和适合的跟踪工具定位等待，再提出可验证的改动；CPU 采样热点不能完整解释离核运行时间。",
    "tags": [
      "engineering"
    ],
    "followUp": "怎样避免日志本身扭曲测量？控制采样率和日志量，使用单调时钟计时，并比较启用观测前后的开销。",
    "reference": {
      "title": "cppreference: std::chrono::steady_clock",
      "url": "https://en.cppreference.com/w/cpp/chrono/steady_clock.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai041",
    "cat": "syntax",
    "type": "single",
    "level": 1,
    "q": "读取大量整数并输出结果的工具耗时主要在输出。下面哪项能减少不必要的每行强制刷新，同时保留换行？",
    "options": [
      "把每行的 std::endl 改为 \n 字符输出，在需要时再显式 flush",
      "把所有输出都改成 std::cerr 且每行 flush",
      "每输出一个数字就调用 std::flush",
      "每行输出后调用 sleep"
    ],
    "ans": [
      0
    ],
    "exp": "std::endl 插入换行并刷新流，频繁刷新可能增加 I/O 开销。普通换行不要求每次强制刷新。交互协议或实时提示可能必须及时 flush，不能在这些位置盲目移除。",
    "tags": [
      "engineering"
    ],
    "followUp": "关闭 iostream 与 stdio 同步要注意什么？在 I/O 前设置并谨慎处理与 printf/scanf 混用；cin.tie(nullptr) 还会改变输入前自动刷新 cout 的行为。",
    "reference": {
      "title": "cppreference: std::endl",
      "url": "https://en.cppreference.com/w/cpp/io/manip/endl.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai042",
    "cat": "syntax",
    "type": "single",
    "level": 2,
    "q": "配置解析器用 stoi 解析端口。测试发现字符串 \"8080junk\" 被接受，而协议要求整串是合法端口。最直接的修复方向是？",
    "options": [
      "只检查字符串第一个字符是数字",
      "检查解析消耗位置是否到达末尾，并处理异常及合法端口范围",
      "只把 stoi 换成 atoi，忽略转换错误",
      "只要转换结果不为 0 就接受"
    ],
    "ans": [
      1
    ],
    "exp": "stoi 可以只转换合法数字前缀，用 pos 判断是否消耗完整输入，并处理 invalid_argument、out_of_range。还须根据协议明确空白、正负号及端口允许范围，避免把类型可表示范围等同于业务范围。",
    "tags": [
      "engineering"
    ],
    "followUp": "不希望用异常怎么办？可用 from_chars 检查 ec 和 ptr==end，再执行业务范围验证；它对空白等语法的规则与 stoi 不同。",
    "reference": {
      "title": "cppreference: std::stoi",
      "url": "https://en.cppreference.com/w/cpp/string/basic_string/stol.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai043",
    "cat": "syntax",
    "type": "single",
    "level": 2,
    "q": "缓存查找接口规定“未命中时不改变缓存”。下面代码违反了什么约定？",
    "code": "Value getOrDefault(const std::string& key) {\n  return cache[key]; // cache 是 std::unordered_map<std::string,Value>\n}",
    "options": [
      "unordered_map 不支持字符串键",
      "operator[] 总会删除旧值",
      "键不存在时 operator[] 会插入默认构造的 Value，产生读操作的副作用",
      "operator[] 查找总是 O(n log n)"
    ],
    "ans": [
      2
    ],
    "exp": "operator[] 在缺失键时插入新元素，可能分配内存并触发 rehash。应使用 find/contains 配合明确的缺失处理，或按接口约定使用 at 并处理异常。平均查询 O(1)，最坏 O(n)。",
    "tags": [
      "engineering",
      "stl"
    ],
    "followUp": "如何让接口表达未命中？可返回 optional<Value>、指针或状态加结果，结合复制成本和对象生命周期选择。",
    "reference": {
      "title": "cppreference: std::unordered_map::operator[]",
      "url": "https://en.cppreference.com/w/cpp/container/unordered_map/operator_at.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai044",
    "cat": "syntax",
    "type": "multi",
    "level": 3,
    "q": "更新配置时要求：解析或校验失败后，现有配置保持原样。哪些方案或判断正确？",
    "options": [
      "直接逐字段修改全局配置，失败时只记录日志即可满足要求",
      "这是强异常保证的典型目标，即失败操作对可观察状态无影响",
      "先在临时对象中完成解析和校验，再以不抛异常的提交操作替换旧配置",
      "最终提交步骤也需要检查是否可能抛异常或只完成一半"
    ],
    "ans": [
      1,
      2,
      3
    ],
    "exp": "准备新状态与提交旧状态应分开。临时对象失败后自动清理，提交若确实不抛异常即可实现事务式更新；若提交仍可能部分失败，就不能声称提供强保证。",
    "tags": [
      "engineering",
      "lifetime"
    ],
    "followUp": "多线程读者怎么办？除异常保证外还需同步发布，如锁保护整体替换或发布不可变快照，避免读到混合版本。",
    "reference": {
      "title": "cppreference: exceptions and exception safety",
      "url": "https://en.cppreference.com/w/cpp/language/exceptions.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai045",
    "cat": "syntax",
    "type": "single",
    "level": 1,
    "q": "面试中介绍团队项目时，被问到“你具体负责什么”。哪种回答最便于验证个人贡献？",
    "options": [
      "只列 C++、Redis、Linux 等技术名词",
      "只介绍整个团队最好的指标，不说明自己做了什么",
      "把所有架构决策都归为自己的工作",
      "说明自己负责的模块、约束、关键决策、可验证结果，并区分团队完成的部分"
    ],
    "ans": [
      3
    ],
    "exp": "职责、约束、决策和结果能形成可追问的证据链。例如解释自己如何定位问题、比较方案并验证改动。技术名词或团队总成果本身无法证明个人承担的工作。",
    "tags": [
      "engineering"
    ],
    "followUp": "没有漂亮性能数字怎么办？诚实描述已验证的正确性、覆盖场景、故障修复或维护性改善，并区分实测结果与估计。",
    "reference": {
      "title": "C++ Core Guidelines: P.1 Express ideas directly in code",
      "url": "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#p1-express-ideas-directly-in-code"
    },
    "source": "原创练习"
  },
  {
    "id": "ai046",
    "cat": "syntax",
    "type": "single",
    "level": 2,
    "q": "某重构后程序在 Debug 正常、Release 偶发错误。代码把必需的初始化放在 assert 中，最合理的修复是什么？",
    "code": "assert(loadConfig());\nstartService();",
    "options": [
      "让 Release 也永远关闭优化即可",
      "将 loadConfig 的调用与错误处理放到 assert 外，assert 只检查不依赖副作用的条件",
      "删除 loadConfig，默认认为配置正确",
      "把 assert 改成注释以避免报警"
    ],
    "ans": [
      1
    ],
    "exp": "定义 NDEBUG 时 assert 不求值其参数，因此 loadConfig 可能完全不执行。程序必需的副作用和运行时错误处理不能依赖断言是否启用。优化级别不同只是暴露该构建差异的表象。",
    "tags": [
      "engineering"
    ],
    "followUp": "assert 适合什么？用于表达开发阶段的不变量或内部前置条件；不应替代对外部不可信输入的常规校验。",
    "reference": {
      "title": "cppreference: assert",
      "url": "https://en.cppreference.com/w/cpp/error/assert.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai047",
    "cat": "syntax",
    "type": "single",
    "level": 2,
    "q": "性能测试中每次向 vector 追加一个元素前都 reserve(size()+1)，结果比不写 reserve 更慢。原因最可能是什么？",
    "code": "for (const auto& x : input) {\n  out.reserve(out.size()+1);\n  out.push_back(x);\n}",
    "options": [
      "reserve 会清空已有元素",
      "频繁精确请求小幅增长可能破坏几何扩容策略，引发反复重分配和搬移",
      "push_back 在 reserve 后必定退化为排序",
      "reserve 的复杂度与已有元素个数永远无关"
    ],
    "ans": [
      1
    ],
    "exp": "reserve 保证容量至少达到请求值，并不承诺几何增长。每次只增一个容量可能造成 O(n²) 总搬移；知道最终大小时可一次 reserve，否则通常让 vector 自行增长。",
    "tags": [
      "engineering",
      "stl"
    ],
    "followUp": "重分配还会影响什么？所有指向原存储元素的迭代器、指针和引用都会失效，外部缓存这些位置时尤其危险。",
    "reference": {
      "title": "cppreference: std::vector::reserve notes",
      "url": "https://en.cppreference.com/w/cpp/container/vector/reserve.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai048",
    "cat": "syntax",
    "type": "single",
    "level": 3,
    "q": "多个线程执行下面代码累计请求数，线上统计偏小。把 requests 加上 volatile 能否修复？",
    "code": "int requests=0;\n// 多个线程并发执行\n++requests;",
    "options": [
      "可以，volatile 使 ++ 成为原子操作",
      "可以，volatile 自动在所有线程间建立先后关系",
      "不需要修复，统计偏小只是精度误差且程序行为仍有定义",
      "不能；这是未同步的并发读写，可用原子计数或互斥保护"
    ],
    "ans": [
      3
    ],
    "exp": "普通对象并发读写构成数据竞争，C++ 中行为未定义。volatile 不提供线程同步，也不把读改写变成原子操作。纯计数且不发布其他状态时，atomic::fetch_add 的 relaxed 顺序通常足够。",
    "tags": [
      "engineering"
    ],
    "followUp": "为什么 relaxed 不适合直接发布任务就绪状态？它仅保证自身原子性，不能单独建立其他普通数据写入与读取之间所需的同步关系。",
    "reference": {
      "title": "cppreference: std::memory_order",
      "url": "https://en.cppreference.com/w/cpp/atomic/memory_order.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai049",
    "cat": "syntax",
    "type": "single",
    "level": 2,
    "q": "异步任务提交函数返回后才开始执行，下面捕获有什么问题？",
    "code": "void submitName(Executor& executor) {\n  std::string name=\"job\";\n  executor.post([&name] { consume(name); });\n}",
    "options": [
      "name 在函数返回时销毁，异步任务持有悬空引用，应按值捕获或转移所有权",
      "只要改成 [&]，捕获对象就会自动延寿",
      "lambda 一旦进入队列，所有局部变量都成为静态变量",
      "必须改成全局变量才有办法修复"
    ],
    "ans": [
      0
    ],
    "exp": "引用捕获不延长被引用对象生命周期。可按值捕获 name，或用 [name=std::move(name)] 将所需状态交给任务；任务对象本身的生命周期仍须由执行器正确管理。",
    "tags": [
      "engineering",
      "lifetime"
    ],
    "followUp": "捕获 this 也安全吗？this 捕获通常只保存指针；任务可能晚于对象销毁，应明确所有权、取消协议或使用适当的 weak_ptr 检查。",
    "reference": {
      "title": "cppreference: lambda expressions and dangling references",
      "url": "https://en.cppreference.com/w/cpp/language/lambda.html"
    },
    "source": "原创练习"
  },
  {
    "id": "ai050",
    "cat": "syntax",
    "type": "multi",
    "level": 3,
    "q": "要给“带过期时间的线程安全缓存”制定可验证的接口契约。哪些问题必须明确，才能可靠实现和测试？",
    "options": [
      "恰好到达过期时刻时，条目算有效还是失效",
      "只需声明“线程安全”，所有并发语义就已经明确",
      "get 返回的引用或视图在解锁、删除、替换后是否仍可使用",
      "过期计时是否应使用不受系统时间回拨影响的单调时钟"
    ],
    "ans": [
      0,
      2,
      3
    ],
    "exp": "边界比较、返回值生命周期和时钟语义都会直接改变正确性。线程安全也需说明单次操作及组合操作的保证；加锁查找后返回可被其他线程销毁的对象引用，仍可能产生悬空访问。",
    "tags": [
      "engineering",
      "lifetime"
    ],
    "followUp": "如何稳定测试过期？注入可控制的时钟，精确推进到边界前、边界上和边界后；避免依赖 sleep 的脆弱测试。",
    "reference": {
      "title": "cppreference: std::chrono::steady_clock",
      "url": "https://en.cppreference.com/w/cpp/chrono/steady_clock.html"
    },
    "source": "原创练习"
  }
];
if (typeof module !== 'undefined' && module.exports) module.exports=ALGORITHM_INTERVIEW;

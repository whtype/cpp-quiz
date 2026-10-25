/* 原创系统面试练习：并发 20、Linux 10、网络 15、客户端/嵌入式 5。 */
var SYSTEMS_INTERVIEW = [
  {
    id: 'si001', cat: 'interview', type: 'single', level: 1,
    q: '两个线程同时执行下面的代码，main 在 join 两个线程后打印 n。为什么不能断言结果一定是 200000？',
    code: 'int n = 0;\nvoid work() {\n  for (int i = 0; i < 100000; ++i) ++n;\n}',
    options: ['并发读写非原子 n 且没有同步，形成数据竞争，行为未定义', '结果只可能是 100000 或 200000', 'join 会补做丢失的加法', 'int 对齐后，++n 就由标准保证为原子操作'],
    ans: [0], exp: '++n 包含读和写；两个线程的冲突访问没有 happens-before 关系，因此是数据竞争，不能把后果只描述为少加几次。join 只建立线程完成与后续操作之间的同步，对齐也不使自增成为原子操作。',
    tags: ['concurrency', 'data-race'], followUp: '怎样修复？用互斥量保护所有访问，或使用 atomic 的 fetch_add；若只需要最终总数，也可分别计数后汇总。',
    reference: { title: 'cppreference：Data races', url: 'https://en.cppreference.com/w/cpp/language/multithread.html' }, source: '原创练习'
  },
  {
    id: 'si002', cat: 'interview', type: 'single', level: 1,
    q: '工作线程循环读取停止标志，主线程把标志设为 true。有人建议把普通 bool 改成 volatile bool。以下评审意见哪项正确？',
    options: ['volatile 自动建立线程间的发布订阅关系', 'volatile 不提供线程同步，应使用原子变量或互斥量', 'volatile 会让每次访问都获得互斥锁', '只要每次循环 sleep 一下，就不需要同步'],
    ans: [1], exp: 'volatile 主要约束特定访问的优化，不保证跨线程原子性或内存顺序。sleep 也不建立标志访问的同步关系；跨线程停止通信应采用合适的原子或锁。',
    tags: ['concurrency', 'memory-model'], followUp: '仅用于取消的原子标志能否 relaxed？若不承载其他数据的发布，通常可以；发布数据时需另行建立同步。',
    reference: { title: 'cppreference：cv qualifiers', url: 'https://en.cppreference.com/w/cpp/language/cv.html' }, source: '原创练习'
  },
  {
    id: 'si003', cat: 'interview', type: 'single', level: 2,
    q: '两个线程各执行一次 inc，n 初值为 0，随后都被 join。下面代码的判断哪项正确？',
    code: 'std::atomic<int> n{0};\nvoid inc() {\n  int old = n.load();\n  n.store(old + 1);\n}',
    options: ['默认顺序一致内存序保证最终一定是 2', 'atomic 只能用于 bool，所以代码不合法', '没有 n 上的数据竞争，但最终可能为 1；应考虑 fetch_add', '只把 load 改为 acquire 就能保证最终为 2'],
    ans: [2], exp: '单次 load 和 store 各自原子，但两者组成的读改写并不原子；两线程可都读到 0 再都写入 1。更强的内存序不能把两个独立操作合成一个不可分割的更新，fetch_add 才是原子读改写。',
    tags: ['concurrency', 'atomic'], followUp: '若更新规则不是简单加法呢？用 compare_exchange 重试循环，或用锁保护整个业务不变量。',
    reference: { title: 'cppreference：atomic::fetch_add', url: 'https://en.cppreference.com/w/cpp/atomic/atomic/fetch_add.html' }, source: '原创练习'
  },
  {
    id: 'si004', cat: 'interview', type: 'multi', level: 2,
    q: '审查线程池的互斥量使用，哪些做法符合 std::mutex 的使用约定？',
    options: ['任务交给另一线程时，让另一线程 unlock 当前线程持有的 mutex', '持锁线程再次 lock 同一个 std::mutex 来实现递归调用', '使用 lock_guard 在作用域结束时由持锁线程解锁', '同时锁住两个 mutex 时使用 std::scoped_lock 协调获取'],
    ans: [2, 3], exp: '锁的释放必须遵守所有权；普通 mutex 不支持同一线程递归获取。lock_guard 适合单锁作用域管理，C++17 scoped_lock 可同时管理多个互斥量并采用避免获取阶段死锁的算法，但不能解决任意业务等待环。',
    tags: ['concurrency', 'mutex'], followUp: 'scoped_lock 能解决所有死锁吗？不能；持锁等待任务完成、条件依赖环等仍需单独设计。',
    reference: { title: 'cppreference：scoped_lock', url: 'https://en.cppreference.com/w/cpp/thread/scoped_lock.html' }, source: '原创练习'
  },
  {
    id: 'si005', cat: 'interview', type: 'single', level: 2,
    q: '有多个消费者共享队列 q，所有队列访问都持有同一个 mutex。下面取任务的代码应怎样修改？',
    code: 'std::unique_lock<std::mutex> lk(m);\nif (q.empty()) cv.wait(lk);\nauto task = q.front();\nq.pop();',
    options: ['改为 cv.wait(lk, [&]{ return !q.empty(); });，醒来重新检查谓词', '把 if 改成 if (!q.empty())', 'wait 返回后先 unlock，再调用 front', '生产者每次 notify_all 后保证任意消费者都能取到任务'],
    ans: [0], exp: '可能虚假唤醒，也可能任务先被其他消费者取走，所以 wait 返回不等于队列非空。谓词版等待会在持锁状态下反复检查；解锁后访问队列破坏保护，notify_all 也不提供每个线程一份任务。',
    tags: ['concurrency', 'condition-variable'], followUp: '为什么谓词状态也要用同一把锁保护？使检查、修改状态与等待的解锁阻塞过程协调，避免数据竞争和丢失唤醒。',
    reference: { title: 'cppreference：condition_variable::wait', url: 'https://en.cppreference.com/w/cpp/thread/condition_variable/wait.html' }, source: '原创练习'
  },
  {
    id: 'si006', cat: 'interview', type: 'single', level: 2,
    q: '线程池关闭时要求把已入队任务全部做完，再让所有消费者退出。队列 q 和 stop 都受同一把锁保护，正确的消费者策略是什么？',
    options: ['只等 !q.empty()，关闭时设置 stop 即可', '等待 stop || !q.empty()；仅当 stop && q.empty() 时退出，关闭方设置 stop 后 notify_all', '一看到 stop 就退出，剩余任务自然会执行', '关闭方只 notify_one，其他消费者一定会自动醒来'],
    ans: [1], exp: '关闭状态必须进入等待谓词，保证空队列中的消费者也能结束；退出条件同时要求队列已空，才能排空任务。关闭过程还应禁止新的任务继续入队。只通知一个等待线程无法保证所有线程退出。',
    tags: ['concurrency', 'thread-pool'], followUp: '如果任务持续产生新任务怎么办？定义关闭后的提交策略，例如拒绝提交并返回错误，避免排空永远无法完成。',
    reference: { title: 'cppreference：condition_variable::notify_all', url: 'https://en.cppreference.com/w/cpp/thread/condition_variable/notify_all.html' }, source: '原创练习'
  },
  {
    id: 'si007', cat: 'interview', type: 'single', level: 3,
    q: '以下只发布一次的数据，payload 在发布后不再修改；读线程的 load 读到了发布线程写入的 true。此时打印 payload 的结论是什么？',
    code: 'int payload = 0;\nstd::atomic<bool> ready{false};\n// 发布线程\npayload = 42;\nready.store(true, std::memory_order_release);\n// 读线程\nif (ready.load(std::memory_order_acquire))\n  std::cout << payload;',
    options: ['payload 必须也是 atomic，否则一定有数据竞争', '只有换成 seq_cst 才能保证读取结果', '这次 release/acquire 同步使 payload 的写先于读，输出 42', 'acquire 能看到其他线程未来才执行的任意写入'],
    ans: [2], exp: 'acquire 读到该 release 写入的值时形成同步，发布前的 payload 写入 happens-before 读取，因此非原子数据也可安全发布。该保证有明确的发布关系，不覆盖未来写入；不能无条件类推到反复复用且并发改写的 payload。',
    tags: ['concurrency', 'memory-model'], followUp: 'ready 改回 false 后能直接重复使用吗？不能仅据此保证安全；需要确认上一轮读者结束并建立每轮所有权或同步协议。',
    reference: { title: 'cppreference：memory_order', url: 'https://en.cppreference.com/w/cpp/atomic/memory_order.html' }, source: '原创练习'
  },
  {
    id: 'si008', cat: 'interview', type: 'multi', level: 2,
    q: '只用于统计完成任务数量的 std::atomic<unsigned> 使用 relaxed 的 fetch_add。以下哪些说法正确？假设不发生整数回绕。',
    options: ['仅观察计数增长，就能安全读取任意工作线程写入的非原子结果', 'relaxed 允许一次 fetch_add 只执行一半而被其他线程看见', '多个线程的 fetch_add 不会因为读改写冲突丢失增量', '所有工作线程被 join 后，可以读取最终总数；join 也提供线程完成的同步'],
    ans: [2, 3], exp: 'relaxed 保留单个原子对象的原子性和修改顺序，但本身不发布其他对象的内容。join 建立完成同步；如果要在工作线程运行时通过计数推断结果可读，则还需合适的发布协议。',
    tags: ['concurrency', 'atomic'], followUp: '高并发计数仍慢的原因可能是什么？所有线程争用同一缓存行；可使用线程局部计数、分片统计并按需聚合。',
    reference: { title: 'cppreference：memory_order', url: 'https://en.cppreference.com/w/cpp/atomic/memory_order.html' }, source: '原创练习'
  },
  {
    id: 'si009', cat: 'interview', type: 'single', level: 2,
    q: '线程 t 独占写入 result，主线程在 t.join() 成功返回之后才读取 result；没有其他线程访问它。result 必须是 atomic 吗？',
    options: ['必须把 result 声明为 volatile，join 才有效', '必须，否则两个线程只要碰过同一个变量就有数据竞争', '不必，因为 join 会把 result 复制到主线程栈上', '不必；线程完成与 join 返回建立同步，前提是确实没有其他冲突访问'],
    ans: [3], exp: '数据竞争取决于冲突访问是否被同步排序，而不是变量是否曾被两个线程使用。join 提供完成同步，不依赖复制变量或 volatile；若主线程在 join 前就读取，则需重新检查安全性。',
    tags: ['concurrency', 'thread-lifetime'], followUp: 'detach 能替代 join 来读取结果吗？不能；detach 只解除线程对象关联，结果就绪与对象存活仍需其他机制保证。',
    reference: { title: 'cppreference：thread::join', url: 'https://en.cppreference.com/w/cpp/thread/thread/join.html' }, source: '原创练习'
  },
  {
    id: 'si010', cat: 'interview', type: 'single', level: 3,
    q: '读线程 acquire-load 一个 atomic<Node*> 后访问节点；写线程 exchange 成新节点，随即 delete 旧节点。仅依靠原子指针和 release/acquire 能保证安全吗？',
    options: ['能，因为 exchange 会等待所有读线程离开旧节点', '不能；原子指针解决指针访问，不保证旧节点已无人使用，需要安全回收机制', '能，只要 Node 中没有虚函数', '将 load 改成 seq_cst 就能延长旧节点生命期'],
    ans: [1], exp: '读者可能已拿到旧地址但还未完成访问，写者删除后会造成 use-after-free。内存序不能替代生命期管理，应考虑带锁访问、适用的共享所有权、hazard pointer 或 epoch 回收等方案。',
    tags: ['concurrency', 'memory-reclamation'], followUp: 'shared_ptr 方案要注意什么？共享指针变量自身也要安全发布；C++20 atomic<shared_ptr<T>> 可管理原子访问，但不保证实现无锁。',
    reference: { title: 'cppreference：atomic<shared_ptr>', url: 'https://en.cppreference.com/w/cpp/memory/shared_ptr/atomic2.html' }, source: '原创练习'
  },
  {
    id: 'si011', cat: 'interview', type: 'single', level: 2,
    q: '转账操作要同时锁住两个账户。A→B 与 B→A 并发时偶发卡死，且各线程已持有一把锁并等待另一把。哪项修复最直接？',
    options: ['把 mutex 改成 volatile mutex', '每次拿到第一把锁后 sleep，让调度更公平', '统一账户锁的获取顺序，或对不同的两把锁使用 std::scoped_lock', '将两个线程的优先级设为相同'],
    ans: [2], exp: '两个方向反序获取锁可能形成循环等待。统一顺序或联合获取不同互斥量可消除这个获取模式下的死锁；sleep 和优先级都没有破坏循环等待条件。若两个账户相同，还需先处理自转账，不能重复传入同一普通 mutex。',
    tags: ['concurrency', 'deadlock'], followUp: '持锁调用未知回调有何风险？回调可能重入、获取其他锁或阻塞，从而引入隐藏的锁顺序与等待关系。',
    reference: { title: 'cppreference：scoped_lock', url: 'https://en.cppreference.com/w/cpp/thread/scoped_lock.html' }, source: '原创练习'
  },
  {
    id: 'si012', cat: 'interview', type: 'single', level: 1,
    q: '假设 std::thread 创建成功，下面函数正常离开作用域时会发生什么？',
    code: 'void start() {\n  std::thread t([] { do_work(); });\n}',
    options: ['t 的析构函数自动等待 do_work 完成', '只有 do_work 尚未结束时才出错', 't 会自动 detach，继续后台执行', 't 仍是 joinable，析构会调用 std::terminate'],
    ans: [3], exp: 'std::thread 即使底层线程函数已经返回，在 join 或 detach 前仍可处于 joinable 状态；其析构不能自动等待，也不会自动分离。应明确选择生命周期策略，可按需求使用具有自动 join 行为的 C++20 jthread。',
    tags: ['concurrency', 'thread-lifetime'], followUp: 'jthread 析构意味着强行杀死线程吗？不是；它请求停止并 join，线程逻辑需要协作响应停止请求。',
    reference: { title: 'cppreference：thread destructor', url: 'https://en.cppreference.com/w/cpp/thread/thread/~thread.html' }, source: '原创练习'
  },
  {
    id: 'si013', cat: 'interview', type: 'multi', level: 2,
    q: '缓存用 std::shared_mutex 保护，多个查询线程持有 shared_lock。哪些评审意见正确？',
    options: ['shared_lock 允许多个读者同时进入，并不允许无同步地改写共享容器', '查询时调用 map[key]，缺失时自动插入，也一定属于只读操作', '插入通常应持有独占锁；若从共享锁切换为独占锁，应重新检查条件', 'shared_mutex 由 C++ 标准保证写线程绝不会饥饿'],
    ans: [0, 2], exp: '共享锁仅使多个共享持有者共存；map::operator[] 可能插入，不能作为通用只读查询。先解共享锁再取独占锁期间状态会改变，所以需要复查。标准并未统一保证共享互斥量的读写公平策略。',
    tags: ['concurrency', 'shared-mutex'], followUp: '只读查询怎么写？使用 find、contains 等不插入的接口，并保证返回引用在锁释放后的生命周期与并发访问仍安全。',
    reference: { title: 'cppreference：shared_mutex', url: 'https://en.cppreference.com/w/cpp/thread/shared_mutex.html' }, source: '原创练习'
  },
  {
    id: 'si014', cat: 'interview', type: 'single', level: 3,
    q: '余额和冻结金额分别是 seq_cst 的 atomic<int>。一次操作先改余额、后改冻结金额，读者分别 load 两者。为什么仍可能读到业务上不一致的组合？',
    options: ['seq_cst 原子变量可能撕裂读取', '顺序一致提供原子操作间的全序，但不把两个对象的多次操作变成事务', 'atomic 只在单线程程序中有效', '把读者的 load 都换为 acquire 就能保证整个快照一致'],
    ans: [1], exp: '读者可能在两个更新之间读取，即使所有单次原子操作都遵守全序，也会得到中间状态。跨字段不变量需要锁、合并状态的单一原子更新或经过严谨设计的快照协议；降低内存序并不能修复原子性边界。',
    tags: ['concurrency', 'memory-model'], followUp: '用一个版本号做 seqlock 就一定安全？不一定；若直接并发访问普通 C++ 字段，仍可能违反数据竞争规则，不能照搬底层平台惯例。',
    reference: { title: 'cppreference：memory_order', url: 'https://en.cppreference.com/w/cpp/atomic/memory_order.html' }, source: '原创练习'
  },
  {
    id: 'si015', cat: 'interview', type: 'single', level: 3,
    q: '下面函数希望将原子变量 x 加一，假设不溢出。关于 compare_exchange_weak 的理解，哪项正确？',
    code: 'int old = x.load();\nwhile (!x.compare_exchange_weak(old, old + 1)) {\n  // retry\n}',
    options: ['失败时 old 永远保持最初 load 的值', 'weak 只可能因比较不相等而失败，不允许伪失败', '失败时会更新 expected 参数 old；重试时应基于当前 old 重新计算 desired', '把 while 换成单个 if 仍保证这次加一一定执行成功'],
    ans: [2], exp: '失败会把读取到的实际值写回 expected；weak 也允许伪失败，因此通常放在循环中。表达式 old + 1 每次调用前重新计算，适应竞争更新；单次失败后直接返回无法保证完成加一。',
    tags: ['concurrency', 'compare-exchange'], followUp: '重试体能发送通知或扣外部账户吗？需谨慎；重试可能重复执行副作用，一般在更新成功后处理，或设计幂等协议。',
    reference: { title: 'cppreference：atomic::compare_exchange', url: 'https://en.cppreference.com/w/cpp/atomic/atomic/compare_exchange.html' }, source: '原创练习'
  },
  {
    id: 'si016', cat: 'interview', type: 'multi', level: 2,
    q: '生产者和消费者使用同一 mutex 保护 ready 谓词，条件变量和共享状态的生命期均得到保证。哪些说法正确？',
    options: ['notify_one 本身会把 ready 自动设为 true', '只要 notify 发生过，后来调用 wait 的线程一定不阻塞', '生产者可以持锁修改 ready，解锁后 notify_one', '也可以持锁 notify_one，但被唤醒者仍要重新获得锁才能从 wait 返回'],
    ans: [2, 3], exp: '条件变量不保存一张可由未来等待者领取的通知票；正确性依赖受锁保护的谓词。通知可在锁内或解锁后进行，后者常减少唤醒后抢锁，但必须保证等待对象和状态仍存活。',
    tags: ['concurrency', 'condition-variable'], followUp: '通知早于消费者 wait 会怎样？消费者持锁检查谓词，若 ready 已为 true 就不进入等待，因此正确协议不会仅因通知早到而卡住。',
    reference: { title: 'cppreference：condition_variable::notify_one', url: 'https://en.cppreference.com/w/cpp/thread/condition_variable/notify_one.html' }, source: '原创练习'
  },
  {
    id: 'si017', cat: 'interview', type: 'single', level: 2,
    q: '下面显式异步启动的任务抛出异常，调用者如何按标准取得该异常？',
    code: 'auto f = std::async(std::launch::async, []() -> int {\n  throw std::runtime_error("failed");\n});',
    options: ['调用 f.get()，异常会在该处重新抛出', '异常会自动在创建任务那一行同步抛出', '调用 f.wait() 就会重新抛出任务异常', '任务抛异常必定像未捕获的原始 thread 异常一样立即终止进程'],
    ans: [0], exp: 'async 将任务结果或异常保存在共享状态中，get 获取结果时重新抛出异常；wait 只等待就绪。异步启动本身也可能失败并抛异常，但那与任务体中的异常不是一回事。',
    tags: ['concurrency', 'future'], followUp: '同一个 future 可以 get 两次吗？普通 future 的有效共享状态在 get 后被消费；需要多方读取时考虑 shared_future。',
    reference: { title: 'cppreference：future::get', url: 'https://en.cppreference.com/w/cpp/thread/future/get.html' }, source: '原创练习'
  },
  {
    id: 'si018', cat: 'interview', type: 'single', level: 1,
    q: '线程池使用 thread_local std::string 保存请求编号。同一工作线程依次处理不同请求，哪项风险判断正确？',
    options: ['thread_local 会在每次任务开始时自动清空', 'thread_local 自动随协程迁移到另一个工作线程', 'thread_local 是所有线程共享的唯一字符串', '变量按线程存储，会跨任务保留；每个请求应明确设置并清理上下文'],
    ans: [3], exp: 'thread_local 的生命周期与线程关联，不是与请求、任务或协程关联。线程池复用线程时可能残留前一请求的信息；跨线程调度也不能依赖它自动携带逻辑请求上下文。',
    tags: ['concurrency', 'thread-local'], followUp: '如何避免异常路径忘记清理？用作用域守卫恢复原上下文，或者把请求上下文显式传递给任务。',
    reference: { title: 'cppreference：Storage duration', url: 'https://en.cppreference.com/w/cpp/language/storage_duration.html' }, source: '原创练习'
  },
  {
    id: 'si019', cat: 'interview', type: 'single', level: 2,
    q: '开发者使用 std::async(work)，不指定启动策略，并期待任务必定立即在新线程运行。哪项结论正确？',
    options: ['默认策略只允许 async，必定创建新线程', '默认策略等同 detach，不需要保存 future', '实现可以选择延迟执行；如需异步策略，应明确传入 std::launch::async 并处理启动失败', '只要不调用 get，任务也一定已开始执行'],
    ans: [2], exp: '默认策略允许 async 或 deferred，不能假定立刻产生并行执行。延迟任务通常在首次非定时等待它的线程中执行；显式 async 表达异步需求，但资源不足仍可能导致启动异常。',
    tags: ['concurrency', 'async'], followUp: '为什么反复丢弃 async 返回的临时 future 可能看起来串行？最后一个关联异步共享状态的 future 析构在相应条件下会等待任务完成。',
    reference: { title: 'cppreference：async', url: 'https://en.cppreference.com/w/cpp/thread/async.html' }, source: '原创练习'
  },
  {
    id: 'si020', cat: 'interview', type: 'single', level: 3,
    q: '无锁栈线程 T1 读到头指针 A 和 next=B 后暂停；T2 弹出 A、弹出 B，再把仍存活的 A 压回，A 的 next 已变成 C。T1 仅比较头指针仍为 A 并 CAS 成 B，问题是什么？',
    options: ['CAS 会自动检测 A 在中间被移除过，因此一定失败', '只要没有 delete 节点，该算法必定安全', '将所有原子操作设为 seq_cst 就会禁止这种交错', '发生 ABA；指针值恢复不能证明链表状态未变化，旧 next 可能已失效'],
    ans: [3], exp: '比较的地址从 A 变为其他值再回到 A，CAS 仅比较当前值，无法发现历史变化。即使节点内存尚未释放，栈结构也可能被错误恢复；更强内存序不提供版本检测。需结合算法选择标签版本、所有权及安全回收策略。',
    tags: ['concurrency', 'lock-free'], followUp: '带版本号的指针就彻底解决了吗？还要分析版本回绕、原子宽度支持及节点生命周期；ABA 检测和内存回收是相关但不同的问题。',
    reference: { title: 'cppreference：atomic::compare_exchange', url: 'https://en.cppreference.com/w/cpp/atomic/atomic/compare_exchange.html' }, source: '原创练习'
  },
  {
    id: 'si021', cat: 'interview', type: 'single', level: 1,
    q: 'Linux 服务对一个常规文件调用 read(fd, buf, 4096)，返回 1000。当前最稳妥的处理是什么？',
    options: ['消费已读的 1000 字节；若协议或任务还需要数据，再继续读并检查后续返回值', '返回值不足 4096 就代表调用失败，应丢弃 buf', '只有读满 4096 才能访问 buf 中任何数据', 'read 已经为 buf 自动补上字符串结束符'],
    ans: [0], exp: '正返回值是实际读入字节数，短读不是错误，也不承诺补零或补字符串终止符。读到 EOF 时返回 0，错误返回 -1；应用应按实际长度处理，不能读取缓冲区中未被本次填充的部分。',
    tags: ['linux', 'io'], followUp: 'read 返回 -1 且 errno 为 EINTR 怎么办？在本次未返回数据的情况下，通常按业务取消与重试策略重新调用。',
    reference: { title: 'Linux man-pages：read(2)', url: 'https://man7.org/linux/man-pages/man2/read.2.html' }, source: '原创练习'
  },
  {
    id: 'si022', cat: 'interview', type: 'single', level: 2,
    q: '程序打开文件得到 fd1，再调用 fd2=dup(fd1)。随后通过 fd1 读取 10 字节，再用 fd2 读取。关于文件偏移，哪项正确？',
    options: ['fd2 有独立偏移，始终从文件起点读取', '两个描述符引用同一 open file description，因此共享当前文件偏移', 'dup 会把整个文件复制到一个临时文件', '只有两个描述符整数相同才会共享偏移'],
    ans: [1], exp: 'dup 创建新的文件描述符，指向同一打开文件描述，因此共享偏移和文件状态标志。描述符自身的标志如 FD_CLOEXEC 与共享的文件状态标志不是同一层次，不能混为一谈。',
    tags: ['linux', 'file-descriptor'], followUp: '需要按指定位置读取且不改共享偏移怎么办？普通文件可使用 pread；若需要独立偏移，也可分别 open。',
    reference: { title: 'Linux man-pages：dup(2)', url: 'https://man7.org/linux/man-pages/man2/dup.2.html' }, source: '原创练习'
  },
  {
    id: 'si023', cat: 'interview', type: 'multi', level: 2,
    q: '服务会创建辅助进程并 exec，近期发现辅助进程意外继承了监听 socket。哪些处理或解释正确？',
    options: ['exec 会无条件关闭所有大于 2 的描述符', '先创建 fd 再 fcntl 设置 CLOEXEC，在多线程中永远没有竞态窗口', '可在支持的接口中使用 SOCK_CLOEXEC、O_CLOEXEC 等原子创建标志', 'FD_CLOEXEC 使成功 exec 时关闭相应描述符；它不是 fork 时禁止继承'],
    ans: [2, 3], exp: '普通描述符可以跨 exec 保留；CLOEXEC 标志约束成功 exec 的行为。创建后另行设置标志在其他线程同时 fork/exec 时可能出现窗口，原子创建选项可避免该类泄漏；不能把 close-on-exec 误当成 close-on-fork。',
    tags: ['linux', 'file-descriptor'], followUp: '监听 fd 泄漏可能产生什么现象？父进程关闭后端口或连接资源仍被子进程持有，生命周期和退出行为变得异常。',
    reference: { title: 'Linux man-pages：open(2)', url: 'https://man7.org/linux/man-pages/man2/open.2.html' }, source: '原创练习'
  },
  {
    id: 'si024', cat: 'interview', type: 'single', level: 1,
    q: 'AddressSanitizer 报告以下访问为 heap-use-after-free。最合适的修复方向是什么？',
    code: 'int* p = new int(7);\nint* alias = p;\ndelete p;\np = nullptr;\nstd::cout << *alias;',
    options: ['关闭 AddressSanitizer，它影响了内存布局', '把 p 设为 nullptr 后，所有别名已经自动失效为 nullptr', '将输出处改成 volatile 读取，就能保证数据还在', '修正所有权和使用顺序，使任何别名都不再访问已结束生命周期的对象'],
    ans: [3], exp: '给一个指针赋 nullptr 不会修改其他别名；delete 后通过 alias 解引用属于悬垂访问。工具报告应促使检查对象的分配、释放和使用链路，而不是通过优化选项或 volatile 掩盖。',
    tags: ['linux', 'debugging'], followUp: 'shared_ptr 能自动修好所有悬垂引用吗？不能；原始指针、引用和异步回调仍可能越过所有者生命期，需要明确持有关系。',
    reference: { title: 'Clang：AddressSanitizer', url: 'https://clang.llvm.org/docs/AddressSanitizer.html' }, source: '原创练习'
  },
  {
    id: 'si025', cat: 'interview', type: 'single', level: 2,
    q: '线上进程 CPU 很低却一直不响应请求。你已获准短时间附加调试器，哪组证据最有助于判断是否在锁等待或阻塞 I/O？',
    options: ['查看所有线程的调用栈，结合系统调用跟踪和线程状态定位等待位置', '只看主线程第一帧，就能排除死锁', 'CPU 低证明程序没有性能问题', '先把所有互斥量换成自旋锁，再观察请求'],
    ans: [0], exp: '低 CPU 可能是等待锁、网络、磁盘或其他条件，不能直接定位。所有线程栈可揭示等待关系，系统调用和状态可补充阻塞证据；直接替换锁可能把等待变为高 CPU，并掩盖根因。',
    tags: ['linux', 'debugging'], followUp: 'GDB 如何批量看线程栈？使用 info threads 和 thread apply all bt，并注意附加调试可能短暂停止目标进程。',
    reference: { title: 'GDB manual：Threads', url: 'https://sourceware.org/gdb/current/onlinedocs/gdb.html/Threads.html' }, source: '原创练习'
  },
  {
    id: 'si026', cat: 'interview', type: 'single', level: 2,
    q: '程序某次调用成功后检查 errno，发现它仍等于上一次失败留下的 EAGAIN，于是报告错误。问题在哪里？',
    options: ['errno 永远是进程里所有线程共享的一份普通变量', '应先根据接口返回值判断失败，再按接口约定读取 errno；成功通常不承诺清零 errno', '每次函数成功都会把 errno 变成 0，因此一定是内存破坏', '只要 errno 非零，当前最近一次调用必定失败'],
    ans: [1], exp: 'errno 只有在相关接口通过约定的返回方式表示错误时才有对应意义；成功调用可能保留旧值。某些接口存在特殊判定规则，应查看其文档；errno 也不是用于判断任意 C++ 函数成功与否的通用状态。',
    tags: ['linux', 'error-handling'], followUp: '打印日志前为何常保存 errno？后续库调用可能改变它，应在失败点保存错误号，再进行格式化和输出。',
    reference: { title: 'Linux man-pages：errno(3)', url: 'https://man7.org/linux/man-pages/man3/errno.3.html' }, source: '原创练习'
  },
  {
    id: 'si027', cat: 'interview', type: 'single', level: 3,
    q: 'SIGTERM 处理器直接使用 std::cout 输出并对 std::mutex 加锁，线上偶发挂死。合理的改造方向是什么？',
    options: ['将锁改为 recursive_mutex 就能保证信号安全', '屏蔽编译器优化后，所有库函数都可用于信号处理器', '处理器只做符合异步信号安全约束的最小操作，再让正常执行路径完成日志和清理', '只要信号只发送一次，处理器调用什么都安全'],
    ans: [2], exp: '信号可能打断正持有内部锁的代码，处理器再次进入不安全的库或锁操作可能死锁。应遵守 async-signal-safe 约束，例如采用经正确设计的非阻塞 self-pipe 通知，或在 Linux 使用专门线程与信号接收机制处理。',
    tags: ['linux', 'signals'], followUp: '在处理器里 write 就一定不会卡住吗？write 是异步信号安全接口，但阻塞 fd 仍可能阻塞；通知管道通常需非阻塞并处理缓冲区已满。',
    reference: { title: 'Linux man-pages：signal-safety(7)', url: 'https://man7.org/linux/man-pages/man7/signal-safety.7.html' }, source: '原创练习'
  },
  {
    id: 'si028', cat: 'interview', type: 'single', level: 2,
    q: '更新配置文件要求崩溃恢复后尽量满足持久化承诺：先写同目录临时文件，再 rename 覆盖目标。仅 write 成功和 rename 成功能证明断电后新配置仍在吗？',
    options: ['能，write 返回就等于硬盘介质已写入', '能，rename 自动为文件内容与父目录执行 fsync', '只需 fflush，内核缓存便一定持久化了', '不能；需结合文件 fsync、rename 后父目录 fsync、错误处理及文件系统语义设计'],
    ans: [3], exp: 'write 成功通常只是数据被内核接受；rename 的名称切换原子性不等同断电持久性。常见方案先同步临时文件，再 rename，再同步目录，并检查每步错误；具体保障还依赖文件系统和存储设备。',
    tags: ['linux', 'durability'], followUp: '为什么文件 fsync 后还考虑目录 fsync？文件内容与目录项更新是不同的持久化对象，替换后的名字关联也需要被保存。',
    reference: { title: 'Linux man-pages：fsync(2)', url: 'https://man7.org/linux/man-pages/man2/fsync.2.html' }, source: '原创练习'
  },
  {
    id: 'si029', cat: 'interview', type: 'single', level: 1,
    q: '准备分析生产环境 core 文件，但开发机上只有重新编译过的另一份可执行文件。怎样才能得到更可信的崩溃栈？',
    options: ['保留并使用崩溃版本对应的可执行文件、共享库及匹配调试符号', '任意同名二进制都可以，函数名相同就足够', '只要源码目录相同，机器码差异不影响回溯', '先删除 core 中的线程信息，回溯就更准确'],
    ans: [0], exp: '栈地址解释依赖崩溃时实际加载的机器码与符号信息，不匹配的二进制可能导致错误的函数和行号。应建立构建产物与符号的版本关联，同时保存运行依赖信息。',
    tags: ['linux', 'debugging'], followUp: '没有调试符号还能看什么？仍可查看寄存器、部分符号、反汇编与映射，但源码行号和局部变量信息通常受限。',
    reference: { title: 'GDB manual：Files', url: 'https://sourceware.org/gdb/current/onlinedocs/gdb.html/Files.html' }, source: '原创练习'
  },
  {
    id: 'si030', cat: 'interview', type: 'multi', level: 3,
    q: '多线程进程 fork 后，子进程准备 exec 新程序。关于这段窗口期，哪些说法正确？',
    options: ['fork 会在子进程中复制出父进程所有工作线程并继续运行', '子进程可以不加分析地继续使用父进程中任意 C++ 库状态', '子进程只有调用 fork 的线程，而锁状态可能来自已经不存在的其他线程', 'exec 前应遵守多线程 fork 后的异步信号安全限制，必要时评估 posix_spawn 等替代接口'],
    ans: [2, 3], exp: '地址空间状态被复制并不意味着全部线程被复制；其他线程持有的锁可能遗留为锁住状态。子进程在 exec 前不能任意调用可能依赖这些状态的非异步信号安全函数，需按受支持的启动路径设计。',
    tags: ['linux', 'process'], followUp: 'pthread_atfork 是万能补救吗？不是；它可协调已知锁，但第三方库锁与复杂运行时状态很难全面覆盖。',
    reference: { title: 'Linux man-pages：fork(2)', url: 'https://man7.org/linux/man-pages/man2/fork.2.html' }, source: '原创练习'
  },
  {
    id: 'si031', cat: 'interview', type: 'single', level: 1,
    q: '客户端在同一个 TCP 连接中先后 send 两条各 8 字节的消息。服务端执行下面代码，哪项判断正确？假设 buf 至少 16 字节。',
    code: 'int n = recv(fd, buf, 16, 0);\nif (n > 0) handle_one_message(buf, n);',
    options: ['每次 recv 一定对应一次 send，代码天然正确', 'TCP 可靠传输意味着 recv 不会短读', '必须按应用协议累计和解析字节流，可能只到一部分或一次到多条', '把 TCP_NODELAY 打开后，每次 recv 就与 send 一一对应'],
    ans: [2], exp: 'TCP 提供有序字节流，不保留应用 send 调用的消息边界。应用需要固定长度、长度字段或分隔符等定界协议，并保留不完整数据；禁用 Nagle 不会把 TCP 变成消息协议。',
    tags: ['network', 'tcp'], followUp: '长度前缀解析先检查什么？检查头是否完整、长度是否合法及是否超过上限，再判断完整帧是否已到齐。',
    reference: { title: 'RFC 9293：Transmission Control Protocol', url: 'https://www.rfc-editor.org/rfc/rfc9293.html' }, source: '原创练习'
  },
  {
    id: 'si032', cat: 'interview', type: 'single', level: 2,
    q: '非阻塞 TCP socket 上 send(buf, 10000) 返回 3000。服务端还要发送剩余数据，正确策略是什么？',
    options: ['重新发送 buf 的全部 10000 字节，TCP 会自动去除应用层重复', '把本次请求当成发送失败，立即关闭所有连接', '既然返回正值，其余 7000 字节已经在内核排队', '推进发送偏移 3000，保留余下字节，遇 EAGAIN 时等待后续可写机会'],
    ans: [3], exp: '返回值只表示本次接受的字节数，应用负责剩余部分；重发整个缓冲区会造成应用层重复。可写仅意味着能尝试发送，不保证一次写完；应维护每个连接的发送队列、偏移和上限。',
    tags: ['network', 'nonblocking-io'], followUp: '什么时候关注 EPOLLOUT？通常在存在尚未发完的数据且需等待可写时关注，发送队列清空后撤销不必要的关注。',
    reference: { title: 'Linux man-pages：send(2)', url: 'https://man7.org/linux/man-pages/man2/send.2.html' }, source: '原创练习'
  },
  {
    id: 'si033', cat: 'interview', type: 'single', level: 2,
    q: 'Linux 中监听 socket 已设 O_NONBLOCK，accept 返回的新连接直接交给事件循环。哪项初始化意见正确？',
    options: ['不能假设新 socket 继承 O_NONBLOCK；可用 accept4 的 SOCK_NONBLOCK 显式设置', '监听 socket 非阻塞，则所有 accept 返回的 socket 都由 Linux 保证非阻塞', '只有连接收到第一个数据包后才能设置非阻塞', '新 socket 必须使用阻塞模式才能注册 epoll'],
    ans: [0], exp: 'Linux 的 accept 返回 socket 不继承监听 socket 的 O_NONBLOCK 等文件状态标志；应显式设置，支持时可用 accept4 原子完成。漏设可能让事件循环中的 recv 阻塞，拖住其他连接。',
    tags: ['network', 'linux'], followUp: 'accept4 还常带哪个标志？SOCK_CLOEXEC，用于避免 socket 被后续 exec 的程序意外继承。',
    reference: { title: 'Linux man-pages：accept(2)', url: 'https://man7.org/linux/man-pages/man2/accept.2.html' }, source: '原创练习'
  },
  {
    id: 'si034', cat: 'interview', type: 'single', level: 3,
    q: '使用非阻塞 socket 的 epoll ET 服务为公平性限制单次读取最多 64 KiB。某连接达到预算时，内核接收缓冲区可能还有数据。正确的调度方案是什么？',
    options: ['直接回到 epoll_wait，剩余数据必定再次触发边沿通知', '将尚未排空的连接放入用户态就绪队列继续轮转，最终读到 EAGAIN；不能只等新边沿', '达到预算后切换阻塞模式，一直等待新数据', '每次只读一个字节，可以增加边沿事件数量'],
    ans: [1], exp: 'ET 下不能依赖已有未读数据自动带来新的通知。可持续读取直到 EAGAIN，或为公平性分片执行并保留用户态就绪状态；EINTR 应按策略重试，返回 0 与不可恢复错误则分别处理关闭或失败。',
    tags: ['network', 'epoll'], followUp: '为什么不要求每次回调无限读到底？高流量连接可能长期占用事件循环；预算与用户态就绪队列可在不丢失进展的前提下改善公平性。',
    reference: { title: 'Linux man-pages：epoll(7)', url: 'https://man7.org/linux/man-pages/man7/epoll.7.html' }, source: '原创练习'
  },
  {
    id: 'si035', cat: 'interview', type: 'single', level: 2,
    q: 'TCP 对端发送一条请求后调用 shutdown(SHUT_WR)，希望继续接收响应。服务端读完请求后 recv 返回 0，应怎样理解？',
    options: ['对端已无法接收任何数据，所以服务端绝不能发送响应', '只是这次没有数据，下一次可以继续读同一方向的新请求', '对端发送方向已正常结束；服务端仍可按协议在自己的发送方向返回响应', '返回 0 与 EAGAIN 完全等价'],
    ans: [2], exp: 'TCP 支持半关闭，接收方向读到有序结束不等于本地发送方向立即不可用。需要区分 EOF、暂时无数据和连接错误，并按应用协议决定何时关闭整个连接。',
    tags: ['network', 'tcp'], followUp: '如果 EOF 到达时仅收到半条请求？应视为不完整帧并按协议报错或清理，不能将半条数据当成完整请求。',
    reference: { title: 'Linux man-pages：shutdown(2)', url: 'https://man7.org/linux/man-pages/man2/shutdown.2.html' }, source: '原创练习'
  },
  {
    id: 'si036', cat: 'interview', type: 'multi', level: 1,
    q: '设计长度前缀的 TCP 消息协议，收到一个 4 字节长度字段后，哪些检查有必要？',
    options: ['限制允许的消息最大长度，避免被畸形长度诱导巨额分配', '约定长度字段字节序，并检查长度加头部大小时的整数溢出', '长度来自 TCP，所以它一定真实可靠，无需校验', '即使负载尚未收全，也可以按声明长度直接访问缓冲区'],
    ans: [0, 1], exp: '传输可靠性不意味着对端提供的应用数据可信或完整。应定义字节序、长度含义、上限和算术检查，先判断缓冲区是否包含完整帧，再访问负载；长度字段本身也可能分多次到达。',
    tags: ['network', 'protocol'], followUp: '零长度帧一定非法吗？取决于协议定义，不能靠实现者临时猜测；应明确空消息、心跳和非法输入的语义。',
    reference: { title: 'RFC 9293：Transmission Control Protocol', url: 'https://www.rfc-editor.org/rfc/rfc9293.html' }, source: '原创练习'
  },
  {
    id: 'si037', cat: 'interview', type: 'single', level: 2,
    q: '服务端计算响应很快，但部分客户端读取极慢，导致每连接发送队列不断增长。最合理的治理是什么？',
    options: ['设置发送队列上限和高低水位，减缓上游生产或按策略拒绝、超时关闭慢连接', '把所有队列改成无界队列，避免请求失败', '开启 TCP_NODELAY 后慢客户端就一定能及时消费', '持续重试 send，不让事件循环处理其他连接'],
    ans: [0], exp: '慢消费者需要背压和资源上限，否则内存增长最终影响整个服务。TCP 的流量控制约束传输，但不会自动限制应用自己堆积的响应队列；无界排队和忙重试均可能放大问题。',
    tags: ['network', 'backpressure'], followUp: '暂停读取请求时还要考虑什么？协议状态、已接收的流水线请求、连接级内存预算和恢复读取的时机。',
    reference: { title: 'Linux man-pages：socket(7)', url: 'https://man7.org/linux/man-pages/man7/socket.7.html' }, source: '原创练习'
  },
  {
    id: 'si038', cat: 'interview', type: 'single', level: 3,
    q: 'Linux 非阻塞 connect 返回 -1，errno 为 EINPROGRESS。稍后 epoll 报告该 socket 可写，接下来怎样判断连接结果？',
    code: 'int rc = connect(fd, addr, addrlen);\n// rc == -1 && errno == EINPROGRESS\n// 稍后收到该 fd 的可写事件',
    options: ['可写就证明远端已接受应用层请求', '调用 getsockopt(SOL_SOCKET, SO_ERROR)，检查是否为 0，并处理查询失败或连接错误', '再次调用 send 空缓冲区，返回 0 就证明连接成功', 'EINPROGRESS 表示连接永久失败，必须立即放弃'],
    ans: [1], exp: '非阻塞连接完成或失败都可能使 socket 就绪；应查询 SO_ERROR 确定结果。连接建立也只代表传输连接可用，不证明应用层请求已处理。连接尝试还需要明确超时和失败后的清理策略。',
    tags: ['network', 'nonblocking-io'], followUp: '为什么需要应用层连接超时？操作系统的重试时长不一定满足业务延迟预算，服务应有自己的截止时间。',
    reference: { title: 'Linux man-pages：connect(2)', url: 'https://man7.org/linux/man-pages/man2/connect.2.html' }, source: '原创练习'
  },
  {
    id: 'si039', cat: 'interview', type: 'single', level: 2,
    q: 'C++ 服务向已断开的 TCP 连接写数据时，进程偶尔直接结束。Linux 下应重点排查什么？',
    options: ['TCP 会在任意 send 失败时自动调用 exit', 'send 失败只能返回 EAGAIN，不可能产生信号', '把缓冲区改为静态数组即可避免断连', '可能收到默认终止进程的 SIGPIPE；可按策略用 MSG_NOSIGNAL 等方式处理，并检查 EPIPE 等错误'],
    ans: [3], exp: '向已不能继续发送的流连接写入可能产生 SIGPIPE；默认处置可终止进程。MSG_NOSIGNAL 可针对调用抑制该信号，但不会把发送变成功，仍需处理错误、连接状态与未发送数据。',
    tags: ['network', 'linux'], followUp: '全局忽略 SIGPIPE 和 MSG_NOSIGNAL 有何区别？前者改变进程范围的信号处置，后者针对发送调用，选择时要考虑其他组件行为。',
    reference: { title: 'Linux man-pages：send(2)', url: 'https://man7.org/linux/man-pages/man2/send.2.html' }, source: '原创练习'
  },
  {
    id: 'si040', cat: 'interview', type: 'multi', level: 2,
    q: '客户端提交一次扣款请求后等待超时，准备自动重试。哪些设计判断正确？',
    options: ['超时证明服务端没有执行扣款，可直接无限重试', '换一个 TCP 连接重试就一定不会重复执行', '超时只说明未及时获得结果，原请求可能已执行', '可使用稳定的幂等键和服务端去重记录，结合业务事务与结果查询设计重试'],
    ans: [2, 3], exp: '响应丢失、服务处理变慢或连接中断均可能导致执行结果不确定。重新建连不等于重新定义业务请求；幂等键、去重范围、保存时间以及业务变更和去重记录的一致性需一起设计。',
    tags: ['network', 'reliability'], followUp: '幂等键只存在内存里够吗？若进程崩溃后仍需防止重复扣款，则需持久化或其他能跨故障保持一致性的去重设计。',
    reference: { title: 'RFC 9110：HTTP Semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110.html' }, source: '原创练习'
  },
  {
    id: 'si041', cat: 'interview', type: 'single', level: 1,
    q: '服务器上的墙上时钟可能被校时。实现“从现在起最多等待 3 秒”的超时，通常应选什么时间基准？',
    options: ['std::chrono::steady_clock 等单调时间源，用于计算持续时间和截止点', '每次把当前日期字符串转成数字再相减', '只用 system_clock，系统校时不可能影响差值', '使用线程执行过的 CPU 时间，必定等于网络等待时间'],
    ans: [0], exp: '持续时间应使用不会因墙上时间调整而倒退的时钟。日期时间适合记录日历时间，CPU 时间只反映执行消耗；都不能无条件替代等待所需的单调时间基准。具体平台的休眠计时语义也应按需求确认。',
    tags: ['network', 'timeout'], followUp: '为什么多次重试共用一个截止时间？避免每轮都重新获得完整的 3 秒预算，导致总等待远超接口承诺。',
    reference: { title: 'cppreference：steady_clock', url: 'https://en.cppreference.com/w/cpp/chrono/steady_clock.html' }, source: '原创练习'
  },
  {
    id: 'si042', cat: 'interview', type: 'single', level: 2,
    q: 'UDP 服务用 512 字节缓冲区接收一个 900 字节数据报。Linux 下普通接收导致截断后，下次 recv 能继续取出本次报文的剩余 388 字节吗？',
    options: ['能，UDP 像 TCP 一样保留任意未读的字节流', '不能按流方式续读；报文超出缓冲区的部分会被丢弃，应设计大小上限并检测截断', '每个 UDP 报文最大只能有 512 字节，因此场景不可能出现', '只有开启 TCP_NODELAY 才能读出剩余部分'],
    ans: [1], exp: 'UDP 保留报文边界，接收缓冲区过小会导致单个数据报截断，而不是留下一段供后续流式读取。可用 recvmsg 的消息标志等机制识别截断，并结合协议上限合理配置缓冲区。',
    tags: ['network', 'udp'], followUp: 'UDP 收到返回长度 0 一定是连接关闭吗？不是；UDP 可携带零长度数据报，不能套用 TCP 流的 EOF 解释。',
    reference: { title: 'Linux man-pages：recv(2)', url: 'https://man7.org/linux/man-pages/man2/recv.2.html' }, source: '原创练习'
  },
  {
    id: 'si043', cat: 'interview', type: 'single', level: 3,
    q: '多个工作线程处理 epoll 返回的连接事件，某 fd 使用 EPOLLONESHOT。一个线程处理完当前数据后，连接不再收到事件，首要检查什么？',
    options: ['ONESHOT 会在第一个事件后自动 close socket', '必须每次创建一个新的 epoll 实例才能继续', '是否在状态与线程所有权协调完成后，用 EPOLL_CTL_MOD 重新激活该 fd 的事件关注', '只要再次调用 epoll_wait，就会自动重新激活 ONESHOT'],
    ans: [2], exp: 'EPOLLONESHOT 在一次事件通知后禁用该描述符的后续通知，需要用 MOD 重新激活。它有助于安排同一连接的单线程处理，但不能自动解决连接关闭、对象生命周期或应用状态的并发问题。',
    tags: ['network', 'epoll'], followUp: '重新激活前要确定什么？读取和发送状态、需要关注的事件，以及连接对象是否仍有效，避免重复交接或对已关闭描述符操作。',
    reference: { title: 'Linux man-pages：epoll_ctl(2)', url: 'https://man7.org/linux/man-pages/man2/epoll_ctl.2.html' }, source: '原创练习'
  },
  {
    id: 'si044', cat: 'interview', type: 'multi', level: 2,
    q: '客户端已建立 TLS 连接。为了确认它连接的是预期的服务器，以下哪些要求合理？',
    options: ['验证证书链、有效期及信任关系', '只要连接加密了，无需知道对端是谁', '发送了 SNI 就等于完成了主机名身份验证', '将所请求的服务身份与证书中允许的身份进行匹配验证'],
    ans: [0, 3], exp: '加密通道不自动证明对端身份。应同时验证证书信任关系与所访问的服务身份；SNI 用于传达目标名称、辅助选证书，并不能代替客户端的身份匹配验证。具体实现还应遵循 TLS 库的验证接口。',
    tags: ['network', 'tls'], followUp: '为什么开发环境关闭验证不能直接带到生产？攻击者也能提供可用于加密的证书；关闭身份验证会失去抵御冒充服务端的重要保障。',
    reference: { title: 'RFC 9525：Service Identity in TLS', url: 'https://www.rfc-editor.org/rfc/rfc9525.html' }, source: '原创练习'
  },
  {
    id: 'si045', cat: 'interview', type: 'single', level: 2,
    q: 'HTTP/1.1 客户端准备复用连接，但上一条响应体只消费了一半。若未经处理就读取下一条响应，主要问题是什么？',
    options: ['上一响应的剩余字节可能被误当成下一响应；应按消息定界规则消费完或放弃复用并关闭', 'TCP 会根据 HTTP 请求数自动跳过旧响应体', '只要读取过状态行，剩余响应体会被操作系统自动删除', '开启 keep-alive 会自动确保每次 recv 对应一条响应'],
    ans: [0], exp: 'HTTP/1.1 持久连接依赖准确的消息定界和连续字节流消费。上一响应剩余字节仍在连接中，不能由 TCP 或 keep-alive 自动跳过；应按 Content-Length、分块传输等合法规则读完，或关闭连接避免解析错位。',
    tags: ['network', 'http'], followUp: '所有响应都有响应体吗？没有，例如 HEAD 响应和某些状态码具有特殊消息体规则，解析器应按协议判断。',
    reference: { title: 'RFC 9112：HTTP/1.1', url: 'https://www.rfc-editor.org/rfc/rfc9112.html' }, source: '原创练习'
  },
  {
    id: 'si046', cat: 'interview', type: 'single', level: 1,
    q: 'Qt 客户端在工作线程完成网络请求后，直接调用 QWidget 修改界面，偶发崩溃。合理的交付结果方式是什么？',
    options: ['给 QWidget 指针加 volatile 即可跨线程修改', '通过 queued signal/slot 等方式把更新投递到 GUI 线程，并保证对象仍存活', '为每个控件创建一个独立线程，提高并发度', '只要更新足够快，就不会违反线程约束'],
    ans: [1], exp: 'Qt GUI 类有线程使用约束，后台线程应把结果投递给 GUI 线程处理。volatile 和执行速度都不能改变对象的线程亲和性；投递过程中还需考虑窗口关闭及接收对象生命周期。',
    tags: ['engineering', 'client'], followUp: '为何不要在 GUI 线程阻塞等待网络 future？会阻塞事件循环，导致界面卡住；通常通过异步完成通知更新界面。',
    reference: { title: 'Qt：Threads and QObjects', url: 'https://doc.qt.io/qt-6/threads-qobject.html' }, source: '原创练习'
  },
  {
    id: 'si047', cat: 'interview', type: 'single', level: 2,
    q: '客户端把后台任务排入线程池，但函数返回后任务才运行。下面捕获方式的主要风险是什么？',
    code: 'void load() {\n  std::string path = "config.json";\n  pool.post([&] { read_file(path); });\n}',
    options: ['lambda 按引用捕获会自动延长 path 的生命周期', '线程池会自动把所有局部变量复制到任务里', 'path 已离开作用域，引用可能悬垂；可按值捕获必要数据并明确相关对象的生命周期', '只要 path 不被修改，引用就一直有效'],
    ans: [2], exp: '引用捕获不延长被引用对象的生命周期；异步执行越过函数作用域后可能访问已销毁的 string。按值捕获可让任务拥有这份路径数据，但其他捕获对象如 this 仍要独立审查。',
    tags: ['engineering', 'client', 'lifetime'], followUp: '捕获 this 后窗口提前销毁怎么办？根据框架用弱引用、受控取消或由有效所有者持有任务，执行前验证对象是否仍可访问。',
    reference: { title: 'cppreference：Lambda expressions', url: 'https://en.cppreference.com/w/cpp/language/lambda.html' }, source: '原创练习'
  },
  {
    id: 'si048', cat: 'interview', type: 'single', level: 3,
    q: '在一个要求有界执行时间的嵌入式中断处理路径里，开发者使用 std::atomic<uint64_t>，认为它一定无锁且实时。哪项评审正确？',
    options: ['所有 atomic 类型都由 C++ 保证为单条硬件指令', '使用 relaxed 就能把任何原子类型变成无锁实现', '64 位 atomic 在任何 32 位或 64 位目标上都保证 lock-free', '应检查目标上的无锁能力和平台中断约束；即使无锁也不等于有界等待或满足实时截止时间'],
    ans: [3], exp: '原子类型保证原子语义，不普遍保证无锁实现；特定目标可能依赖库内部锁。is_always_lock_free 或 is_lock_free 可提供相关信息，但 lock-free 只是一类进展保证，不能自动推出每次调用有界、可在中断上下文使用。',
    tags: ['engineering', 'embedded', 'atomic'], followUp: '为什么 CAS 重试循环也要评估？竞争或中断交互可导致多次重试；需要结合具体平台、优先级和算法证明最坏执行时间。',
    reference: { title: 'cppreference：atomic::is_lock_free', url: 'https://en.cppreference.com/w/cpp/atomic/atomic/is_lock_free.html' }, source: '原创练习'
  },
  {
    id: 'si049', cat: 'interview', type: 'multi', level: 1,
    q: '客户端组件跨动态库边界传递字符串；两个模块可能使用不同运行库。哪些接口约定更稳妥？',
    options: ['明确由分配方提供配套释放函数，调用方按约定归还', '约定字符串编码与长度表达方式，不假定所有输入都以零结尾', '跨任意编译器直接传 std::string 的 ABI 都由 C++ 标准统一保证', '任一模块都可用自己运行库的 free 释放其他模块 new 出来的对象'],
    ans: [0, 1], exp: '跨模块需明确内存分配与释放边界、编码及长度。C++ 标准不统一各编译器和运行库的二进制 ABI；混用分配器或 new/free 组合会破坏约定。稳定边界常采用明确的 C 接口及配套释放函数。',
    tags: ['engineering', 'client', 'abi'], followUp: '只写 extern "C" 就解决一切兼容性问题吗？没有；它处理语言链接，数据布局、调用约定、所有权和错误传递仍需明确约定。',
    reference: { title: 'Microsoft Learn：Passing CRT objects across DLL boundaries', url: 'https://learn.microsoft.com/en-us/cpp/c-runtime-library/potential-errors-passing-crt-objects-across-dll-boundaries?view=msvc-170' }, source: '原创练习'
  },
  {
    id: 'si050', cat: 'interview', type: 'single', level: 3,
    q: '嵌入式 Linux 驱动给 DMA 设备准备了描述符并写“启动”寄存器。设备偶发读到旧描述符。哪项判断最准确？',
    options: ['把描述符结构体所有字段都设为 volatile 就能跨平台保证 DMA 一致性', 'x86 上一次运行正常，就证明其他架构也无需屏障', '普通 C++ mutex 能自动刷新任意设备缓存', '应根据平台 DMA 一致性模型，使用内核 DMA 映射/同步接口及规定的屏障和 I/O 访问接口'],
    ans: [3], exp: '设备 DMA、CPU 缓存和 MMIO 的可见性及顺序由平台与内核接口约束；volatile 不会自动进行 DMA 缓存维护，也不是通用硬件屏障。应遵循 DMA API 与设备协议，区分 coherent 与 streaming 映射并正确处理所有权交接。',
    tags: ['engineering', 'embedded', 'dma'], followUp: 'coherent DMA 内存是否完全不需要屏障？不一定；一致性不等于所有操作都按设备要求排序，描述符字段与启动通知仍可能需要指定屏障。',
    reference: { title: 'Linux kernel：DMA API HOWTO', url: 'https://docs.kernel.org/core-api/dma-api-howto.html' }, source: '原创练习'
  }
];
if (typeof module !== 'undefined' && module.exports) module.exports = SYSTEMS_INTERVIEW;

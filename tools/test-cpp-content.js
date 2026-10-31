/* Editorial regression guards, not a C++ compiler or a full-bank correctness proof.
 * Run: node tools/test-cpp-content.js
 * Rules reviewed against [intro.object], [expr.sizeof], [except.spec],
 * [except.terminate], [basic.types], [vector.modifiers], [dcl.ref],
 * [basic.stc], [stmt.return] and [lex.string].
 */
var assert = require('assert')
var Q = require('../data/questions')
var passed = 0
var failed = 0
function check(id, answer, facts) {
  try {
    var q = Q.getByIds([id])[0]
    assert(q, id + ' must remain reachable by its saved ID')
    assert.deepStrictEqual(q.ans, [answer], 'preserve answer index')
    facts.forEach(function (fact) {
      assert(fact[1].test(q[fact[0]]), fact[0] + ' must retain ' + fact[1])
    })
    passed++
    console.log('PASS ' + id)
  } catch (e) {
    failed++
    console.error('FAIL ' + id + ': ' + e.message)
  }
}
check('s03', 0, [['q', /sizeof\(char\*\)\s*==\s*8/]])
check('s15', 1, [['options', /至少 1/], ['exp', /对齐/]])
check('s16', 0, [['q', /不能.*至少增加/], ['exp', /复用/]])
check('s31', 0, [['q', /逸出/], ['exp', /实现定义/], ['exp', /内部.*捕获/]])
check('s83', 1, [['options', /不能保证/], ['exp', /平凡可拷贝.*不保证/]])
check('s93', 0, [['exp', /不可拷贝/], ['exp', /强异常保证.*不再/]])
check('s101', 1, [['options', /至少 1/], ['exp', /对齐/]])
check('s102', 2, [['options', /可以声明指向引用的指针/], ['exp', /引用的指针.*不合法/]])
check('s103', 2, [['q', /所指 int 可通过 p 修改/]])
check('s104', 1, [['q', /存储期/], ['exp', /生命周期.*初始化/]])
check('s106', 2, [['exp', /任何.*版本.*未定义行为/]])
check('s108', 1, [['options', /至少 2/], ['exp', /CHAR_BIT/]])
check('s111', 1, [['q', /解引用/]])
check('s112', 2, [['q', /调用方.*仍存活/], ['options', /按值形参/]])
check('s114', 3, [['q', /未声明移动操作/], ['q', /不发生拷贝消除/]])
check('s115', 1, [['q', /结合/], ['exp', /C\+\+17.*仍/]])
check('s116', 0, [['exp', /5 \* sizeof\(int\)/]])
check('s117', 1, [['exp', /10 \* sizeof\(int\)/], ['exp', /10 \* sizeof\(int\*\)/]])
check('s134', 1, [['options', /逸出/], ['exp', /实现定义/]])
check('i116', 2, [['q', /大小.*1、4、2/], ['q', /对齐.*1、4、2/], ['q', /最小.*填充/]])
console.log('\n' + passed + ' passed, ' + failed + ' failed (editorial guards only)')
if (failed) process.exit(1)

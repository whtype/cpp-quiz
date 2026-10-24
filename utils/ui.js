/**
 * 界面尺寸工具（自定义导航栏需要自己让出状态栏高度）
 */
function info() {
  try {
    if (wx.getWindowInfo) return wx.getWindowInfo()
    return wx.getSystemInfoSync()
  } catch (e) {
    return { statusBarHeight: 20, windowWidth: 375 }
  }
}

function nav() {
  var i = info()
  var sb = Number(i.statusBarHeight)
  // 取不到（0 / NaN / undefined）时兜底 20，避免导航栏顶进状态栏里
  if (!isFinite(sb) || sb <= 0) sb = 20
  return {
    statusBar: sb,
    // 状态栏 + 44px 标题栏
    navHeight: sb + 44
  }
}

/** 在页面 onLoad 里调用，把状态栏高度塞进 data */
function attach(page) {
  var n = nav()
  page.setData({ statusBar: n.statusBar, navHeight: n.navHeight })
}

/**
 * 统一的返回：有上一页就退，没有就回首页。
 * —— 直接进过练习页（分享卡片 / 场景值直达 / 热启动）时页面栈只有一层，
 *    wx.navigateBack 会静默失败，用户就"卡在页面里点不动"了。
 */
function back(fallback) {
  var pages = []
  try { pages = getCurrentPages() || [] } catch (e) { pages = [] }
  if (pages.length > 1) {
    wx.navigateBack()
  } else {
    wx.reLaunch({ url: fallback || '/pages/index/index' })
  }
}

function toast(title) {
  wx.showToast({ title: title, icon: 'none' })
}

module.exports = { nav: nav, attach: attach, back: back, toast: toast }

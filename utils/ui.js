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
  var sb = i.statusBarHeight || 20
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

function toast(title) {
  wx.showToast({ title: title, icon: 'none' })
}

module.exports = { nav: nav, attach: attach, toast: toast }

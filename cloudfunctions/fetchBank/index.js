/**
 * fetchBank —— 题库抓取云函数
 *
 * 作用：小程序端 wx.request 受「request 合法域名」白名单限制，无法直接访问
 * GitHub / jsDelivr 等外部地址。云函数运行在服务端，没有这个限制，
 * 因此由它代抓任意 URL 的题库 JSON，再把结果返回给小程序端。
 *
 * 入参：{ url: 'https://...' }
 * 返回：{ statusCode, body }
 */

const https = require('https')
const http = require('http')

const TIMEOUT = 20000
const MAX_SIZE = 4 * 1024 * 1024 // 4MB

function get(url, redirectCount) {
  return new Promise((resolve, reject) => {
    const lib = url.indexOf('https:') === 0 ? https : http
    const req = lib.get(
      url,
      {
        timeout: TIMEOUT,
        headers: {
          'User-Agent': 'cpp-quiz-miniprogram/1.2',
          Accept: 'application/json,text/plain,*/*'
        }
      },
      res => {
        // 跟随重定向（jsDelivr 等 CDN 常见）
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume()
          if ((redirectCount || 0) >= 3) {
            reject(new Error('重定向次数过多'))
            return
          }
          get(res.headers.location, (redirectCount || 0) + 1).then(resolve, reject)
          return
        }

        let size = 0
        const chunks = []
        res.on('data', c => {
          size += c.length
          if (size > MAX_SIZE) {
            req.destroy()
            reject(new Error('响应过大'))
            return
          }
          chunks.push(c)
        })
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            body: Buffer.concat(chunks).toString('utf8')
          })
        })
        res.on('error', reject)
      }
    )
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('请求超时'))
    })
    req.on('error', reject)
  })
}

exports.main = async (event) => {
  const url = (event && event.url) || ''
  if (!/^https?:\/\//i.test(url)) {
    return { statusCode: 0, error: 'URL 不合法（必须以 http/https 开头）' }
  }
  try {
    const r = await get(url, 0)
    return { statusCode: r.statusCode, body: r.body }
  } catch (e) {
    return { statusCode: 0, error: String((e && e.message) || e) }
  }
}

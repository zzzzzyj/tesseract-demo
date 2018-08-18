const appId = 'wx25db31241a793739'
const appVersion = "1.0.0"
const lang = wx.getSystemInfoSync().language
/**
 * 封装wx.request
 */
// const apiRootUrl = 'http://127.0.0.1:8069'
const apiRootUrl = 'https://www.zhangyejun.club'

const apiAuthByCodeUrl = apiRootUrl + '/wechat_mp_auth/auth_by_code'
const apiAuthByLoginUrl = apiRootUrl + '/wechat_mp_auth/auth_by_login'
const apiGetTickets = apiRootUrl + '/api/get_tickets'
const apiCreateTicket = apiRootUrl + '/api/create_record'
const apiUploadBinaryUrl = apiRootUrl + '/api/binary/upload_attachment'
const apiTesseractOCRUrl = apiRootUrl + '/api/tesseract/ocr'
const apiCreateTicketSerialNumber = apiRootUrl + '/api/create_serial_number'

var wx_request = promisify(wx.request)
var wx_login = promisify(wx.login)

/**
 * promisify
 * @fn 传入的函数，如wx.request、wx.download
 */
function promisify(fn) {
  return function(obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function(res) {
        resolve(res)
      }

      obj.fail = function(res) {
        reject(res)
      }

      fn(obj) //执行函数，obj为传入函数的参数
    })
  }
}

/**
 * 封装wx.request
 */
function serverRequest(url, params = {}, method = 'POST', retry = false) {
  return new Promise(function(resolve, reject) {
    params["context"] = {
      "lang": lang
    }
    params["appid"] = appId
    params["appversion"] = appVersion
    wx_request({
      url: url,
      data: {
        "params": params
      },
      method: method,
      header: {
        'Content-Type': 'application/json',
        'Cookie': 'session_id = ' + wx.getStorageSync('token') + '; frontend_lang=' + lang
      }
    }).then(res => {
      if (res.header && res.header['Set-Cookie']) {
        let raw = res.header['Set-Cookie'];
        let session_id = raw.slice(raw.indexOf('=') + 1, raw.indexOf(';'))
        if (wx.getStorageSync('token') != session_id) {
          wx.setStorageSync('token', session_id);
        }
      }
      if (res.data.error && res.data.error.code == 100) {
        if (!retry) {
          console.log('Session is expired or invalid, authbycode and retry...');
          authByCode().then(res => {
            serverRequest(url, params, method, true).then(res => {
              resolve(res);
            }).catch(err => {
              reject(err);
            });
          }).catch(err => {
            wx.redirectTo({
              url: '/pages/auth/login/login',
            })
            reject(err);
          });
        } else {
          reject(res);
        }
      } else {
        resolve(res);
      }
    }).catch(err => {
      reject(err);
    });
  });
}

function authByCode() {
  return new Promise(function(resolve, reject) {
    wx_login().then(res => {
      wx_request({
        url: apiAuthByCodeUrl,
        data: {
          "params": {
            "code": res.code,
            "appid": appId,
            "appversion": appVersion,
            "context": {
              "lang": lang
            }
          }
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.data.result && res.data.result['success']) {
          if (res.header && res.header['Set-Cookie']) {
            let raw = res.header['Set-Cookie'];
            let session_id = raw.slice(raw.indexOf('=') + 1, raw.indexOf(';'))
            wx.setStorageSync('token', session_id);
          }
          wx.setStorageSync('userId', res.data.result.user_id);
          resolve(res);
        } else {
          wx.setStorageSync('userId', '');
          reject(res);
        }
      }).catch(err => {
        reject(err);
      })
    }).catch(err => {
      reject(err);
    })
  })
}

function authByLogin(loginname, password) {
  return new Promise(function(resolve, reject) {
    wx_login().then(res => {
      let params = {
        "code": res.code,
        "login": loginname,
        "pwd": password,
      }
      serverRequest(apiAuthByLoginUrl, params).then(res => {
        if (res.data.result && res.data.result['success']) {
          wx.setStorageSync('userId', res.data.result.user_id);
          resolve(res);
        } else {
          wx.setStorageSync('userId', '');
          reject(res);
        }
      }).catch(err => {
        reject(err);
      })
    }).catch(err => {
      reject(err);
    })
  })
}

module.exports = {
  serverRequest,
  authByCode,
  authByLogin,
  
  apiAuthByCodeUrl,
  apiAuthByLoginUrl,
  apiGetTickets,
  apiCreateTicket,
  apiUploadBinaryUrl,
  apiTesseractOCRUrl,
  apiCreateTicketSerialNumber
}
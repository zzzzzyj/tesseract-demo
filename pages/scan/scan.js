const util = require('../../utils/util.js')
// pages/scan/scan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    barcode: '',
    imageSrc: '',
  },

  scanBarcode: function() {
    let that = this
    wx.scanCode({
      success: (res) => {
        console.log(res)
        that.setData({
          barcode: res.result
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  takePhoto: function() {
    wx.navigateTo({
      url: '/pages/camera/camera',
    })
  },

  uploadData: function() {
    let barcode = this.data.barcode
    if (barcode == '') {
      wx.showModal({
        title: '错误信息',
        content: '请先扫条码',
        showCancel: false,
      })
      return
    }

    wx.showLoading({
      title: '正在上传...',
    })
    this.createTicket()
  },

  createTicket: function() {
    let that = this;
    const url = util.apiCreateTicket
    var params = {
      "barcode": this.data.barcode,
    }
    util.serverRequest(url, params).then(res => {
      var result = res.data.result
      if (result) {
        that.uploadPhoto(result)
      } else {
        wx.hideLoading()
        wx.showModal({
          title: '错误信息',
          content: '上传失败，请重试',
          showCancel: false,
        })
      }
    })
  },

  uploadPhoto: function(tess_id) {
    let that = this;
    const tempImagepaths = wx.getStorageSync('temp_image_paths')

    for (let tempImagepath of tempImagepaths) {

      //create serial record
      let params = {
        "tess_id": tess_id,
      }
      util.serverRequest(util.apiCreateTicketSerialNumber, params).then(res => {
        let res_id = res.data.result
        if (res_id) {

          //upload image
          wx.uploadFile({
            url: util.apiUploadBinaryUrl,
            filePath: tempImagepath,
            name: 'ufile',
            formData: {
              'model': 'zyj.ticket.serial.number',
              'id': res_id
            },
            header: {
              "Content-Type": "multipart/form-data",
              'Cookie': 'session_id = ' + wx.getStorageSync('token')
            },
            success: function(res) {
              console.log(res)
              that.tesseractOCR(res_id)
            },

            fail: function(res) {
              wx.hideLoading()
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function(res) {}
              })
            }
          });
        } else {
          wx.hideLoading()
          wx.showModal({
            title: '错误信息',
            content: '上传失败，请重试',
            showCancel: false,
          })
        }
      })
    }
  },

  tesseractOCR: function(res_id) {
    let that = this;
    const url = util.apiTesseractOCRUrl
    var params = {
      "id": res_id,
    }
    util.serverRequest(url, params).then(res => {
      var result = res.data.result
      if (result) {
        console.log(result)
        wx.setStorage({
          key: 'temp_image_paths',
          data: [],
          success: function(res) {
            wx.hideLoading()
            wx.redirectTo({
              url: '/pages/index/index',
            })
          }
        })
      } else {
        wx.hideLoading()
      }
    })
  }
})
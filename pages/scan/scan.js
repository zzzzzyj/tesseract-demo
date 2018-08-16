const util = require('../../utils/util.js')
// pages/scan/scan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    barcode: '',
    imageSrc: '',
    ocr_text: ''
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
    if(barcode == ''){
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
        console.log(result)
        that.uploadPhoto('zyj.ticket', result)
      } else {
        wx.hideLoading()
        wx.showModal({
          title: '错误信息',
          content: '上传失败，可能此条码已存在',
          showCancel: false,
        })
      }
    })
  },

  uploadPhoto: function(model, res_id) {
    let that = this;
    const tempImagepath = wx.getStorageSync('temp_image_path')

    wx.uploadFile({
      url: util.apiUploadBinaryUrl,
      filePath: tempImagepath,
      name: 'ufile',
      formData: {
        'model': model,
        'id': res_id
      },
      header: {
        "Content-Type": "multipart/form-data",
        'Cookie': 'session_id = ' + wx.getStorageSync('token')
      },
      success: function(res) {
        console.log(res)
        wx.hideLoading()
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
        that.setData({
          ocr_text: result
        })
      } else {
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    wx.getStorage({
      key: 'temp_image_path',
      success: function(res) {
        console.log(res)
        if (res.data) {
          that.setData({
            imageSrc: res.data
          })
        }
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },

})
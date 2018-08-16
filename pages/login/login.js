// pages/auth/login/login.js

const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginname: '',
    password: '',
  },

  login: function () {
    var that = this;
    if (that.data.password.length < 1 || that.data.loginname.length < 1) {
      wx.showModal({
        title: '错误信息',
        content: '请输入用户名和密码',
        showCancel: false
      });
      return false;
    }
    util.authByLogin(that.data.loginname, that.data.password).then(res => {
      if (res.data.result['success']) {
        wx.showToast({
          title: '登录成功'
        })
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }
      else {
        wx.showToast({
          title: '登录失败'
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '登录失败'
      })
      console.log(err)
    });
    that.setData({
      password: '',
    })
  },

  bindLoginNameInput: function (e) {
    this.setData({
      loginname: e.detail.value,
      smssent: false,
    });
  },

  bindPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },

  clearInput: function (e) {
    switch (e.currentTarget.id) {
      case 'clear-loginname':
        this.setData({
          loginname: ''
        });
        break;
      case 'clear-password':
        this.setData({
          password: ''
        });
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
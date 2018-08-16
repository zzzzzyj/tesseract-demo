const util = require('../../utils/util.js')

Page({
  data: {
    list: []
  },

  getTicketsData: function(){
    let that = this;
    const url = util.apiGetTickets

    util.serverRequest(url).then(res => {
      var result = res.data.result
      console.log(res)
      if (result) {
        console.log(result)
        that.setData({
          list: result
        })
      }
      else {
        wx.showModal({
          title: '错误信息',
          content: '未能获取首页信息',
          showCancel: false,
        })
      }
    })
  },

  addScan: function () {
    wx.navigateTo({
      url: '/pages/scan/scan',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  onShow: function (options) {
    this.getTicketsData()
  },

  onLoad: function (options) {
    
  },

  kindToggle: function(e) {
    var id = e.currentTarget.id,
      list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  }
});
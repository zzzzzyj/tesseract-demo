Page({
  data: {
    // src: '',
    images: []
  },

  onShow() {
    this.ctx = wx.createCameraContext()
    // let that = this
    // wx.getStorage({
    //   key: 'temp_image_path',
    //   success: function(res) {
    //     console.log(res)
    //     if(res.data){
    //       that.setData({
    //         src: res.data
    //       })
    //     }
    //   },
    //   fail: function(err) {
    //     console.log(err)
    //   }
    // })
  },

  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
        wx.setStorage({
          key: 'temp_image_path',
          data: res.tempImagePath,
          success: function(res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
  },

  chooseImage: function() {
    let that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // console.log(res.tempFilePaths)
        // that.setData({
        //   src: res.tempFilePaths
        // });

        wx.setStorage({
          key: 'temp_image_path',
          data: res.tempFilePaths[0],
          success: function (res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
  },

  error(e) {
    console.log(e.detail)
  }
})
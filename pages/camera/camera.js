Page({
  data: {
    images: []
  },

  onShow() {
    this.ctx = wx.createCameraContext()
    let that = this
    wx.getStorage({
      key: 'temp_image_paths',
      success: function(res) {
        if (res.data) {
          that.setData({
            images: res.data
          })
        }
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },

  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        let images = this.data.images
        images.push(res.tempImagePath)
        this.setData({
          images: images
        })

      }
    })
  },

  deletePhoto: function(options) {
    let index = options.target.dataset.index
    let images = this.data.images
    images.splice(index, 1)
    this.setData({
      images: images
    })
  },

  submit: function() {
    const images = this.data.images
    wx.setStorage({
      key: 'temp_image_paths',
      data: images,
      success: function(res) {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
})
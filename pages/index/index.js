//index.js
//获取应用实例
const app = getApp()
var userLocation = {};
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
  },
  //事件处理函数
  onLoad: function () {
    wx.getSystemInfo({
      success: (res) => {

        app.globalData.windowHeight = res.windowHeight,
        app.globalData.windowWidth = res.windowWidth
      }
    });
    wx.getLocation({
      success: function(res) {
        userLocation.long = res.longitude;
        userLocation.lat = res.latitude;
      },
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  onReady: function() {
    this.checkReady();
  },

  checkReady: function() {
    if (this.data.userInfo.length === 0 || userLocation.length === 0) {
      setTimeout(this.checkReady, 100);
    } else {
      setTimeout(this.navToMap, 1500);
    }
  },

  getUserInfo: function(e) {

    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  navToMap: function(e) {

    wx.showModal({
      title: '提示',
      content: '作为演示用例，请先创建事件',
      showCancel: false,
      success: () => {
        wx.switchTab({
          url: '../map/map',
          success: (e) => {

          },
          fail: (e) => {

          }
        })
      }
    });
  }
})

module.exports.userLocation = userLocation;
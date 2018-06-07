// pages/event_log/event_log.js
const RANGE_SCALE = 0.5;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    events: [
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取位置信息
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //请求数据
    wx.showLoading({
      title: '加载中...',
    })
    this.getLocation().then(d => {
      this.getEventList(d).then(d => {
        this.renderList(d);
      });
    });
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
    console.log("pullDown");
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
  
  },

  /**
   * 获取当前用户的位置
   * return promise
   */
  getLocation: function() {
    return new Promise((resolve) => {
      wx.getLocation({
        success: (res) => {
          var lat = res.latitude;
          var lng = res.longitude;
          resolve({
            lng: lng,
            lat: lat
          });
        },
      })
    })
  },

  getEventList: function(d) {
    return new Promise((resolve) => {
      wx.request({
        url: 'http://localhost:8080/mesh/getEventMarker',
        method: 'POST',
        dataType: "json",
        data: JSON.stringify(this.getReveiveRange(d)),
        success: (res) => {
          resolve(res.data.data);
        }
      })
    });
  },

  renderList: function(data) {
    var d = [];
    if (data !== [] || data !== undefined) {
      data.forEach(_d => {
        d.push({
          title: _d.title,
          level: _d.level
        });
      })
      this.setData({
        event: d
      });
    }
    wx.hideLoading();
  },

  getReveiveRange: function(o) {
    var d = {};
    d.ne_lng = o.lng + RANGE_SCALE;
    d.ne_lat = o.lat + RANGE_SCALE;
    d.sw_lng = o.lng - RANGE_SCALE;
    d.sw_lat = o.lat - RANGE_SCALE;
    return d;
  }
})
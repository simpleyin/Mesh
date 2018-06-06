// pages/event_edit/event_edit.js
var name,address,lat,lng;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: null,
    time: null,
    isAgree: true,
    eventClass: [
      '轻微', '较严重', '严重', '十分严重'
    ],
    level: 0, //严重程度
    index: 0 //event level picker index
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var d = new Date().toISOString().split("T");
    var date = d[0];
    var time = d[1].substr(0, 5);
    this.setData({
      date: date,
      time: time
    })
    console.log(options);
    name = options.name;
    address = options.address;
    lat = options.lat;
    lng = options.lng;
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
  
  },

/**
 * 事件表单日期设置
 */
  bindDateChange: function (e) {
    console.log(e);
    this.setData({
      date: e.detail.value
    })
  },

/**
 * 事件表单时间设置
 */
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !this.data.isAgree
    })
  },

  pubNewEvent: function (e) {
    var data = e.detail.value;
    for (var d in data) {
      if (data[d] === "" || data[d] === undefined || data[d].length === 0) {
        wx.showModal({
          title: '警告⚠️',
          content: '请输入完整的信息',
          showCancel: false,
        })
        return false;
      }
    }
    this.submitForm(data);
  },

  submitForm: function (data) {
    console.log(JSON.stringify(data));
    wx.showLoading({
      title: '正在发布',
    });
    wx.request({
      url: 'http://localhost:8080/mesh/putEvent',
      data: JSON.stringify(data),
      method: "POST",
      success: (e) => {
        console.log(e);
        wx.hideLoading();
        //提示发布成功并返回主页面
        wx.showModal({
          title: '提示',
          content: '发布成功',
          showCancel: false,
          success: (res) => {
            wx.switchTab({
              url: '/pages/map/map',
            })
          }
        })
      },
      fail: (e) => {
        console.log(e);
        wx.hideLoading();
        wx.showModal({
          title: '失败',
          content: '发布失败, 请重试',
          showCancel: false
        })
      }
    })
  },

  eventLevelChange: function (e) {
    this.setData({
      level: e.detail.value,
      index: e.detail.value
    })
  }
})
// pages/event_detail/event_detail.js
var mock = require("../../utils/mock.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    event: null,
    fromUserPage: false,
    pics: mock.getMockEventPicsUrl(),
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    watchedState: "关注"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      event: JSON.parse(options.data),
      fromUserPage: options.fromUserPage === undefined ? false : options.fromUserPage
    })
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
 * 用户进行事件的补充和查看补充
 */
  makeAdditionalRemark: function() {
    this.showWarning();
  },

  makeEdit: function() {
    this.showWarning();
  },

  makeReport: function() {
    this.showWarning();
  },

  showWarning: function() {
    wx.showModal({
      title: '警告',
      content: '该功能暂未开放',
      showCancel: false
    })
  },

  makeWatch: function() {
    this.setData({
      watchedState: "已关注"
    })
  }
})
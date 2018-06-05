// pages/event_edit/event_edit.js
var name,address,lat,lng;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "",
    time: "",
    isAgree: true,
    eventClass: [
      '普通', '较严重', '严重', '十分严重'
    ],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    console.log(e);
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
    console.log("pub");
  }
})
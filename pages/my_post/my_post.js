// pages/my_post/my_post.js
var app = getApp();
var databus = require("../../databus/databus.js")
var util = require("../../utils/util.js")
var databus = require("../../databus/databus.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
    databus.getEventByCreatedId(app.globalData.userId).then((d) => {
      var data = [];
      d.data.forEach(_d => {
        _d.levelName = util.getLevelName(_d.level);
        _d._string = JSON.stringify(_d);
        data.push(_d);
      })
      this.setData({
        events: data
      })
    })
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
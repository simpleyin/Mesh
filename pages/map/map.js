// pages/map/map.js
var index = require("../index/index.js");
var qqMap = require("../../lib/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.min.js");
var qqMapSdk;
var app = getApp();
var _markModel = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: null,
    longitude: null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      latitude: index.userLocation.lat,
      longitude: index.userLocation.long,
      markers: [
        {
          id: 0,
          iconPath: "../../assets/pic/location.png",
          longitude: index.userLocation.long,
          latitude: index.userLocation.lat,
          width: 30,
          height: 30
        }
      ]
    });
    qqMapSdk = new qqMap({
      key: 'PVKBZ-ETYRJ-7ZAF3-KISNA-F5TET-UXFW4'
    });
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('map');
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
   * 开启标记模式
   */
  markModel: function () {
    console.log("进入标记模式");
    _markModel = true;
  },

  /**
   * 在地图上进行单点标记，
   */
  markPoint: function (e) {

  },

  setMark: function (long, lat) {
  },

  regionChange: function (e) {
    if (e.type === "end") {
      this.setCenterMark();
      this.getCurrentRange();
    }
  },

  setCenterMark: function () {
    this.mapCtx.getCenterLocation({
      success: function(res) {
        this.setData({
          'markers[1]': {
            id: 1,
            iconPath: "../../assets/pic/location.png",
            longitude: res.longitude,
            latitude: res.latitude,
            width: 30,
            height: 30
          }
        })
      }.bind(this),
    })
  },

  getCurrentRange: function() {
    this.mapCtx.getRegion({
      success: function(res) {
        console.log(res);
        this.setData({
          'currentNe.lng': res.northeast.longitude,
          'currentNe.lat': res.northeast.latitude,
          'currentSw.lng': res.southwest.longitude,
          'currentSw.lat': res.southwest.latitude,
        })
      }.bind(this)
    })
  },

  loadEventMarker: function() {

  },

  test: function (e) {
    //使用该函数进行地点选择，保存返回的坐标，进行事件创建.
    //this.createEvent();
    console.log(this.data);
  },

  /**
   * 创建事件，并跳转至event_edit页面
   */
  createEvent: function() {
    var name, address, lat, lng;
    wx.chooseLocation({
      success: function(res) {
        name = res.name;
        address = res.address;
        lat = res.latitude;
        lng = res.longitude;
        wx.navigateTo({
          url: '../event_edit/event_edit?name=' + name + 'address=' + address + 'lat=' + lat + 'lng=' + lng,
        });
      },
    });
  }


})
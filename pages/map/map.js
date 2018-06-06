// pages/map/map.js
var index = require("../index/index.js");
var qqMap = require("../../lib/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.min.js");
var mock = require("../../metaData/mock.js");
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
    MAX_SCALE: 9
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
    this.mapCtx = wx.createMapContext('map');
    //初始化页面数据
    // console.log(options);
    // if (options.lng !== undefined && options.lat !== undefined) {
    //   this.setData({
    //     latitude: options.lat,
    //     longitude: options.lng
    //   })
    //} else {
      wx.getLocation({
        success: (res) => {
          this.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
        },
      })
    //}
    this.setData({
      // markers: [
      //   {
      //     id: 0,
      //     iconPath: "../../assets/pic/location.png",
      //     longitude: index.userLocation.long,
      //     latitude: index.userLocation.lat,
      //     width: 30,
      //     height: 30
      //   }
      // ],
      controls: [{
        id: 0,
        iconPath: "../../assets/pic/add_event.png",
        position: {
          left: app.globalData.windowWidth - 50,
          top: 300,
          width: 40,
          height: 40
        },
        clickable: true
      },
      {
        id: 1,
        iconPath: "../../assets/pic/locate.png",
        position: {
          left: app.globalData.windowWidth - 50,
          top: 360,
          width: 40,
          height: 40
        },
        clickable: true
      },
      {
        id: 2,
        iconPath: "../../assets/pic/search.png",
        position: {
          left: app.globalData.windowWidth - 50,
          top: 420,
          width: 40,
          height: 40
        },
        clickable: true
      }],
    });
    qqMapSdk = new qqMap({
      key: 'PVKBZ-ETYRJ-7ZAF3-KISNA-F5TET-UXFW4'
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
   * 在地图上进行单点标记，
   */
  markPoint: function (e) {

  },

  setMark: function (long, lat) {
  },

  /**
   * 地图区域改变函数
   */
  regionChange: function (e) {
    if (e.type === "end") {
      this.getCurrentRange();
      this.mapCtx.getScale({
        success: function (res) {
          this.setData({
            'currentScale': res
        })
        }.bind(this)
      });
      this.loadEventMarker();
    }
  },

/**
 * 设置当前定位点为地图中心
 */
  setCenter: function (obj) {
    wx.getLocation({
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
      this.mapCtx.moveToLocation();
      }
    });
  },

  /**
   * 得到当前地图区域的范围，并保存
   */
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

  /**
   * 根据当前地图区域加载事件标记
   */
  loadEventMarker: function() {
    请求服务器得到当前区域的地标
    若scale超过规定的等级则不加载
    if (this.data.currentScale < this.data.MAX_SCALE) {
      return false;
    }
    this.requestEventMarker();
  },
  
  /**
   * 向服务器请求获取当前地图区域的事件集合
   */
  requestEventMarker: function() {
    var data = {
      neLng: this.data.currentNe.lng,
      neLat: this.data.currentNe.lat,
      swLng: this.data.currentSw.lng,
      swLat: this.data.currentSw.lat
    }
    console.log(data);
    wx.request({
      url: 'http://localhost:8080/mesh/getEventMarker',
      method: 'POST',
      data: JSON.stringify(data),
      success: (res) => {

      },
      fail: (res) => {

      }
    })
  },

  renderMarkers: function(data) {

  },

  test: function (e) {
    //使用该函数进行地点选择，保存返回的坐标，进行事件创建.
    this.mapCtx.moveToLocation();
    console.log(this.data);
  },

  tapControl: function(e) {
    console.log(e.controlId);
    if (e.controlId === 0) {
      //create new event
      this.createEvent();
    } else if (e.controlId === 1) {
      //进行定位
      this.setCenter();
    } else if (e.controlId === 2) {
      //进行搜索，并定位
      this.searchAndLocate();
    }
  },

/**
 * 根据使用腾讯地图搜索获得的位置信息进行定位
 * TODO 并不能成功设置定位点，并进行视角移动
 */
  searchAndLocate: function() {
    wx.chooseLocation({
      success: (res) => {
        console.log(res);
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        this.mapCtx.moveToLocation();
        // wx.navigateTo({
        //   url: '/pages/map/map?lng=' + res.latitude + 'lat=' + res.longitude,
        // })
      },
    })
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
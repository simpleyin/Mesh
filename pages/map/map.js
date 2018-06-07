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
    this.getCurrentRange().then(d => this.loadEventMarker(d));
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
      console.log(e);
      this.getCurrentRange().then(d => this.loadEventMarker(d));
      this.mapCtx.getScale({
        success: function (res) {
          this.setData({
            'currentScale': res
        })
        }.bind(this)
      });
      
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
    return new Promise((resolve) => {
      this.mapCtx.getRegion({
        success: function (res) {
          console.log(res);
          this.setData({
            'currentNe.lng': res.northeast.longitude,
            'currentNe.lat': res.northeast.latitude,
            'currentSw.lng': res.southwest.longitude,
            'currentSw.lat': res.southwest.latitude,
          })
          resolve({
            'ne_lng': res.northeast.longitude,
            'ne_lat': res.northeast.latitude,
            'sw_lng': res.southwest.longitude,
            'sw_lat': res.southwest.latitude,
          });
        }.bind(this)
      })
    })
  },

  /**
   * 根据当前地图区域加载事件标记
   */
  loadEventMarker: function(d) {
    //请求服务器得到当前区域的地标
    //若scale超过规定的等级则不加载
    if (this.data.currentScale < this.data.MAX_SCALE) {
      return false;
    }
    this.requestEventMarker(d);
  },
  
  /**
   * 向服务器请求获取当前地图区域的事件集合
   */
  requestEventMarker: function(d) {
    //d.minLevel = 0; 通过用户设置的危险等级范围来进行筛选
    wx.request({
      url: 'http://localhost:8080/mesh/getEventMarker',
      method: 'POST',
      dataType: "json",
      data: JSON.stringify(d),
      success: (res) => {
        //进行渲染
        console.log(res);
        if (res.data.size !== 0) {
          var markers = this.buildMarkers(res.data.data);
          this.setData({
            markers: markers
          })
        }
      },
      fail: (res) => {

      }
    })
  },
  
  /**
   * 将数据构造为markers数组, 同时将event信息保存到对应的marker上
   * data: array
   * return array
   */
  buildMarkers: function(data) {
      //   {
      //     id: 0,
      //     iconPath: "../../assets/pic/location.png",
      //     longitude: index.userLocation.long,
      //     latitude: index.userLocation.lat,
      //     width: 30,
      //     height: 30
      //   
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var marker = {};
      marker.title = data[i].title;
      marker.description = data[i].description;
      marker.address = data[i].address;
      marker.id = i;
      marker.level = data[i].level;
      marker.iconPath = this.getPicPathByLevel(data[i].level);
      marker.longitude = data[i].lng;
      marker.latitude = data[i].lat;
      marker.width = 30;
      marker.height = 30;
      marker.callout = {
        content: data[i].title,
        fontSize: 14,
        color: '#ffffff',
        bgColor: '#000000',
        padding: 8,
        borderRadius: 4,
        boxShadow: '4px 8px 16px 0 rgba(0)'
      },
      res.push(marker);
    }
    return res;
  },

  getPicPathByLevel: function(level) {
    var path = "";
    switch(level) {
      case 0:
          path = "../../assets/pic/level_0.png";
          break;
      case 1:
        path = "../../assets/pic/level_1.png";
        break;
      case 2:
        path = "../../assets/pic/level_2.png";
        break;
      case 3:
        path = "../../assets/pic/level_3.png";
        break;
        default:
        path = "../../assets/pic/location.png";
    }
    return path;
  },

  test: function (e) {
    //使用该函数进行地点选择，保存返回的坐标，进行事件创建.
    this.mapCtx.moveToLocation();
    
  },

  tapControl: function(e) {
    
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
 * 点击marker上的callout触发
 */
  tapCallout: function(e) {
    console.log(e);
  },

/**
 * 点击marker触发 
 */
  tapMarker: function(e) {
    this.showEventDetails(e.markerId);
  },

  showEventDetails: function(markerId) {
    console.log(markerId);
    console.log(this.data.markers);
    var marker = this.data.markers[markerId];
    //TODO 创建自定义modal的组件
    wx.showModal({
      title: marker.title,
      content: marker.description + "\n危险等级: " + marker.level,
      showCancel: false,
    })
  },

/**
 * 根据使用腾讯地图搜索获得的位置信息进行定位
 * TODO 并不能成功设置定位点，并进行视角移动
 */
  searchAndLocate: function() {
    wx.chooseLocation({
      success: (res) => {
        
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
    var data = {};
    wx.showLoading({
      title: 'loading...',
    });
    wx.chooseLocation({
      success: (res) => {
        data.landmark = res.name;
        data.address = res.address + res.name;
        data.lat = res.latitude;
        data.lng = res.longitude;
        console.log("成功获取位置信息");
        wx.hideLoading();
        wx.navigateTo({
          url: '../event_edit/event_edit?data=' + JSON.stringify(data),
        });
      },
      fail: (res) => {
        console.log("调用失败");
        wx.hideLoading();
        wx.showModal({
          title: '警告',
          content: '调用腾讯地图API失败，请稍后重试',
          showCancel: false
        })
      }
    });
  }


})
// pages/map/map.js
var index = require("../index/index.js");
var qqMap = require("../../lib/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.min.js");
var mock = require("../../utils/mock.js")
var util = require("../../utils/util.js");
var databus = require("../../databus/databus.js")
var app = getApp();
var _markModel = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: null,
    longitude: null,
    MAX_SCALE: 13,
    showModal: false,
    modalMessage: "MESSAGE",
    mock: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //TODO 处理闪屏问题
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('map'); {
      wx.getLocation({
        success: (res) => {
          this.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
        },
      })
    }
    this.setData({
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

    this.getCurrentRange().then(d => {

      this.loadEventMarker(d);
    });
    // if (this.data.mock) {
    //   this.mock();
    // }
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

  mock: function() {
    mock.mockData();
  },

  /**
   * 地图区域改变函数
   */
  regionChange: function (e) {
    if (e.type === "end") {
      this.mapCtx.getScale({
        success: function (res) {
          this.setData({
            'currentScale': res.scale
          })
        }.bind(this)
      });
      this.getCurrentRange().then(d => this.loadEventMarker(d));
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
   * error: 初始时获得参数出错
   */
  getCurrentRange: function() {
    return new Promise((resolve) => {
      this.mapCtx.getRegion({
        success: (res) => { 
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
        }
      })
    })
  },

  /**
   * 根据当前地图区域加载事件标记
   */
  loadEventMarker: function(d) {
    //请求服务器得到当前区域的地标
    //若scale超过规定的等级则不加载
    if (this.data.currentScale < this.data.MAX_SCALE && this.data.currentScale !== undefined) {
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
      url: databus.host + '/mesh/getEventMarker',
      method: 'POST',
      dataType: "json",
      data: JSON.stringify(d),
      success: (res) => {
        //进行渲染
        if (res.data.size !== 0 && res.data.size !== undefined) {
          var markers = this.buildMarkers(res.data.data);
          this.setData({
            markers: markers
          })
        }
      },
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
      marker.levelName = util.getLevelName(data[i].level);
      marker.iconPath = this.getPicPathByLevel(data[i].level);
      marker.longitude = data[i].lng;
      marker.latitude = data[i].lat;
      marker.width = 30;
      marker.height = 30;
      marker.date = data[i].date;
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
    
  },

/**
 * 点击marker触发 
 */
  tapMarker: function(e) {
    this.showEventDetails(e.markerId);
  },

  showEventDetails: function(markerId) {
    
    var marker = this.data.markers[markerId];
    //TODO 创建自定义modal的组件
    // wx.showModal({
    //   title: marker.title,
    //   content: marker.description + "\n危险等级: " + marker.level,
    //   showCancel: false,
    // })
    this.setData({
      showModal: true
    });
    this.setData({
      modalTitle: "事件",
      modalName: marker.title,
      modalMessage: marker.description,
      modalLevel: marker.level,
      modalLevelName: marker.levelName,
      modalDate: util.removeZeroFromDate(marker.date),
      modalData: JSON.stringify(marker)
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

  eventModalConfirm: function() {
    this.setData({
      showModal: false
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
        
        wx.hideLoading();
        wx.navigateTo({
          url: '../event_edit/event_edit?data=' + JSON.stringify(data),
        });
      },
      fail: (res) => { 
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
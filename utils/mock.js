var databus = require("../databus/databus.js")
var app = getApp();

const getMockEventPicsUrl = () => {
  return [
    databus.host + "/mesh/img/event_crash.jpg",
    databus.host + "/mesh/img/event_earthquake.jpg",
    databus.host + "/mesh/img/event_rain.jpg",
  ]
}

const mockData = () => {
  wx.getLocation({
    success: function (res) {
      var lng = res.longitude;
      var lat = res.latitude;
      var data = {
        title: "危险事件",
        level: 0,
        color: "blue",
        userId: app.globalData.userId,
        userName: "热心市民",
        state: "on",
        lng: lng,
        lat, lat,
        address: "重庆市南岸区南城大道21号",
        description: "发生火灾，车祸，抢劫等危险或恶性事件",
        city: "重庆"
      };
      for (var i = 0; i < 4; i++) {
        var t = data;
        t.lng = t.lng + i * 0.1;
        t.lat = t.lat + i * 0.1;
        t.lng = t.lng + "";
        t.lat = t.lat + "";
        t.level = i;
        pubMockData(data);
      }
    },
  })
}

const pubMockData = (data) => {
  wx.request({
    url: databus.host + "/mesh/putEvent",
    data: JSON.stringify(data),
    //处理中文乱码
    header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
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
}

module.exports = {
  getMockEventPicsUrl: getMockEventPicsUrl,
  mockData: mockData
}
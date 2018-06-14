// pages/event_edit/event_edit.js
var databus = require("../../databus/databus.js")
var app = getApp();
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
    index: 0, //event level picker index
    city: "重庆",   //TODO
    imgFiles: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = JSON.parse(options.data);
    var d = new Date().toISOString().split("T");
    var date = d[0];
    var time = d[1].substr(0, 5);
    this.setData({
      date: date,
      time: time,
			userName: app.globalData.userInfo.nickName,
			openId: app.globalData.openId,
			userId: app.globalData.userId,
    })

    if (data !== undefined || data !== {}) {
      this.setData({
        landmark: data.landmark,
        address: data.address,
        lat: data.lat,
        lng: data.lng
      })
    } else {
      wx.showModal({
        title: '警告',
        content: '获取位置信息出错',
        showCancel: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // wx.showModal({
    //   title: '提示',
    //   content: '请确保在刚才的地图下方勾选了地址，否则会造成创建失败',
    //   showCancel: false
    // })
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
    var promises = [];
    var data = e.detail.value;
    data = this.buildSubmitData(data);
    if (data == null) {
      return false;
    }
    //TODO 完成上传图片的promise后，在提交表单
    // for (var path of this.data.imgFiles) {
    //   promises.push(databus.uploadFileWithTempPath(path));
    // }
    // Promise.all(promises).then((values) => {
    //   console.log("get paths");
    //   console.log(values);
    //   data.paths = values;
    //   this.submitForm(data);
    // })
    this.submitForm(data);
  },

  buildSubmitData: function (data) {
    data.lng = this.data.lng + "";
    data.lat = this.data.lat + "";
    data.userName = this.data.userName;
    data.userId = this.data.userId;
    data.address = this.data.address;
    data.city = this.data.city;
    for (var d in data) {
      if (data[d] === "" || data[d] === undefined || data[d].length === 0) {
        wx.showModal({
          title: '警告⚠️',
          content: '请输入完整的信息',
          showCancel: false,
        })
        return null;
      }
    }
    return data;
  },

  submitForm: function (data) {

    wx.showLoading({
      title: '正在发布',
    });
    wx.request({
      url: databus.host + "/mesh/putEvent",
      data: JSON.stringify(data),
      //处理中文乱码
      header: {'content-type': 'application/x-www-form-urlencoded;charset=utf-8'},
      method: "POST",
      success: (e) => {

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
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          imgFiles: that.data.imgFiles.concat(res.tempFilePaths)
        });
      }
    })
  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.imgFiles // 需要预览的图片http链接列表
    })
  }
})
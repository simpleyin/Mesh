const host = "https://www.simpleyin.xyz";
//const host = "http://localhost:8080";
var app = getApp();

const getUserIdByOpenId = (openId) => {
  return new Promise((resolve) => {
    var data = {
      action: "getUserId",
      openId: openId
    }
    wx.request({
      url: host + '/mesh/user',
      data: JSON.stringify(data),
      method: "POST",
      success: (res) => {
        resolve(res.data);
      }
    });
  });
}

const getEventByCreatedId = (id) => {
  return new Promise((resolve) => {
    var data = {
      action: "getEventByCreatedId",
      createdId: id
    };
    wx.request({
      url: host + '/mesh/getEvent',
      data: JSON.stringify(data),
      method: "POST",
      success: (res) => {
        console.log(res);
        resolve(res.data);
      }
    })
  })
}

/**
 * 通过本地选取的临时文件的路径，上传文件至服务器
 */
const uploadFileWithTempPath = (tempPath) => {
  return new Promise((resolve) => {
    wx.uploadFile({
      url: host + '/mesh/upload',
      filePath: tempPath,
      name: 'file',
      formData: {
        "action": "uploadImg",
        "openId": app.globalData.openId,
        "userId": app.globalData.userId
      },
      success: (res) => {
        console.log(res);
        resolve(res.data);
      }
    })
  })
}

module.exports = {
  "getUserIdByOpenId": getUserIdByOpenId,
  "getEventByCreatedId": getEventByCreatedId,
  "uploadFileWithTempPath": uploadFileWithTempPath,
  "host": host,
}
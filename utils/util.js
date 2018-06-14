const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const removeZeroFromDate = date => {
  try {
    var arr = date.split(" ");
    var t = arr[1].split(".");
    var re = Array.prototype.concat(arr[0], t[0]);
    return re[0] + " " + re[1];
  } catch (e) {
    console.log(e);
  }
}

const getLevelName = n => {
  var name;
  switch(n) {
    case 0: name = "轻微";
    break;
    case 1: name = "较严重";
    break;
    case 2: name = "严重";
    break;
    case 3: name = "十分严重";
    break;
    default: name = "DEFAULT";
  }
  return name;
}

module.exports = {
  formatTime: formatTime,
  getLevelName: getLevelName,
  removeZeroFromDate: removeZeroFromDate
}

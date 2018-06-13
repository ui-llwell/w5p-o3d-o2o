const util = require('../../utils/util.js')
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    courierNumber:'',
    logisticsList: [
      // {
      //   context: '[韩国—仁川]包裹已到达[仁川海外仓]',
      //   ftime: '2018.4.23 23:05 ',
      // },
      // {
      //   context: '[韩国—仁川]包裹已到达[仁川海外仓]',
      //   ftime: '2018.4.23 23:05',
      // }
    ]
  },
  onLoad: function (obj) {
    var ttt = JSON.parse(obj.goodsMes);
    // console.log(ttt)
    this.setData({
      logisticsList: ttt.data,
      courierNumber: ttt.nu,
    })
  },

})

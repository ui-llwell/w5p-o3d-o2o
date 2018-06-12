const util = require('../../utils/util.js')
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    waybilltype:'',
    waybillno:'',
    billId:'billId123',
    createTime: '2018-06-12 11:02:03',//订单创建时间
    payTime:'2018-06-12 11:02:03',//支付时间
    addr_name:'f',
    addr_tel:'10010',
    addr_addr:'辽宁省大连市中山区人民路11111号22',
    totalPrice:'33434.22',
    
    orderList: [
      {
        slt: 'http://ecc-product.oss-cn-beijing.aliyuncs.com/xcx/首页-扫码下单色块@3x.png',
        skuBillName: '资生堂男士滋润乳100ml 补水补水补水补水保湿',
        skuUnitPrice:'22222.22',
        quantity:'2'
      },
      {
        slt: 'http://ecc-product.oss-cn-beijing.aliyuncs.com/xcx/首页-扫码下单色块@3x.png',
        skuBillName: '资生堂男士滋润乳100ml 补水补水补水补水保湿',
        skuUnitPrice: '22.22',
        quantity: '2'
      }
    ]
  },
  onLoad: function (obj) {
    console.log(obj);
    var ttt = JSON.parse(obj.goodsMes);
    console.log(ttt);
    this.setData({
      billId: ttt.billId,
      createTime: ttt.createTime,
      payTime: ttt.payTime,
      addr_name: ttt.consigneeName,
      addr_tel: ttt.consigneeMobile,
      addr_addr: ttt.addr,
      totalPrice: ttt.total,
      orderList: ttt.orderGoodsList,

      waybillno: ttt.waybillno,
      waybilltype: ttt.waybilltype
    })
  },

  checkLogistics(){
    console.log('clipboard')
    console.log(this.data)
    wx.request({
      url: 'https://wxapp.llwell.net/query?type=' + this.data.waybilltype + '&postid=' + this.data.waybillno +'&id=1&valicode=&temp=0.0440786141981274',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json' // 默认值
      }, // 设置请求的 header
      success: function (res) {
        // 发送请求成功执行的函数
        console.log(res)

          
          var ttt = res.data;
          // console.log('ttt',ttt)
          wx.navigateTo({
            url: '../logistics/index?goodsMes=' + JSON.stringify(ttt)
          })

        


      },
      fail: function (res) {
      },
      complete: function () {
        wx.hideLoading();
      }
    })
    // wx.setClipboardData({
    //   data: 'data',
    //   success: function (res) {
    //     wx.getClipboardData({
    //       success: function (res) {
    //         console.log(res.data) // data
    //         // wx.navigateTo({
    //         //   url: '../show/show'
    //         // })
    //       }
    //     })
    //   }
    // })
  }
})

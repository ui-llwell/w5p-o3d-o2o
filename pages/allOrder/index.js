//myOrder.js
const app = getApp()
Page({
  data: {
    orderList: [
      // {
      //   billId: 327710274213934286,
      //   imgUrl: 'http://ecc-product.oss-cn-beijing.aliyuncs.com/xcx/首页-扫码下单色块@3x.png',
      //   createTime: '2018.4.23 23:05',
      //   product: '资生堂男士滋润乳100ml 补水补水补水补水保湿',
      // }
    ]
  },
  onShow:function(){
    var that = this;
    var data = {
      shop: wx.getStorageSync('shop'),
      token: wx.getStorageSync('token')
    }
    app.Ajax(
      'Order',
      'POST',
      'GetOrderList',
      data,
      function (json) {
        if (json.success) {
          // console.log(json)
          that.setData({
            orderList: json.data.orderList,
          })
        } else {
          console.log('请重新获取订单');
        }
      }
    );
  },
  logistics:function(e){
    // console.log("查看详情");
    // console.log(e.currentTarget.dataset.billid);
    app.Ajax(
      'Order',
      'POST',
      'GetOrder',
      {
        orderId: e.currentTarget.dataset.billid, 
        token: wx.getStorageSync('token')
        },
      function (json) {
        if (json.success) {
          var ttt = json.data;
          // console.log('ttt',ttt)
          wx.navigateTo({
            url: '../goodsDetail/index?goodsMes=' + JSON.stringify(ttt)
          })
          
        } else {
          wx.showModal({
            title: "温馨提示",
            content: "请重新选择商品",
            showCancel: false,
            confirmText: "确定"
          })
        }
      }
    );


  }
})

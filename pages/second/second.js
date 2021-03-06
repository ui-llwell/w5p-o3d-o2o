//logs.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    paddingBottom:"2",
    payTime:1,
    buyNum:1,
    maxNum:null,
    yesMax:false,
    minNum:null,
    imgUrls: [],
    second_content_detail_title:'',
    second_content_detail_price:'',
    id:'',
    stock:'',
    radioItems: [
      { value: '1', name: '现场取货',disabled:'true' },
      { value: '2', name: '快递收货', checked: 'true' },
    ],
    expressageType: '2',
    inputName: '',
    inputIdCard:'',
    
    inputPerson: '',
    inputAddress: '',
    inputPhone: '',
  },
  onLoad: function(obj) {
    // console.log(obj)
    // console.log(JSON.parse(obj.goodsMes))
    var ttt = JSON.parse(obj.goodsMes);
    this.setData({
      second_content_detail_title: ttt.goodsname,
      second_content_detail_price : ttt.price,
      stock: ttt.stock,
      id:ttt.id,
      imgUrls : ttt.slt,
      maxNum:ttt.stock
    })
    if (wx.getStorageSync('inputName')){
      this.setData({
        inputName: wx.getStorageSync('inputName'),
        inputIdCard: wx.getStorageSync('inputIdCard'),
        inputPerson: wx.getStorageSync('inputPerson'),
        inputAddress: wx.getStorageSync('inputAddress'),
        inputPhone: wx.getStorageSync('inputPhone'),
      })
    }
    
  },
  
  minus: function(e){
    if (this.data.buyNum > 1) {
      this.data.buyNum -= 1;
      this.setData({
        buyNum: this.data.buyNum
      })
    }
  },
  plus: function(){
    if (this.data.buyNum<this.data.maxNum){
      this.data.buyNum += 1;
      this.setData({
        buyNum: this.data.buyNum
      })
    } else {
      this.setData({
        yesMax: true
      })
    }
  },
  radioChange: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      expressageType: e.detail.value
    });

    var items = this.data.radioItems;
    for (var i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value == e.detail.value
    }

    this.setData({
      radioItems: items
    });
  },
  formSubmit: function (e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (e.detail.value.radio==1){
      this.toSuccessBuy(e.detail.value);
    }else{
      var ccc = e.detail.value;
      if (ccc.inputName && ccc.inputIdCard && ccc.inputPerson && ccc.inputPhone && ccc.inputAddress){
        
          wx.setStorageSync('inputName', ccc.inputName),
          wx.setStorageSync('inputIdCard', ccc.inputIdCard),
          wx.setStorageSync('inputPerson', ccc.inputPerson),
          wx.setStorageSync('inputAddress', ccc.inputAddress),
          wx.setStorageSync('inputPhone', ccc.inputPhone),
        this.toSuccessBuy(e.detail.value);
      }else{
        // console.log("请添必填项")
        wx.showModal({
          title: "注意",
          content: "请输入完整信息",
          showCancel: false,
          confirmText: "确定"
        })
      }
    }
  },
  formReset: function (e) {
    // console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  },
  toSuccessBuy: function (needs){
    new Promise(resolve => {
      app.getLogin(resolve);
    }).then(() => {
      var data = {
        product: this.data.second_content_detail_title,
        goodsId: this.data.id,
        shop: wx.getStorageSync('shop'),
        token: wx.getStorageSync('token'),
        ...needs
      }
      // console.log('needs',data)
      this.testPayment(data);
    })
  },
  getAddress: function(){
    var that = this;
    wx.getSetting({
      success(res) {
        // console.log('成功输出')
        if (!res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success() {
              wx.chooseAddress({
                success: function (res) {
                  that.setData({
                    inputPerson: res.userName,
                    inputAddress: res.provinceName + res.cityName + res.countyName + res.detailInfo,
                    inputPhone: res.telNumber,
                  });
                }
              })
            }
          })
        } else {
          // console.log('失败输出')
          wx.chooseAddress({
            success: function (res) {
              that.setData({
                inputPerson: res.userName,
                inputAddress: res.provinceName + res.cityName + res.countyName + res.detailInfo,
                inputPhone: res.telNumber,
              });
            }
          })
        }
      }
    })
  },
  
  testPayment: function (data) {
    var that = this;
    app.Ajax(
      'Payment',
      'POST',
      'Payment',
       data ,
      function (json) {
        // console.log('zhifu',json);
        if (json.success) {
          
          // that.finishPaySend(json.data.billId);
          // var number = json.data.product;
          // var date = that.getNowFormatDate();
          // var buyOrder = wx.getStorageSync('buyOrder')||[]
          // buyOrder.unshift({ number,date})
          // wx.setStorageSync('buyOrder', buyOrder)
          wx.requestPayment({
            'timeStamp': json.data.timeStamp,
            'nonceStr': json.data.nonceStr,
            'package': json.data.package,
            'signType': 'MD5',
            'paySign': json.data.paySign,
            'success': function (res) {
              // console.log("ok");
              // console.log(res);
              that.finishPaySend(json.data.billId);
              wx.navigateBack({
                url: '../index/index'
              })
            },
            'fail': function (res) {
              wx.showModal({
                title: "支付失败",
                content: "请重新下单",
                showCancel: false,
                confirmText: "确定"
              })
            }
          })
        } else {
          wx.showModal({
            title: "支付失败",
            content: "请重新下单",
            showCancel: false,
            confirmText: "确定"
          })
        }

      }
    );
  },
  finishPaySend:function(billId){
      // console.log(billId);
      var that = this;
      app.Ajax(
        'Payment',
        'POST',
        'SendPaymentMsg',
        { orderId: billId},
        function (json) {
          if (json.success) {
            console.log('yesssss')
          } else {
            // console.log(that.data.payTime)
            if (that.data.payTime<3){
              var curPayTime = that.data.payTime+=1
              that.setData({
                payTime: curPayTime
              })
              setTimeout(
                that.finishPaySend
                , 5000, billId)
            }
          }
        })
  },
  bindfocus:function(e){
    console.log('e',e)
    // this.setData({
    //   paddingBottom:e.detail.height+200
    // })
  },
  bindblur:function(e){
    // this.setData({
    //   paddingBottom: 2
    // })
  }
 
})

//index.js
//获取应用实例
const app = getApp()
//导入百度地图API接口
var bmap = require('../../libs/bmap-wx.min.js');
Page({
  data: {

    weathericon: "../../images/sun.png",
    mydata:{
      "晴天":'../../images/sun.png',
      "大雨":'../../images/rainy.png',
      "多云":'../../images/cloudy.png'
    },
    city: '长沙',
    day: '2020年6月23日',
    weather: '晴',
    temp: '28',
    tips: "生活小提示",

    ocity: "待查询",
    oweather: "待查询",
    otemp: "待查询",
    otips: "待查询"

    
  },
  //事件处理函数
  getinfo: function() {
    console.log("获取天气信息：xxx")
  },
  onLoad: function () {
   var that = this;
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
     });
     that.getcity()
  },
  getcity: function(){
    var that = this;
    var BMap = new bmap.BMapWX({ak:'N68fXDY4ese8P8WWWKV5GK3Cu2kjUHpK'});
    var fail = function(data){
      console.log('fail!')
    };
    var success =function(data){
      console.log('success!');
      var city = data.currentWeather[0].currentCity;
      console.log(city);
      city = city.replace('市','');
      that.getweather(city);
      that.setData({
        city: city
      });
    };
    BMap.weather({
      fail: fail,
      success: success
    });
  },
  getweather: function(city){
    var that = this;
    wx.request({
      url: 'http://wthrcdn.etouch.cn/weather_mini?city='+city, //仅为示例，并非真实的接口地址
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
        var icon = res.data.data.forecast[0].type
        switch(icon)
        {
          case "晴天":
            that.setData({weathericon: that.data.mydata.晴天})
          case "多云":
            that.setData({weathericon: that.data.mydata.多云})
          case "大雨":
            that.setData({weathericon: that.data.mydata.大雨})
        }
        that.setData(
          {
            day: res.data.data.forecast[0].date,
            weather: res.data.data.forecast[0].type,
            temp: res.data.data.wendu,
            tips: res.data.data.ganmao
          }
        )
      }
    })
  },
  getothercity: function(){
    var that = this;
    wx.request({
      url: 'http://wthrcdn.etouch.cn/weather_mini?city='+this.data.ocity, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
        that.setData(
          {
            ocity: that.data.ocity,
            oweather: res.data.data.forecast[0].type,
            otemp: res.data.data.wendu+"℃",
            otips: res.data.data.ganmao,
          }
        )
      }
    })
  },
  getInput: function(e){
    this.data.ocity = e.detail.value;
  }
})

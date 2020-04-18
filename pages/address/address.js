// pages/address/address.js
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:'悉尼歌剧院',
    show:false,
    url:'../../images/address-one.jpg',
    up:'../../images/up.png',
    down:'../../images/down.png'
  },

  //简介显示和隐藏
  onVisibility:function(word){
    that = this;
    that.setData({
      show: that.data.show ? false : true
    })
    
  },

  getAddress:function(word){
    wx.request({
      url: 'https://api.tianapi.com/txapi/scenic/index?key=&word=' + word,
      success:res=>{
        if(res.data.code == 200){
          that.setData({
            detail: res.data.newslist[0]
          })
        }else{
            that.setData({
              detail: res.data.msg
            }) 
        }
      }
    })
  },

  
  //获取token
  getToken:function(base64){
    
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token',
      method:"GET",
      data:{
        grant_type:"client_credentials",
        client_id:"",
        client_secret:""
      },
      success:res=>{
        // console.log(res.data.access_token);
        that.addressId(res.data.access_token,base64)
      }
    })
  },

  //地标识别
  addressId:function(token,base64){
    that = this;
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/landmark?access_token=' + token,
      dataType:'json',
      method:"POST",
      header:{
        'Content-Type':'application/x-www-form-urlencoded'
      },
      data:{
        image:base64
      },
      success:res=>{
        var content = {
          address:"未知"
        }
        if(res.data.result != null){
          if(res.data.result.landmark != ""){
            content.address = res.data.result.landmark
          }
        }
        wx.hideLoading();
        wx.showToast({
          title: '图像识别成功'
        });
        that.setData({
          show:false,
          address:content.address
        })  
        that.getAddress(content.address);
      }
    })
  },

  // 选择图片
  clickSel:function(){
    wx.chooseImage({
      count:1,
      sizeType:["compressed"],
      success:res=>{
        wx.showLoading({
          title: '图像识别中...',
        })
        //获取全局的文件管理器
        var manager = wx.getFileSystemManager();
        manager.readFile({
          filePath:res.tempFilePaths[0],
          encoding:'base64',
          success:res=>{
            //64位编码加前缀
            var src = "data:image/jpg;base64," + res.data;
            that.getToken(res.data);
            that.setData({
              url:src
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
})
// pages/mine/mine.js
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:false,
    show:false,
    up:'../../images/up.png',
    down:'../../images/down.png'
  },

  //果蔬显示和隐藏
  onVisibility:function(word){
    that = this;
    that.setData({
      show: that.data.show ? false : true
    })
  },

  onViewImage:function(event){
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],
      current:'src'
    })
  },

  //获取菜谱
  getCaipu:function(word){
    wx.request({
      url: 'https://api.tianapi.com/txapi/caipu/index?key=&word=' + word,
      success: function (res) {
        if(res.data.code == 200){
        that.setData({
          content: res.data.newslist
        })
      }else{
          that.setData({
            content: res.data.msg
          }) 
      }
      },
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
        that.fruitId(res.data.access_token,base64)
      }
    })
  },

  //果蔬识别
  fruitId:function(token,base64){
    that = this;
    var plantUrl = that.data.url;
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/classify/ingredient?access_token=' + token,
      dataType:'json',
      method:"POST",
      header:{
        'Content-Type':'application/x-www-form-urlencoded'
      },
      data:{
        image:base64,
        top_num:3
      },
      success:res=>{
        console.log(res.data);
        var content = [
          {
            name:"",
            score:"",
            url:plantUrl
          },
          {
            name:"",
            score:""
          },
          {
            name:"",
            score:""
          },
        ]
        if(res.data.result != null){
          for(var i = 0;i<res.data.result.length;i++){
            var probability = res.data.result[i].score
            content[i].name = res.data.result[i].name;
            content[i].score = probability.toFixed(3);
          }
        }
        wx.hideLoading();
        wx.showToast({
          title: '图像识别成功'
        });
        that.setData({
          flag:true,
          show:false,
          plantList:content,
          result_num:res.data.result_num
        })  
        that.getCaipu(res.data.result[0].name)
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
        // console.log(res.tempFilePaths[0])
        //获取全局的文件管理器
        var manager = wx.getFileSystemManager();
        manager.readFile({
          filePath:res.tempFilePaths[0],
          encoding:'base64',
          success:res=>{
            // console.log(res.data);
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
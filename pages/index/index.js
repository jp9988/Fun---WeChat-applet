// pages/index/index.js
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:false,
    tipFlag:true,
    markFlag:false
  },
  //获取token
  get_token:function(base64){
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token',
      method:"GET",
      data:{
        "grant_type":"client_credentials",
        "client_id":"",//APIKEY 
        "client_secret":""//secret Key
      },
      dataType:"json",
      success:res=>{
        //token获取成功
        that.faceId(res.data.access_token,base64);
      }
    })
  },
  //人脸识别
  faceId:function(token,base64){
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=' + token,
      method:"POST",
      header:{
        "Content-Type":"application/json"
      },
      data:{
        image:base64,
        image_type:"BASE64",
        face_field:"age,beauty,expression,face_shape,gender,glasses,landmark,landmark150,race,quality,eye_status,emotion,face_type,mask"
      },
      success:res=>{
        console.log("识别成功",res.data.result);
        //关闭loading
        wx.hideLoading();
        //错误码为零，执行成功
        if(!res.data.error_code){
          wx.showToast({
            title: '人脸识别成功',
          })
          that.setData({
            // face_num:res.data.resultface_num,
            face_list:res.data.result.face_list[0],
            flag:true,
            tipFlag:false,
            markFlag: false
          })
        }else if(res.data.error_code == 222202){
          wx.showToast({
            title: '图片中不包含人脸',
            icon:"none"
          });
          that.setData({
            flag:false,
            tipFlag:true,
            markFlag:false
          })
        }else{
          wx.showToast({
            title: '人脸识别失败,错误码:' + res.data.error_code,
          });
          that.setData({
            flag:false,
            tipFlag:true,
            markFlag:false
          })
        }

        
      }
    })
  },

  onMark:function(){
    //特征点的显示和隐藏
    that.setData({
      markFlag: that.data.markFlag ? false : true
    })
  },

  click:function(event){
    //打开相册选择图片
    wx.chooseImage({
      count:1,
      sizeType:["compressed"],
      success:res=>{
        //选择照片时开始执行loading
        wx.showLoading({
          title: '人脸识别中...',
        })

        console.log(res.tempFilePaths[0]);

        //获取原图宽高
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success:res=>{
            //算比例
            var number = 375/res.width;
            console.log(number)
            that.setData({
              num:number
            })
          }
        })
        //获取全局的文件管理器
        var manager = wx.getFileSystemManager();
        //读取文件的内容
        manager.readFile({
          filePath:res.tempFilePaths[0],
          //以base64位读取文件内容
          encoding:"base64",
          success:res=>{
            //返回指定格式的文件编码
            // console.log(res);
            //64位编码加前缀
            var src = "data:image/jpg;base64," + res.data;
            that.get_token(res.data);
            //把base64存到data            
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
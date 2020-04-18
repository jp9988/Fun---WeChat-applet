// pages/plant-animal/plant-animal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onPlant:function(){
    //只能使用相对路径
    wx.navigateTo({
      url: '../plant/plant'
    })
  },

  onAnimal:function(){
    //只能使用相对路径
    wx.navigateTo({
      url: '../animal/animal'
    })
  },
})
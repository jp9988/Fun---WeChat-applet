// pages/dish-fruit/dish-fruit.js
Page({

  onDish:function(){
    wx.navigateTo({
      url: '../dish/dish',
    })
  },

  onFruit:function(){
    wx.navigateTo({
      url: '../fruit/fruit',
    })
  },
})
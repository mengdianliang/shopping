var express = require('express');
var router = express.Router();
var User = require('./../models/user');
require('./../util/format')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// 用户登录
router.post('/login', function (req, res, next) {
  var param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  User.findOne(param, function (err, doc) {
    if (err) {
      res.json({
        code: 1,
        msg: err.message
      })
    } else {
      // console.log(doc)
      if (doc) {
        res.cookie('userId', doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        res.cookie("userName", doc.userName, {
          path: '/',
          maxAge: 1000*60*60
        });
        //req.session.user = doc;
        res.json({
            code: 0,
            msg: '',
            result: {
              userName: doc.userName
            }
        });
      } else {
        res.json({
          code: 1,
          msg: '用户名或密码错误'
        })
      }
    }
  })
})

//用户登出
router.post("/logout", function (req, res, next) {
  res.cookie("userId", "", {
    path: "/",
    maxAge: -1
  })
  res.cookie("userName", "", {
    path: "/",
    maxAge: -1
  })
  res.json({
    code: 0,
    msg: '',
    result: {
      userName: ''
    }
  })
})

// 登录记忆
router.get("/checkLogin", function (req, res, next) {
  if(req.cookies.userId){
      res.json({
        code: 0,
        msg: '',
        result: {
          userName: req.cookies.userName || ''
        }
      })
  }else{
    res.json({
      code: 1,
      msg: '未登录',
      result: ''
    })
  }
})
// 查询当前用户购物车的数量
router.get("/getCartCount", function (req, res, next) {
  if (req.cookies && req.cookies.userId) {
    console.log("userId:" + req.cookies.userId)
    var userId = req.cookies.userId
    User.findOne({"userId": userId}, function (err, doc) {
      if (err) {
        res.json({
          code: 1,
          msg: err.message
        })
      } else {
        let cartList = doc.cartList
        let cartCount = 0
        cartList.map((item) => {
          cartCount += parseFloat(item.productNum)
        })
        res.json({
          code: 0,
          msg: "",
          result: cartCount
        })
      }
    })
  } else {
    res.json({
      code: 0,
      msg: "当前用户不存在",
      result: 0
    })
  }
})
// 查看当前用户的购物车数据
router.get('/cartList', function (req, res, next) {
  var userId = req.cookies.userId
  User.findOne({userId:userId}, function (err,doc) {
      if (err) {
        res.json({
          code: 1,
          msg: err.message,
          result: ''
        })
      } else {
          if (doc) {
            res.json({
              code: 0,
              msg: '',
              result:doc.cartList
            })
          } else {
            res.json({
              code: 1,
              msg: '购物车空空如也'
            })
          }
      }
  });
})
// 删除购物车商品
router.post('/cartDel', function (req, res, next) {
  var userId = req.cookies.userId
  var productId = req.body.productId
  // $pull 要删除的数据
  User.update({
    userId: userId
  }, {
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  },function (err, doc) {
    if (err) {
      res.json({
        code: 1,
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        code: 0,
        msg: '',
        result: 'suc'
      })
    }
  })
})
// 修改购物车商品数量
router.post("/cartEdit", function (req, res, next) {
  var userId = req.cookies.userId
  var productId = req.body.productId
  var productNum = req.body.productNum
  var checked = req.body.checked

  // 更新子文档
  User.update({"userId": userId, "cartList.productId": productId}, {
    "cartList.$.productNum": productNum,
    "cartList.$.checked": checked,
    }, function (err,doc) {
    if (err) {
      res.json({
        code: 1,
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        code: 0,
        msg: '',
        result: 'suc'
      })
    }
  })
})

// 购物车商品全选功能
router.post("/editCheckAll", function (req, res, next) {
  var userId = req.cookies.userId
  var checkAll = req.body.checkAll ? '1' : '0'
  User.findOne({userId: userId}, function (err, user) {
    if (err) {
      res.json({
        code: 1,
        msg: err.message,
        result: ''
      })
    } else {
      if (user) {
        // console.log(user)
        user.cartList.forEach((item) => {
          item.checked = checkAll
        })
        user.save(function (err1, doc) {
            if (err1) {
              res.json({
                code: 1,
                msg: err1,message,
                result: ''
              })
            }else{
              res.json({
                code: 0,
                msg: '',
                result: 'suc'
              });
            }
        })
      }
    }
  })
})
//查询用户快递地址
router.get("/addressList", function (req, res, next) {
  var userId = req.cookies.userId
  User.findOne({userId: userId}, function (err, doc) {
    if(err){
      res.json({
        code: 1,
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        code: 0,
        msg: '',
        result: doc.addressList
      });
    }
  })
})
//设置快递默认地址
router.post("/setDefault", function (req, res, next) {
  var userId = req.cookies.userId
  var addressId = req.body.addressId
  if (!addressId) {
    res.json({
      code: 1003,
      msg: 'addressId is null',
      result:''
    })
  } else {
    User.findOne({userId: userId}, function (err, doc) {
      if (err) {
        res.json({
          code: 1,
          msg: err.message,
          result: ''
        })
      } else {
        var addressList = doc.addressList
        addressList.forEach((item) => {
          if (item.addressId === addressId) {
             item.isDefault = true
          } else {
            item.isDefault = false
          }
        })
        doc.save(function (err1, doc1) {
          if (err) {
            res.json({
              code: 1,
              msg: err.message,
              result: ''
            })
          } else {
              res.json({
                code: 0,
                msg: '',
                result: 'suc'
              })
          }
        })
      }
    })
  }
})

// 删除快递地址
router.post("/delAddress", function (req, res, next) {
  var userId = req.cookies.userId
  var addressId = req.body.addressId
  User.update({
    userId: userId
  },{
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, function (err, doc) {
      if (err) {
        res.json({
            code: 1,
            msg: err.message,
            result: ''
        })
      } else {
        res.json({
          code: 0,
          msg: '',
          result: 'suc'
        })
      }
  })
})
// 添加快递地址
router.post("/addAddress", function (req, res, next) {
  console.log(req)
  var userId = req.cookies.userId
  var userName = req.body.userName
  var streetName = req.body.streetName
  var postCode = parseInt(req.body.postCode)
  var tel = parseInt(req.body.tel)
  User.findOne({userId: userId}, function (err, doc) {
     if (err) {
        res.json({
            code: 0,
            msg: err.message,
            result: ''
        })
     } else {
       var maxAddress = 0
       //获取当前用户的地址信息
       doc.addressList.forEach((item) => {
          if (parseInt(item.addressId) > maxAddress) {
            maxAddress = item.addressId
          }
          item.isDefault = false
       })
       var addressId = (maxAddress + 1).toString()

       var address = {
          addressId: addressId,
          userName: userName,
          streetName: streetName,
          postCode: postCode,
          tel: tel,
          isDefault: true
       }
       doc.addressList.unshift(address)
       doc.save(function (err1, doc1) {
          if (err1) {
            res.json({
              code: 1,
              msg: err.message,
              result: ''
            })
          } else {
            res.json({
              code: 0,
              msg: '',
              result: 'suc'
            })
          }
       })
     }
  })
})

// 添加订单号
router.post("/payMent", function (req, res, next) {
  var userId = req.cookies.userId
  var addressId = req.body.addressId
  var orderTotal = req.body.orderTotal
  User.findOne({userId: userId}, function (err, doc) {
     if (err) {
        res.json({
            code: 0,
            msg: err.message,
            result: ''
        })
     } else {
       var address = ''
       var goodsList = []
       //获取当前用户的地址信息
       doc.addressList.forEach((item) => {
          if (addressId === item.addressId) {
            address = item
          }
       })
       //获取用户购物车的购买商品
       doc.cartList.filter((item) => {
         if (item.checked === '1') {
           goodsList.push(item)
         }
       })

       var platform = '622'
       var r1 = Math.floor(Math.random()*10)
       var r2 = Math.floor(Math.random()*10)

       var sysDate = new Date().Format('yyyyMMddhhmmss')
       var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
       var orderId = platform + r1 + sysDate + r2
       var order = {
          orderId: orderId,
          orderTotal: orderTotal,
          addressInfo: address,
          goodsList: goodsList,
          orderStatus: '1',
          createDate: createDate
       }
       doc.orderList.push(order)
       doc.save(function (err1, doc1) {
          if (err1) {
            res.json({
              code: 1,
              msg: err.message,
              result: ''
            })
          } else {
            res.json({
              code: 0,
              msg: '',
              result: {
                orderId: order.orderId,
                orderTotal: order.orderTotal
              }
            })
          }
       })
     }
  })
})

//根据订单Id查询订单信息
router.get("/orderDetail", function (req, res, next) {
  var userId = req.cookies.userId
  var orderId = req.param("orderId")
  console.log(orderId)
  User.findOne({userId: userId}, function (err, userInfo) {
    if (err) {
      res.json({
        code: 1,
        msg: err.message,
        result: ''
      })
    } else {
      var orderList = userInfo.orderList
      if (orderList.length > 0) {
        var orderTotal = 0
        orderList.forEach((item) => {
          if (item.orderId === orderId) {
            orderTotal = item.orderTotal
          }
        })
        if (orderTotal > 0) {
          res.json({
            code: 0,
            msg: '',
            result: {
              orderId: orderId,
              orderTotal: orderTotal
            }
          })
        } else {
          res.json({
            code: 120002,
            msg: '无此订单',
            result: ''
          })
        }
      } else {
        res.json({
          code: 120001,
          msg: '当前用户未创建订单',
          result: ''
        })
      }
    }
  })
})
module.exports = router;

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
var User = require('../models/user');

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/db_demo');

mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.")
});

mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
});
//查询商品列表数据
router.get('/list', function (req, res, next) {
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  var sort = req.param('sort')
  let skip = (page - 1) * pageSize
  let curRange = req.param('curRange')
  let params = {}
  let priceGt = ''
  let priceLte = ''
  if (curRange!=='all') {
    switch (curRange) {
      case 'price0':priceGt = 0;priceLte=100;break;
      case 'price1':priceGt = 100;priceLte=500;break;
      case 'price2':priceGt = 500;priceLte=1000;break;
      case 'price3':priceGt = 1000;priceLte=5000;break;
    }
    console.log(priceGt,priceLte)
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({'salePrice': sort})
  goodsModel.exec({}, function (err, doc) {
    if (err) {
      res.json({
        code: 1,
        msg: err.message
      })
    } else {
      res.json({
        code: 0,
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

//加入购物车
router.post('/addCart', function (req, res, next) {
  var userId = '100000077'
  var productId = req.body.productId
  User.findOne({userId: userId}, function (err, userDoc) {
    if (err) {
      res.json({
        code: 1,
        msg: err.msg
      })
    } else {
      console.log("userDoc:" + userDoc)
      if (userDoc) {
        var goodsItem = '';
        userDoc.cartList.forEach(function (item) {
          if (item.productId === productId) {
            goodsItem = item
            item.productNum++
          }
        })
        if (goodsItem) {
          userDoc.save(function (err2, doc2) {
            if (err2) {
              res.json({
                code: 1,
                msg: err2.msg
              })
            } else {
              res.json({
                code: 0,
                msg: '',
                result: 'suc'
              })
            }
          })
        } else {
          Goods.findOne({productId: productId}, function(err1, doc) {
            if (err1) {
              res.json({
                code: 1,
                msg: err1.message
              })
            } else {
              if (doc) {
                doc.productNum = 1;
                doc.checked = 1;
                userDoc.cartList.push(doc);
                userDoc.save(function (err2,doc2) {
                  if (err2) {
                    res.json({
                      code: 1,
                      msg: err2.message
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
            }
          })
        }
      }
    }
  })

})
module.exports = router;

var express = require('express');
var router = express.Router();
var TuiguangTagModel = require('../model/TuiguangTag.js')

router.get('/', function (req, res, next) {
  let account_id;
  if(!req.session.account) {
    account_id = req.query.account_id
  } else {
    account_id = req.session.account._id;
  }
  TuiguangTagModel.find({account_id}, function (err, result) {
    if (err) {
      console.log(err)
      res.send({
        err: err
      })
    } else {
      res.send({
        success: "查询成功",
        data: result
      })
    }
  })
})

router.post('/', function (req, res, next) {
  let account_id;
  if(!req.session.account) {
    account_id = req.body.account_id
  } else {
    account_id = req.session.account._id;
  }
  TuiguangTagModel.findOne({
    name: req.body.name,
    account_id
  }, function (err, result) {
    if (err) {
      console.log(err)
      res.send({
        err: err
      })
    } else {
      console.log('result', result)
      if (result) {
        res.send({
          success: "查询成功",
          exist: 1,
          data: result
        })
      } else {
        var tm = TuiguangTagModel({
          name: req.body.name,
          account_id
        })
        tm.save(function (error, tm) {
          console.log(error)
          res.send({
            success: "查询成功",
            exist: 0,
            data: tm
          })
        });
      }
    }
  });
})


router.delete('/', function (req, res, next) {
  TuiguangTagModel.findByIdAndRemove(req.query.id, function (err, result) {
    if (err) {
      console.log(err);
      res.send({
        err: err
      })
    } else {
      res.send({
        success: "删除成功"
      })
    }
  })
})



module.exports = router;
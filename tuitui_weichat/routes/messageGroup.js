const express = require('express');
const router = express.Router();
const MessageGroupModel = require('../model/MessageGroup');

router.get('/', async(req, res, next) => {
  let account_id;
  if(!req.session.account) {
    account_id = req.query.account_id
  } else {
    account_id = req.session.account._id;
  }
  let data = await MessageGroupModel.find({account_id});
  res.send({code: 1, msg: "查询成功", data})
});

router.post('/', async (req, res, next) => {
  let account_id;
  if(!req.session.account) {
    account_id = req.body.account_id
  } else {
    account_id = req.session.account._id;
  }
  let {group} = req.body;
  if(account_id) {
    let data = await MessageGroupModel.create({group, account_id});
    if(data) {
      res.send({code: 1, msg: "创建成功", data})
    } else {
      res.send({code: -1, msg: "创建失败"})
    }
  } else {
    res.send({code: -1, msg: "创建失败,用户信息失效"})
  }
  
});

router.delete("/", async (req, res, next) => {
  let {_id} = req.query;
  let data = await MessageGroupModel.findByIdAndRemove(_id);
  if(data) {
    res.send({code: 1, msg: "删除成功", data})
  } else {
    res.send({code: -1, msg: "删除失败"})
  }
});


module.exports = router;
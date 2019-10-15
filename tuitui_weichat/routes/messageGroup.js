const express = require('express');
const router = express.Router();
const MessageGroupModel = require('../model/MessageGroup');

router.get('/', async(req, res, next) => {
  let data = await MessageGroupModel.find();
  res.send({code: 1, msg: "查询成功", data})
});

router.post('/', async (req, res, next) => {
  let {group} = req.body;
  let data = await MessageGroupModel.create({group});
  if(data) {
    res.send({code: 1, msg: "创建成功", data})
  } else {
    res.send({code: -1, msg: "创建失败"})
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
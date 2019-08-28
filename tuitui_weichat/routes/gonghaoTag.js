var express = require('express');
var router = express.Router();
var GonghaoTagModel = require('../model/GonghaoTag.js');

router.get('/', async (req, res, next) => {
  let account_id = req.session.account._id;
  let result = await GonghaoTagModel.find({account_id});
  if(result.length > 0) {
    res.send({ code: 1, msg: "查询成功", data: result })
  } else {
    res.send({code: -1, msg: "没有查询到相关数据"})
  }
});

router.get('/get_name', async (req, res, next) => {
  let account_id = req.session.account._id, _id = req.query.tagId;
  let result = GonghaoTagModel.findOne({_id, account_id});
  if(result) {
    res.send({ code: 1, msg: "查询成功", data: result })
  } else {
    res.send({code: -1, msg: "没有查询到相关数据"})
  }
});

router.post('/', async (req, res, next) => {
  let account_id = req.session.account._id;
  let { name } = req.body;
  let result = await GonghaoTagModel.findOne({ name, account_id });
  if(result) {
    res.send({ code: 1, msg: "查询成功", exist: 1, data: result })
  } else {
    let data = await GonghaoTagModel.create({ name, account_id });
    if(data) {
      res.send({ code: 1, msg: "创建标签成功", exist: 0, data })
    } else {
      res.send({ code: -1, msg: "创建失败" })
    }
  }
});

router.put("/", async (req, res, next) => {
  let { id, name } = req.body;
  let result = await GonghaoTagModel.findByIdAndUpdate(id, {name}, {new: true});
  if(result) {
    res.send({code:1, msg: "修改成功", data: result})
  } else {
    res.send({code: -1, msg: "修改失败"})
  }
});

router.delete('/:id', async (req, res, next) => {
  let result = await GonghaoTagModel.findByIdAndRemove(req.params.id);
  if(result) {
    res.send({code: 1, msg: "删除成功"})
  } else {
    res.send({code: -1, msg: "删除失败"})
  }
});

module.exports = router;
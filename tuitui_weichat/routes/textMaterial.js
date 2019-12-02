const express = require('express');
const router = express.Router();
const TextMaterialModel = require('../model/TextMaterial.js');
var UserTagModel = require('../model/UserTag');
var wechat_util = require('../util/get_weichat_client.js');

router.get('/', async (req, res, next) => {
  let account_id, {code} = req.query;
  if(!req.session.account) {
    account_id = req.query.account_id
  } else {
    account_id = req.session.account._id;
  }
  let result = await TextMaterialModel.find({account_id, code});
  if(result.length > 0) {
    res.send({code: 1, msg: "查询成功", data: result})
  } else {
    res.send({code: 0, msg: "查询失败", data: []})
  }
});

router.post('/', async (req, res, next) => {
  let account_id;
  if(!req.session.account) {
    account_id = req.query.account_id
  } else {
    account_id = req.session.account._id;
  }
  let { content, is_timing, timing_time, tagId, code } = req.body;
  let result = await TextMaterialModel.create({ content, is_timing, timing_time, tagId, code, account_id });
  if(result) {
    res.send({code: 1, msg: "创建成功", data: result})
  } else {
    res.send({code: 0, msg: "创建失败，请检查输入是否有误"})
  }
});

router.put('/', async (req, res, next) => {
  let { _id, content, is_timing, timing_time, tagId } = req.body;
  let result = await TextMaterialModel.findByIdAndUpdate(_id, { content, is_timing, timing_time, tagId }, {new: true});
  if(result) {
    res.send({code: 1, msg: "修改成功", data: result})
  } else {
    res.send({code: 0, msg: "修改失败，请检查输入是否有误"})
  }
});

router.delete('/', async (req, res, next) => {
  const { _id } = req.query;
  const result = await TextMaterialModel.findByIdAndRemove(_id);
  if(result) {
    res.send({code: 1, msg: "删除成功"})
  } else {
    res.send({code: 0, msg: "删除失败，没有找到该条数据"})
  }
});

router.post('/preview', async (req, res, next) => {
  let { code, content, openid } = req.body;
  let client = await wechat_util.getClient(code);
  client.previewText(openid, content, function (err, result) {
    if(err) {
      console.log(err)
    }
    if(result.errcode === 0) {
      res.send({code: 1, msg: "已发送预览消息，请在对应手机查看"})
    } else {
      res.send({code: 0, msg: "预览消息发送失败，请检查openid是否有误，或重新关注公众号获取", errcode: result.errcode, errmsg: result.errmsg})
    }
  })
});

router.post('/send', async (req, res, next) => {
  let { code, content, tagId, _id } = req.body;
  let client = await wechat_util.getClient(code);
  client.massSendText(content, tagId, async function (err, result) {
    if(err) {
      console.log(err)
    }
    console.log('------发送文本消息--------')
    console.log(result)
    if(result.errcode === 0) {
      let data = await TextMaterialModel.findByIdAndUpdate(_id, {msg_id: result.msg_id, isSend: 1}, {new: true});
      res.send({code: 1, msg: "发送成功"})
    } else {
      res.send({code: 0, msg: "消息发送失败", errcode: result.errcode, errmsg: result.errmsg})
    }
  })
});


module.exports = router;
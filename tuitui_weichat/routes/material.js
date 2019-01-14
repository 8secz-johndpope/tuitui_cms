var express = require('express');
var router = express.Router();
var UserTagModel = require('../model/UserTag');
var MaterialModel = require('../model/Material');
var getMaterials = require('../script/get_material');
var sendTag = require('../script/send_tag_message');
var weichat_util = require('../util/get_weichat_client.js')

router.get('/', async (req, res, next) => {
  let docs = getMaterials.get_aterials(req.query.code)
  if (docs) {
    res.send({
      success: '同步成功',
      data: docs
    })
  }
})

router.get('/show', async (req, res, next) => {
  let docs = await MaterialModel.find({
    code: req.query.code,
    type: 'news'
  }).sort({
    'update_time': -1
  }).limit(10)
  res.send({
    success: '成功',
    data: docs
  })
})

router.get('/tag', async (req, res, next) => {
  let doc = await UserTagModel.find({
    code: req.query.code
  })
  res.send({
    data: doc
  })
})

router.get('/del_msg', async (req, res, next) => {
  var api = await weichat_util.getClient(req.query.code);
  api.deleteMass(req.query.msg_id, Number(req.query.article_idx), (err, result) => {
    console.log('result------------------------', result, 'result------------------------')
    console.log('err------------------------', err, 'err------------------------')
    res.send({success: '删除成功'})
  });
})

router.get('/clear', async (req, res, next) => {
  let docs = await MaterialModel.remove({code: req.query.code})
  if(docs) {
    res.send({success: '已删除全部素材，如有需要请重新同步素材'})
  }
})

router.get('/sendMsg', async (req, res, next) => {
  var id = req.query.id;
  var tagId = req.query.tagId;
  var mediaId = req.query.mediaId;
  let docs = await sendTag.get_message(id, tagId, mediaId);
  if(!docs){
    return res.send({
       error: '正在发送消息'
    })
  }
  let result = await MaterialModel.findByIdAndUpdate(id, {
    msg_id: docs.msg_id
  }, {new: true})
  res.send({
    success: '发送成功', data: result, docs: docs
  })
})

module.exports = router;
var express = require('express');
var router = express.Router();
var MsgHistoryModel = require('../model/MsgHistory');
var weichat_util = require('../util/get_weichat_client.js')
var ConfigModel = require('../model/Config');

router.get("/state", async (req, res, next) => {
  let client = await weichat_util.getClient(req.query.code)
  client.getMassMessageStatus(req.query.msg_id, function(err, result){
    if(err) {
      return
    } else {
      res.send({data: result})
    }
  })
});

router.get('/', async (req, res, next) => {
  let {page = 1} = req.query;
  let docs = await MsgHistoryModel.find({ code: req.query.code, type: 'news' }).skip((page - 1) * 10).limit(10).sort({ 'update_time': -1 });
  let total = await MsgHistoryModel.count({ code: req.query.code, type: 'news' })
  let messages = [], arr= [], results = [], item = {};
  for (let i = 0; i < docs.length; i ++) {
    arr = docs[i].content.news_item
    for (let j = 0; j < arr.length; j ++) {
      messages.push({title: arr[j].title})
    }
    item = {
      update_time: docs[i].update_time,
      media_id: docs[i].media_id,
      msg_id: docs[i].msg_id,
      content: {
        news_item: messages
      },
      _id: docs[i]._id,
      timing: docs[i].timing,
      isTiming: docs[i].isTiming,
      tagId: docs[i].tagId,
      code: docs[i].code
    }
    results.push(item)
    messages = []
  }
  res.send({
    success: '成功',
    data: results,
    total
  })
});

router.get('/del_msg', async (req, res, next) => {
  var api = await weichat_util.getClient(req.query.code);
  api.deleteMass(Number(req.query.msg_id), Number(req.query.article_idx), (err, result) => {
    console.log('result------------------------', result, 'result------------------------')
    console.log('err------------------------', err, 'err------------------------')
    res.send({success: '删除成功'})
  });
});

router.get('/delByDate', async (req, res, next) => {
  let date = req.query.date;
  let account_id;
  if(!req.session.account) {
    account_id = req.query.account_id
  } else {
    account_id = req.session.account._id;
  }
  let messages = await MsgHistoryModel.find({code: req.query.code, update_time: {$lte: date}, account_id});
  let code = messages[0].code;
  let api = await weichat_util.getClient(code);
  await messages.map(async item => {
    let result = await del_mass(api, item);
  });
  let data = await MsgHistoryModel.remove({code: req.query.code, update_time: {$lte: date}});
  res.send({success: '删除成功'})
});

router.get('/clear', async (req, res, next) => {
  let account_id;
  if(!req.session.account) {
    account_id = req.query.account_id
  } else {
    account_id = req.session.account._id;
  }
  let docs = await MsgHistoryModel.remove({code: req.query.code, account_id})
  if(docs) {
    res.send({success: '已删除全部历史记录'})
  }
});

async function delMass (code, item) {
  let client = await weichat_util.getClient(code)
 let result = await del_mass(client, item);
  if(result.errcode == 45009 && Object(item).length > 0) {
    await test(code, item)
  }
}

async function test(code, item) {
  let client = await weichat_util.getClient(code)
  let conf = await ConfigModel.findOne({code: code})
  let appid = conf.appid;
  let data = await clear_quota(client, appid);
  if(data.errcode != 48006 && Object(item).length > 0) {
    await delMass(code, item)
  }
}

function clear_quota (client, appid) {
  return new Promise((resovle, reject) => {
    client.clearQuota(appid, function (err, data) {
      if(err) {
        reject(err)
      }
      resovle(data)
    })
  })
}

function del_mass (client, item) {
  return new Promise((resovle, reject) => {
    client.deleteMass(item.msg_id, 0, (err, result) => {
      if(err) {
        reject(err)
      }
      console.log(result)
      resovle(result)
    });
  })
}

module.exports = router;
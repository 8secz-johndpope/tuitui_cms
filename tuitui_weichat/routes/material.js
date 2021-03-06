var express = require('express');
var router = express.Router();
var UserTagModel = require('../model/UserTag');
var MaterialModel = require('../model/Material');
var MsgHistoryModel = require('../model/MsgHistory');
var getMaterials = require('../script/get_material');
var sendTag = require('../script/send_tag_message');
var uploadNews = require("../script/uploadMaterial");
const weichat_util = require('../util/get_weichat_client.js');
var async = require("async");

router.get('/', async (req, res, next) => {
  let docs = getMaterials.get_aterials(req.query.code);
  if (docs) {
    res.send({
      success: '同步成功',
      data: docs
    })
  }
});

router.get('/show', async (req, res, next) => {
  let docs = await MaterialModel.find({
    code: req.query.code,
    type: 'news',
  }).sort({
    'update_time': -1
  }).limit(20);
  res.send({
    success: '成功',
    data: docs
  })
});

router.get('/send_timing', async (req, res, next) => {
  let id = req.query.id,
      message = {
        tagId: Number(req.query.tagId),
        isTiming: req.query.isTiming,
        timing: Number(req.query.timing)
      };
  let result = await MaterialModel.findByIdAndUpdate(id, message, {new: true})
  if(result) {
    res.send({success: "设置定时成功", data: result})
  } else {
    res.send({err: "设置失败，请重新尝试"})
  }
});

router.post('/copy', async (req, res, next) => {
  let id = req.body.id;
  let result = await MaterialModel.findById(id)
  if(result) {
    result = result.toObject();
    delete result._id;
    let doc = await MaterialModel.create(result)
    res.send({success: "复制成功", data: doc})
  } else {
    res.send({err: "复制失败"})
  }
});

router.get('/del', async (req, res, next) => {
  let id = req.query.id;
  let result = await MaterialModel.findByIdAndRemove(id)
  if(result) {
    res.send({success: "删除成功", data: result})
  } else {
    res.send({err: "删除失败"})
  }
});

router.get('/tag', async (req, res, next) => {
  let doc = await UserTagModel.find({
    code: req.query.code
  });
  res.send({
    data: doc
  })
});

router.get('/clear', async (req, res, next) => {
  let docs = await MaterialModel.remove({code: req.query.code})
  if(docs) {
    res.send({success: '已删除全部素材，如有需要请重新同步素材'})
  }
});

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
  await MaterialModel.findById(id, async (err, result) => {
    if(err) {
      res.send({error: "发送失败"})
    } else {
      result = result.toObject();
      delete result._id;
      result.tagId = tagId;
      result.msg_id = docs.msg_id;
      result.update_time = Date.now() / 1000;
      let message = await MsgHistoryModel.create(result);
      res.send({
        success: '发送成功', result: result, docs: docs, message: message
      })
    }
  })
  
});

router.post('/syncMaterial', async (req, res, next) => {
  let { docs = [], codes = [] } = req.body;
  if(docs.length > 0) {
    let result = await mapMaterial(codes, docs);
    result && res.send({code: 1, msg: "素材同步成功"})
  } else {
    res.send({code: -1, msg: "没有查询到素材"})
  }
});

router.put('/contentSourceUrl', async (req, res, next) => {
  let { media_id, index, articles, code, id } = req.body;
  let updateInfo = { media_id, index, articles };
  let result = await updateContentSourceUrl(updateInfo, code);
  if(result) {
    let data = await MaterialModel.findById(id);
    data.content.news_item[index] = articles;
    let docs = await MaterialModel.findByIdAndUpdate(id, data);
    if(docs) {
      res.send({code: 1, msg: "原文链接修改成功"})
    }
  } else {
    res.send({code: -1, msg: "原文链接修改失败，请重试"})
  }
});

function mapMaterial(codes, docs) {
  return new Promise((resolve, reject) => {
    async.map(docs, async item => await mapCodes(codes, item.content.news_item), (err, res) => {
      resolve(res)
    })
  })
}

function mapCodes(codes, articles) {
  return new Promise((resolve, reject) => {
    async.map(codes, async code => {
      let news = await uploadNews.uploadNews(code, articles);
      if(news.length > 0) {
        let result = await uploadMaterial(code, news);
        if(result.media_id) {
          let data = {
            type: "news",
            code,
            content: {
              news_item: news
            },
            media_id: result.media_id
          };
          return await MaterialModel.create(data);
        }
      }
    }, (err, res) => {
      console.log(err)
      resolve(res)
    })
  })
}


async function uploadMaterial(code, news) {
  var api = await weichat_util.getClient(code);
  return new Promise((resolve, reject) => {
    api.uploadNewsMaterial({"articles": news}, (err, result) => {
      if(err) {
        console.error("err", err);
        reject(err);
      }
      console.log(result, "22222222222222222222----------------------")
      resolve(result)
    })
  })
}

async function updateContentSourceUrl(updateInfo, code) {
  var api = await weichat_util.getClient(code);
  return new Promise((resolve, reject) => {
    api.updateNewsMaterial({...updateInfo}, (err, result) => {
      if(err) {
        console.error("err", err);
        reject(err);
      }
      console.log(result, "-------------------------------修改原文链接---------------------")
      resolve(result)
    })
  })
}

module.exports = router;
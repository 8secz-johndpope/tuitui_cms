var express = require('express');
var router = express.Router();
var UserTagModel = require('../model/UserTag');
var MaterialModel = require('../model/Material');
var MsgHistoryModel = require('../model/MsgHistory');
var getMaterials = require('../script/get_material');
var sendTag = require('../script/send_tag_message');
var uploadNews = require("../script/uploadMaterial");
const weichat_util = require('../util/get_weichat_client.js')
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
  })
  let messages = [], arr= [], results = [], item = {};
  // for (let i = 0; i < docs.length; i ++) {
  //   arr = docs[i].content.news_item
  //   for (let j = 0; j < arr.length; j ++) {
  //     messages.push({title: arr[j].title})
  //   }
  //   item = {
  //     update_time: docs[i].update_time,
  //     media_id: docs[i].media_id,
  //     content: {
  //       news_item: messages
  //     },
  //     _id: docs[i]._id,
  //     timing: docs[i].timing,
  //     isTiming: docs[i].isTiming,
  //     tagId: docs[i].tagId,
  //     code: docs[i].code
  //   }
  //   results.push(item)
  //   messages = []
  // }
  res.send({
    success: '成功',
    data: docs
  })
})

router.get('/send_timing', async (req, res, next) => {
  let id = req.query.id,
      message = {
        tagId: Number(req.query.tagId),
        isTiming: req.query.isTiming,
        timing: Number(req.query.timing)
      }
  let result = await MaterialModel.findByIdAndUpdate(id, message, {new: true})
  if(result) {
    res.send({success: "设置定时成功", data: result})
  } else {
    res.send({err: "设置失败，请重新尝试"})
  }
})

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
})

router.get('/del', async (req, res, next) => {
  let id = req.query.id;
  let result = await MaterialModel.findByIdAndRemove(id)
  if(result) {
    res.send({success: "删除成功", data: result})
  } else {
    res.send({err: "删除失败"})
  }
})

router.get('/tag', async (req, res, next) => {
  let doc = await UserTagModel.find({
    code: req.query.code
  })
  res.send({
    data: doc
  })
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
  await MaterialModel.findById(id, async (err, result) => {
    if(err) {
      res.send({error: "发送失败"})
    } else {
      result = result.toObject()
      delete result._id;
      result.tagId = tagId
      result.msg_id = docs.msg_id
      result.update_time = Date.now() / 1000
      console.log(result)
      let message = await MsgHistoryModel.create(result)
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

function mapMaterial(codes, docs) {
  return new Promise((resolve, reject) => {
    async.map(docs, async item => await mapCodes(codes, item.content.news_item), (err, res) => {
      resolve(res)
      console.log("====================mapMaterial-res======================", res, "====================mapMaterial-res=======================")
    })
    // docs.map(async item => {await mapCodes(codes, item.content.news_item)})
  })
}

function mapCodes(codes, articles) {
  return new Promise((resolve, reject) => {
    async.map(codes, async code => {
      let news = await uploadNews.uploadNews(code, articles);
      if(news.length > 0) {
        console.log(news, "news")
        let result = await uploadMaterial(code, news);
        console.log("result", result, "------------------result==========")
        if(result.media_id) {
          let data = {
            type: "news",
            code,
            content: {
              news_item: news
            },
            media_id: result.media_id
          };
          let docs = await MaterialModel.create(data);
          console.log("docs", docs, "11111111111__________")
          return docs
        }
      }
    }, (err, res) => {
      console.log(err)
      console.log("====================res======================", res, "====================res=======================")
      resolve(res)
    })
    // codes.map(async code => {
    //   let news = await uploadNews.uploadNews(code, articles);
    //   if(news.length > 0) {
    //     let result = await uploadMaterial(code, news);
    //     if(result.media_id) {
    //       let data = {
    //         type: "news",
    //         code,
    //         content: {
    //           news_item: news
    //         },
    //         media_id: result.media_id,
    //         update_time: Date.now() / 1000
    //       };
    //       resolve(await MaterialModel.create(data));
    //     }
    //   }
    // })
  })
}


async function uploadMaterial(code, news) {
  var api = await weichat_util.getClient(code);
  return new Promise((resolve, reject) => {
    api.uploadNewsMaterial({"articles": news}, (err, result) => {
      if(err) {
        console.error("err", err)
        reject(err);
      }
      console.log(result, "22222222222222222222----------------------")
      resolve(result)
    })
  })
}

module.exports = router;
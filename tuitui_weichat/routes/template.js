const express = require('express');
const router = express.Router();
const templateMsgModel = require('../model/templateMsg');
const ConfigModel = require('../model/Config');
const wechat_util = require('../util/get_weichat_client.js');
const mem = require('../util/mem');

/**
 消息队列
 */
const q = 'template_tasks';
const amqplib = require('amqplib');
let ch;
getChannel();

async function getChannel() {
  console.log('----- getChannel ----')
  try {
    let conn = await amqplib.connect('amqp://localhost')
    ch = await conn.createChannel();
    //sendMQ('openid,code')
  } catch (e) {
    console.log(e)
  }
}

async function sendMQ(msg) {
  await ch.assertQueue(q);
  ch.sendToQueue(q, Buffer.from(msg));
}

router.get('/list', async (req, res, next) => {
  let code = req.query.code;
  let api = await wechat_util.getClient(code);
  let arr = []
  api.getAllPrivateTemplate(async function (err, lists) {
    for (let list of lists.template_list) {
      if (list.title != '订阅模板消息') {
        let obj = {template_id: list.template_id, title: list.title, data: {}}
        let body = ''
        let reg = /\n\W.*\}/g
        if (reg.test(list.content)) {
          body = list.content.match(/\n\W.*\}/g).toString()
          body = body.replace(/\n/g, '').replace(/{/g, '').replace(/}/g, '').replace(/：/g, '：_').replace(/.DATA/g, '')
        }
        for (let i of body.split(',')) {
          if (i.split('_')[1]) {
            obj['data'][i.split('_')[1]] = {
              pre: i.split('_')[0],
              value: '',
              color: ''
            }
          } else {
            if (list.content.indexOf('first') != -1) {
              obj['data']['first'] = {
                pre: '',
                value: '',
                color: ''
              }
            }
            if (list.content.indexOf('remark') != -1) {
              obj['data']['remark'] = {
                pre: '',
                value: '',
                color: ''
              }
            }
            if (list.content.indexOf('content') != -1) {
              obj['data']['content'] = {
                pre: '',
                value: '',
                color: ''
              }
            }
          }
        }
        arr.push(obj)
      }
    }
    res.send(arr)
  })
})

router.get('/', async (req, res, next) => {
  let account_id, {page = 1} = req.query;
  if (!req.session.account) {
    account_id = req.query.account_id
  } else {
    account_id = req.session.account._id;
  }
  let doc = await templateMsgModel.find({account_id}).skip((page - 1) * 10).limit(10).sort({_id: -1});
  let total = await templateMsgModel.count({account_id});
  res.send({data: doc, total});
})

router.get('/search', async (req, res, next) => {
  let account_id, {page = 1, confName} = req.query;
  if (!req.session.account) {
    account_id = req.session.account_id
  } else {
    account_id = req.session.account._id;
  }
  try {
    let reg = new RegExp(confName);
    let doc = await templateMsgModel.find({confName: {$regex: reg}, account_id}).skip((page - 1) * 10).limit(10).sort({_id: -1});
    let total = await templateMsgModel.count({confName: {$regex: reg}, account_id});
    res.send({msg: "查询成功", data: doc, total})
  } catch (e) {
    res.send({msg: "不能以特殊字符开头", data: []})
  }
})


router.post('/create', async (req, res, next) => {
  let account_id;
  if (!req.session.account) {
    account_id = req.body.account_id
  } else {
    account_id = req.session.account._id;
  }
  let code = req.body.code
  let conf = await ConfigModel.findOne({code: code})
  let confName = conf.nick_name
  let data = {
    code: code,
    confName: confName,
    name: req.body.name,
    templateId: req.body.templateId,
    templateName: req.body.templateName,
    url: req.body.url,
    content: req.body.content,
    sex: req.body.sex,
    is_timing: req.body.is_timing,
    timing_time: req.body.timing_time,
    account_id
  }
  if(account_id) {
    let doc = await templateMsgModel.create(data)
    if (doc) {
      res.send({success: '创建成功', data: doc})
    } else {
      res.send({err: '创建失败'})
    }
  } else {
    res.send({err: '创建失败， 账户信息失效'})
  }
  
})

router.post('/update', async (req, res, next) => {
  let id = req.body.id
  let code = req.body.code
  let conf = await ConfigModel.findOne({code: code})
  let confName = conf.nick_name
  let data = {
    code: code,
    confName: confName,
    name: req.body.name,
    templateId: req.body.templateId,
    templateName: req.body.templateName,
    url: req.body.url,
    content: req.body.content,
    sex: req.body.sex,
    is_timing: req.body.is_timing,
    timing_time: req.body.timing_time
  }
  let doc = await templateMsgModel.findByIdAndUpdate(id, data, {new: true})
  if (doc) {
    res.send({success: '修改成功', data: doc})
  } else {
    res.send({err: '修改失败'})
  }
})

router.get('/del', async (req, res, next) => {
  let id = req.query.id
  var doc = await templateMsgModel.findByIdAndRemove(id)
  if (doc) {
    res.send({success: '删除成功', data: doc})
  } else {
    res.send({err: '删除失败'})
  }
})

router.get('/send', async (req, res, next) => {
  let id = req.query.id
  sendMQ(id)
  res.send('已发送')
})

router.post('/preview', async (req, res, next) => {
  let {code, templateId, url, content, openid} = req.body;
  let client = await wechat_util.getClient(code);
  let result = await preview_template(openid, code, client, templateId, url, content);
  if (result) {
    res.send({code: 1, msg: "已发送预览消息"})
  }
});

async function preview_template(openid, code, client, templateId, url, content) {
  return new Promise((resolve, reject) => {
    client.sendTemplate(openid, templateId, url, content, function (err, result) {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

module.exports = router;
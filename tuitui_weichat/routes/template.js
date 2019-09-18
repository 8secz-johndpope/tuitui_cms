const express = require('express');
const router = express.Router();
const templateRecordModel = require('../model/templateRecord');
const templateMsgModel = require('../model/templateMsg');
const ConfigModel = require('../model/Config');
const wechat_util = require('../util/get_weichat_client.js');
const mem = require('../util/mem');

router.get('/list', async(req, res, next) => {
    let code = req.query.code;
    let api = await wechat_util.getClient(code);
    let arr = []
    api.getAllPrivateTemplate(async function (err, lists) {
        console.log(lists.template_list,'------------------------')
        for (let list of lists.template_list) {
            let obj = {template_id: list.template_id, title: list.title}
            let body = ''
            let reg = /\n\W.*\}/g
            if (reg.test(list.content)) {
                body = list.content.match(/\n\W.*\}/g).toString()
                body = body.replace(/\n/g, '').replace(/{/g, '').replace(/}/g, '').replace(/：/g, '：_').replace(/.DATA/g, '')
            }
            await mem.set(code + '_' + list.template_id, body, 24 * 60 * 60)
            for (let i of body.split(',')) {
                if (i.split('_')[1]) {
                    obj[i.split('_')[1]] = {
                        pre: i.split('_')[0],
                        value: '',
                        color: ''
                    }
                } else {
                    if (list.content.indexOf('first') != -1) {
                        obj['first'] = {
                            pre: '',
                            value: '',
                            color: ''
                        }
                    }
                    if (list.content.indexOf('remark') != -1) {
                        obj['remark'] = {
                            pre: '',
                            value: '',
                            color: ''
                        }
                    }
                    if (list.content.indexOf('content') != -1) {
                        obj['content'] = {
                            pre: '',
                            value: '',
                            color: ''
                        }
                    }
                }
            }
            arr.push(obj)
        }
        res.send(arr)
    })
})

router.get('/', async(req, res, next) => {
    let account_id = req.session.account._id;
    let doc = await templateMsgModel.find({account_id})
    res.send({data: doc})
})

router.post('/create', async(req, res, next) => {
    let account_id = req.session.account._id;
    let code = req.body.code
    let conf = await ConfigModel.findOne({code:code})
    let confName = conf.nick_name
    let data = {
        code: code,
        confName: confName,
        name: req.body.name,
        templateId: req.body.templateId,
        templateName: req.body.templateName,
        url: req.body.url,
        content: req.body.content,
        account_id
    }
    let doc = await templateMsgModel.create(data)
    if (doc) {
        res.send({success: '创建成功', data: doc})
    } else {
        res.send({err: '创建失败'})
    }
})

router.post('/update', async(req, res, next) => {
    let id = req.body.id
    let code = req.body.code
    let conf = await ConfigModel.findOne({code:code})
    let confName = conf.nick_name
    let data = {
        code: code,
        confName: confName,
        name: req.body.name,
        templateId: req.body.templateId,
        templateName: req.body.templateName,
        url: req.body.url,
        content: req.body.content,
    }
    let doc = await templateMsgModel.findByIdAndUpdate(id, data, {new: true})
    if (doc) {
        res.send({success: '修改成功', data: doc})
    } else {
        res.send({err: '修改失败'})
    }
})

router.get('/del', async(req, res, next) => {
    let id = req.query.id
    var doc = await templateMsgModel.findByIdAndRemove(id)
    if (doc) {
        res.send({success: '删除成功', data: doc})
    } else {
        res.send({err: '删除失败'})
    }
})

router.post('/send', async(req, res, next) => {
    let account_id = req.session.account._id;
    let code = req.body.code;
    let templateId = req.body.templateId
    let url = req.body.url
    let content = req.body.content
    let client = await wechat_util.getClient(code);
    send_template('', code, client, templateId, url, content)
    let body = await mem.get(code + '_' + templateId)
    body = body.split(',')
    let obj = {"开始": content.first.value || ""}
    for (let i = 0; i < body.length - 1; i++) {
        let key = body[i].split('_')[0]
        let value = body[i].split('_')[1]
        obj[key] = content[value].value
    }
    obj['结束'] = content.remark.value || ""
    await templateRecordModel.create({
        code: code,
        templateId: templateId,
        url: url,
        content: obj,
        account_id
    })
    res.send('已发送')
})

async function send_template(openid, code, client, templateId, url, data) {
    client.getFollowers(openid, async function (err, result) {
        if (err) {
            console.log(err, '------------------send template err')
        } else {
            if (result.errcode) {
                console.log(result.errcode, '------------------send template error')
            }
            if (result && result.data && result.data.openid) {
                for (let sendopenid of result.data.openid) {
                    client.sendTemplate(sendopenid, templateId, url, data, function (err, result) {
                    })
                }
                send_template(result.next_openid, code, client, templateId, url, data)
            } else {
                console.log(code + '-------------send template end')
                return
            }
        }
    })
}

module.exports = router;
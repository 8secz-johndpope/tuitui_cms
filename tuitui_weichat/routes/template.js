const express = require('express');
const router = express.Router();
const TemplateModel = require('../model/template');
const wechat_util = require('../util/get_weichat_client.js');
const mem = require('../util/mem');

router.get('/list', async(req, res, next) => {
    let code = req.query.code;
    let api = await wechat_util.getClient(code);
    let arr = []
    api.getAllPrivateTemplate(async function (err, lists) {
        for (let list of lists.template_list) {
            let obj = {}
            let body = ''
            let reg = /\n\W.*\}/g
            if (reg.test(list.content)) {
                body = list.content.match(/\n\W.*\}/g).toString()
                body = body.replace(/\n/g, '').replace(/{/g, '').replace(/}/g, '').replace(/：/g, '：_').replace(/.DATA/g, '')
            }
            await mem.set(code + '_' + list.template_id, body, 24 * 60 * 60)
            console.log(body.split(','),'--------------------------------')
            for (let i of body.split(',')) {
                obj[i.split('_')[1]] = {
                    pre: i.split('_')[0],
                    value: '',
                    color: ''
                }
            }
            arr.push(obj)
        }
        res.send(arr)
    })
})

router.post('/send', async(req, res, next) => {
    // let account_id = req.session.account._id;
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
    await TemplateModel.create({code: code, templateId: templateId, url: url, content: obj})
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
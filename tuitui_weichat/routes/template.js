const express = require('express');
const router = express.Router();
const TemplateModel = require('../model/template');
const wechat_util = require('../util/get_weichat_client.js');
const mem = require('../util/mem');

router.get('/list', async(req, res, next) => {
    let code = req.query.code;
    let api = await wechat_util.getClient(code);
    api.getAllPrivateTemplate(async function (lists) {
        console.log(lists, '-----------------------------list')
        for (let list of lists.template_list) {
            console.log(list.content, '-----------------------------content')
            await mem.set(code + '_' + list.template_id, list.content, 30)
        }
        res.send(lists)
    })
})

router.post('/send', async(req, res, next) => {
    let account_id = req.session.account._id;
    let code = req.body.code;
    let templateId = req.body.templateId
    let url = req.body.url
    let content = req.body.content
    let client = await wechat_util.getClient(code);
    send_template('', code, client, templateId, url, content)
    let tem = mem.get(code + '_' + templateId)
    let body = tem.match(/\W\n\W.*\W {/g).toString()
    body = body.replace(/\n/g,'').replace(/{/g,'').replace(/}/g,'').replace(/ /g,'')
    let obj = {}
    for(let i=0;i<content.length;i++){
        obj[body[i]] = content[i]
    }
    console.log(obj,'---------------------obj')
    await TemplateModel.create({account_id: account_id, code: code, templateId: templateId, content: obj})
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
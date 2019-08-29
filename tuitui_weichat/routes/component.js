const express = require('express');
const router = express.Router();
const xmlUtil = require("../util/xmlUtil");
const componentService = require('../util/component');
const UserconfModel = require("../model/Userconf")
const ConfigModel = require("../model/Config")
const http = require("../util/httpUtils");
const authorizer_info = require("../util/authorizer_info")
const ReplyModel = require('../model/Reply');
const MsgModel = require('../model/Msg');
const mem = require('../util/mem');
const wechat_util = require('../util/get_weichat_client')
const wxReplay = require('../util/wxReplay')

var xml_msg = async function (req, res, next) {
    if (req.method == 'POST' && req.is('text/xml')) {
        let promise = new Promise(function (resolve, reject) {
            let buf = ''
            req.setEncoding('utf8')
            req.on('data', (chunk) => {
                buf += chunk
            })
            req.on('end', () => {
                resolve(buf)
            })
        })

        await promise.then((result) => {
            req.body.xml = result
        })
            .catch((e) => {
                e.status = 400
            })
        next()
    } else {
        await next()
    }
}

router.get('/', async function (req, res, next) {
    await res.render('test');
})

router.post('/auth', xml_msg, async(req, res, next) => {
    let requestString = req.body;
    let requestMessage = xmlUtil.formatMessage(requestString.xml);
    let query = req.query;
    let result = await componentService.handleComponentMessage(requestMessage, query);
    res.send('success')
})

router.get('/componentAuthorize', async(req, res, next) => {
    let url = await componentService.getAuthorizeUrl();
    res.send(url);
    // res.redirect(url);
})

//授权后跳转到的页面
router.get('/queryAuthorizeInfo', async(req, res, next) => {
    let account_id = req.session.account._id
    let query = req.query;
    let auth_code = query.auth_code;
    let expires_in = query.expires_in;
    let authorization_info = await componentService.queryAuthorizeInfo(account_id, auth_code);
    refreshAccessToken({appid: authorization_info.authorizer_appid})
    await authorizer_info.get_authorizer_info({appid: authorization_info.authorizer_appid})
    res.redirect('/admin')
})

var refreshAccessToken = async function (con = {}) {
    var auths = await ConfigModel.find(con)
    var access_token = await mem.get("cms_component_access_token");
    var https_options = {
        hostname: 'api.weixin.qq.com',
        path: '/cgi-bin/component/api_authorizer_token?component_access_token=%ACCESS_TOKEN%',
        method: 'post'
    };
    https_options.path = https_options.path.replace('%ACCESS_TOKEN%', access_token);
    for (var i = 0; i < auths.length; i++) {
        try {
            var auth = auths[i];
            var post_data = {
                component_appid: "wx4b715a7b61bfe0a4",
                authorizer_appid: auth.appid,
                authorizer_refresh_token: auth.refresh_token
            }
            var result = await http.doHttps_withdata(https_options, post_data);
            var data = JSON.parse(result);
            if (data && data.authorizer_access_token) {
                auth.authorizer_access_token = data.authorizer_access_token
                auth.expires_in = data.expires_in
                auth.refresh_token = data.authorizer_refresh_token
                auth.refresh_time = Date.now()
                auth.save();
            }
            await redis_client.publish('access_token', auth.appid);
            await mem.set('access_token_' + auth.appid, auth.authorizer_access_token + '!@#' + auth.expires_in, 2 * 60 * 60)
        } catch (e) {
            console.log('-------refreshAccessToken err-------')
            console.log(e)
        }
    }
}

router.get('/appinfo/:appid', async(req, res, next) => {
    var auth = await ConfigModel.findOne({appid: req.params.appid})
    res.send(auth)
})

router.get('/unbind', async(req, res, next) => {
    let data = {
        "appid": req.query.appid,
        "open_appid": "wx4b715a7b61bfe0a4"
    }
    var token = await mem.get("access_token_" + data.appid);
    let access_token = token.split('!@#')[0]
    console.log('access_token----------', access_token)
    var https_options = {
        hostname: 'api.weixin.qq.com',
        path: '/cgi-bin/open/unbind?access_token=%ACCESS_TOKEN%',
        method: 'post'
    };
    https_options.path = https_options.path.replace('%ACCESS_TOKEN%', access_token);
    var unbind_result = await http.doHttps_withdata(https_options, data);
    console.log(https_options, '------------------------options')
    console.log('unbind result: ' + unbind_result);
    res.send("success")
})

router.post('/message/:appid/callback', xml_msg, async(req, res, next) => {
    //用户回复
    let appid = req.params.appid;
    let code = 0
    if (appid) {
        let code = await mem.get("configure_appid_" + appid)
        if (!code) {
            let conf = await ConfigModel.findOne({appid: appid})
            if (!conf) {
                return res.send('')
            }
            code = conf.code
            await mem.set("configure_appid_" + appid, code, 30 * 24 * 3600)
        }
    }

    if (!code) {
        return res.send('')
    }

    let requestString = req.body;
    let requestMessage = xmlUtil.formatMessage(requestString.xml);
    let query = req.query;
    let message = await componentService.handleMessage(requestMessage, query);
    // let info = await userInfo(code, message)
    // console.log(info, '------------------info')


    let user = {
        openid: message.FromUserName,
        code: code,
        action_time: Date.now(),
        // nickname: info.nickname || "",
        // headimgurl: info.headimgurl || "",
        // sex: Number(info.sex) || 0
    }
    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            user.subscribe_time = Date.now();
            user.subscribe_flag = true;
            reply(code, 2, 'subscribe', message.FromUserName, 0)
        } else if (message.Event === 'unsubscribe') {
            user.unsubscribe_time = Date.now();
            user.subscribe_flag = false;
        } else if (message.Event.toLowerCase() == 'click') {
            reply(code, 1, message.EventKey, message.FromUserName, 0)
        }
    } else if (message.MsgType === 'text') {
        if (message.Content == 'TESTCOMPONENT_MSG_TYPE_TEXT') {
            res.send(wxReplay.get_reply(req, 'TESTCOMPONENT_MSG_TYPE_TEXT_callback', message))
        } else {
            res.send(wxReplay.get_reply(req, '测试回复文字', message))
        }
        //reply(code, 0, message.Content, message.FromUserName, 0)
    }

    UserconfModel.findOneAndUpdate(
        {
            "openid": message.FromUserName,
            "code": code
        },
        user,
        {upsert: true}, function (err) {
            console.log(err)
        })
})

async function userInfo(code, message) {
    let api = await wechat_util.getClient(code);
    return new Promise((resolve, reject) => {
        api.getUser(message.FromUserName, function (err, info) {
            resolve(info);
        })
    })
}

async function reply(code, type, param, openid, sex) {
    if (sex == 0) {
        let info = await ReplyModel.findOne({code: code})
        if (info && info.attribute) {
            sex = info.attribute
        }
    }
    var reply = await mem.get("cms_reply_" + code + "_" + param);
    if (!reply) {
        if (type == 0) {
            reply = await ReplyModel.findOne({
                $or: [
                    {code: code, type: type, text: param},
                    {code: code, type: 4}
                ]
            }).sort({type: 1})
        } else if (type == 1) {
            reply = await ReplyModel.findOne({code: code, type: type, key: param})
        } else if (type == 2) {
            reply = await ReplyModel.findOne({
                $or: [
                    {sex: sex},
                    {sex: 3}
                ], code: code, type: type
            })
        } else if (type == 3) {
            reply = await ReplyModel.findOne({code: code, type: type})
        }
        if (reply && reply.replyType == 0) {
            reply = JSON.stringify({type: 0, msg: reply.msgId})
        } else if (reply && reply.replyType == 1) {
            reply = JSON.stringify({type: 1, msg: reply.media})
        } else {
            return
        }
        await mem.set("cms_reply_" + code + "_" + param, reply, 30)
    }

    reply = JSON.parse(reply)
    if (reply.type == 1) {
        res.send(reply.msg)
    } else {
        var content = await mem.get("cms_msg_" + reply.msg);
        if (!content) {
            content = await MsgModel.findOne({msgId: reply.msg})
            if (content) {
                await mem.set("cms_msg_" + reply.msg, content, 30);
                replyMsg(content, code, openid)
            }
        } else {
            replyMsg(content, code, openid)
        }
    }
}

async function replyMsg(content, code, openid) {
    var client = await wechat_util.getClient(code);
    var data = {}
    if (content.type == 0) {
        client.sendText(openid, content.description, function (err, data) {
        })
    } else if (content.type == 1) {
        client.sendNews(openid, content.contents, function (err, data) {
        })
    }
    return
}


module.exports = router
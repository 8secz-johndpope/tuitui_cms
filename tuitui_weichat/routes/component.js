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
const asyncRedis = require("async-redis");
const redis_client = asyncRedis.createClient();

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

var refreshComponentAuthCode = async function () {
    var access_token = await mem.get("cms_component_access_token");
    if (!access_token) {
        return;
    }
    var componentAuthCodePostData = {
        component_appid: "wx4b715a7b61bfe0a4"
    };
    var https_options = {
        hostname: 'api.weixin.qq.com',
        path: '/cgi-bin/component/api_create_preauthcode?component_access_token=%ACCESS_TOKEN%',
        method: 'post'
    };

    https_options.path = https_options.path.replace('%ACCESS_TOKEN%', access_token);
    var component_preauthcode_result = await http.doHttps_withdata(https_options, componentAuthCodePostData);
    var preauthcode_json = JSON.parse(component_preauthcode_result);
    console.log('Refresh pre_auth_code result: ' + component_preauthcode_result);
    if (preauthcode_json.errcode != undefined) {
        return;
    }
    auth_code = preauthcode_json.pre_auth_code;
    await mem.set("cms_component_auth_code", auth_code, 30 * 60)
}

router.get('/componentAuthorize', async(req, res, next) => {
    await refreshComponentAuthCode()
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
    let code
    if (appid) {
        code = await mem.get("configure_appid_" + appid)
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
    let user = {}
    let userSex = await UserconfModel.findOne({openid: message.FromUserName, code: code})
    if(userSex && userSex.sex && userSex.sex != "0"){
        user = {
            action_time: Date.now()
        }
    }else {
        let info = await userInfo(code, message.FromUserName)
        if (info.sex) {
            user = {
                nickname: info.nickname,
                headimgurl: info.headimgurl,
                sex: info.sex.toString(),
                province: info.province,
                city: info.city,
                country: info.country,
                action_time: Date.now()
            }
        } else {
            user = {
                sex: "0",
                action_time: Date.now()
            }
        }
    }
    console.log('--------component message------------')
    console.log(message)
    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            user.subscribe_time = Date.now();
            user.subscribe_flag = true;
            user.action_type = 1;
            reply(req, res, message, code, 2, 'subscribe', message.FromUserName, 0)
        } else if (message.Event === 'unsubscribe') {
            user.unsubscribe_time = Date.now();
            user.subscribe_flag = false;
        } else if (message.Event.toLowerCase() == 'click') {
            user.action_type = 2;
            reply(req, res, message, code, 1, message.EventKey, message.FromUserName, 0)
        }
    } else if (message.MsgType === 'text') {
        if (message.Content == 'TESTCOMPONENT_MSG_TYPE_TEXT') {
            res.send(wxReplay.get_reply(req, 'TESTCOMPONENT_MSG_TYPE_TEXT_callback', message))
        } else {
            user.action_type = 3;
            reply(req, res, message, code, 0, message.Content, message.FromUserName, 0)
        }
    }

    await UserconfModel.findOneAndUpdate({openid: message.FromUserName, code: code}, user, {upsert: true})
})

async function userInfo(code, openid) {
    // console.log(code,'-------------------------code')
    let api = await wechat_util.getClient(code);
    return new Promise((resolve, reject) => {
        api.getUser(openid, function (err, info) {
            resolve(info);
        })
    })
}

async function reply(req, res, message, code, type, param, openid, sex) {
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
            return res.send('')
        }
        await mem.set("cms_reply_" + code + "_" + param, reply, 30)
    }

    reply = JSON.parse(reply)
    if (reply.type == 1) {
        res.send(reply.msg)
    } else {
        var content = await mem.get("cms_msg_" + reply.msg);
        if (!content) {
            let content = await MsgModel.findOne({msgId: reply.msg})
            if (content) {
                await mem.set("cms_msg_" + reply.msg, content, 30);
                replyMsg(req, res, message, content, code, openid)
            }
        } else {
            replyMsg(req, res, message, content, code, openid)
        }
    }
}

async function replyMsg(req, res, message, content, code, openid) {
    if (content.type == 0) {
        res.send(wxReplay.get_reply(req, content.contents[0].description, message))
    } else if (content.type == 1) {
        res.send(wxReplay.get_reply(req, content.contents, message))
    }
    return
}


module.exports = router
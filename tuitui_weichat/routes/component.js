const express = require('express');
const router = express.Router();
const xmlUtil = require("../util/xmlUtil");
const componentService = require('../util/component');
const UserconfModel = require("../model/Userconf")
const ConfigModel = require("../model/Config")
const http = require("../util/httpUtils");
const authorizer_info = require("../util/authorizer_info")
const ReplyModel = require('../model/Reply');
const MenuModel = require('../model/Menu')
// const MsgModel = require('../model/Msg');
const ActionModel = require('../model/Action')
const mem = require('../util/mem');
const wechat_util = require('../util/get_weichat_client')
const wxReplay = require('../util/wxReplay')
const asyncRedis = require("async-redis");
const redis_client = asyncRedis.createClient();

var session = require('express-session');
var RedisStrore = require('connect-redis')(session);
var redis = require("redis");
var redis_s_client = redis.createClient();
//var MemcachedStore = require('connect-memcached')(session);

function genuuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}
let sessiond = session({
    genid: function (req) {
        return genuuid() // use UUIDs for session IDs
    },
    secret: 'mingxingshuo',
    name: 'xiaoshuo',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 1000 * 60 * 60 * 24},  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    rolling: false,
    saveUninitialized: false,
    store: new RedisStrore({host: 'localhost', port: 6379, client: redis_s_client, ttl: 260}),
    /*store: new MemcachedStore({
     hosts: ["127.0.0.1:11211"],
     secret: "mingxingshuo" // Optionally use transparent encryption for memcache session data
     })*/
});

/**
 消息队列
 */
const q = 'user_tasks';
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
    await ch.assertQueue('user_tasks_cb',{
        autoDelete: true,
        durable: false
    });
    ch.sendToQueue('user_tasks_cb', Buffer.from(msg));
}

async function sendSaveMQ(msg) {
    await ch.assertQueue('save_user_tasks');
    ch.sendToQueue('save_user_tasks', Buffer.from(msg));
}

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
router.get('/queryAuthorizeInfo', [sessiond], async(req, res, next) => {
    let account_id;
    if (!req.session.account) {
        account_id = req.query.account_id
    } else {
        account_id = req.session.account._id;
    }
    console.log('-------queryAuthorizeInfo  account_id---------')
    console.log(account_id);
    if(account_id) {
        let query = req.query;
        let auth_code = query.auth_code;
        let expires_in = query.expires_in;
        let authorization_info = await componentService.queryAuthorizeInfo(account_id, auth_code);
        if (!authorization_info.errcode) {
            await authorizer_info.get_authorizer_info({appid: authorization_info.authorizer_appid})
            res.redirect('/admin')
            refreshAccessToken({appid: authorization_info.authorizer_appid})
        } else {
            res.redirect('/error?errcode=' + authorization_info.errcode + '&errmsg=' + authorization_info.errmsg)
        }
    } else {
        res.redirect('/error?errcode=404&errmsg=' + "用户信息失效，请重试")
    }
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

    let appid = req.params.appid;
    let code
    if (appid) {
        code = await mem.get("configure_appid_" + appid)
        if (!code) {
            let conf = await ConfigModel.findOne({appid: appid})
            if (!conf) {
                return res.send('success')
            }
            code = conf.code
            await mem.set("configure_appid_" + appid, code, 60)
        }
    }
    if (!code) {
        return res.send('success')
    }
    let requestString = req.body;
    let requestMessage = xmlUtil.formatMessage(requestString.xml);
    let query = req.query;
    let message = await componentService.handleMessage(requestMessage, query);
    if (message.Content == 'openid') {
        console.log('---回复openid-----')
        return res.send(wxReplay.get_reply(req, message.FromUserName, message))
    } else if (message.MsgType === 'event' && message.Event.toUpperCase() == 'MASSSENDJOBFINISH') {
        console.log('-------群发消息事件 收到回调------')
        console.log(message)
        return res.send('success')
    } else if (message.Content == 'test_new') {
        console.log('---回复测试-----')
        return res.send(wxReplay.get_reply(req, '测试', message))
    }

    /*if (appid != 'wx3805806832e4f552' && appid != 'wx0b2522b49584c154' && appid != 'wx4653895b5676edeb') {
     return res.send('');
     }*/

    let action = await mem.get('action_' + code)

    if (!action) {
        action = await ActionModel.findOne({code: code})
        if (!action) {
            action = {
                code: code,
                actions: []
            }
        }
        await mem.set('action_' + code, JSON.stringify(action), 60)
    } else {
        action = JSON.parse(action)
    }

    let condition = '';
    if (message.MsgType === 'event' && message.Event === 'subscribe') {
        condition = 'subscribe'
        await redis_client.incr('sub_'+code+new Date().Format('yyyy-MM-dd'))
        await redis_client.expire('sub_'+code+new Date().Format('yyyy-MM-dd'),60*60*48)
    } else if (message.MsgType === 'event' && message.Event.toLowerCase() == 'click') {
        condition = 'click_' + message.EventKey
    } else if (message.MsgType === 'text') {
        condition = 'text_' + message.Content
    }

    let user = {openid: message.FromUserName, code: code, action_time: Date.now()}
    if (message.Event === 'unsubscribe') {
        await redis_client.incr('unsub_'+code+new Date().Format('yyyy-MM-dd'))
        await redis_client.expire('unsub_'+code+new Date().Format('yyyy-MM-dd'),60*60*48)
        user.subscribe_flag = false
        sendMQ(JSON.stringify(user))
        return res.send('success')
    }
    if (action.actions.indexOf(condition) === -1 && action.actions.indexOf('1') === -1) {
        if (message.MsgType === 'event' && message.Event === 'subscribe') {
            user.subscribe_time = Date.now();
            user.subscribe_flag = true;
            user.action_type = 1;
        } else if (message.MsgType === 'event' && message.Event.toLowerCase() == 'click') {
            user.action_type = 2;
        } else if (message.MsgType === 'text') {
            user.action_type = 2;
        }
        sendMQ(JSON.stringify(user))
        return res.send('')
    }

    if (message.MsgType === 'event' && message.Event === 'subscribe') {
        user.subscribe_time = Date.now();
        user.subscribe_flag = true;
        user.action_type = 1;
        let subscribe_count = await mem.get('reply_subscribe_count_' + code)
        if (!subscribe_count) {
            subscribe_count = await ReplyModel.count({codes: {$elemMatch: {$eq: Number(code)}}, type: 2})
            await mem.set("reply_subscribe_count_" + code, subscribe_count.toString(), 60)
        }
        if (subscribe_count == "0") {
            sendMQ(JSON.stringify(user))
            return res.send('success')
        } else {
            reply(req, res, message, code, 2, 'subscribe', message.FromUserName, 0, user)
        }
    } else if (message.MsgType === 'event' && message.Event.toLowerCase() == 'click') {
        user.action_type = 2;
        let click_count = await mem.get('reply_click_count_' + code)
        if (!click_count) {
            click_count = await MenuModel.count({codes: {$elemMatch: {$eq: Number(code)}}})
            await mem.set("reply_click_count_" + code, click_count.toString(), 60)
        }
        if (click_count == "0") {
            sendMQ(JSON.stringify(user))
            return res.send('success')
        } else {
            reply(req, res, message, code, 1, message.EventKey, message.FromUserName, 0, user)
        }
    } else if (message.MsgType === 'text') {
        user.action_type = 2;
        let text_count = await mem.get('reply_text_count_' + code)
        if (!text_count) {
            text_count = await ReplyModel.count({
                codes: {$elemMatch: {$eq: Number(code)}},
                $or: [{type: 4}, {type: 0, text: {$ne: ''}}]
            })
            await mem.set("reply_text_count_" + code, text_count.toString(), 60)
        }
        if (text_count == "0") {
            sendMQ(JSON.stringify(user))
            return res.send('success')
        } else {
            reply(req, res, message, code, 0, message.Content, message.FromUserName, 0, user)
        }

    }
})


async function reply(req, res, message, code, type, param, openid, sex, user) {
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
                    {codes: {$elemMatch: {$eq: code}}, type: type, text: param},
                    {codes: {$elemMatch: {$eq: code}}, type: 4}
                ]
            }).sort({type: 1})
            // if(code = 10000000049){
            //     console.log('-----------------------aaaa')
            // }
        } else if (type == 1) {
            code === 10000000245 && console.log(code)
            reply = await MenuModel.find({codes: {$elemMatch: {$eq: code}}}).sort({updateAt: -1}).limit(1);

            if (reply[0]) {
                console.log("----------------------------reply=============================");
                console.log(reply, param)
                console.log("----------------------------reply=============================")
                reply = reply[0].contents[param]
            } else {
                sendMQ(JSON.stringify(user))
                return res.send('success')
            }
            // reply = await ReplyModel.findOne({codes: {$elemMatch: {$eq: code}}, type: type, key: param})
        } else if (type == 2) {
            reply = await ReplyModel.findOne({
                $or: [
                    {sex: sex},
                    {sex: 3}
                ], codes: {$elemMatch: {$eq: code}}, type: type
            })
        } else if (type == 3) {
            reply = await ReplyModel.findOne({codes: {$elemMatch: {$eq: code}}, type: type})
        }
        if (reply && reply.replyType == 0) {
            reply = JSON.stringify({type: 0, content: reply.content, is_nickname: reply.is_nickname})
        } else if (reply && reply.replyType == 1) {
            reply = JSON.stringify({type: 1, articles: reply.articles, is_nickname: reply.is_nickname})
        } else {
            // console.log('----匹配不到规则----')
            // if(code = 10000000049){
            //     console.log('-----------------------bbbb')
            // }
            sendMQ(JSON.stringify(user))
            return res.send('success')
        }
        await mem.set("cms_reply_" + code + "_" + param, reply, 30)
    }

    // console.log('----发送----')
    // console.log(reply)
    reply = JSON.parse(reply)
    if (reply.is_nickname) {
        let clinet = await wechat_util.getClient(code);
        let info = await async_getInfo(clinet, openid)
        if (reply.type == 1) {
            let articles = reply.articles;
            if (articles.length > 0) {
                articles[0].title = articles[0].title.replace('{{nick_name}}', info.nickname || "")
                replyMsg(req, res, message, articles, code, openid)
            }
        } else {
            let content = reply.content.replace('{{nick_name}}', info.nickname || "")
            replyMsg(req, res, message, content, code, openid)
        }
        user.nickname = info.nickname
        user.headimgurl = info.headimgurl
        user.sex = info.sex.toString() || "0"
        sendSaveMQ(JSON.stringify(user))
    } else {
        if (reply.type == 1) {
            var articles = await mem.get("cms_articles_" + JSON.stringify({articles: reply.articles}));
            if (!articles) {
                let articles = reply.articles;
                if (articles.length > 0) {
                    await mem.set("cms_articles_" + JSON.stringify({articles}), JSON.stringify({articles}), 30);
                    replyMsg(req, res, message, articles, code, openid)
                }
            } else {
                let articles1 = JSON.parse(articles);
                replyMsg(req, res, message, articles1.articles, code, openid)
            }
        } else {
            var content = await mem.get("cms_content_" + reply.content);
            if (!content) {
                let content = reply.content;
                if (content) {
                    await mem.set("cms_content_" + reply.content, content, 30);
                    replyMsg(req, res, message, content, code, openid)
                }
            } else {
                replyMsg(req, res, message, content, code, openid)
            }
        }
        sendMQ(JSON.stringify(user))
    }
}


function async_getInfo(clinet, openid) {
    return new Promise((resolve, reject) => {
        clinet.getUser(openid, function (err, info) {
            resolve(info)
        });
    })
}

async function replyMsg(req, res, message, content, code, openid) {
    res.send(wxReplay.get_reply(req, content, message))
    return
}


module.exports = router
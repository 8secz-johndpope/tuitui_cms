var express = require('express');
var router = express.Router();
var MessageModel = require('../model/Message');
var ConfigModel = require('../model/Config');
var UserModel = require('../model/Userconf');
// var send = require('../script/send_message');
// var sendUser = require('../script/send_user_message');
var wechat_util = require('../util/get_weichat_client.js')

/**
 消息队列
 */
const q = 'message_tasks';
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

router.get('/', async(req, res, next) => {
    let account_id;
    if (!req.session.account) {
        account_id = req.query.account_id
    } else {
        account_id = req.session.account._id;
    }
    let {type = "manual"} = req.query;
    let messages = [];
    if (type === "is_timing") {
        messages = await MessageModel.find({account_id, is_timing: true}).sort({
            timing_time: -1, codes: 1
        });
    } else if (type === "delay") {
        messages = await MessageModel.find({account_id, delay: {$lte: 0}}).sort({
            _id: -1, codes: 1
        });
    } else if (type === "manual") {
        messages = await MessageModel.find({account_id}).sort({
            _id: -1, codes: 1
        });
    }

    let LocalDate = new Date(new Date().toLocaleDateString()).getTime()

    for (let i = 0; i < messages.length; i++) {
        
        let contents = messages[i].contents
        for (var j = 0; j < contents.length; j++) {
            let content = contents[j]
            if (content.local_picurl) {
                content.picurl = content.local_picurl
            }
        }

        if(!messages[i].daily_time_show){
            messages[i].daily_time_show = LocalDate + messages[i].daily_time
        }

    }
    res.send({
        messages: messages
    })
})

router.get('/get_code', async(req, res, next) => {
    let account_id;
    if (!req.session.account) {
        account_id = req.query.account_id
    } else {
        account_id = req.session.account._id;
    }
    let doc = await ConfigModel.find({account_id})
    res.send({
        data: doc
    })
})


router.post('/create', async(req, res, next) => {
    var ab_img = __dirname + '/../' + req.body.img_path;
    var mediaId = await upload(parseInt(req.body.type), ab_img, req.body.codes);
    var contents = await uploadImage(parseInt(req.body.type), req.body.contents, req.body.codes);

    console.log(contents, "==================contents========2019-12-11================")

    let account_id;
    if (!req.session.account) {
        account_id = req.body.account_id
    } else {
        account_id = req.session.account._id;
    }
    var message = {
        codes: req.body.codes,
        sex: req.body.sex,
        action_type: req.body.action_type,
        task: req.body.task,
        is_timing: req.body.is_timing,
        delay: req.body.isHour ? req.body.delay * 60 : req.body.delay,
        isHour: req.body.isHour,
        timing_time: req.body.timing_time,
        type: parseInt(req.body.type),
        contents: contents,
        img: req.body.img,
        tagId: req.body.tagId,
        mediaId: mediaId,
        account_id,
        remarks: req.body.remarks,
        gonghaoList: req.body.gonghaoList,
        group: req.body.group,
        is_daily: req.body.is_daily,
        is_nickname: req.body.is_nickname,
    };
    if (req.body.is_daily) {
        //适配没更新
        if(!req.body.daily_time_show){
            message.daily_time = req.body.daily_time
            if(message.daily_time<0){
                let date_tmp = new Date(new Date().toLocaleDateString()).getTime()+message.daily_time
                let date_com = new Date(date_tmp)
                let tmp_time = date_com.setHours(0,0,0,0)
                let d_time = date_tmp-tmp_time
                message.daily_time = d_time
            }
        }else{
            message.daily_time = req.body.daily_time_show % (24 * 60 * 60 * 1000) + 8 * 60 * 60 * 1000
        }
        //message.daily_time_show = req.body.daily_time_show
    } else {
        message.daily_time = 0
    }
    if (account_id) {
        var docs = await MessageModel.create(message);
        if (docs) {
            if (docs.type == 0) {
                let contents = docs.contents
                for (var j = 0; j < contents.length; j++) {
                    let content = contents[j]
                    if (content.local_picurl) {
                        content.picurl = content.local_picurl
                    }
                }
            }
            res.send({
                success: '成功',
                data: docs
            })
        } else {
            res.send({
                err: '创建失败，请检查输入是否有误'
            })
        }
    } else {
        res.send({
            err: '创建失败，账户信息失效'
        })
    }

})

router.post('/update', async(req, res, next) => {
    var id = req.body.id;
    var ab_img = __dirname + '/../' + req.body.img_path;
    var mediaId = await upload(parseInt(req.body.type), ab_img, req.body.codes);
    var contents = await uploadImage(parseInt(req.body.type), req.body.contents, req.body.codes);
    var message = {
        codes: req.body.codes,
        sex: req.body.sex,
        action_type: req.body.action_type,
        task: req.body.task,
        is_timing: req.body.is_timing,
        delay: req.body.isHour ? req.body.delay * 60 : req.body.delay,
        isHour: req.body.isHour,
        timing_time: req.body.timing_time,
        type: parseInt(req.body.type),
        contents: contents,
        img: req.body.img,
        tagId: req.body.tagId,
        mediaId: mediaId,
        remarks: req.body.remarks,
        gonghaoList: req.body.gonghaoList,
        group: req.body.group,
        is_daily: req.body.is_daily,
        is_nickname: req.body.is_nickname,
    };
    if (req.body.is_daily) {
        //适配没更新
        if(!req.body.daily_time_show){
            message.daily_time = req.body.daily_time
            if(message.daily_time<0){
                let date_tmp = new Date(new Date().toLocaleDateString()).getTime()+message.daily_time
                let date_com = new Date(date_tmp)
                let tmp_time = date_com.setHours(0,0,0,0)
                let d_time = date_tmp-tmp_time
                message.daily_time = d_time
            }
        }else{
            message.daily_time = req.body.daily_time_show % (24 * 60 * 60 * 1000) + 8 * 60 * 60 * 1000
        }
    } else {
        message.daily_time = 0
    }
    // if (parseInt(req.body.type) === 2) {
    //     for (let code of req.body.codes) {
    //         let client = await wechat_util.getClient(code);
    //         client.uploadImageMaterial(req.body.img, async function (error, result) {
    //             message.mediaId = result.media_id
    //         })
    //     }
    // }
    var docs = await MessageModel.findByIdAndUpdate(id, message)
    if (docs) {
        if (docs.type == 0) {
            let contents = docs.contents
            for (var j = 0; j < contents.length; j++) {
                let content = contents[j]
                if (content.local_picurl) {
                    content.picurl = content.local_picurl
                }
            }
        }
        res.send({
            success: '修改成功',
            data: docs
        })
    } else {
        res.send({
            err: '修改失败'
        })
    }
})

router.get('/delete', async(req, res, next) => {
    var id = req.query.id;
    var doc = await MessageModel.findByIdAndRemove(id)
    if (doc) {
        res.send({
            success: '删除成功',
            data: doc
        })
    } else {
        res.send({
            err: '删除失败'
        })
    }
})

router.get('/remove', async(req, res, next) => {
    var startTime = new Date(Number(req.query.startTime)),
        endTime = new Date(Number(req.query.endTime));
    let account_id;
    if (!req.session.account) {
        account_id = req.query.account_id
    } else {
        account_id = req.session.account._id;
    }
    var docs = await MessageModel.remove({
        timing_time: {
            $gte: startTime,
            $lt: endTime
        }, account_id
    })
    if (docs) {
        res.send({
            success: '删除成功',
            data: docs
        })
    } else {
        res.send({
            err: '删除失败'
        })
    }
})

router.get('/send', async(req, res, next) => {
    var id = req.query.id;
    sendMQ(id)
    // sendUser.get_message(id);
    res.send({
        success: '发送成功'
    })
})

router.post('/preview', async(req, res, next) => {
    let {codes, openid, type, contents, img_path} = req.body;
    let users = await UserModel.find({openid: openid}, {nickname: 1, openid: 1}).sort({updateAt: -1}).limit(1)
    var articles = contents;
    let user = users[0]
    if (users.length > 0) {
        for (let code of codes) {
            let client = await wechat_util.getClient(code);
            articles[0].title = articles[0].title.replace('{{nick_name}}', user.nickname || "")
            type === 0 && client.sendNews(openid, articles, async function (error, result) {
                console.log("error", error, "----------图文-------------")
                console.log("result", result, "----------图文-------------")
                //res.send({code: 1, msg: "发送成功"})
            });
            type === 1 && client.sendText(openid, articles[0].description.replace('{{nick_name}}', user.nickname), async(error, result) => {
                console.log("error", error, "-----------文本------------")
                console.log("result", result, "----------文本-------------")
                //res.send({code: 1, msg: "发送成功"})
            });
            if (type === 2) {
                var ab_img = __dirname + '/../' + img_path;
                var mediaId = await upload(parseInt(req.body.type), ab_img, codes)
                client.sendImage(openid, mediaId, async(error, result) => {
                    console.log("error", error, "-----------图片------------")
                    console.log("result", result, "----------图片-------------")
                    //res.send({code: 1, msg: "发送成功"})
                })
            }
        }
        res.send({code: 1, msg: "发送成功"})
    } else {
        res.send({code: -1, msg: "互动时间超过48小时，再次互动或重新关注公众号后，再次尝试"})
    }

});

router.put('/updateGroup', async(req, res, next) => {
    let {selectedMessages, group} = req.body;
    selectedMessages.map(async item => {
        await MessageModel.findByIdAndUpdate(item, {group})
    });
    res.send({code: 1, msg: "修改成功"})
});

router.delete('/delSelect', async(req, res, next) => {
    let {selectedMessages} = req.query;
    selectedMessages.map(async item => {
        await MessageModel.findByIdAndRemove(item)
    });
    res.send({code: 1, msg: "批量删除成功"})
});

async function upload(type, img_path, codes) {
    if (type == 2) {
        for (let code of codes) {
            let client = await wechat_util.getClient(code);
            return new Promise((resolve, reject) => {
                client.uploadImageMaterial(img_path, async function (error, result) {
                    console.log("error", error, "-----------------------")
                    console.log("result", result, "-----------------------")
                    resolve(result.media_id)
                })
            })
        }
    } else {
        return
    }
}

async function uploadImage(type, contents, codes) {
    let ab_img = __dirname + '/../public/uploads/';
    if (type === 0) {
        codes = codes.derangedArray()
        for (let code of codes) {
            let client = await wechat_util.getClient(code);
            if (!client) {
                continue
            }
            for (var i = 0; i < contents.length; i++) {
                let item = contents[i]
                let temp_pic = item.picurl
                let img_paths = item.picurl.split('/')
                let img_file = img_paths[img_paths.length - 1]
                try {
                    item.local_picurl = item.picurl;
                    item.picurl = await client_upload(client, ab_img + img_file)
                } catch (e) {
                    item.picurl = temp_pic
                    item.local_picurl = ''
                }
                continue
            }
            break
        }
        return contents
    } else {
        return contents
    }
}

function client_upload(client, file_path) {
    return new Promise((resolve, reject) => {
        client.uploadImage(file_path, function (error, result) {
            console.log("error", error, "-----------------------")
            console.log("result", result, "-----------------------")
            if (result && result.url) {
                resolve(result.url)
            } else {
                reject(error)
            }
        });
    })
}

if (!Array.prototype.derangedArray) {
    Array.prototype.derangedArray = function () {
        for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
        return this;
    };
}

module.exports = router
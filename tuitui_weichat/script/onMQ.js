const UserconfModel = require("../model/Userconf")
const wechat_util = require('../util/get_weichat_client')

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
        onMQ()
    } catch (e) {
        console.log(e)
    }
}

async function onMQ() {
    await ch.assertQueue(q);
    ch.consume(q, async function (msg) {
        if (msg !== null) {
            let handle_str = msg.content.toString()
            console.log(handle_str, '-------------------handle_str');
            let data = JSON.parse(handle_str)
            let info = await userInfo(data.code, data.openid)
            data.nickname = info.nickname
            data.headimgurl = info.headimgurl
            data.sex = info.sex.toString()
            await UserconfModel.findOneAndUpdate({openid: data.openid, code: data.code}, data, {upsert: true})
            /**
             待查询用户信息  写入数据库
             */
            ch.ack(msg);
        }
    });
}

async function userInfo(code, openid) {
    // console.log(code,'-------------------------code')
    let api = await wechat_util.getClient(code);
    return new Promise((resolve, reject) => {
        api.getUser(openid, function (err, info) {
            resolve(info);
        })
    })
}
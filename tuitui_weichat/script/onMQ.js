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
            let data = JSON.parse(handle_str)
            if(data.openid=='oxH2t1fMyotDLwBhxQMzAvmAqoF8'){
                console.log('----用户信息-----')
                console.log(handle_str)
            }
            let info = await userInfo(data.code, data.openid)
            if(data.openid=='oxH2t1fMyotDLwBhxQMzAvmAqoF8'){
                console.log(info)
            }
            data.nickname = info.nickname
            data.headimgurl = info.headimgurl
            if(info && info.sex){
                data.sex = info.sex.toString()
            }else{
                data.sex = "0"
            }
            await UserconfModel.findOneAndUpdate({openid: data.openid, code: data.code}, data, {upsert: true})
            /**
             待查询用户信息  写入数据库
             */
            ch.ack(msg);
        }else{
            ch.ack(msg);
        }
    });
}

async function userInfo(code, openid) {
    // console.log(code,'-------------------------code')
    let api = await wechat_util.getClient(code);
    if(openid=='oxH2t1fMyotDLwBhxQMzAvmAqoF8'){
        console.log(api)
    }
    if(api.store.accessToken==''){
        console.log('----accessToken 为空------')
        console.log(code)
    }
    return new Promise((resolve, reject) => {
        api.getUser(openid, function (err, info) {
            if(openid=='oxH2t1fMyotDLwBhxQMzAvmAqoF8'){
                console.log('获取微信用户信息')
                console.log(err)
                console.log(info)
            }
            resolve(info);
        })
    })
}
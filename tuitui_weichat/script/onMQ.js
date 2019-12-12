const UserconfModel = require("../model/Userconf")
const wechat_util = require('../util/get_weichat_client')

/**
 消息队列
 */
const amqplib = require('amqplib');
let ch;
getChannel();
async function getChannel() {
    console.log('----- getChannel ----')
    try {
        let conn = await amqplib.connect('amqp://localhost')
        ch = await conn.createChannel();
        onMQ('user_tasks')
        saveMQ('save_user_tasks')
    } catch (e) {
        console.log(e)
    }
}

async function onMQ(q) {
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
            if(info && info.sex){
                data.nickname = info.nickname
                data.headimgurl = info.headimgurl
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
    //console.log('-------获取用户信息  api---------')
    //console.log(api.store)
    return new Promise((resolve, reject) => {
        if(!api){
            resolve('');
        }else {
            api.getUser(openid, function (err, info) {
                if (openid == 'oxH2t1fMyotDLwBhxQMzAvmAqoF8') {
                    console.log('获取微信用户信息')
                    console.log(err)
                    console.log(info)
                }
                resolve(info);
            })
        }
    })
}

async function saveMQ(q) {
    await ch.assertQueue(q);
    ch.consume(q, async function (msg) {
        if (msg !== null) {
            let handle_str = msg.content.toString()
            let data = JSON.parse(handle_str)
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
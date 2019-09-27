const UserconfModel = require("../model/Userconf")
const wechat_util = require('../util/get_weichat_client')

/**
  消息队列
*/
const q = 'user_tasks';
const amqplib = require('amqplib');
let ch;
getChannel();
async function getChannel(){
    console.log('----- getChannel ----')
    try{
        let conn = await amqplib.connect('amqp://localhost')
        ch = await conn.createChannel();
        onMQ()
    }catch(e){
        console.log(e)
    }
}

async function onMQ(){
    await ch.assertQueue(q);
    ch.consume(q, async function(msg) {
      if (msg !== null) {
        let handle_str = msg.content.toString()
        console.log(handle_str);
        /**
            待查询用户信息  写入数据库
        */
        ch.ack(msg);
      }
    });
}
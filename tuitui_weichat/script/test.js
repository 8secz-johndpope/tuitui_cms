var mem = require('../util/mem.js');
const ConfigModel = require("../model/Config")
var sendMQ = require('../util/sendMQ')

async function a() {

    sendMQ.send(JSON.stringify({a:'test'}),'message_tasks')

    // let configs = await ConfigModel.find()
    // for(let config of configs){
    //     await mem.set("configure_appid_" + config.appid, 0, 1)
    //     await mem.set("configure_" + config.code, 0, 1)
    //     console.log(config,'---------------config')
    // }

    // var access_token = await mem.get("cms_component_access_token");
    // console.log(access_token,'------------------------------access_token')
    // await mem.set("cms_component_access_token",'',1);
    // let client = await WechatUtil.getClient(10000000001)
    // client.getFollowers(async function (err, result) {
    //     console.log(err,result,'----------------------result')
    // })
}
a()

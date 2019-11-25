// var mem = require('../util/mem.js');
const ConfigModel = require("../model/Config")
const AccountModel = require('../model/Account.js')
var MenuModel = require('../model/Menu');
// const crypto = require("crypto");
// var sendMQ = require('./sendMQ')

async function a() {

    // let a = await AccountModel.update({_id:'5d842e38294bb857f2728122'},{username:'yuansikuan',password:'40bb7b3c8969de39b91a1fde16d2c42a'})
    // console.log(a,'--------------')
    // sendMQ.send('aaa','message_tasks')

    let a = await AccountModel.findById('5d842dc9294bb857f2728120')
    console.log(a,'-----------------')

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

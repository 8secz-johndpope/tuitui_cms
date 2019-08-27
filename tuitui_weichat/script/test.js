var mem = require('../util/mem.js');
var WechatUtil = require('../util/get_weichat_client.js');

async function a() {
    let client = await WechatUtil.getClient(10000000001)
    client.getFollowers('',async function (err, result) {
        console.log(err,result,'----------------------result')
    })
}
a()

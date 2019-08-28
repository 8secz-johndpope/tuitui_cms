var mem = require('../util/mem.js');
var WechatUtil = require('../util/get_weichat_client.js');

async function a() {
    var access_token = await mem.get("cms_component_access_token");
    console.log(access_token,'------------------------------access_token')
    // let client = await WechatUtil.getClient(10000000001)
    // client.getFollowers(async function (err, result) {
    //     console.log(err,result,'----------------------result')
    // })
}
a()

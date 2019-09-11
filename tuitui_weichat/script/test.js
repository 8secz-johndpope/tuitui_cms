var mem = require('../util/mem.js');

async function a() {
    let code = process.argv.slice(2)[0]

    await mem.set("jieguan_" + code, 0, 1)
    // var access_token = await mem.get("cms_component_access_token");
    // console.log(access_token,'------------------------------access_token')
    // await mem.set("cms_component_access_token",'',1);
    // let client = await WechatUtil.getClient(10000000001)
    // client.getFollowers(async function (err, result) {
    //     console.log(err,result,'----------------------result')
    // })
}
a()

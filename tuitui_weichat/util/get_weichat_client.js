const ConfigModel = require('../model/Config');
const mem = require('../util/mem.js');
const Singleton = require('/home/work/refresh/util/get_weichat_client.js');

async function getClient(code) {
    let appid = await mem.get("configure_" + code)
    if(!appid){
        let conf = await ConfigModel.findOne({code:code})
        appid = conf.appid
        await mem.set("configure_" + code, appid, 30 * 24 * 3600)
    }
    let token = mem.get('access_token_'+appid)
    console.log(token,'--------------------------token')
    let api = Singleton.getInterface(appid)
    api.store = {accessToken: token, expireTime: Date.now() + (expires_in - 10) * 1000}
    api.token = {accessToken: token, expireTime: Date.now() + (expires_in - 10) * 1000}
    console.log(api.store,'---------------------store')
    return api.api;
}

module.exports.getClient = getClient;


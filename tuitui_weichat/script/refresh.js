const schedule = require('node-schedule');
const http = require('../util/httpUtils.js');
const mem = require('../util/mem.js');
const authModel= require("../model/AuthorizationInfo.js");
const Singleton = require('../util/get_weichat_client');

//refresh component_access_token every 1 hour
var refreshComponentAccessToken = async function() {
    var ticket = await mem.get('component_ticket');
    if(ticket == null || ticket == undefined || ticket == '') {
        return;
    }
    var componentTokenPostData = {
        component_appid : 'wx4b715a7b61bfe0a4',
        component_appsecret : '5d9db74768cbead3047ff8612ede5124',
        component_verify_ticket : ticket
    };
    var https_options = {
        hostname : 'api.weixin.qq.com',
        path : '/cgi-bin/component/api_component_token',
        method : 'post'
    };

    var component_access_token_result = await http.doHttps_withdata(https_options, componentTokenPostData);
    var access_token_json = JSON.parse(component_access_token_result);
    console.log('Refresh component_access_token result: ' + component_access_token_result);

    if(access_token_json.errcode != undefined) {
        return;
    }
    access_token = access_token_json.component_access_token;
    await mem.set("cms_component_access_token",access_token,90*60)
}

//refresh pre_auth_code every 20 minutes
var refreshComponentAuthCode = async function() {
    var access_token = await mem.get("component_access_token");
    if(!access_token) {
        return;
    }
    var componentAuthCodePostData = {
        component_appid : "wx4b715a7b61bfe0a4"
    };
    var https_options = {
        hostname : 'api.weixin.qq.com',
        path : '/cgi-bin/component/api_create_preauthcode?component_access_token=%ACCESS_TOKEN%',
        method : 'post'
    };

    https_options.path = https_options.path.replace('%ACCESS_TOKEN%', access_token);
    var component_preauthcode_result = await http.doHttps_withdata(https_options, componentAuthCodePostData);
    var preauthcode_json = JSON.parse(component_preauthcode_result);
    console.log('Refresh pre_auth_code result: ' + component_preauthcode_result);
    if(preauthcode_json.errcode != undefined) {
        return;
    }
    auth_code = preauthcode_json.pre_auth_code;
    await mem.set("component_auth_code",auth_code,30*60)
}

//账号比较多，有待优化的细节
var refreshAccessToken = async function(con={}) {
    var auths = await authModel.find(con)
    var access_token = await mem.get("component_access_token");
    var https_options = {
        hostname : 'api.weixin.qq.com',
        path : '/cgi-bin/component/api_authorizer_token?component_access_token=%ACCESS_TOKEN%',
        method : 'post'
    };
    https_options.path = https_options.path.replace('%ACCESS_TOKEN%', access_token);
    for (var i = 0; i <auths.length; i++) {
        try{
            var auth = auths[i];
            var post_data={
                component_appid : "wx4b715a7b61bfe0a4",
                authorizer_appid : auth.appid,
                authorizer_refresh_token : auth.refresh_token
            }
            var result = await http.doHttps_withdata(https_options, post_data);
            var data = JSON.parse(result);
            auth.authorizer_access_token = data.authorizer_access_token
            auth.expires_in = data.expires_in
            auth.refresh_token = data.authorizer_refresh_token
            auth.save();
            let saveToken = Singleton.getInterface(auth.appid)
            saveToken.setToken(auth.appid,auth.authorizer_access_token,auth.expires_in)
            // Singleton.setToken(auth.appid,auth.authorizer_access_token,auth.expires_in)
            await mem.set('access_token_'+auth.appid,auth.authorizer_access_token,30)
        }catch(e){
            console.log('-------refreshAccessToken err-------')
            console.log(e)
        }
    }
}

var get_authorizer_info = async function(con={}) {

    var  auths = await authModel.find(con)

    var access_token = await mem.get("component_access_token");
    var https_options = {
        hostname : 'api.weixin.qq.com',
        path : '/cgi-bin/component/api_get_authorizer_info?component_access_token=%ACCESS_TOKEN%',
        method : 'post'
    };
    https_options.path = https_options.path.replace('%ACCESS_TOKEN%', access_token);
    for (var i = 0; i <auths.length; i++) {
        try{
            var auth = auths[i];
            var post_data={
                component_appid : "wx4b715a7b61bfe0a4",
                authorizer_appid : auth.appid
            }
            var result = await http.doHttps_withdata(https_options, post_data);
            console.log('-------get_authorizer_info reslut-------')
            console.log(result)
            var info = JSON.parse(result).authorizer_info;
            auth.service_type_info_id = info.service_type_info.id;
            auth.verify_type_info_id = info.verify_type_info.id;
            auth.user_name = info.user_name;
            auth.qrcode_url = info.qrcode_url;
            auth.nick_name = info.nick_name;
            auth.save();
        }catch(e){
            console.log('-------get_authorizer_info err-------')
            console.log(e)
        }
    }
}

// get_authorizer_info({appid:'wx4b715a7b61bfe0a4'})
// schedule.scheduleJob('0 0 * * * *',get_authorizer_info({appid:'wx2f289986bee197b2'}))

function start(){
    //refresh component_access_token every hour
    var rule1 = new schedule.RecurrenceRule();
    rule1.minute = 0
    rule1.second = 0
    schedule.scheduleJob(rule1, async function () {
        refreshComponentAccessToken()
    })
    // schedule.scheduleJob('0 0 */1 * * *', refreshComponentAccessToken());

    //refresh pre_auth_code every 20 minutes
    var rule2 = new schedule.RecurrenceRule();
    rule2.minute = [20,40,60]
    rule2.second = 10
    schedule.scheduleJob(rule2, async function () {
        refreshComponentAuthCode()
    })
    // schedule.scheduleJob('0 */20 * * * *', refreshComponentAuthCode());

    //refresh app access_token
    var rule3 = new schedule.RecurrenceRule();
    rule3.minute = 0
    rule3.second = 30
    schedule.scheduleJob(rule3, async function () {
        refreshAccessToken()
    })
    // schedule.scheduleJob('30 0 */1 * * *', refreshAccessToken({appid:'wx4b715a7b61bfe0a4'}));

   //refresh app info
    var rule4 = new schedule.RecurrenceRule();
    rule4.minute = 0
    rule4.second = 20
    schedule.scheduleJob(rule4, async function () {
        get_authorizer_info()
    })
    // schedule.scheduleJob('20 0 */1 * * *',get_authorizer_info({appid:'wx4b715a7b61bfe0a4'}))
}
start()

module.exports = {
    refreshComponentAccessToken : refreshComponentAccessToken,
    refreshComponentAuthCode : refreshComponentAuthCode,
    refreshAccessToken : refreshAccessToken,
    get_authorizer_info : get_authorizer_info,
}



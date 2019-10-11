const xml2js = require('xml2js');
const xmlUtil = require("../util/xmlUtil.js");
const wechatCrypto = require('../util/cryptoUtil.js');
const mem = require("../util/mem.js");
const ConfigModel= require("../model/Config");
const http = require('../util/httpUtils.js');
//analyze the decrypted message (xml => json)

var resolveMessage = messageXML => {
    var message = new Promise((resolve, reject) => {
            xml2js.parseString(messageXML, {trim: true}, (err, result) => {
            var message = xmlUtil.formatMessage(result.xml);
            resolve(message);
        });
    }).then(function(message) {
        return message;
    });

    return message;
};

module.exports.handleComponentMessage = async (requestMessage, query) => {
    let signature = query.msg_signature;
    let timestamp = query.timestamp;
    let nonce = query.nonce;
    // console.log("Receive messasge from weixin \nsignature: " + signature + "\ntimestamp: " + timestamp + "\nnonce: " + nonce);
    var requestMessage = await resolveMessage(requestMessage);
    let cryptor = new wechatCrypto('mingxingshuo', 'tw4a1yTUv0VJURGNif96ibI4z3oWPJJWpuo2mHTvzLb', 'wx4b715a7b61bfe0a4');
    let encryptMessage = requestMessage.Encrypt;
    let decryptMessage = cryptor.decrypt(encryptMessage);

    // console.log('Receive messasge from weixin decrypted :' + JSON.stringify(decryptMessage));

    var message = await resolveMessage(decryptMessage.message);
    let infoType = message.InfoType;
    console.log(infoType);
    if(infoType == 'component_verify_ticket') {
        let ticket = message.ComponentVerifyTicket;
        console.log('------ticket------')
        console.log(ticket)
        await mem.set('cms_component_ticket',ticket,20*60);
    } else if(infoType == 'authorized') {
        //TODO authorized
    } else if(infoType == 'unauthorized') {
        //TODO unauthorized
        console.log('------unauthorized------')
        console.log(message)
        // var doc = await ConfigModel.findByIdAndRemove();
    } else if(infoType == 'refresh') {
        //TODO refresh
    }

    return '';
}

module.exports.handleMessage = async (requestMessage, query) => {
    let signature = query.msg_signature;
    let timestamp = query.timestamp;
    let nonce = query.nonce;
    // console.log("Receive messasge from weixin \nsignature: " + signature + "\ntimestamp: " + timestamp + "\nnonce: " + nonce);
    var requestMessage = await resolveMessage(requestMessage);
    // console.log('---------requestMessage---------');
    // console.log(requestMessage);
    let cryptor = new wechatCrypto('mingxingshuo', 'tw4a1yTUv0VJURGNif96ibI4z3oWPJJWpuo2mHTvzLb', 'wx4b715a7b61bfe0a4');
    let encryptMessage = requestMessage.Encrypt;
    let decryptMessage = cryptor.decrypt(encryptMessage);

    // console.log('Receive messasge from weixin decrypted :' + JSON.stringify(decryptMessage));

    var message = await resolveMessage(decryptMessage.message);
    
    return message;
}

module.exports.getAuthorizeUrl = async function() {
    let url = 'https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=%APPID%&pre_auth_code=%AUTH_CODE%&redirect_uri=%REDIRECT_URI%'
        .replace('%APPID%', 'wx4b715a7b61bfe0a4')
        .replace('%AUTH_CODE%', await mem.get('cms_component_auth_code'))
        .replace('%REDIRECT_URI%',
            'http://t.dmmup.com/component/queryAuthorizeInfo');
    return url;
}

module.exports.queryAuthorizeInfo = async (account_id,auth_code) => {
    var access_token = await mem.get('cms_component_access_token');
    let queryAuthorizePostData = {
        component_appid : 'wx4b715a7b61bfe0a4',
        authorization_code : auth_code
    };
    let https_options = {
        hostname : 'api.weixin.qq.com',
        path : '/cgi-bin/component/api_query_auth?component_access_token=%ACCESS_TOKEN%',
        method : 'POST'
    };
    https_options.path = https_options.path.replace('%ACCESS_TOKEN%', access_token);
    let queryAuthorizeResult = await http.doHttps_withdata(https_options, queryAuthorizePostData);
    let queryAuthorize_json = JSON.parse(queryAuthorizeResult);
    console.log(queryAuthorize_json);
    let authorization_info = queryAuthorize_json.authorization_info;
    console.log(authorization_info,'-------------------authorization_info')
    let appid = authorization_info.authorizer_appid;
    let authorizer_access_token = authorization_info.authorizer_access_token;
    let expires_in = authorization_info.expires_in;
    let refresh_token = authorization_info.authorizer_refresh_token;
    let func_info = JSON.stringify(authorization_info.func_info);
    let conf = await ConfigModel.findOne({"appid":appid})
    if(conf){
        await ConfigModel.update({"appid":appid},{
            "authorizer_access_token":authorizer_access_token,
            "expires_in":expires_in,
            "refresh_time": Date.now(),
            "refresh_token":refresh_token,
            "func_info":func_info
        })
    }else{
        await ConfigModel.create({
            "appid":appid,
            "authorizer_access_token":authorizer_access_token,
            "expires_in":expires_in,
            "refresh_time": Date.now(),
            "refresh_token":refresh_token,
            "func_info":func_info,
            "account_id":account_id
        })
    }
    return authorization_info;
}

async function test(){
    var xml = '<xml>\n    <AppId><![CDATA[wx4b715a7b61bfe0a4]]></AppId>\n    <Encrypt><![CDATA[mArdndfPF44xyfGEIy5yCCuUFKAAlSr3UIoAbfjTogTNrxk43MD3We6+IG7YauTDvaSdH+VHj4xo6xTC2s1/fCE4Wda3IT4ZG+z2m02XR8lshBxKKdGoVbVdw8BrEWb5uuANjJ+I8b+HVQK9SPDC9wkKmt27+AT2nAOBcnakgzItIK/aFi2C1H8r7tlG40AYWdn6bSGGKRWLeoNlCRMkOeE4I1QzfnbV6pmSIV5Ipvcm/dMby3SU3ScKEVNP8/9iJ6O334Y9SOQKsc6OjNnYa0ny3lf0Sqzri/h20hgyNrKqCofqQN3O0OtXxEuZ6gB6irSQNFz6hEHb6OeMHWY/7nNJCmnKAL0J4lPIliVtguw1gqRi8okPuH7J3COsdzfIBNvDyWM4DHnBG5hmNMRi8tG+VCvvDNuC8Qrdq0XDUGEbVS2oB0w2EYdouhA+EGySyliS88YiAY4OTvAonbwxAQ==]]></Encrypt>\n</xml>\n';
    var requestMessage = await resolveMessage(xml)
    console.log('-----------requestMessage.Encrypt-------------');
    console.log(requestMessage.Encrypt);
    let encryptMessage = requestMessage.Encrypt;
    let cryptor = new wechatCrypto('mingxingshuo', 'tw4a1yTUv0VJURGNif96ibI4z3oWPJJWpuo2mHTvzLb', 'wx4b715a7b61bfe0a4');
    let decryptMessage = cryptor.decrypt(encryptMessage);
    // console.log('Receive messasge from weixin decrypted :' + JSON.stringify(decryptMessage));
}


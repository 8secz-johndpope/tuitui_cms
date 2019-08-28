const http = require('httpUtils.js');
const mem = require('mem.js');
const ConfigModel= require("../model/Config");

var get_authorizer_info = async function(con={}) {

    var  auths = await ConfigModel.find(con)

    var access_token = await mem.get("cms_component_access_token");
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

module.exports = {
    get_authorizer_info : get_authorizer_info,
}



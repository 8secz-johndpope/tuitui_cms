var request = require('request');

/**
 * 新浪 短链服务
 * @param {*} long_url 
 */

function short_url_req(long_url){
    return new Promise((resolve,reject)=>{
        let api = 'http://api.weibo.com/2/short_url/shorten.json?source=211160679&url_long='+encodeURIComponent(long_url);
        request(api,function(error, response, body){
          try{
            let data = JSON.parse(body)
            console.log(data)
            resolve(data.urls[0].url_short)
          }catch(e){
            reject(e)
          }
        })
    });
  }

short_url_req('http://tiexie0.wang/transfer/101091303')

exports.short_url_req = short_url_req;
const express = require('express');
const router = express.Router();
const SunshineModel = require('../model/Sunshine.js');
const mem = require('../util/mem.js')
const rp = require('request-promise');

router.get('/:id',async function (req, res, next) {
    var id = req.params.id;
    let value = await mem.get('sun_' + id)
    if(value){
        value = JSON.parse(value)
        res.redirect(value.tuiguang_link)
    }else {
        let data = await SunshineModel.findOne({_id: id})
        if (data) {
            await mem.set('sun_' + id,JSON.stringify(data),60)
            res.redirect(data.tuiguang_link)
        }else{
            res.send('没有查询到此链接，请先创建')
        }
    }
    upload_sun(req)
})


let upload_sun =async (req) =>{
    let s_url = 'http://www.dev.kpread.com/api/toutiao/visitorsave4join?'
    s_url += "ip="+req.clientIp+"&";
    s_url += "ua="+req.headers['user-agent']+"&"
    s_url += "url="+encodeURIComponent("https://t.1yuedu.cn"+req.originalUrl)
    let body = await rp(url)
    console.log('------回传阳光-------',body)
}


let get_link = (data,req) =>{
    /*console.log('----------阳光--------')
    console.log(req.clientIp)*/
    let link = data.tuiguang_link+'?suncb=1&channel_id='+data.channel_id
                +'&ip='+req.clientIp+'&ua='+req.headers['user-agent'];
    let params = req.query;
    let args = []
    for (let key in params) {
        args.push(key+'='+params[key])
    }
    if(args.length){
        link += '&'+args.join('&')
    }
    console.log('-------阳光落地页拼接链接---------')
    console.log(link)
    return link;
}

let getClientIp = function (req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress || '';
}

module.exports = router;
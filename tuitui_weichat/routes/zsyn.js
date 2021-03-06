var express = require('express');
var router = express.Router();
var ZhuiShuYunModel = require('../model/ZhuiShuYun.js');
var mem = require('../util/mem.js')

router.get('/:id',async function (req, res, next) {
    var id = req.params.id;
    let value = await mem.get('zsy_' + id)
    if(value){
        value = JSON.parse(value)
        res.redirect(get_link(value,req))
    }else {
        let data = await ZhuiShuYunModel.findOne({_id: id})
        if (data) {
            await mem.set('zsy_' + id,JSON.stringify(data),60)
            res.redirect(get_link(data,req))
        }else{
            res.send('没有查询到此链接，请先创建')
        }
    }
})

let get_link = (data,req) =>{
    /*console.log('----------追书云--------')
    console.log(req.clientIp)*/
    let link = data.tuiguang_link+'?dycallback=1&channel_id='+data.channel_id
                +'&ip='+req.clientIp+'&ua='+req.headers['user-agent'];
    let params = req.query;
    let args = []
    for (let key in params) {
        args.push(key+'='+params[key])
    }
    if(args.length){
        link += '&'+args.join('&')
    }
    console.log('-------追书云落地页拼接链接---------')
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
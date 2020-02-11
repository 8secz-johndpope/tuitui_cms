var express = require('express');
var router = express.Router();
var ConfigModel = require('../model/Config');
var mem = require('../util/mem.js');
var user = require('../script/get_users')
var exec = require('child_process').exec;
var request = require('request');
var OpenidModel = require('../model/Openidjg');
var UserconfModel = require('../model/Userconfjg');
var UserTagModel = require('../model/UserTag')
var RecordModel = require('../model/Record')
var WechatUtil = require('../util/get_weichat_client.js');
const asyncRedis = require("async-redis");
const redis_client = asyncRedis.createClient();
var async = require('async');

router.get('/', async(req, res, next) => {
    let account_id;
    if(!req.session.account) {
        account_id = req.query.account_id
    } else {
        account_id = req.session.account._id;
    }
    let doc = await ConfigModel.find({account_id}).sort({_id: -1});
    res.send({code: 1, msg: "查询成功", data: doc})
});

router.get('/group', async(req, res, next) => {
    let account_id;
    if(!req.session.account) {
        account_id = req.query.account_id
    } else {
        account_id = req.session.account._id;
    }
    let {group = "未分组"} = req.query;
    let doc = await ConfigModel.find({account_id, group}).sort({_id: -1});
    res.send({code: 1, msg: "查询成功", data: doc})
});

router.get('/find_one', async(req, res, next) => {
    let account_id;
    if(!req.session.account) {
        account_id = req.query.account_id
    } else {
        account_id = req.session.account._id;
    }
    try {
        let reg = new RegExp(req.query.nick_name);
        let doc = await ConfigModel.find({nick_name: {$regex: reg}, account_id});
        res.send({code: 1, msg: "查询成功", data: doc})
    } catch (e) {
        res.send({code: 1, msg: "不能以特殊字符开头", data: []})
    }

});

router.get('/del', async(req, res, next) => {
    let id = req.query.id;
    var doc = await ConfigModel.findByIdAndRemove(id);
    if (doc) {
        await UserconfModel.remove({code: doc.code});
        await mem.set("configure_" + doc.code, '', 1);
        res.send({success: '删除成功', data: doc})
    } else {
        res.send({err: '删除失败'})
    }
});

router.put('/', async(req, res, next) => {
    let {id, group, attribute, ab_test} = req.body;
    let result = await ConfigModel.findByIdAndUpdate(id, {group, attribute, ab_test}, {new: true});
    if (result) {
        res.send({code: 1, msg: "修改成功", data: result})
    } else {
        res.send({code: -1, msg: "修改失败，请重试"})
    }
});

router.put('/multi_select', async(req, res, next) => {
    let {ids, group} = req.body;
    let result = await ids.map(async item => {
        await ConfigModel.findByIdAndUpdate(item, {group}, {new: true});
    });
    if (result) {
        res.send({code: 1, msg: "修改成功", data: result})
    } else {
        res.send({code: -1, msg: "修改失败，请重试"})
    }
});

router.get('/reset', async(req, res, next) => {
    var config = new ConfigModel();
    config.nextCount(function (err, count) {
        config.resetCount(function (err, nextCount) {
        });
    });
    res.send({success: '重置成功'})
});

router.get('/jieguan', async(req, res, next) => {
    let code = req.query.code
    await ConfigModel.update({code:code},{status:0})
    res.send('设置成功')
});

router.get('/data/:code',async(req, res, next) =>{
    let code = req.params.code;
    let y_cumulate_user = await get_wechat_cumulate()
    let sub_user = await redis_client.get('sub_'+code+new Date().Format('yyyy-MM-dd'))
    let unsub_user = await redis_client.get('unsub_'+code+new Date().Format('yyyy-MM-dd'))
    let data = {
        cumulate_user : y_cumulate_user+sub_user-unsub_user,
        new_user : sub_user,
        cancel_user : unsub_user
    }
    res.send(data)
})

function get_wechat_cumulate(code){
    return new Promise((resolve, reject) =>{
        WechatUtil.getClient(code).then((client) => {
            if(!client){
                return reject('未获取client')
            }
            let d = new Date(Date.now() - 24*60*60*1000)
            let s_d = d.Format('yyyy-MM-dd')
            client.getUserCumulate(s_d, s_d, (err,res_data) => {
                if(err || !res_data.list || !res_data.list.length ){
                    return reject('未获取到数据')
                }
                return resolve(res_data.list[0].cumulate_user)
            })
        })
    })
}


module.exports = router;

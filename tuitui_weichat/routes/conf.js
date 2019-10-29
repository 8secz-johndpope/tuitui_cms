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
var async = require('async');

router.get('/', async(req, res, next) => {
    let account_id = req.session.account._id;
    console.log(req.session)
    let doc = await ConfigModel.find({account_id}).sort({_id: -1});
    console.log("-------------1222222222222222222222----------------------")
    console.log(doc)
    res.send({code: 1, msg: "查询成功", data: doc, account_id})
});

router.get('/group', async(req, res, next) => {
    let account_id = req.session.account._id;
    let {group = "未分组"} = req.query;
    let doc = await ConfigModel.find({account_id, group}).sort({_id: -1});
    res.send({code: 1, msg: "查询成功", data: doc})
});

router.get('/find_one', async(req, res, next) => {
    let reg = new RegExp(req.query.nick_name), account_id = req.session.account._id;
    let doc = await ConfigModel.find({nick_name: {$regex: reg}, account_id});
    res.send({code: 1, msg: "查询成功", data: doc})
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
    let {id, group, attribute} = req.body;
    let result = await ConfigModel.findByIdAndUpdate(id, {group, attribute}, {new: true});
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

module.exports = router;

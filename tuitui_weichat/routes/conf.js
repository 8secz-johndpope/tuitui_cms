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

router.get('/', async (req, res, next) => {
  let account_id = req.session.account._id;
  let doc = await ConfigModel.find({account_id}).sort({_id: -1})
  res.send({data: doc})
})

router.get('/find_one', async(req, res, next) => {
    let reg = new RegExp(req.query.nick_name), account_id = req.session.account._id;
    let doc = await ConfigModel.find({nick_name: {$regex: reg}, account_id})
    res.send({data: doc})
})

router.get('/del', async(req, res, next) => {
    let id = req.query.id
    var doc = await ConfigModel.findByIdAndRemove(id)
    if (doc) {
        await UserconfModel.remove({code: doc.code})
        await mem.set("configure_" + doc.code, '', 1)
        res.send({success: '删除成功', data: doc})
    } else {
        res.send({err: '删除失败'})
    }
})

router.get('/reset', async(req, res, next) => {
    var config = new ConfigModel()
    config.nextCount(function (err, count) {
        config.resetCount(function (err, nextCount) {
        });
    });
    res.send({success: '重置成功'})
})

router.get('/jieguan', async(req, res, next) => {
    let code = req.query.code
    let jieguan = await mem.get("jieguan_" + code)
    // if (!jieguan) {
        await ConfigModel.findOneAndUpdate({code: code}, {status: -1})
        let client = await WechatUtil.getClient(code)
        async.waterfall([
            function (callback) {
                UserTagModel.remove({code: code}, function (err, doc) {
                    client.getTags(function (err, res) {
                        if (res) {
                            for (let i of res.tags) {
                                if (i.name == "明星说男" || i.name == "明星说女" || i.name == "明星说未知") {
                                    client.deleteTag(i.id, function (error, res) {
                                        console.log(res)
                                    })
                                }
                            }
                            callback(null)
                        } else {
                            callback(null)
                        }
                    })
                })
            }, function (callback) {
                UserconfModel.remove({code: code}, function (err, doc) {
                    OpenidModel.remove({code: code}, function (err, doc) {
                        RecordModel.remove({code: code}, function (err, doc) {
                            callback(null)
                        })
                    })
                })
            }, function (callback) {
                setTimeout(function () {
                    callback(null)
                }, 10 * 1000)
            }, function (callback) {
                client.createTag("明星说未知", async function (err, data) {
                    console.log(err, data, '---------------------data')
                    await UserTagModel.create({id: data.tag.id, name: "未知", code: code, sex: '0'})
                    callback(null)
                })
            }, function (callback) {
                client.createTag("明星说男", async function (err, data) {
                    await UserTagModel.create({id: data.tag.id, name: "男", code: code, sex: '1'})
                    callback(null)
                })
            }, function (callback) {
                client.createTag("明星说女", async function (err, data) {
                    await UserTagModel.create({id: data.tag.id, name: "女", code: code, sex: '2'})
                    callback(null)
                })
            }, function (callback) {
                let cmdStr = 'code=' + code + ' pm2 start /home/work/jieguan_script/script/jieguan.js --name ' + code
                exec(cmdStr, function () {
                })
            }], async function (error) {
            res.send({success: '设置接管成功'})
        })
    // } else {
    //     res.send({success: '已接管'})
    // }
})

module.exports = router;

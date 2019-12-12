var express = require('express');
var router = express.Router();
var ReplyModel = require('../model/Reply');
var ActionModel = require('../model/Action')
var mem = require('../util/mem.js');
var wechat_util = require('../util/get_weichat_client.js');
var multer = require('multer');
var fs = require('fs');

var upload = multer({
    dest: __dirname + '/../public/uploads'
});

router.post('/upload', upload.single('imageFile'), function (req, res, next) {
    fs.rename(req.file.path, __dirname + '/../public/uploads/' + req.file.filename + '.jpg', function (err) {
        if (err) {
            throw err;
        }
        console.log('上传成功!');
    });
    res.send({filename: req.file.filename + '.jpg'});
});

router.get('/', async(req, res, next) => {
    let account_id;
    if (!req.session.account) {
        account_id = req.query.account_id
    } else {
        account_id = req.session.account._id;
    }
    let doc = await ReplyModel.find({account_id});
    if (doc.length > 0) {
        res.send({code: 1, msg: "查询成功", data: doc})
    } else {
        res.send({code: -1, msg: "没有查询到相关数据"})
    }
});

router.post('/create', async(req, res, next) => {
    let account_id;
    if (!req.session.account) {
        account_id = req.body.account_id
    } else {
        account_id = req.session.account._id;
    }
    const {codes, is_nickname, type, text = "", key = "", sex, attribute, replyType, content = "", articles = [], name} = req.body;
    let data = {codes, is_nickname, type, text, key, sex, attribute, replyType, content, articles, account_id, name};
    let doc = await ReplyModel.create(data);
    if (doc) {
        if ((doc.type == 2)) {
            for (let code of doc.codes) {
                await ActionModel.findOneAndUpdate({code: code}, {$addToSet: {actions: 'subscribe'}}, {
                    upsert: true,
                    new: true
                })
            }
        }
        if (doc.type == 0 && doc.text) {
            for (let code of doc.codes) {
                await ActionModel.findOneAndUpdate({code: code}, {$addToSet: {actions: 'text_' + doc.text}}, {
                    upsert: true,
                    new: true
                })
            }
        }
        if ((doc.type == 4)) {
            for (let code of doc.codes) {
                await ActionModel.findOneAndUpdate({code: code}, {$addToSet: {actions: '1'}}, {
                    upsert: true,
                    new: true
                })
            }
        }
        res.send({code: 1, msg: '创建成功', data: doc})
    } else {
        res.send({code: -1, msg: '创建失败'})
    }
});

router.post('/update', async(req, res, next) => {
    const {codes, is_nickname, type, text = "", key = "", url = "", showUrl = "", sex, attribute, replyType, content = "", articles = [], _id, name} = req.body;
    let data = {codes, is_nickname, type, text, key, sex, attribute, replyType, content, articles, name};
    let doc = await ReplyModel.findByIdAndUpdate(_id, data);
    if (doc) {
        let delparam
        if ((doc.type == 2)) {
            delparam = 'subscribe'
        }
        if (doc.type == 0 && doc.text) {
            delparam = 'text_' + doc.text
        }
        if ((doc.type == 4)) {
            delparam = '1'
        }

        for (let code of codes) {
            await ActionModel.findOneAndUpdate({code: code}, {
                $pull: {actions: delparam}
            })
            if ((type == 2)) {
                await ActionModel.findOneAndUpdate({code: code}, {
                    $addToSet: {actions: 'subscribe'}
                }, {
                    upsert: true
                })
            }
            if (type == 0 && text) {
                await ActionModel.findOneAndUpdate({code: code}, {
                    $addToSet: {actions: 'text_' + text}
                }, {
                    upsert: true
                })
            }
            if ((type == 4)) {
                await ActionModel.findOneAndUpdate({code: code}, {
                    $addToSet: {actions: '1'}
                }, {
                    upsert: true
                })
            }
        }
        res.send({code: 1, msg: '修改成功'})
    } else {
        res.send({code: -1, msg: '修改失败'})
    }
});

router.get('/del', async(req, res, next) => {
    let id = req.query._id;
    var doc = await ReplyModel.findByIdAndRemove(id);
    if (doc) {
        for (let code of doc.codes) {
            if ((doc.type == 2)) {
                await ActionModel.findOneAndUpdate({code: code}, {$pull: {actions: 'subscribe'}})
            }
            if (doc.type == 0 && doc.text) {
                await ActionModel.findOneAndUpdate({code: code}, {$pull: {actions: 'text_' + doc.text}})
            }
            if ((doc.type == 4)) {
                await ActionModel.findOneAndUpdate({code: code}, {$pull: {actions: '1'}})
            }
        }
        res.send({code: 1, msg: '删除成功', data: doc})
    } else {
        res.send({code: -1, msg: '删除失败'})
    }
});

router.get('/remove', async(req, res, next) => {
    let account_id;
    if (!req.session.account) {
        account_id = req.query.account_id
    } else {
        account_id = req.session.account._id;
    }
    var docs = await ReplyModel.remove({account_id});
    res.send({code: 1, msg: '删除成功', data: docs})
});


module.exports = router;

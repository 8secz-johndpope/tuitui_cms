var express = require('express');
var router = express.Router();
var ReplyTimeModel = require('../model/ReplyTime');

router.get('/', async (req, res, next) => {
    let account_id, {page = 1} = req.query;
    if (!req.session.account) {
        account_id = req.query.account_id
    } else {
        account_id = req.session.account._id;
    }
    let doc = await ReplyTimeModel.find({account_id}).skip((page - 1) * 10).limit(10).sort({_id: -1});
    let total = await ReplyTimeModel.count({account_id});
    if (doc.length > 0) {
        res.send({code: 1, msg: "查询成功", data: doc, total})
    } else {
        res.send({code: -1, msg: "没有查询到相关数据"})
    }
});

router.post('/create', async (req, res, next) => {
    let account_id;
    if (!req.session.account) {
        account_id = req.body.account_id
    } else {
        account_id = req.session.account._id;
    }
    const {reply_id, is_nickname, content, timing_time, remarks} = req.body;
    let data = {reply_id, is_nickname, content, timing_time, remarks, account_id};
    if (account_id) {
        let doc = await ReplyTimeModel.create(data);
        if (doc) {
            res.send({code: 1, msg: '创建成功', data: doc})
        } else {
            res.send({code: -1, msg: '创建失败'})
        }
    } else {
        res.send({code: -1, msg: '创建失败，用户信息失效'})
    }

});

router.post('/update', async (req, res, next) => {
    const {_id, reply_id, is_nickname, content, timing_time, remarks} = req.body;
    let data = {reply_id, content, is_nickname, timing_time, remarks};
    let doc = await ReplyTimeModel.findByIdAndUpdate(_id, data);
    if (doc) {
        res.send({code: 1, msg: '修改成功'})
    } else {
        res.send({code: -1, msg: '修改失败'})
    }
});

router.get('/del', async (req, res, next) => {
    let id = req.query._id;
    var doc = await ReplyTimeModel.findByIdAndRemove(id);
    if (doc) {
        res.send({code: 1, msg: '删除成功', data: doc})
    } else {
        res.send({code: -1, msg: '删除失败'})
    }
});

router.get('/remove', async (req, res, next) => {
    let account_id;
    if (!req.session.account) {
        account_id = req.query.account_id
    } else {
        account_id = req.session.account._id;
    }
    var docs = await ReplyTimeModel.remove({account_id});
    res.send({code: 1, msg: '删除成功', data: docs})
});


module.exports = router;

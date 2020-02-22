var express = require('express');
var router = express.Router();
var MessageRandomModel = require('../model/MessageRandom');

router.get('/', async (req, res, next) => {
    let account_id;
    if (!req.session.account) {
        account_id = req.query.account_id
    } else {
        account_id = req.session.account._id;
    }
    let doc = await MessageRandomModel.find({account_id});
    if (doc.length > 0) {
        res.send({code: 1, msg: "查询成功", data: doc})
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
    const {message_id, message_array} = req.body;
    let data = {message_id, message_array, account_id};
    console.log(data, typeof data, '------------------')
    console.log(message_array, typeof message_array, '------------------')
    if (account_id) {
        let doc = await MessageRandomModel.create(data);
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
    const {_id, message_id, message_array} = req.body;
    let data = {message_id, message_array};
    let doc = await MessageRandomModel.findByIdAndUpdate(_id, data);
    if (doc) {
        res.send({code: 1, msg: '修改成功'})
    } else {
        res.send({code: -1, msg: '修改失败'})
    }
});

router.get('/del', async (req, res, next) => {
    let id = req.query._id;
    var doc = await MessageRandomModel.findByIdAndRemove(id);
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
    var docs = await MessageRandomModel.remove({account_id});
    res.send({code: 1, msg: '删除成功', data: docs})
});


module.exports = router;

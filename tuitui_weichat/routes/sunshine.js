// 追书云推广链接
const express = require('express');
const router = express.Router();
const SunshineModel = require('../model/Sunshine.js');

router.get('/', async (req, res, next) => {
    let account_id;
    if (!req.session.account) {
      account_id = req.query.account_id;
    } else {
      account_id = req.session.account._id;
    }
    let result = await SunshineModel.find({account_id});
    let domain_name = "https://t.1yuedu.cn";
    if(result.length) {
        res.send({code: 1, msg: "查询成功", data: result, domain_name})
    } else {
        res.send({code: -1, msg: "没有查询到数据", domain_name})
    }
})

router.post("/", async (req, res, next) => {
    let account_id;
    if (!req.session.account) {
      account_id = req.body.account_id;
    } else {
      account_id = req.session.account._id;
    }
    let {gonghao_name, channel_id, tuiguang_link} = req.body;
    if(!gonghao_name || !channel_id || !tuiguang_link) {
        res.send({code: 0, msg: "字段不能为空"})
    } else {
        let result = await SunshineModel.create({gonghao_name, channel_id, tuiguang_link, account_id});
        if(result) {
            res.send({code: 1, msg: "创建成功", data: result})
        } else {
            res.send({code: -1, msg: "创建失败，请重试"})
        }
    }
})

router.put('/', async(req, res, next) => {
    let {gonghao_name, channel_id, tuiguang_link, _id} = req.body;
    if(!gonghao_name || !channel_id || !tuiguang_link) {
        res.send({code: 0, msg: "字段不能为空"})
    } else {
        let result = await SunshineModel.findByIdAndUpdate(_id, {gonghao_name, channel_id, tuiguang_link}, {new: true});
        if(result) {
            res.send({code: 1, msg: "修改成功", data: result})
        } else {
            res.send({code: -1, msg: "修改失败，请重试"})
        }
    }
})

router.delete('/', async(req, res, next) => {
    let {_id} = req.query;
    let result = await SunshineModel.findByIdAndRemove(_id);
    if(result) {
        res.send({code: 1, msg: "删除成功"})
    } else {
        res.send({code: -1, msg: "删除失败，请重试"})
    }
})


module.exports = router;
const express = require('express');
const router = express.Router();
const AdvertiseInfoModel = require('../model/AdvertiseInfo');

router.get('/', async (req, res, next) => {
    let {app_id, page} = req.query;
    let result = await AdvertiseInfoModel.find({app_id: app_id}).skip((page - 1) * 10).limit(10).sort({})
    if (result.length > 0) {
        res.send({code: 1, msg: '查询成功', data: result})
    } else {
        res.send({code: -1, msg: '没有查询到广告主'})
    }
});

module.exports = router;
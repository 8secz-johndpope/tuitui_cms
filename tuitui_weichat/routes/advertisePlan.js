const express = require('express');
const router = express.Router();
const AdvertisePlanModel = require('../model/AdvertisePlan.js');

router.get('/', async (req, res, next) => {
  let { page } = req.query;
  let result = await AdvertisePlanModel.find().skip((page - 1) * 10).limit(10).sort({})
  if(result.length > 0) {
    res.send({code: 1, msg: '查询成功', data: result})
  } else {
    res.send({code: -1, msg: '没有查询到广告计划'})
  }
});

module.exports = router;
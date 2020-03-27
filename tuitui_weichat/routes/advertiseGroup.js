const express = require('express');
const router = express.Router();
const AdvertiseGroupModel = require('../model/AdvertiseGroup.js');

router.get('/', async (req, res, next) => {
  let { page } = req.query;
  let result = await AdvertiseGroupModel.find().skip((page - 1) * 10).limit(10).sort({});
  if(result.length > 0) {
    res.send({code: 1, msg: '查询成功', data: result})
  } else {
    res.send({code: -1, msg: '没有查询到广告计划'})
  }
});

router.get('/create/:index', async (req, res, next) => {
  let {index} = req.params;
  let message = {
    id : index,  // 计划ID
    name : "测试",  // 计划名称
    advertiser_id : index + 250,  // 广告主ID
    campaign_id : index + 520,  // 广告组ID
    status : "投放中",  // 计划投放状态
    delivery_range : "全部",  // 投放范围
    budget_mode : "cpm",  // 广告预算类型
    budget : 1000,  // 广告预算
    bid : 100 + index,  // 广告出价
    ad_create_time : "2020-03-27 10:00:00",  // 计划创建时间
    ad_modify_time : "2020-03-27 10:59:59",  // 计划上次修改时间
    start_time : "2020-03-27 11:00:00",  // 广告投放起始时间
    end_time : "2020-03-27 12:00:00",  // 广告投放结束时间
    external_url : "https://www.baidu.com?index=" + index
  };
  let result = await AdvertiseGroupModel.create(message);
  if(result) {
    res.send({code: 1, msg: '创建成功', data: result})
  } else {
    res.send({code: -1, msg: '创建失败'})
  }
});

module.exports = router;
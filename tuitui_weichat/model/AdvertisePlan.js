var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var AdvertisePlanSchema = new Schema({
    id : Number,  // 计划ID
    name : String,  // 计划名称
    advertiser_id : Number,  // 广告主ID
    campaign_id : Number,  // 广告组ID
    status : String,  // 计划投放状态
    delivery_range : String,  // 投放范围
    budget_mode : String,  // 广告预算类型
    budget : Number,  // 广告预算
    bid : Number,  // 广告出价
    ad_create_time : String,  // 计划创建时间
    ad_modify_time : String,  // 计划上次修改时间
    start_time : String,  // 广告投放起始时间
    end_time : String,  // 广告投放结束时间
    external_url : String,  // 广告落地页链接
});

var AdvertisePlanModel = db.model('AdvertisePlan', AdvertisePlanSchema);
module.exports = AdvertisePlanModel;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var AdvertiseGroupSchema = new Schema({
    id : Number,  // 计划ID
    name : String,  // 计划名称
    budget : Number,  // 广告组预算
    budget_mode : String,  // 广告预算类型
    status : String,  // 广告组状态
    campaign_create_time : String,  // 广告组创建时间
    campaign_modify_time : String,  // 广告组修改时间
});

var AdvertiseGroupModel = db.model('AdvertiseGroup', AdvertiseGroupSchema);
module.exports = AdvertiseGroupModel;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var PlatformSchema = new Schema({
    account_id : String,
    platform: Number,   // 平台名称  1 阅文 2 腾文 3 有书阁
    gonghao_name: String,  // 公号名称,
    seruid: String  // 公号id
});

var PlatformModel = db.model('Platform', PlatformSchema);
module.exports = PlatformModel;

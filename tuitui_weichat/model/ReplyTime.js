var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var ReplyTimeSchema = new Schema({
    account_id : String,
    reply_id : String,
    is_nickname: Boolean,
    content: String, // 文本消息
    timing_time: Date,
});

var ReplyTimeModel = db.model('ReplyTime', ReplyTimeSchema);
module.exports = ReplyTimeModel;
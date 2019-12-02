var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var TemplateMsgSchema = new Schema({
    account_id: String,
    code: Number,
    confName: String,
    name: String,
    templateId: String,
    templateName: String,
    url: String,
    content: Object,
    sex: {type: String, default: 'all'},// 0未知 1男 2女 all全部
    is_timing: Boolean,
    timing_time: Date,
    status: {type: Number, default: 0},//1正在发送，2超过次数限制，3发送完成
    sendAt: Number,
    errAt: Number,
    openid: String,
    count: {type: Number, default: 0}
});

var TemplateMsgModel = db.model('TemplateMsg', TemplateMsgSchema);
module.exports = TemplateMsgModel;


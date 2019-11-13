var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var TextMaterialSchema = new Schema({
    account_id: String,
    code: Number,
    content: String, // 文本内容
    tagId: Number, // 粉丝属性
    is_timing: { // 是否定时
        type: Boolean,
        default: false
    },
    timing_time: { // 定时时间
        type: String,
        default: ""
    },
    msg_id: {  // 素材msg_id
        type: String,
        default: ""
    },
    isSend: {  // 0 未发送 1 已发送
        type: Number,
        default: 0
    }
});

var TextMaterialModel = db.model('TextMaterial', TextMaterialSchema);
module.exports = TextMaterialModel;

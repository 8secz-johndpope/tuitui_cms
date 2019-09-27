var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var ReplySchema = new Schema({
    account_id : String,
    codes: Array,
    name: String,
    type: Number, //事件类型:0文本 1点击 2关注 3location 4自动回复
    text: String, //请求发送的文字
    key: String, //请求点击的key
    sex: {type: Number, default: 0}, //0未知 1男 2女 3全部
    attribute: Number, //1男 2女
    replyType: Number,  //0文字 1图文
    content: String, // 文本消息
    articles: [{  // 图文消息
        title:String,
        description:String,
        url:String,
        picurl:String
    }]
});

var ReplyModel = db.model('Reply', ReplySchema);
module.exports = ReplyModel;
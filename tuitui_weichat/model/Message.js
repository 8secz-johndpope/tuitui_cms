var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var MessageSchema = new Schema({
    account_id: String,
    task: Boolean,
    group: {
        type: String,
        default: "未分组"
    },
    sex: String,//0未知 1男 2 女
    type: Number,//0链接 1文本 2 图片 3
    action_type: {type: Number, default: 0},
    img: String,
    url: String,
    isHour: { // 0 分钟 1 小时
        type: Number,
        default: 0
    },
    title: String,
    delay: Number,
    des: String,
    is_timing: Boolean,
    timing_time: Date,
    is_daily: {type: Boolean, default: false},
    daily_time: Number,
    time: String,
    tagId: Number,
    mediaId: {type: String, default: ''},
    contents: [{
        title: String,
        description: String,
        url: String,
        picurl: String,
        local_picurl: {
            type: String,
            default: ""
        },
    }],
    codes: [Number],
    gonghaoList: [{
        code: Number,
        nick_name: String
    }],
    remarks: {
        type: String,
        default: ""
    },
    sendAt: Number,
    count: {type: Number, default: 0},
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: {createdAt: 'createAt', updatedAt: 'updateAt'}
});

MessageSchema.statics = {
    fetch(id, codes, cb) {
        if (id) {
            return this.find({_id: {$lt: id}, code: {$in: codes}})
                .limit(50)
                .sort({'_id': -1})
                .exec(cb);
        } else {
            return this.find({code: {$in: codes}})
                .limit(50)
                .sort({'_id': -1})
                .exec(cb);
        }

    }
}

var MessageModel = db.model('Message', MessageSchema);

module.exports = MessageModel;
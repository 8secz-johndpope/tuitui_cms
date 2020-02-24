var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var MessageRandomSchema = new Schema({
    account_id: String,
    message_id: String,
    local_urls: {type: Array, default: []},
    message_array: [{
        type: {
            type: Number
        },//0链接 1文本 2 图片 3
        contents: [{
            title: String,
            description: String,
            url: String,
            picurl: String,
            local_picurl: {
                type: String,
                default: ""
            }
        }]
    }],
    remarks: {
        type: String,
        default: ""
    },
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

var MessageRandomModel = db.model('MessageRandom', MessageRandomSchema);

module.exports = MessageRandomModel;
var mongoose = require('mongoose');
//mongoose.set('debug', true);
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var UserinfoSchema = new Schema({
    openid: String,
    code: Number,
    nickname: String,
    sex: {type: String, default: "0"},
    province: String,
    city: String,
    country: String,
    headimgurl: String,
    action_time: Number,
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

var UserinfoModel = db.model('Userinfo', UserinfoSchema);

module.exports = UserinfoModel;
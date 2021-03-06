var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var AccountSchema = new Schema({
    username : String,
    password : String,
    remarks : {
        type: String,
        default: "默认为本公司使用"
    },
    role : Number,//0 超级权限  1 1级代理  2  公众号矩阵
    power : {
        type: Number,//0 无测试权限  1 有
        default: 0
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    },
    loginAt : Date,
    childAccount : []
});

var AccountModel = db.model('Account', AccountSchema);
module.exports = AccountModel;

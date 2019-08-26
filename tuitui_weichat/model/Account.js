var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var AccountSchema = new Schema({
    username : String,
    password : String,
    role : Number,//0 超级权限  1 1级代理  2  公众号矩阵  
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

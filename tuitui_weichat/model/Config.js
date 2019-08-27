var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var ConfigSchema = new Schema({
    account_id : String,
    appid: String,
    authorizer_access_token: String,
    expires_in: Number,
    refresh_token: String,
    func_info: String,
    nick_name: String,
    qrcode_url: String,
    user_name: String,//原始id
    service_type_info_id: Number,//授权方公众号类型，0代表订阅号，1代表由历史老帐号升级后的订阅号，2代表服务号
    verify_type_info_id: Number,//授权方认证类型，-1代表未认证，0代表微信认证，1代表新浪微博认证，2代表腾讯微博认证，3代表已资质认证通过但还未通过名称认证，4代表已资质认证通过、还未通过名称认证，但通过了新浪微博认证，5代表已资质认证通过、还未通过名称认证，但通过了腾讯微博认证
    status: {type: Number, default: -2},  // -2未接管,-1接管中,1已接管
    group: {type: String, default: ""},
    attribute: {type: Number, default: 0}, //0 未知,1 男,2 女
    save_user: {type: Boolean, default: true},
    real_time: {type: Boolean, default: false},
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
})

ConfigSchema.plugin(autoIncrement.plugin, {
    model: 'Config',
    field: 'code',
    startAt: 10000000000,
    incrementBy: 1
});

var ConfigModel = db.model('Config', ConfigSchema);
module.exports = ConfigModel;


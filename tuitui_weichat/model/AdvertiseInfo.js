var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var AdvertiseInfoSchema = new Schema({
    app_id: String,
    id: Number,
    name: String,
    description: String,
    email: String,
    contacter: String,
    phonenumber: String,
    role: String,
    status: String,
    telephone: String,
    address: String,
    license_url: String,
    license_no: String,
    license_province: String,
    license_city: String,
    company: String,
    brand: String,
    promotion_area: String,
    promotion_center_province: String,
    promotion_center_city: String,
    first_industry_name: String,
    second_industry_name: String,
    reason: String,
    balance: Number,
    create_time: String,
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

var AdvertiseInfoModel = db.model('AdvertiseInfo', AdvertiseInfoSchema);

module.exports = AdvertiseInfoModel;
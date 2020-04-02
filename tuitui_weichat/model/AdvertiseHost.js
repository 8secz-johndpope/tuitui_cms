var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var AdvertiseHostSchema = new Schema({
    advertiser_id : Number  // 广告主ID
});

var AdvertiseHostModel = db.model('AdvertiseHost', AdvertiseHostSchema);
module.exports = AdvertiseHostModel;

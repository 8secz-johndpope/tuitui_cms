var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var PlatformManageSchema = new Schema({
    platform: Number,
    name: String
});

var PlatformManageModel = db.model('PlatformManage', PlatformManageSchema);
module.exports = PlatformManageModel;

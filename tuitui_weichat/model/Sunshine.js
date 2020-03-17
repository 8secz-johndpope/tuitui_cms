var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var SunshineSchema = new Schema({
  account_id : String,
  gonghao_name: String,
  tuiguang_link: String
});

var SunshineModel = db.model('Sunshine', SunshineSchema);
module.exports = SunshineModel;

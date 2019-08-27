var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var TuiguangTagSchema = new Schema({
  name:{ type: String, required: true },
  account_id: String
});

var TuiguangTagModel = db.model('TuiguangTag', TuiguangTagSchema);
module.exports = TuiguangTagModel;


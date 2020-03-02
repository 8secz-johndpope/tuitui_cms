var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var TuiGuangSchema = new Schema({
  account_id : String,
  type: Number,
  id: String,
  gonghao_id: String,
  pageTitle: String,
  name: String,
  picurl: String,
  picurl_ali: {
    type : String,
    default : ""
  },
  capter: String,
  remarks: String,
  company: String,
  finalImg: {
    type: String,
    default: ""
  },
  finalImg_ali: {
    type : String,
    default : ""
  },
  gonghaoLogo: String,
  domain_name: {
    type: String,
    default: "https://td.tyuss.com"
  },
  suffix : String,
  zIndex: {
    type: Number,
    default: 0
  },
  bgcolor: {type: String, default: "#fff"}
});

var TuiGuangModel = db.model('TuiGuang', TuiGuangSchema);
module.exports = TuiGuangModel;

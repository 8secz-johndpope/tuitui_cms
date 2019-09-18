var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var TemplateMsgSchema = new Schema({
    account_id : String,
    code : Number,
    confName:String,
    name:String,
    templateId: String,
    templateName: String,
    url: String,
    content: Object
});

var TemplateMsgModel = db.model('TemplateMsg', TemplateMsgSchema);
module.exports = TemplateMsgModel;


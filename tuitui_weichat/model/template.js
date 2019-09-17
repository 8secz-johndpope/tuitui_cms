var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var TemplateSchema = new Schema({
    code : Number,
    templateId: String,
    url: String,
    content: String,
    sendAt: Date
});

var TemplateModel = db.model('Template', TemplateSchema);
module.exports = TemplateModel;


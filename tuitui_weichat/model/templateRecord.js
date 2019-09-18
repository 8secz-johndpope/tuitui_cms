var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var TemplateRecordSchema = new Schema({
    account_id : String,
    code : Number,
    templateId: String,
    url: String,
    content: Object,
    sendAt: {
        type: Date,
        default: Date.now
    }
});

var TemplateRecordModel = db.model('TemplateRecord', TemplateRecordSchema);
module.exports = TemplateRecordModel;


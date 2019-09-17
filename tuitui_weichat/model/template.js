var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var TemplateSchema = new Schema({
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

var TemplateModel = db.model('Template', TemplateSchema);
module.exports = TemplateModel;


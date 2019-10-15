var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var MessageGroupSchema = new Schema({
    group : String,
});

var MessageGroupModel = db.model('MessageGroup', MessageGroupSchema);
module.exports = MessageGroupModel;

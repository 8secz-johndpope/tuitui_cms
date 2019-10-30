var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var ActionSchema = new Schema({
    code: Number,
    actions: Array
});

var ActionModel = db.model('Action', ActionSchema);

module.exports = ActionModel;
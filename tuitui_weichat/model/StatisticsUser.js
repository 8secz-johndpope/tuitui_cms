var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var StatisticsUserSchema = new Schema({
    code: Number,
    todayCount: Number,
    yesterdayCount: Number,
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

var StatisticsUserModel = db.model('StatisticsUser', StatisticsUserSchema);
module.exports = StatisticsUserModel;

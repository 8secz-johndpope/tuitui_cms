var mongoose = require('mongoose');
//mongoose.set('debug', true);
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var UserinfoSchema = new Schema({
    openid: String,
    code: Number,
    nickname: String,
    sex: {type: String, default: "0"},
    province: String,
    city: String,
    country: String,
    headimgurl: String,
    action_time: Number,
});

UserinfoSchema.statics = {
    fetch(id, sex, tagId, codes, cb) {
        let sql = {
            // subscribe_flag: true,
            //$or: [{send_time: {$lt: Date.now() - 2 * 3600 * 1000}}, {send_time: 0},{send_time:{$exists:false}}],
            code: {$in: codes},
            action_time: {$gt: Date.now() - 48 * 3600 * 1000}
        }
        if (sex && sex != 'all') {
            sql.sex = sex
        }
        if (tagId) {
            sql.tagIds = {$elemMatch: {$eq: tagId}}
        }
        if (id) {
            sql._id = {$lt: id}
        }

        console.log(sql,'--------------------sql')
        return this.find(sql)
            .limit(50)
            .sort({'_id': -1})
            .exec(cb);
    }
}


var UserinfoModel = db.model('Userinfo', UserinfoSchema);

module.exports = UserinfoModel;
var wechat_util = require('../util/get_weichat_client.js')
var UserTagModel = require('../model/UserTag')
var SubOpenidSexModel = require('../model/SubOpenidSex');
var ConfigModel = require('../model/Config');

function update_tag(_id, code, tagId, sex) {
    SubOpenidSexModel.fetchTag(_id, code, sex, async function (error, users) {
        var user_arr = [];
        users.forEach(function (user) {
            user_arr.push(user.openid)
        })
        let client = await wechat_util.getClient(code)
        if (user_arr.length == 0) {
            console.log(user_arr, '-------------------user null')
            return
        } else {
            client.membersBatchtagging(tagId, user_arr, async function (error, res) {
                console.log(res)
                if(res.errcode == 45009){
                    let conf = await ConfigModel.findOne({code: code})
                    let appid = conf.appid
                    client.clearQuota(appid, function (err, data) {
                        console.log(err, data, '------------------------------')
                        console.log('clearQuota end')
                        update_tag(users[0]._id, code, tagId, sex)
                    })
                }else{
                    if (users.length == 50) {
                        setTimeout(function() {
                            update_tag(users[49]._id, code, tagId, sex)
                        },200)
                    } else {
                        console.log('.........end...........')
                        return
                    }
                }
            })
        }
    })
}

async function getTag() {
    let code = process.argv.slice(2)[0]
    UserTagModel.find({code: code}, function (err, data) {
        for (let i of data) {
            let sex = "0"
            if (i.name == "男") {
                sex = "1"
            } else if (i.name == "女") {
                sex = "2"
            }
            update_tag(null, code, i.id, sex)
        }
    })
}

getTag()

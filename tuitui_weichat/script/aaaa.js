var ReplyModel = require('../model/Reply');
var ReplyTimeModel = require('../model/ReplyTime');
// var UserTagModel = require('../model/UserTag')
// var wechat_util = require('../util/get_weichat_client.js')
var UserconfModel = require('../model/Userconf');
// var OpenidModel = require('../model/Openid');
// var OpenidTagModel = require('../model/OpenidTag');
// var SubOpenidTagModel = require('../model/SubOpenidTag');
const MessageModel = require("../model/Message")
const MessageRandomModel = require("../model/MessageRandom")
var account = require('../model/Account')

async function a() {
    let code = process.argv.slice(2)[0]
    // let user = await UserconfModel.count({code: code})
    // console.log(user, '-----------------user')
    // let OpenidTag = await OpenidTagModel.count({code: code})
    // console.log(OpenidTag, '--------------OpenidTag')
    // let SubOpenidTag = await SubOpenidTagModel.count({code: code})
    // console.log(SubOpenidTag, '-----------------SubOpenidTag')
    // let client = await wechat_util.getClient(code)

    // let LocalDate = new Date(new Date().toLocaleDateString()).getTime()
    // let yDate = new Date(new Date().toLocaleDateString()).getTime() - 24*3600*1000
    // let yyDate = new Date(new Date().toLocaleDateString()).getTime() - 48*3600*1000
    // let a = await UserconfModel.count({code:code,subscribe_flag: {$ne: false},action_time:{$gte:yyDate,$lt:yDate}})
    // console.log(a,'----------------------')
    // let b = await UserconfModel.count({code:code,subscribe_flag: {$ne: false},action_time:{$gte:yDate,$lt:LocalDate}})
    // console.log(b,'----------------------')
    let c = await MessageRandomModel.find({})
    console.log(JSON.stringify(c),'---------------')
    // let d = await account.findById('5dedbac43c67d104222f4c82')
    // console.log(d.password,'------------------d')

    // await ConfigModel.update({code: code}, {status: -2})
    //
    // let result = await UserconfModel.remove({code:code})
    // console.log(result,'---result')
    // await UserTagModel.remove({code:code})
    // await UserTagModel.create({id: 106, name: "未知", code: code})
    // await UserTagModel.create({id: 107, name: "男", code: code})
    // await UserTagModel.create({id: 108, name: "女", code: code})
    // client.deleteTag(100, function (error, res) {
    //     console.log(res)
    // })
    // client.deleteTag(101, function (error, res) {
    //     console.log(res)
    // })
    // client.deleteTag(102, function (error, res) {
    //     console.log(res)
    // })
    // client.createTag("明星说未知", async function (err, data) {
    //     await UserTagModel.create({id: data.tag.id, name: "未知", code: code, sex: '0'})
    // })
    // client.createTag("明星说男", async function (err, data) {
    //     await UserTagModel.create({id: data.tag.id, name: "男", code: code, sex: '1'})
    // })
    // client.createTag("明星说女", async function (err, data) {
    //     await UserTagModel.create({id: data.tag.id, name: "女", code: code, sex: '2'})
    // })

    // let openid = await OpenidModel.count({code:code})
    // console.log(openid,'--------------openid')
    // let user = await UserconfModel.count({code:code})
    // console.log(user,'-----------------user')
    // client.getTags(function (err,data) {
    //     console.log(data,'-----------------aaa')
    // })
    // client.createTag("明星说女", async function (err, data) {
    //     console.log(data, '-----------------data')
    //     await UserTagModel.create({id: data.tag.id, name: "女", code: code})
    //     client.getTags(function (err, data1) {
    //         console.log(data1, '-----------------data1')
    //     })
    // })
}
a()
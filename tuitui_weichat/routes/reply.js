var express = require('express');
var router = express.Router();
var ReplyModel = require('../model/Reply');
var mem = require('../util/mem.js');
var wechat_util = require('../util/get_weichat_client.js')
var multer = require('multer');
var fs = require('fs')

var upload = multer({
    dest: __dirname + '/../public/uploads'
});

router.post('/upload', upload.single('imageFile'), function (req, res, next) {
    fs.rename(req.file.path, __dirname + '/../public/uploads/' + req.file.filename + '.jpg', function (err) {
        if (err) {
            throw err;
        }
        console.log('上传成功!');
    })
    res.send({filename: req.file.filename + '.jpg'});
})

router.get('/', async(req, res, next) => {
    let account_id = req.session.account._id;
    let code = req.query.code
    let doc = await ReplyModel.find({code:code, account_id})
    res.send({data: doc})
})

router.post('/create', async(req, res, next) => {
    let account_id = req.session.account._id;
    const {code, type, text = "", key = "", url = "", showUrl = "", sex, attribute, replyType, content = "", articles = []} = req.body;
    if (replyType === 1 && url) {
        let media = await uploadImg(code);
        if(media) {
            let data = {code, type, text, key, url, showUrl, sex, attribute, replyType, content, articles, account_id, media};
            console.log(data,'---------------------data');
            let doc = await ReplyModel.create(data);
            if (doc) {
                await setMem1(doc);
                res.send({success: '创建成功', data: doc})
            } else {
                res.send({err: '创建失败'})
            }
        } else {
            res.send({err: '创建失败,没有获取到mediaId'})
        }
    } else {
        let data = {code, type, text, key, url, showUrl, sex, attribute, replyType, content, articles, account_id};
        let doc = await ReplyModel.create(data);
        if (doc) {
            await setMem1(doc);
            res.send({success: '创建成功', data: doc})
        } else {
            res.send({err: '创建失败'})
        }
    }
});

router.post('/update', async(req, res, next) => {
    const {code, type, text = "", key = "", url = "", showUrl = "", sex, attribute, replyType, content = "", articles = [], id} = req.body;
    if (replyType === 1 && url) {
        let media = await uploadImg(code);
        if(media) {
            let data = {code, type, text, key, url, showUrl, sex, attribute, replyType, content, articles, media};
            console.log(data,'---------------------data');
            let doc = await ReplyModel.findByIdAndUpdate(id, data, {new: true})
            if (doc) {
                await setMem (doc);
                res.send({success: '修改成功', data: doc})
            } else {
                res.send({err: '修改失败'})
            }
        } else {
            res.send({err: '修改失败,没有获取到mediaId'})
        }
    } else {
        let data = {code, type, text, key, url, showUrl, sex, attribute, replyType, content, articles};
        let doc = await ReplyModel.findByIdAndUpdate(id, data, {new: true});
        console.log(doc);
        if (doc) {
            console.log(replyType, doc.code, doc.text, doc.key, '---------------------ttttttttt');
            await setMem (doc);
            res.send({success: '修改成功', data: doc})
        } else {
            res.send({err: '修改失败'})
        }
    }
});

router.get('/del', async(req, res, next) => {
    let id = req.query.id;
    var doc = await ReplyModel.findByIdAndRemove(id);
    if (doc) {
         var content = await mem.get("reply_" + doc.code + "_" +  'subscribe');
        if (doc.text) {
            await mem.set("reply_" + doc.code + "_" + doc.text, '', 1);
            await mem.set("reply_" + doc.code + "_" +  'subscribe', '', 1);
            await mem.set("reply_" + doc.code + "_" +  'click', '', 1)
          } else if (doc.key) {
            await mem.set("reply_" + doc.code + "_" + doc.key, '', 1);
            await mem.set("reply_" + doc.code + "_" +  'subscribe', '', 1);
            await mem.set("reply_" + doc.code + "_" +  'click', '', 1)
        }
        res.send({success: '删除成功', data: doc})
    } else {
        res.send({err: '删除失败'})
    }
});

router.get('/remove', async(req, res, next) => {
    let account_id = req.session.account._id;
    var docs = await ReplyModel.remove({account_id})
  res.send({success: '删除成功', data: docs})
});

// update
async function setMem (doc) {
    if (doc.text) {
        await mem.set("reply_" + doc.code + "_" + doc.text, {type:0,msg:doc.msgId}, 30)
        await mem.set("reply_" + doc.code + "_" +  'subscribe', '', 1)
        await mem.set("reply_" + doc.code + "_" +  'click', '', 1)
    } else if (doc.key) {
        await mem.set("reply_" + doc.code + "_" + doc.key, {type:0,msg:doc.msgId}, 30)
        await mem.set("reply_" + doc.code + "_" +  'subscribe', '', 1)
        await mem.set("reply_" + doc.code + "_" +  'click', '', 1)
    } else {
        await mem.set("reply_" + doc.code + "_subscribe", {type:0,msg:doc.msgId}, 30)
        await mem.set("reply_" + doc.code + "_" +  'subscribe', '', 1)
        await mem.set("reply_" + doc.code + "_" +  'click', '', 1)
    }
}

// create
async function setMem1(doc) {
    if (doc.text) {
        await mem.set("reply_" + doc.code + "_" + doc.text, {type: 1, msg: doc.media}, 30)
    } else if (doc.key) {
        await mem.set("reply_" + doc.code + "_" + doc.key, {type:1,msg:doc.media}, 30)
    } else {
        await mem.set("reply_" + doc.code + "_subscribe", {type:1,msg:doc.media}, 30)
    }
}

async function uploadImg (code) {
    let client = await wechat_util.getClient(code);
    return new Promise((resolve, reject) => {
        client.uploadImageMaterial( __dirname + "/." + req.body.url, async function (error, result) {
            console.log(error,result,'---------------------result')
            if (result) {
                let media = {
                    type: "image",
                    content: {
                        mediaId: result.media_id
                    }
                };
                resolve(media);
            } else {
                reject(error);
            }
        });
    })
}

module.exports = router;

var MaterialModel = require('../model/Material');
var async = require('async');
var weichat_util = require('../util/get_weichat_client.js')
var request = require('request');
var fs = require('fs');

async function get_aterials(code) {
    console.log('-------执行 get_aterials 方法-------')
    var api = await weichat_util.getClient(code);
    await api.getMaterialCount(async (err, result, res) => {
        console.log('----------- get_aterials-----------')
        console.log(err, result)
        for( key in result) {
            let num = Math.ceil(result[key]/20)
            for(let i = 0; i < num; i ++) {
              if(key.split('_')[0] == 'news') {
                await getMaterial(code, api, key.split('_')[0], i)
              }
            }
        }
    })
}

async function getMaterial(code, client, type, offset) {
    await client.getMaterials(type, offset, 20, (err, result, res) => {
        // result = JSON.parse(JSON.stringify(result))
        console.log(result.item, "========================================2019-12-19========================================")
        let data = result.item
        for(let j = 0; j < data.length; j ++) {
            data[j].type = type.split('_')[0];
            data[j].code = code;
            if(data[j].content.news_item.length && data[j].content.news_item[0] && data[j].content.news_item[0]!='null'){
                console.log('----------',j,'-------------')
                console.log(data[j].content.news_item.length)
                // console.log(data[j].content.news_item[0])
                async.map(data[j].content.news_item,async function(item) {
                    if(item.thumb_url){
                        let path = await handleImage(item.thumb_url);
                        item.local_img_path = path.split('/public')[1]; 
                        if(!item.thumb_media_id) {
                            await client.uploadMaterial(path, "image", (error, doc) => {
                                console.log(error, "------------------2020-01-02--error--------------------------")
                                console.log(doc, "------------------2020-01-02----------------------------")
                                item.thumb_media_id = doc.media_id;
                            })
                        }
                    }
                    console.log(item, "=================2020-01-02  item==================================")
                    return item
                },async (error,results) => {
                        if(error){
                            console.error(error)
                        }
                        data[j].content.news_item = results
                        //console.log("---------------------start----------------------------")
                        //console.log(data[j].content.news_item)
                        //console.log("--------------------end-----------------------------")
                        await MaterialModel.findOneAndUpdate({media_id: data[j].media_id}, data[j], {new: true, upsert: true})
                    });
            }
        }
        // if(docs) {
        //     return docs
        // } else {
        //     console.log('获取素材出错')
        // }
    });
}

function handleImage(thumb_url){
    return new Promise((resolve,reject)=>{
        //console.log('-------download file---------')
        let path = __dirname + '/../public/uploads/wechat/material/' + Date.now() + Math.floor(Math.random() * 100000 + 1) + Math.floor(Math.random() * 10 + 1) + '.jpg';
        let writeStream = fs.createWriteStream(path);
        let readStream = request(thumb_url);
        readStream.pipe(writeStream);
        readStream.on('end', function(response) {
            //console.log('文件写入成功');
            writeStream.end();
            resolve(path)
        });

        writeStream.on("finish", function() {
            // console.log("ok");
        });
    })
}

module.exports.get_aterials = get_aterials;

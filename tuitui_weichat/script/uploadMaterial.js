const weichat_util = require('../util/get_weichat_client.js');
var fs = require('fs');
var request = require('request');
var async = require("async");

async function uploadNews(code, messages) {
  return new Promise(function (resolve, reject) {
    async.map(messages,async function(item){
      //console.log("---------item.thumb_url----------------")
      //console.log(item.thumb_url)
      let path = await handleImage(item.thumb_url);
      item.thumb_media_id = await uploadImage(path, code);
      
      return {
        "title": item.title,
        "thumb_media_id": item.thumb_media_id,
        "author": item.author,
        "digest": item.digest,
        "show_cover_pic": item.show_cover_pic,
        "content": item.content,
        "content_source_url": item.content_source_url,
        "need_open_comment": item.need_open_comment,
        "only_fans_can_comment": item.only_fans_can_comment,
        "local_img_path": path.split('/public')[1]
      } 

    },(err,results) => {
      if(err){
        console.error(err)
      }
      //console.log(results)
      resolve(results);
    })
  })
}

function handleImage(thumb_url){
  return new Promise((resolve,reject)=>{
      //console.log('-------download file---------')
      let path = __dirname + '/../public/uploads/wechat/material/' + Date.now() + Math.floor(Math.random() * 100000 + 1) + '.jpg';
      let writeStream = fs.createWriteStream(path);
      let readStream = request(thumb_url)
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

function uploadImage(url, code) {
  return new Promise((resolve, reject) => {
    //console.log('-------upload file---------')
    weichat_util.getClient(code).then(function(api){
      api.uploadThumbMaterial(url, function (error, result) {
        if(error) reject(error);
        //console.log('上传文件成功')
        resolve(result.media_id);
      });
    });
  })
}

module.exports = {uploadNews};
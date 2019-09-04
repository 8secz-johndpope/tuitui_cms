const weichat_util = require('../util/get_weichat_client.js');
var fs = require('fs');
var request = require('request');

async function uploadNews(code, messages) {
  return new Promise(function (resolve, reject) {
    let articles = messages.map((item, index) => {
      let url = __dirname + '/../public/uploads/' + Date.now() + index + Math.floor(Math.random() * 10000 + 1) + 'aaa.jpg';
      let writeStream = fs.createWriteStream(url)
      let readStream = request(item.thumb_url)
      readStream.pipe(writeStream);
      readStream.on('end', async function(response) {
        // console.log('文件写入成功');
        item.thumb_media_id = await uploadImage(url, code);
        writeStream.end();
      });

      writeStream.on("finish", function() {
        // console.log("ok");
      });
      return {
        "title": encodeURIComponent(item.title),
        "thumb_media_id": item.thumb_media_id,
        "author": encodeURIComponent(item.author),
        "digest": encodeURIComponent(item.digest),
        "show_cover_pic": item.show_cover_pic,
        "content": encodeURIComponent(item.content),
        "content_source_url": encodeURIComponent(item.content_source_url),
        "need_open_comment": item.need_open_comment,
        "only_fans_can_comment": item.only_fans_can_comment
      }
    });
    resolve(articles);
  })
}

function uploadImage(url, code) {
  return new Promise((resolve, reject) => {
    weichat_util.getClient(code).then(function(api){
      api.uploadThumbMaterial(url, function (error, result) {
        if(error) reject(error);
        resolve(result.media_id);
      });
    });
  })
}

module.exports = {uploadNews};
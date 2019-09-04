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
        console.log('文件写入成功');
        item.thumb_media_id = await uploadImage(url, code);
        console.log(url)
        console.log(item.thumb_media_id)
        writeStream.end();
      });

      writeStream.on("finish", function() {
        console.log("ok");
      });
      return {
        "title": item.title,
        "thumb_media_id": item.thumb_media_id,
        "author": item.author,
        "digest": item.digest,
        "show_cover_pic": item.show_cover_pic,
        "content": item.content,
        "content_source_url": item.content_source_url,
        "need_open_comment": item.need_open_comment,
        "only_fans_can_comment": item.only_fans_can_comment
      }
    });
    resolve(articles);
  })
}

async function uploadImage(url, code) {
  return new Promise(async (resolve, reject) => {
    var api = await weichat_util.getClient(code);
    api.uploadImageMaterial(url, async function (error, result) {
      if(error) reject(error);
      resolve(result.media_id);
    });
  })
}

module.exports = {uploadNews};
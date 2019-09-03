const weichat_util = require('../util/get_weichat_client.js');
var fs = require('fs');
var request = require('request');

async function uploadNews(code, messages) {
  return new Promise(function (resolve, reject) {
    let articles = messages.map(item => {
      let url = __dirname + '/../public/uploads/' + Date.now() + 'aaa.jpg';
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
      return item
    });
    resolve(articles);
  })
}

async function uploadImage(url, code) {
  return new Promise(async (resolve, reject) => {
    var api = await weichat_util.getClient(code);
    api.uploadImage(url, async function (error, result) {
      if(error) reject(error);
      console.log('----------image------------')
      console.log(result)
      resolve(result.media_id);
    });
  })
}

module.exports = {uploadNews};
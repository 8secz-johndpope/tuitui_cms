const weichat_util = require('../util/get_weichat_client.js');
var fs = require('fs');
var request = require('request');

async function uploadNews(code, messages) {
  return new Promise(async (resolve, reject) => {
    let articles = await messages.map(async item => {
      let url = __dirname + '/../public/uploads/' + Date.now() + 'aaa.jpg';
      let writeStream = fs.createWriteStream(url)
      let readStream = request(item.thumb_url)
      readStream.pipe(writeStream);
      readStream.on('end', async function(response) {
        console.log('文件写入成功', response);
        item.thumb_media_id = await uploadImage(url, code);
        writeStream.end();
      });

      writeStream.on("finish", function() {
        console.log("ok");
      });
      console.log(item.thumb_media_id, 1111111111111111111111111111111111111)
    });
    resolve({articles});
  })
}

async function uploadImage(url, code) {
  return new Promise(async (resolve, reject) => {
    var api = await weichat_util.getClient(code);
    api.uploadImageMaterial(url, async function (error, result) {
      console.log(error,result,'---------------------result1111111');
      if(error) reject(error);
      resolve(result.media_id);
    });
  })
}

module.exports = {uploadNews};
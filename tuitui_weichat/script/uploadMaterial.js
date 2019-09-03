const weichat_util = require('../util/get_weichat_client.js');
var fs = require('fs');
var request = require('request');

async function uploadNews(code, messages) {
  return new Promise(async (resolve, reject) => {
    let articles = await messages.map(async item => {
      let aaa = request(item.thumb_url).pipe(fs.createWriteStream('./' + Date.now() + '.jpg'));
      // item.thumb_media_id = await uploadImage(item.thumb_url, code)
      console.log(aaa)
    });
    let news = {articles};
    resolve(news);
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
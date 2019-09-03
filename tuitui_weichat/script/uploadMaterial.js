const weichat_util = require('../util/get_weichat_client.js')

async function uploadNews(code, articles) {
  return new Promise(async (resolve, reject) => {
    let articles = await articles.map(async item => {
      item.thumb_media_id = await uploadImage(item.thumb_url, code)
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

module.exports = {uploadMaterial};
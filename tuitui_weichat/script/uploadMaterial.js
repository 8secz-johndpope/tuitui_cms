const weichat_util = require('../util/get_weichat_client.js')

async function uploadMaterial(code) {
  var api = await weichat_util.getClient(code);
}

module.exports = {uploadMaterial};
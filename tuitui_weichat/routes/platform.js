var express = require('express');
var router = express.Router();
var rp = require("request-promise")

router.post('/liantiao', async (req, res, next) => {
  let {td_url} = req.body;
 console.log(td_url, "2020-02-16,td_url")

  let ad_cb_url = 'https://ad.toutiao.com/track/activate/?link='
       +encodeURIComponent(td_url)+'&event_type=2'
 console.log(ad_cb_url, "2020-02-16,ad_cb_url")

 let result = await rp(ad_cb_url);
 console.log(result, "2020-02-16,result")
 res.send({code: 1, result, msg: "已回调"})
})

module.exports = router;
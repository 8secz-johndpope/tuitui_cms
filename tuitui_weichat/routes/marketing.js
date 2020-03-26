const express = require('express');
const router = express.Router();
const MarketingModel = require('../model/Marketing')
const request = require("request");
const mem = require('../util/mem.js');

router.get('/auth', async (req, res, next) => {
    let {app_id, auth_code, state} = req.query
        , secret = state
    request({
        url: "https://ad.oceanengine.com/open_api/oauth2/access_token/",
        method: "post",
        qs: {app_id: app_id, secret: secret, grant_type: 'auth_code', auth_code: auth_code},
        json: true
    }, async (err, res) => {
        if (res.code == 0) {
            await mem.set('marketing_access_token_' + app_id, res.data.access_token, 24 * 3600)
            await MarketingModel.update({app_id: app_id}, {
                app_id: app_id,
                advertiser_ids: res.data.advertiser_ids,
                secret: secret,
                access_token: res.data.access_token,
                expires_in: res.data.expires_in,
                refresh_token: res.data.refresh_token,
                refresh_token_expires_in: res.data.refresh_token_expires_in,
                refresh_type: 1,
                refresh_time: Date.now()
            }, {upsert: true})
            res.send('success')
        } else {
            res.send('false------', res.message)
        }
    })
})

module.exports = router;
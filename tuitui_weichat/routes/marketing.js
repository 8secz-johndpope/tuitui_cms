const express = require('express');
const router = express.Router();
const MarketingModel = require('../model/Marketing')
const AdvertiseInfoModel = require('../model/AdvertiseInfo')
const request = require("request");
const mem = require('../util/mem.js');

router.get('/auth', async (req, res, next) => {
    let {app_id, auth_code, state} = req.query
        , secret = state;
    app_id = parseInt(app_id);
    request({
        url: "https://ad.oceanengine.com/open_api/oauth2/access_token/",
        method: "post",
        qs: {app_id: app_id, secret: secret, grant_type: 'auth_code', auth_code: auth_code},
        json: true
    }, async (err, response) => {
        console.log("err", err);
        let result = response.body;
        console.log("result.data.access_token", typeof result.data.access_token,result.data.access_token);
        if (result.code == 0) {
            await mem.set('marketing_access_token_' + app_id, result.data.access_token, 24 * 3600)
            await MarketingModel.update({app_id: app_id}, {
                app_id: app_id,
                advertiser_ids: result.data.advertiser_ids,
                secret: secret,
                access_token: result.data.access_token,
                expires_in: result.data.expires_in,
                refresh_token: result.data.refresh_token,
                refresh_token_expires_in: result.data.refresh_token_expires_in,
                refresh_type: 1,
                refresh_time: Date.now()
            }, {upsert: true})
            AdvertiseInfo(app_id, result.data.advertiser_ids)
            res.send('success')
        } else {
            console.log(result.code, '---------------code')
            res.send('false------', result.message)
        }
    })
})

function AdvertiseInfo(app_id, advertiser_ids) {
    request({
        url: "https://ad.oceanengine.com/open_api/2/advertiser/info/",
        method: "get",
        qs: {advertiser_ids: advertiser_ids},
        json: true
    }, async (err, res) => {
        if (res.code == 0) {
            for (let advertise of res.data) {
                await AdvertiseInfoModel.update({id: advertise.id}, {
                    app_id: app_id,
                    id: advertise.id,
                    name: String,
                    description: advertise.description,
                    email: advertise.email,
                    contacter: advertise.contacter,
                    phonenumber: advertise.phonenumber,
                    role: advertise.role,
                    status: advertise.status,
                    telephone: advertise.telephone,
                    address: advertise.address,
                    license_url: advertise.license_url,
                    license_no: advertise.license_no,
                    license_province: advertise.license_province,
                    license_city: advertise.license_city,
                    company: advertise.company,
                    brand: advertise.brand,
                    promotion_area: advertise.promotion_area,
                    promotion_center_province: advertise.promotion_center_province,
                    promotion_center_city: advertise.promotion_center_city,
                    first_industry_name: advertise.first_industry_name,
                    second_industry_name: advertise.second_industry_name,
                    reason: advertise.reason,
                    balance: advertise.balance,
                    create_time: advertise.create_time
                }, {upsert: true})
            }
        } else {
            console.log(res.code, '---------------code')
        }
        return
    })
}

module.exports = router;
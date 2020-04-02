const rp = require("request-promise");
const AccountModel = require('../model/Account.js');
const MarketingModel = require('../model/Marketing.js');
const AdvertiseHostModel = require('../model/AdvertiseHost.js');
const mem = require('../util/mem.js');
const url = "https://ad.oceanengine.com/open_api/2/ad/get";
const uri = "https://ad.oceanengine.com/open_api/2/majordomo/advertiser/select/";

getAdvertiseHostList();

async function getAdvertiseHostList() {
    let result = await MarketingModel.find({}, {advertiser_ids: 1, access_token: 1, _id: 0});
    let advertiser_ids, access_token;
    if(result.length) {
        advertiser_ids = result[1].advertiser_ids;
        access_token = result[1].access_token;
    }
    let options = {
        uri,
        qs: {
            advertiser_id: advertiser_ids[0]
        },
        headers: {
            'User-Agent': 'Request-Promise',
            'Access-Token': access_token
        },
        json: true
    };
    rp(options).then(async res => {
        if(res.code === 0) {
            console.log(res.data.list[0], "res");
            await AdvertiseHostModel.remove();
            let data = await AdvertiseHostModel.insertMany(res.data.list);
            console.log(data, "data");
        }
    })
}

async function getAdvertiseData(page = 1) {
    let result = await MarketingModel.find({}, {advertiser_ids: 1, app_id: 1, access_token: 1, _id: 0});
    console.log(result, "result");
    let app_id, advertiser_ids, access_token;
    if(result.length) {
        app_id = result[1].app_id;
        advertiser_ids = result[1].advertiser_ids;
        access_token = result[1].access_token;
        // access_token = mem.get('marketing_access_token_' + app_id);
    }
    console.log(typeof access_token, access_token, "access_token");
    var options = {
        uri: url,
        qs: {
            advertiser_id: advertiser_ids[0],
            page,
            page_size: 10,
            field: ["id", "name", "advertiser_id", "campaign_id", "status", "delivery_range", "budget_mode", "budget", "bid", "ad_create_time", "ad_modify_time", "start_time", "end_time", "external_url"]
        },
        headers: {
            'User-Agent': 'Request-Promise',
            'Access-Token': access_token
        },
        json: true
    };
    rp(options).then(parsedBody => {
        console.log(parsedBody, "parsedBody")
    })
}

// getAdvertiseData(1)


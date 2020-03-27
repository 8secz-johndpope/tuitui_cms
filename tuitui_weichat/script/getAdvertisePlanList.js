const rp = require("request-promise");
const AccountModel = require('../model/Account.js');
const MarketingModel = require('../model/Marketing.js');
const mem = require('../util/mem.js');
const url = "https://ad.oceanengine.com/open_api/2/ad/get";

async function getAdvertisePlanList(page = 1) {
    let result = await MarketingModel.find({}, {advertiser_ids: 1, app_id: 1, _id: 0});
    console.log(result, "result");
    let app_id, advertiser_ids, access_token;
    if(result.length) {
        app_id = result[0].app_id;
        advertiser_ids = result[0].advertiser_ids;
        access_token = mem.get('marketing_access_token_' + app_id);
    }
    console.log(access_token, "access_token");
    var options = {
        uri: url,
        qs: {
            advertiser_id: 0,
            page,
            page_size: 10,
            field: ["id", "name", "advertiser_id", "campaign_id", "status", "delivery_range", "budget_mode", "budget", "bid", "ad_create_time", "ad_modify_time", "start_time", "end_time", "external_url"]
        },
        headers: {
            'User-Agent': 'Request-Promise',
            'Access-Token': ''
        },
        json: true
    };
    rp(options).then(parsedBody => {
        console.log(parsedBody, "parsedBody")
    })
}

getAdvertisePlanList(1)

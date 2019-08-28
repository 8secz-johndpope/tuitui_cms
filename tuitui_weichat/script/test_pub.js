const asyncRedis = require("async-redis");
const redis_client = asyncRedis.createClient();

async function pubAccessToken(){
	await redis_client.publish('access_token','xxxxxxxxxx');
}

pubAccessToken()

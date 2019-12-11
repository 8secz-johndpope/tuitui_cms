var MessageModel = require('../model/Message');
var wechat_util = require('../util/get_weichat_client.js')
var async = require('async');
var count = 0;

async function get_message(){
	let messages = await MessageModel.find({type:0})
	async.eachSeries(messages,async function(message){
		console.log(message)
		if(!message.local_picurl){
			message.contents = await uploadImage(0,message.contents,message
			.codes)
			//await message.save()
			console.log('------执行完之后的message------------')
			console.log(message)
			count++
			console.log('-------执行第'+count+'条------')
		}
		return message
	},function(error){
		console.log('-------执行完成------')
		console.log(error)
	})
}

async function uploadImage(type, contents, codes) {
    let ab_img = __dirname + '/../public/uploads/';
    if (type === 0) {
        for (let code of codes) {
            let client = await wechat_util.getClient(code);
            console.log('-------client--------')
            console.log(client)
            for (var i =  0; i < contents.length; i++) {
                    let item = contents[i]
                    item.local_picurl = item.picurl;
                    let img_paths = item.local_picurl.split('/')
                    let img_file = img_paths[img_paths.length-1]
                    item.picurl = await client_upload(client,ab_img + img_file)
            }
        }
        return contents
    } else {
        return contents
    }
}

function client_upload(client,file_path){
    return new Promise((resolve,reject) => {
        client.uploadImage(file_path, function (error, result) {
            console.log("error", error, "-----------------------")
            console.log("result", result, "-----------------------")
            resolve(result.url)
        });
    })
}


get_message()
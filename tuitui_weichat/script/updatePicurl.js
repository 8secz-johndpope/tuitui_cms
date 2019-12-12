var MessageModel = require('../model/Message');
var wechat_util = require('../util/get_weichat_client.js')
var async = require('async');
var fs= require("fs")
var count = 0;

async function get_message(){
	let messages = await MessageModel.find({type:0})
	async.eachSeries(messages,async function(message){
		//console.log('------修改前------')
		//console.log(message.contents)
		if(!message.local_picurl){
			message.contents = await uploadImage(0,message.contents,message
			.codes)
			await message.save()
			//console.log('------修改后------')
			//console.log(message.contents)
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
    	codes = codes.derangedArray()
        for (let code of codes) {
        	console.log('公众号------------',code)
            let client = await wechat_util.getClient(code);
            if(!client){
            	console.log('----client 为空  continue----')
            	continue
            }
            for (var i =  0; i < contents.length; i++) {
                    let item = contents[i] 
                    let temp_pic = item.picurl
                    let img_paths = item.picurl.split('/')
                    let img_file = img_paths[img_paths.length-1]
                    if(!fs.existsSync(ab_img + img_file)){
                    	console.log('-------文件不存在----------')
                    	break
                    }
                    try{
                    	item.local_picurl = item.picurl;
                    	item.picurl = await client_upload(client,ab_img + img_file)
                    }catch(e){
                    	item.picurl = temp_pic
                    	item.local_picurl = ''
                    }
                    continue
            }
            console.log('----上传完成  break-----')
            break;
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


if (!Array.prototype.derangedArray) {
    Array.prototype.derangedArray = function() {
        for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
        return this;
    };
}

get_message()
const request = require('request');
const fs = require("fs");
const path = require("path");

const dirPath = path.join(__dirname, "file");
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
    //console.log("文件夹创建成功");
} else {
    //console.log("文件夹已存在");
}

function get_url(url,cb){
	request({
		url : url,
		headers:{
			"User-Agent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
		}
	},function(error, response, body){
		if(response.statusCode == 301 || response.statusCode == 302){
			console.log('中转')
			let location = response.headers.location;
			get_url(location,cb)
		}else if( response.statusCode == 200 ){
			//console.log(body)
			let pattern = new RegExp("(?<=playAddr: \")https?://.+(?=\",)")
			let d_url = pattern.exec(body).toString()
			d_url = d_url.replace(/playwm/g,'play')
			console.log(d_url)
			cb(null,d_url)
		}
	})
}

function get_file(d_url,cb) {
	let fileName = Date.now()+''+parseInt(Math.random()*1000)+'.mp4'
	let stream = fs.createWriteStream(path.join(dirPath, fileName));
    request({
    	url : d_url,
    	headers: {
        	"Connection": "keep-alive",
        	"Host": "aweme.snssdk.com",
        	"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_1_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16D57 Version/12.0 Safari/604.1"
    	}
    }).pipe(stream).on("close", function (err) {
        console.log("文件[" + fileName + "]下载完毕");
        cb(null,fileName)
    });
}


function change_flie(fileName){
	fs.appendFileSync(path.join(dirPath, fileName), "###$$$");
}

function get_douyin_md5_vedio(url,callback){
	get_url(url,function(err,d_url){
		get_file(d_url,function(error,fileName){
			change_flie(fileName)
			callback(fileName)
		})
	})
}

function async_get_douyin(url){
	return new Promise((resolve, reject)=>{
		get_douyin_md5_vedio(url,function(fileName){
			resolve(fileName)
		})
	});
}

module.exports.async_get_douyin = async_get_douyin
module.exports.get_douyin_md5_vedio = get_douyin_md5_vedio

// async_get_douyin('https://v.douyin.com/gtjqLt/')
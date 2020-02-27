var express = require('express');
var router = express.Router();
var TuiGuangModel = require('../model/TuiGuang.js');
var DomainModel = require('../model/Domain.js');

// var StaticsTuiGuangModel = require('../model/StaticsTuiGuang.js');
// var TransferModel = require('../model/Transfer.js');
// var PlatformDataModel = require('../model/PlatformData.js');
var multer = require('multer');
var fs = require('fs')
var mem = require('../util/mem.js')
// const asyncRedis = require("async-redis");
// const redis_client = asyncRedis.createClient();

//线上
var juedui_lujing = '/home/work/tuitui_program/project/public/images/website'

//线下
//var juedui_lujing ='../public/images/tuiguan'

var upload = multer({
	dest: juedui_lujing
});

router.post('/novel/upload', upload.single('imageFile'), function (req, res, next) {
	fs.rename(req.file.path, juedui_lujing + "/" + req.file.filename + '.jpg', function (err) {
		if (err) {
			throw err;
		}
		console.log('上传成功!');
	})
	res.send({ filename: req.file.filename + '.jpg' });
})

router.get('/novel/show', async (req, res, next) => {
	let { page = 1 } = req.query;
	let count = await TuiGuangModel.count({});
	let messages = await TuiGuangModel.find({}, { capter: 0 }).skip((page - 1) * 20).limit(20).sort({ zIndex: -1, _id: -1 });
	if (messages.length) {
		res.send({ code: 1, data: messages, domain_names, count, msg: "查询成功" })
	} else {
		res.send({ code: -1, data: messages, domain_name: "https://td.tyuss.com", count, msg: "暂时没有相关数据" })
	}
});

router.get('/novel/get_content', async (req, res, next) => {
	var id = req.query._id
	var messages = await TuiGuangModel.findById(id);
	res.send({ data: messages })
})

router.post('/novel/add', (req, res, next) => {
	TuiGuangModel.find({ id: req.body.id }, function (err, data) {
		if (err) {
			console.log("Error:" + err);
		} else {
			if (data != '') {
				res.send({ err: '此id已存在' })
			} else {
				var novelInfo = {
					type: req.body.type,
					id: req.body.id,
					gonghao_id: req.body.gonghao_id,
					pageTitle: req.body.pageTitle,
					name: req.body.name,
					picurl: req.body.picurl,
					capter: req.body.capter,
					remarks: req.body.remarks,
					domain_name: req.body.domain_name,
					gonghaoLogo: req.body.gonghaoLogo,
					finalImg: req.body.finalImg,
					company: req.body.company,
					suffix: req.body.suffix,
					bgcolor: req.body.bgcolor
				};
				var user = new TuiGuangModel(novelInfo)
				user.save(function (err, data) {
					if (err) {
						console.log("Error:" + err);
					} else {
						res.send({ message: '创建成功' })
					}
				});
			}
		}
	})

});

router.post('/novel/update', async (req, res, next) => {
	var id = req.body._id
	var message = {
		type: req.body.type,
		id: req.body.id,
		gonghao_id: req.body.gonghao_id,
		pageTitle: req.body.pageTitle,
		name: req.body.name,
		picurl: req.body.picurl,
		capter: req.body.capter,
		remarks: req.body.remarks,
		domain_name: req.body.domain_name,
		gonghaoLogo: req.body.gonghaoLogo,
		finalImg: req.body.finalImg,
		company: req.body.company,
		suffix: req.body.suffix,
		bgcolor: req.body.bgcolor
	};
	if (req.body.capter) {
		message.capter = req.body.capter
	}
	var docs = await TuiGuangModel.findByIdAndUpdate(id, message)
	if (docs) {
		mem.set('capter_' + id, {}, 60).then(function () {
			console.log('---------set capter value---------')
		})
		mem.set('toutiao_' + id, {}, 60).then(function () {
			console.log('---------set toutiao value---------')
		})
		mem.set('data_' + id, {}, 60).then(function () {
			console.log('---------set data value---------')
		})
		res.send({ success: '修改成功' })
	} else {
		res.send({ err: '修改失败' })
	}
})

router.post('/novel/delete_one', (req, res, next) => {
	var selector = {
		id: req.body.id
	}
	TuiGuangModel.find(selector, function (err, data) {
		if (err) {
			console.log("Error:" + err);
		} else {
			if (data != '') {
				TuiGuangModel.remove(selector, function (err, result) {
					res.send({ message: '删除成功' })
				})
			} else {
				res.send({ message: '没有此项数据' })
			}
		}
	})
})

router.post('/goTop', async (req, res, next) => {
	let message = await TuiGuangModel.findOne().sort({ zIndex: -1 });
	let zIndex = message.zIndex + 1;
	let result = await TuiGuangModel.findByIdAndUpdate(req.body.id, { zIndex }, { new: true });
	if (result) {
		res.send({ result: result, success: "置顶成功" })
	}
});

router.post('/cancelGoTop', async (req, res, next) => {
	let result = await TuiGuangModel.findByIdAndUpdate(req.body.id, { zIndex: 0 }, { new: true });
	if (result) {
		res.send({ result: result, success: "已取消置顶" })
	}
});

// router.get('/data', async (req, res, next) => {
// 	let tid = req.query.tid
// 	if (!tid) {
// 		return res.send('请输入transfer id')
// 	}
// 	let transfer = await TransferModel.findOne({ id: tid })
// 	if (!transfer) {
// 		return res.send('没有找到相关的transfer')
// 	}
// 	//console.log(transfer)

// 	var data = {
// 		tuiguang: [],
// 		duibi: []
// 	}

// 	let links = transfer.links.concat(transfer.back_urls)
// 	for (var i = 0; i < links.length; i++) {
// 		var link = links[i]
// 		var params = link.substr(link.lastIndexOf('/') + 1)
// 		var index = params.split('?')[0]
// 		var channel = params.split('channel=')[1]
// 		let uv = await redis_client.pfcount('website_tuiguang_' + channel + '_' + index);
// 		let cv = await redis_client.pfcount('website_tuiguang_copy_' + channel + '_' + index);
// 		let ip = await redis_client.pfcount('website_tuiguang_ip_' + channel + '_' + index);
// 		let wv = await redis_client.pfcount('website_tuiguang_wechat_' + channel + '_' + index);

// 		data.tuiguang.push({
// 			index: index,
// 			uv: uv,
// 			cv: cv,
// 			wv: wv,
// 			ip: ip
// 		})
// 		data.duibi.push({
// 			index: index,
// 			copy_uv: (cv / uv * 100).toFixed(2) + '%',
// 			wechat_uv: (wv / uv * 100).toFixed(2) + '%',
// 		})
// 	}
// 	return res.send(data)
// })

// router.get('/data/del', async (req, res, next) => {
// 	let tid = req.query.tid
// 	if (!tid) {
// 		return res.send('请输入transfer id')
// 	}
// 	let transfer = await TransferModel.findOne({ id: tid })
// 	if (!transfer) {
// 		return res.send('没有找到相关的transfer')
// 	}

// 	for (var i = 0; i < transfer.links.length; i++) {
// 		var link = transfer.links[i]
// 		var params = link.substr(link.lastIndexOf('/') + 1)
// 		var index = params.split('?')[0]
// 		var channel = params.split('channel=')[1]
// 		let uv = await redis_client.del('website_tuiguang_' + channel + '_' + index);
// 		let cv = await redis_client.del('website_tuiguang_copy_' + channel + '_' + index);
// 		let ip = await redis_client.del('website_tuiguang_ip_' + channel + '_' + index);
// 		let wv = await redis_client.del('website_tuiguang_wechat_' + channel + '_' + index);
// 	}
// 	return res.send('删除成功')
// })


// router.get('/statics/zeng', async (req, res, next) => {
// 	var tid = req.query.tgid;
// 	var datas = await StaticsTuiGuangModel.find({ tuiguang_id: tid, type: 0 }).sort({ date: -1 }).limit(24)
// 	return res.render('statics/zeng', {
// 		data: JSON.stringify(datas)
// 	})
// })

// router.post('/data/yuewen', async (req, res, next) => {
// 	//console.log('-----阅文请求body-----')
// 	//console.log(req.body)
// 	let ua = req.body.ua;
// 	ua = new Buffer(ua, 'base64').toString();
// 	//let h_ua = ua.substring(0,ua.indexOf(')',ua.indexOf(')')+1)+1);
// 	let ip = req.body.ip;
// 	let pd = {
// 		uni_ip_h_ua: handleIpAndUa(ip, ua),
// 		wx_ua: ua,
// 		ip: ip,
// 		regtime: new Date(req.body.time).getTime(),
// 		wx_openid: req.body.open_id,
// 		isfollow: 1,
// 		seruid: req.body.appflag,
// 		wx_platfrom: 1
// 	}
// 	if (!pd.regtime) {
// 		delete pd.regtime
// 	}
// 	//console.log('-----阅文回传数据-----')
// 	//console.log(pd)
// 	await PlatformDataModel.findOneAndUpdate({ uni_ip_h_ua: pd.uni_ip_h_ua },
// 		pd,
// 		{ upsert: true },//这个之后考虑要不要加
// 	)
// 	//console.log('-----send yuewen------')
// 	res.send({ "code": 0 });
// });

function handleIpAndUa(ip, ua) {
	let uni_ip_h_ua = (ip + ua.substring(0, ua.indexOf(')', ua.indexOf(')') + 1) + 1));
	if (uni_ip_h_ua.indexOf('iPhone') != -1) {
		let replace_start = uni_ip_h_ua.substring(0, uni_ip_h_ua.indexOf('(') + 1);
		let replace_end = uni_ip_h_ua.substring(uni_ip_h_ua.indexOf(')'))
		uni_ip_h_ua = replace_start + 'iPhone' + replace_end
	}
	return uni_ip_h_ua;
}

module.exports = router;
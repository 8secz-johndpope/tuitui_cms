var express = require('express');
var router = express.Router();
var TagModel = require('../model/Tag.js')

router.get('/',function(req,res,next){
	let account_id = req.session.account._id;
	TagModel.find({}, function(err,result){
		if(err){
			res.send({err: err})
		}else{
			res.send({success: "查询成功", data: result})
		}
	})
})

router.get('/get_name',function(req,res,next){
	let account_id = req.session.account._id;
	TagModel.findOne({_id: req.query.tagId, account_id},function(err,result){
		if(err){
			console.log(err)
			res.send({err: err})
		}else{
			res.send({success: "查询成功", data: result})
		}
	})
})

router.post('/',function(req,res,next){
	let account_id = req.session.account._id;
	TagModel.findOne({name:req.body.name, account_id},function(err,result){
		if(err){
			res.send({err: err})
		}else{
			if(result){
				res.send({success: "查询成功", data: result})
			}else{
				var tm =TagModel({
					name:req.body.name,
					account_id
				});
				tm.save(function(error,tm){
					res.send({success: "新增标签成功", data: tm})
				});
			}
		}
	});
});


router.delete('/:id',function(req,res,next){
	TagModel.findByIdAndRemove(req.params.id,function(err,result){
		if(err){
			console.log(err);
			res.send({err:err})
		}else{
			res.send({success: "删除成功"})
		}
	})
})



module.exports = router;
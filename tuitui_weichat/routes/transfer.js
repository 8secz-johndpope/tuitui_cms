var express = require('express');
var router = express.Router();
var TransferModel = require('../model/Transfer');
var DomainModel = require('../model/Domain');
var mem = require('../util/mem.js');


router.get('/', async(req, res, next) => {
    let account_id, messages, total;
    let {page = 1, group} = req.query;
    let domain_name = "http://doumobone.top";
    if(!req.session.account) {
        account_id = req.query.account_id
    } else {
        account_id = req.session.account._id;
    }
    if(group) {
        messages = await TransferModel.find({account_id, group}).skip((page - 1) * 10).limit(10).sort({order: -1, _id: -1});
        total = await TransferModel.count({account_id, group});
    } else {
        messages = await TransferModel.find({account_id}).skip((page - 1) * 10).limit(10).sort({order: -1, _id: -1});
        total = await TransferModel.count({account_id});
    }
    res.send({messages: messages, domain_name, total})
});

router.post('/goTop', async(req, res, next) => {
    let account_id;
    if(!req.session.account) {
        account_id = req.body.account_id
    } else {
        account_id = req.session.account._id;
    }
    let message = await TransferModel.findOne({account_id}).sort({order: -1});
  let order = message.order + 1;
  let result = await TransferModel.findByIdAndUpdate(req.body.id, {order}, {new: true});
  if(result) {
    res.send({result: result, success: "置顶成功"})
  }
});

router.get('/update_links', async(req, res, next) => {
    let account_id;
    if(!req.session.account) {
        account_id = req.query.account_id
    } else {
        account_id = req.session.account._id;
    }
    var domain_name = req.query.domain_name,
    messages = await TransferModel.find({account_id}),
    domain_names = await DomainModel.findByIdAndUpdate('5b6d0b899a9fab38f48b5b10', {domain_name: domain_name})
    // for(var i=0,mLength=messages.length;i<mLength;i++){
    //     messages[i].links[0] = domain_name + '/tuiguang' + messages[i].links[0].split('/tuiguang')[1]
    //     var docs = await TransferModel.findByIdAndUpdate(messages[i]._id, {links: messages[i].links})
    // }
    res.send({success: '域名修改成功'})
})

router.post('/create', async(req, res, next)=> {
    console.log(req.session.account, "req.session.account----------------------------------")
    let account_id;
    if(!req.session.account) {
        account_id = req.body.account_id
    } else {
        account_id = req.session.account._id;
    }
    var message = {
        id:randomWord(false,10),
        title: req.body.title,
        links: req.body.links,
        type: req.body.type,
        weights: req.body.weights,
        status: req.body.status,
        granularity: req.body.granularity,
        remarks: req.body.remarks,
        group: req.body.group || '默认',
        back_urls: req.body.back_urls,
        account_id
    }
    // var result = await TransferModel.find({id: message.id})
    // if(result.length !== 0) {
    //   res.send({err: "创建失败，该id已存在"})
    // } else {
      var docs = await TransferModel.create(message);
      if (docs) {
          res.send({success: '成功', data: docs})
      } else {
          res.send({err: '创建失败，请检查输入是否有误'})
      }
    //}
})

router.post('/update', async(req, res, next) => {
    var id = req.body._id;
    var message = {
        id:req.body.id,
        title: req.body.title,
        links: req.body.links,
        type: req.body.type,
        weights: req.body.weights,
        status: req.body.status,
        granularity: req.body.granularity,
        remarks: req.body.remarks,
        group: req.body.group || '默认',
        back_urls: req.body.back_urls
    };
    var docs = await TransferModel.findByIdAndUpdate(id, message);
    if (docs) {
        res.send({success: '修改成功'})
        mem.set('transfer_'+req.params.index,{},60).then(function(){
             console.log('---------set transfer value---------')
        })
    } else {
        res.send({err: '修改失败'})
    }
})

router.get('/delete', async(req, res, next) => {
    var id = req.query.id;
    await TransferModel.remove({_id: id}, (err, data) => {
        if(data) {
            res.send({success: '删除成功'})
        } else {
            res.send({err: '删除失败'})
        }
    })
    
})

function randomWord(randomFlag, min, max){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
 
    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}

module.exports = router

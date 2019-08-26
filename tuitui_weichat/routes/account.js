const express = require('express');
const router = express.Router();
const AccountModel = require('../model/Account.js')

router.post('/', async (req, res, next) => {
  let { account, password } = req.body;
  let result = await AccountModel.find({account});
  if(result.length > 0) {
    res.send({code: 2, msg: "该账户名已存在，请检查输入是否有误"})
  } else {
    let data = await AccountModel.create({ account, password });
    if(data) {
      res.send({code: 1, msg: '账户创建成功', data})
    } else {
      res.send({code: -1, msg: '账户创建失败，请重试'})
    }
  }
});

router.get('/', async (req, res, next) => {
  let { account } = req.query, result;
  if(account) {
    result = await AccountModel.find({account: {$regex: new RegExp(account)}})
  } else {
    result = await AccountModel.find();
  }
  if(result.length > 0) {
    res.send({code: 1, msg: '查询成功', data: result})
  } else {
    res.send({code: -1, msg: '查询失败，请重试'})
  }
});

router.put('/', async (req, res, next) => {
  let { id, password } = req.body;
  let data = await AccountModel.findByIdAndUpdate(id, { password }, {new: true});
  if(data) {
    res.send({code: 1, msg: '密码修改成功', data})
  } else {
    res.send({code: -1, msg: '密码修改失败，请重试'})
  }
});

router.delete('/', async (req, res, next) => {
  let { _id } = req.query;
  let result = await AccountModel.findByIdAndRemove(_id);
  if(result) {
    res.send({code: 1, msg: '删除成功'})
  } else {
    res.send({code: -1, msg: "删除失败"})
  }
});

router.post('/login', async (req, res, next) => {
  let { account, password } = req.body;
  let result = await AccountModel.find({account, password});
  if(result.length > 0) {
    res.send({code: 1, msg: '登录成功', data: result})
  } else {
    res.send({code: -1, msg: '用户名或密码输入有误，请重新输入'})
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const AccountModel = require('../model/Account.js')

router.post('/', async (req, res, next) => {
  let { username, password, role, remarks } = req.body;
  let result = await AccountModel.find({username});
  if(result.length > 0) {
    res.send({code: 2, msg: "该账户名已存在，请检查输入是否有误"})
  } else {
    let data = await AccountModel.create({ username, password, role, remarks, loginAt: Date.now() });
    if(data) {
      res.send({code: 1, msg: '账户创建成功', data})
    } else {
      res.send({code: -1, msg: '账户创建失败，请重试'})
    }
  }
});

router.get('/', async (req, res, next) => {
  let { username } = req.query, result;
  if(username) {
    result = await AccountModel.find({username: {$regex: new RegExp(username)}})
  } else {
    result = await AccountModel.find();
  }
  if(result.length > 0) {
    res.send({code: 1, msg: '查询成功', data: result})
  } else {
    res.send({code: -1, msg: '没有查询到相关数据'})
  }
});

router.put('/power', async (req, res, next) => {
  let { id, power } = req.body;
  let updateAt = Date.now();
  let data = await AccountModel.findByIdAndUpdate(id, { power, updateAt }, {new: true});
  if(data) {
    res.send({code: 1, msg: '权限修改成功', data})
  } else {
    res.send({code: -1, msg: '权限修改失败，请重试'})
  }
});

router.put('/remarks', async (req, res, next) => {
  let { id, remarks } = req.body;
  let updateAt = Date.now();
  let data = await AccountModel.findByIdAndUpdate(id, { remarks, updateAt }, {new: true});
  if(data) {
    res.send({code: 1, msg: '备注修改成功', data})
  } else {
    res.send({code: -1, msg: '备注修改失败，请重试'})
  }
});

router.put('/', async (req, res, next) => {
  let { id, username, password } = req.body;
  let updateAt = Date.now();
  let data = await AccountModel.findByIdAndUpdate(id, { username, password, updateAt }, {new: true});
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
  let { username, password } = req.body;
  let result = await AccountModel.find({username, password});
  // console.log(username, password, "-----------------username, password----------------")
  // console.log(result, "-----------------result----------------")
  if(result.length > 0) {
    req.session.account = result[0];
    // console.log(req.session.account, "---------------------------------req.session.account----------------------------------")
    result[0].loginAt = Date.now();
    await result[0].save();
    res.send({code: 1, msg: '登录成功', data: result})
  } else {
    res.send({code: -1, msg: '用户名或密码输入有误，请重新输入'})
  }
});


module.exports = router;
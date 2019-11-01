var express = require('express');
var router = express.Router();
var MenuModel = require('../model/Menu');
var ActionModel = require('../model/Action')
var WechatUtil = require('../util/get_weichat_client.js');

router.get('/', async(req, res, next) => {
    let account_id;
    if (!req.session.account) {
        account_id = req.query.account_id
    } else {
        account_id = req.session.account._id;
    }
    let doc = await MenuModel.find({account_id});
    res.send({data: doc})
});

router.post('/create', async(req, res, next) => {
    console.log('------------------------')
    let account_id;
    if (!req.session.account) {
        account_id = req.body.account_id
    } else {
        account_id = req.session.account._id;
    }
    let data = {
        title: req.body.title,
        codes: req.body.codes,
        values: req.body.values,
        individual: req.body.individual,
        sex: req.body.sex,
        contents: req.body.contents,
        account_id
    };
    let doc = await MenuModel.create(data);

    if (doc) {
        for (let code of doc.codes) {
            if (doc.individual) {
                createIndividualMenu(code, doc.values, doc.sex, doc._id, null)
            } else {
                createMenu(code, doc.values)
            }
            for (let value of doc.values) {
                if (value.sub_button.length == 0) {
                    if (value.type == 'click') {
                        await ActionModel.findOneAndUpdate({code: code}, {$addToSet: {actions: 'click_' + value.key}}, {
                            upsert: true,
                            new: true
                        })
                    }
                } else {
                    for (let button of value.sub_button) {
                        if (button.type == 'click') {
                            await ActionModel.findOneAndUpdate({code: code}, {$addToSet: {actions: 'click_' + button.key}}, {
                                upsert: true,
                                new: true
                            })
                        }
                    }
                }
            }
        }
        res.send({success: '创建成功', data: doc})
    } else {
        res.send({err: '创建失败'})
    }
});

router.post('/update', async(req, res, next) => {
    let id = req.body.id;
    let data = {
        title: req.body.title,
        codes: req.body.codes,
        values: req.body.values,
        individual: req.body.individual,
        sex: req.body.sex,
        contents: req.body.contents,
    };
    let doc = await MenuModel.findByIdAndUpdate(id, data);
    if (doc) {
        for (let code of doc.codes) {
            for (let value of doc.values) {
                if (value.sub_button.length == 0) {
                    if (value.type == 'click') {
                        await ActionModel.findOneAndUpdate({code: code}, {$pull: {actions: 'click_' + value.key}})
                    }
                } else {
                    for (let button of value.sub_button) {
                        if (button.type == 'click') {
                            await ActionModel.findOneAndUpdate({code: code}, {$pull: {actions: 'click_' + button.key}})
                        }
                    }
                }
            }
        }
        for (let code of req.body.codes) {
            if (data.individual) {
                createIndividualMenu(code, req.body.values, req.body.sex, req.body.id, doc.menuid)
            } else {
                createMenu(code, req.body.values)
            }
            for (let value of req.body.values) {
                if (value.sub_button.length == 0) {
                    if (value.type == 'click') {
                        await ActionModel.findOneAndUpdate({code: code}, {$addToSet: {actions: 'click_' + value.key}}, {
                            upsert: true,
                            new: true
                        })
                    }
                } else {
                    for (let button of value.sub_button) {
                        if (button.type == 'click') {
                            await ActionModel.findOneAndUpdate({code: code}, {$addToSet: {actions: 'click_' + button.key}}, {
                                upsert: true,
                                new: true
                            })
                        }
                    }
                }
            }
        }
        res.send({success: '修改成功'})
    } else {
        res.send({err: '修改失败'})
    }
});

router.get('/del', async(req, res, next) => {
    let id = req.query.id;
    var doc = await MenuModel.findByIdAndRemove(id);
    for (let code of doc.codes) {
        if (doc.individual) {
            console.log('--------------------删除个性化菜单1---------------------------')
            removeIndividualMenu(code, doc.menuid)
        } else {
            createMenu(code, [])
        }
        for (let value of doc.values) {
            if (value.sub_button.length == 0) {
                if (value.type == 'click') {
                    await ActionModel.findOneAndUpdate({code: code}, {$pull: {actions: 'click_' + value.key}})
                }
            } else {
                for (let button of value.sub_button) {
                    if (button.type == 'click') {
                        await ActionModel.findOneAndUpdate({code: code}, {$pull: {actions: 'click_' + button.key}})
                    }
                }
            }
        }
    }
    res.send({success: '删除成功', data: doc})
});


// 创建通用菜单
async function createMenu(code, menu) {
    var menu = {"button": menu};
    console.log('menu', menu);
    var api = await WechatUtil.getClient(code);
    if (menu.button.length == 0) {
        api.removeMenu(function (err, res) {
            console.log(res);
            api.getMenu(function (err, res_m) {
                console.log(JSON.stringify(res_m));
            });
        });
        return
    } else {
        api.removeMenu(function (err, res) {
            if (err) {
                console.log('--------removeMenu-----err-----')
                console.log(err)
                console.log(res)
            }
            api.createMenu(menu, function (err, res) {
                if (err) {
                    console.log('--------createMenu-----err-----')
                    console.log(err)
                    console.log(res)
                }
                api.getMenu(function (err, res_m) {
                    console.log(err)
                    console.log(JSON.stringify(res_m));
                });
            });
        });
        return
    }
};

// 创建个性化菜单
async function createIndividualMenu(code, menu, sex, id, menuid) {
    console.log('menu', menu, 'menu')
    let individaulMenu = {
        "button": menu,
        "matchrule": {
            "sex": sex
        }
    };
    console.log('individaulMenu', individaulMenu);
    console.log('code', code);
    var api = await WechatUtil.getClient(code);
    if (menuid) {
        api.removeCustomMenu(menuid, function (err, res) {
            console.log(err)
            console.log(res)
        })
    }
    api.createCustomMenu(individaulMenu, async function (err, res) {
        if (err) {
            console.log('--------createCustomMenu-----err-----')
            console.log(err)
            console.log(res)
        }
        let result = await MenuModel.findByIdAndUpdate(id, {menuid: res.menuid}, {new: true});
        if (result) {
            api.getMenu(function (error, res_m) {
                console.log(error)
                console.log(res_m);
            });
        }
    });
};

async function removeIndividualMenu(code, menuid) {
    console.log('--------------------删除个性化菜单2---------------------------')
    console.log('code', code)
    console.log('menuid', menuid)
    var api = await WechatUtil.getClient(code);
    if (menuid) {
        api.removeCustomMenu(menuid, function (err, res) {
            console.log(err)
            console.log(res)
        })
    }
}

module.exports = router;

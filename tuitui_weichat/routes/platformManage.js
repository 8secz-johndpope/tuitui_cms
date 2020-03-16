var express = require("express");
var router = express.Router();
var PlatformManageModel = require("../model/PlatformManage.js");

router.get("/", async (req, res, next) => {
  let result = await PlatformManageModel.find();
  if (result.length) {
    res.send({ code: 1, msg: "查询成功", data: result });
  } else {
    res.send({ code: -1, msg: "没有数据，请添加" });
  }
});


router.post("/", async (req, res, next) => {
  let { platform, name } = req.body;
  if (!platform || !name) {
    res.send({ code: -1, msg: "参数填写有误" });
  } else {
    let result = await PlatformManageModel.create({ platform, name });
    if (result) {
      res.send({ code: 1, msg: "创建成功", data: result });
    } else {
      res.send({ code: -1, msg: "创建失败，请重试" });
    }
  }
});

router.put("/", async (req, res, next) => {
  let { platform, name, _id } = req.body;
  if (!_id || !platform || !name) {
    res.send({ code: -1, msg: "修改失败" });
  } else {
    let result = await PlatformManageModel.findByIdAndUpdate(
      _id,
      { platform, name },
      { new: true }
    );
    if (result) {
      res.send({ code: 1, msg: "修改成功", data: result });
    } else {
      res.send({ code: -1, msg: "修改失败" });
    }
  }
});

router.delete("/", async (req, res, next) => {
  let { id } = req.query;
  let result = await PlatformManageModel.findByIdAndRemove(id);
  if (result) {
    res.send({ code: 1, msg: "删除成功" });
  } else {
    res.send({ code: -1, msg: "删除失败" });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const StatisticsUserModel = require('../model/StatisticsUser')

router.get('/', async(req, res, next) => {
    let doc = await StatisticsUserModel.find()
    res.send({data:doc})
})

module.exports = router;

var express = require('express');
var router = express.Router();
var douyin = require('../util/douyin')

router.get('/douyin', async function(req, res, next) {
    let url = req.query.url
    let d_url = await douyin.async_get_douyin(url)
    res.send(d_url)
})
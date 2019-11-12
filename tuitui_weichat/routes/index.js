var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res, next) {
  console.log('...get / ...');
  res.sendFile(path.join(__dirname, '../public', 'home.html'));
});

router.get('/admin/*', function(req, res, next) {
  console.log('...get /admin/* ...');
  res.sendFile(path.join(__dirname, '../build', 'home.html'));
});

router.get('/admin', function(req, res, next) {
  console.log('...get /admin ...');
  res.sendFile(path.join(__dirname, '../build', 'home.html'));
});

router.get('/error', function(req, res, next) {
  const {errcode, errmsg} = req.query;
  res.render("error/index", {errcode, errmsg})
});

module.exports = router;

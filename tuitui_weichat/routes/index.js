var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public', 'home.html'));
});

router.get('/admin/*', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

router.get('/admin', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});



module.exports = router;

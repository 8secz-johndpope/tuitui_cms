var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/admin/*', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

router.get('/admin', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



module.exports = router;

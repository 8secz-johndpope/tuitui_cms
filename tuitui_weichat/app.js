var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MemcachedStore = require('connect-memcached')(session);


var index = require('./routes/index');
var qr_code = require('./routes/qr_code');
var transfer = require('./routes/transfer');
var tag = require('./routes/tag')
var conf = require('./routes/conf');
var menu = require('./routes/menu');
var msg = require('./routes/msg');
var reply = require('./routes/reply');
var message = require('./routes/message');
var material = require('./routes/material');
var gonghaoTag = require('./routes/gonghaoTag')
var msgHistory = require('./routes/msgHistory')
var component = require('./routes/component');
var account = require('./routes/account');
var tuiguangTag = require('./routes/tuiguangTag')

var app = express();

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:8080");
	res.header('Access-Control-Allow-Credentials', true);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1');
	next();
});

//app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'build')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false,limit: '50mb' }));
app.use(cookieParser());
app.use(session({
    secret: 'mingxingshuo',
    name: 'xiaoshuo',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 1000*60*60*24 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
    store: new MemcachedStore({
      hosts: ["127.0.0.1:11211"],
      secret: "mingxingshuo" // Optionally use transparent encryption for memcache session data
    })
}));

app.use('/', index);
app.use('/qr_code', qr_code);
app.use('/transfer', transfer);
app.use('/tag',tag);
app.use('/conf',conf);
app.use('/menu',menu);
app.use('/msg',msg);
app.use('/reply',reply)
app.use('/message',message)
app.use('/material',material)
app.use('/gonghaoTag',gonghaoTag)
app.use('/history',msgHistory)
app.use('/component',component)
app.use('/account',account)
app.use('/tuiguangTag',tuiguangTag)

app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;

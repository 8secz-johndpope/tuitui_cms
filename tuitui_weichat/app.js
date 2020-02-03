var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var MemcachedStore = require('connect-memcached')(session);

const redis   = require("redis");
const redis_client = redis.createClient();

var RedisStrore = require('connect-redis')(session);

//监控
const easyMonitor = require('easy-monitor');
easyMonitor('tuitui_cms');

var index = require('./routes/index');
var qr_code = require('./routes/qr_code');
var transfer = require('./routes/transfer');
var tag = require('./routes/tag');
var conf = require('./routes/conf');
var menu = require('./routes/menu');
var reply = require('./routes/reply');
var message = require('./routes/message');
var material = require('./routes/material');
var gonghaoTag = require('./routes/gonghaoTag')
var msgHistory = require('./routes/msgHistory')
var component = require('./routes/component');
var account = require('./routes/account');
var tuiguangTag = require('./routes/tuiguangTag')
var template = require('./routes/template')
var messageGroup = require('./routes/messageGroup')
var textMaterial = require('./routes/textMaterial')
var watermark = require('./routes/watermark')


var app = express();

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:8081");
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
app.use(express.static(path.join(__dirname, 'public')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false,limit: '50mb' }));
//app.use(cookieParser());
/*app.use(session({
    genid: function(req) {
      return genuuid() // use UUIDs for session IDs
    },
    secret: 'mingxingshuo',
    name: 'xiaoshuo',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 1000*60*60*24 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    rolling:true,
    saveUninitialized: false,
    store: new MemcachedStore({
      hosts: ["127.0.0.1:11211"],
      secret: "mingxingshuo" // Optionally use transparent encryption for memcache session data
    })
}));*/

function genuuid(){
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

let sessiond = session({
    genid: function(req) {
      return genuuid() // use UUIDs for session IDs
    },
    secret: 'mingxingshuo',
    name: 'xiaoshuo',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 1000*60*60*24 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    rolling:false,
    saveUninitialized: false,
    store : new RedisStrore({ host: 'localhost', port: 6379, client: redis_client,ttl :  260}),
    /*store: new MemcachedStore({
      hosts: ["127.0.0.1:11211"],
      secret: "mingxingshuo" // Optionally use transparent encryption for memcache session data
    })*/
})

app.use('/component',component)
app.use('/', index);
app.use('/qr_code',[cookieParser(),sessiond], qr_code);
app.use('/transfer',[cookieParser(),sessiond], transfer);
app.use('/tag',[cookieParser(),sessiond],tag);
app.use('/conf',[cookieParser(),sessiond],conf);
app.use('/menu',[cookieParser(),sessiond],menu);
app.use('/reply',[cookieParser(),sessiond],reply)
app.use('/message',[cookieParser(),sessiond],message)
app.use('/material',[cookieParser(),sessiond],material)
app.use('/gonghaoTag',[cookieParser(),sessiond],gonghaoTag)
app.use('/history',[cookieParser(),sessiond],msgHistory)
app.use('/account',[cookieParser(),sessiond],account)
app.use('/tuiguangTag',[cookieParser(),sessiond],tuiguangTag)
app.use('/template',[cookieParser(),sessiond],template)
app.use('/messageGroup',[cookieParser(),sessiond],messageGroup)
app.use('/textMaterial',[cookieParser(),sessiond],textMaterial)
app.use('/watermark',[cookieParser(),sessiond],watermark)

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

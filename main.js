
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet')
app.use(helmet());
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);
var connection = require('./lib/db');
var flash = require('connect-flash');

var options = {
  host: 'localhost',
  user: 'root',
  password: 'gustj486!!',
  database: 'opentutorials'
}

var sessionStore = new MySQLStore(options);



app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

// file session store
// app.use(session({
//   secret: 'asadlfkj!@#!@#dfgasdg',
//   resave: false,
//   saveUninitialized: true,
//   store:new FileStore()
// }))

// mysql session store
app.use(session({
	secret: 'asdfasdfasdf',
	store: sessionStore,
	resave: false,
	saveUninitialized: true
})); 

app.use(flash());

// flash로 들어왔을때 실행되는 미들웨어
// app.get('/flash', function(req, res){
//   // Set a flash message by passing the key, followed by the value, to req.flash(). -> req.flash() 함수를 만들어준다는 의미인듯..
//   // 그리고 session-store에다가 입력한 데이터를 집어넣어 준다.
//   req.flash('msg', 'Flash is back!!');
//   res.send('flash');
// });


// // flash의 특성상 한번 사용하면 지워진다는 휘발성 원리가 존재함.
// app.get('/flash-display', function(req, res){
//   // Get an array of flash messages by passing the key to req.flash()
//   var fmsg = req.flash();
//   console.log(fmsg);
//   const { msg } = fmsg;
//   console.log(msg);
//   res.send(fmsg);
// });

const passport = require('./lib/passport')(app);




app.get('*', function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});


var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth')(passport);

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});

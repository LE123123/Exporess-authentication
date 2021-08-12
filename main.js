
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet')
app.use(helmet());
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);

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

app.get('*', function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth');

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

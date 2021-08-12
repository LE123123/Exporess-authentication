var express = require('express');
var app = express();

app.use('/hello', (req, res, next) => {
    console.log('LOGGED');
    next();
});


app.get('*', function (req, res, next) {
  res.send('Hello World!');
  next()
}, (req, res, next) => {
    console.log('LOGGED2');
    next();
});

app.get('*', (req, res, next) => {
    console.log('LOGGED3');
    next();
})



app.get('/hello', function (req, res, next) {
    console.log('LOGGED4')
});

app.listen(3000);
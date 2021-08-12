var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var connection = require('../lib/db');

/*
router.get('/create', function(request, response){
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <form action="/topic/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `, '');
    response.send(html);
  });
   
  router.post('/create_process', function(request, response){
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      response.redirect(`/topic/${title}`);
    });
  });
   
  router.get('/update/:pageId', function(request, response){
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      var title = request.params.pageId;
      var list = template.list(request.list);
      var html = template.HTML(title, list,
        `
        <form action="/topic/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
      );
      response.send(html);
    });
  });
   
  router.post('/update_process', function(request, response){
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(error){
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.redirect(`/topic/${title}`);
      })
    });
  });
   
  router.post('/delete_process', function(request, response){
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error){
      response.redirect('/');
    });
  });
   
  router.get('/:pageId', function(request, response, next) { 
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      if(err){
        next(err);
      } else {
        var title = request.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {
          allowedTags:['h1']
        });
        var list = template.list(request.list);
        var html = template.HTML(sanitizedTitle, list,
          `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
          ` <a href="/topic/create">create</a>
            <a href="/topic/update/${sanitizedTitle}">update</a>
            <form action="/topic/delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>`
        );
        response.send(html);
      }
    });
  });
*/


const authData = {
  email: 'heart20021010@gmail.com',
  password: 'gustj486!!',
  nickname: 'hyunseo'
}

router.get('/login', function(request, response){
  var title = 'WEB - login';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
    <form action="/auth/login_process" method="post">
      <p><input type="text" name="email" placeholder="email"></p>
      <p><input type="password" name="pwd" placeholder="password"></p>

      <p>
        <input type="submit" value="login">
      </p>

    </form>
  `, '');
  response.send(html);
});

router.post('/login_process', (request, response) => {
  var post = request.body;
  var email = post.email;
  var password = post.pwd;
  
  connection.query(`select * from signup`, (error, data) => {
    var i = 0;
    while (i < data.length) {
      console.log(i);
      if(email === data[i].email && password === data[i].password) {
        request.session.is_logined = true;
        const { nickname } = data[i];
        request.session.nickname = nickname;
        
        // 만약 save가 없다면 데이터베이스에서 session을 저장하는 것보다
        // redirect가 먼저 일어나 쿼리가 씹힐 수 있다.
        request.session.save(() => {
          response.redirect('/')
        })
        return;

      }
      i += 1;
    }

    response.send(`
        <div>
          <h2>Try Login again!</h2>
          <form action="/auth/login">
            <input type="submit" value="go back to login page!!">
          </form>
        </div>`)      
        return;
  });
});

router.get('/logout', (request, response) => {
  request.session.destroy((error) => {
    response.redirect('/');
  })
})

router.get('/signup', (request, response) => {

  var title = 'WEB - signup';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
    <form action="/auth/signup_process" method="post">
      <p><input type="text" name="email" placeholder="email"></p>
      <p><input type="password" name="pwd" placeholder="password"></p>
      <p><input type="text" name="nickname" placeholder="nickname"></p>

      <p>
        <input type="submit" value="signup">
      </p>

    </form>
  `, '');
  response.send(html);
})


router.post('/signup_process', (request, response) => {
  var post = request.body;
  var email = post.email;
  var password = post.pwd;
  var nickname = post.nickname;

  connection.query('select * from signup', (error, data) => {
    connection.query(
      `insert into signup(email, password, nickname) values(?, ?, ?)`,
        [email, password, nickname], (error2, data2) => {
          response.redirect('/auth/login');
        }
      )
  });
});


module.exports = router;
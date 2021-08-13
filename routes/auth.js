var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var connection = require('../lib/db');

module.exports = function(passport) {
  router.get('/login', function(request, response){
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = 'WEB - login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <div style="color: red">${feedback}</div>
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

  // router.post('/login_process', (request, response) => {
  //   var post = request.body;
  //   var email = post.email;
  //   var password = post.pwd;
    
  //   connection.query(`select * from signup`, (error, data) => {
  //     var i = 0;
  //     while (i < data.length) {
  //       console.log(i);
  //       if(email === data[i].email && password === data[i].password) {
  //         request.session.is_logined = true;
  //         const { nickname } = data[i];
  //         request.session.nickname = nickname;
          
  //         // 만약 save가 없다면 데이터베이스에서 session을 저장하는 것보다
  //         // redirect가 먼저 일어나 쿼리가 씹힐 수 있다.
  //         request.session.save(() => {
  //           response.redirect('/')
  //         })
  //         return;

  //       }
  //       i += 1;
  //     }

  //     response.send(`
  //         <div>
  //           <h2>Try Login again!</h2>
  //           <form action="/auth/login">
  //             <input type="submit" value="go back to login page!!">
  //           </form>
  //         </div>`)      
  //         return;
  //   });
  // });



  router.get('/logout', (request, response) => {

    // passport에 로그아웃을 하고
    // 그 다음에야 session을 지워주는 게 순서가 틀어지지 않고 잘 맞는다.
    request.logout();
    request.session.destroy((err) => {
      response.redirect('/');
    });

    // request.session.save(() => {
    //   response.redirect('/')
    // })
  });

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

  router.post('/withdrawl_process', (request, response) => {
    var post = request.body;
    
    connection.query('delete from signup where id=?', [request.user.id], (error, data) => {
      request.logout();
      request.session.destroy((err) => {
      response.redirect('/');
    });
    })
  })

  router.post('/login_process',
    // passport에서 만들어준 콜백함수
    // local -> username, password를 이용해서 인증하는 방식을 말한다.
    passport.authenticate('local', {
    //성공 했을 때는 이 경로로
    successRedirect: '/',

    // 실패 했을 때는 이 경로로
    failureRedirect: '/auth/login',
    // 그 후에 추가적인 콜백함수도 줄 수 있다.
    failureFlash: true,
    successFlash: true
  }));
  return router;
}
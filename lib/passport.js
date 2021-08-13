const connection = require('./db');

module.exports = function(app) {
    var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;


    // passport 를 미들웨어로 설치해준것 (passport가 express에 개입하게 됌)

    // passport를 이용하겠다
    app.use(passport.initialize());

    // 우리는 내부적으로 session을 이용하겠다.
    app.use(passport.session());


    //session을 처리하는 방법 -> mysql 서버에 저장하는 코드라고 할 수 있다. -> 그래서 딱 한번 호출되는 것이다.
    passport.serializeUser(function(user, done) {
    // console.log('serializeUser', user);
    done(null, user.email);
    // done(null, user);
    });

    passport.deserializeUser(function(id, done) {
    // console.log('deserializeUser', id);
    connection.query(`select * from signup where email=?`, [id], (error, data) => {
    done(null, data[0]); // 이게 request.user에 저장되게 약속되어있다.
    });
    // 두번째 인자로는 식별할 수 있는 인자를 주어지게 된다 (우리의 경우에는 email)
    // done(null, user);
    });

    passport.use(new LocalStrategy(
    {
    usernameField: 'email',
    passwordField: 'pwd'
    },
    function(username, password, done) {
    // console.log('LocalStrategy', username, password)

    connection.query(`select * from signup`, (error, data) => {
    var i = 0;
    var is_checked = false;
    while(i < data.length) {
        if(username === data[i].email) {
        is_checked = true;
        // console.log(1)
        
        if(password === data[i].password) {
            // console.log(2);

            // data[i]를 serializeUser콜백 함수의 첫번째 인자로 주입하게 되기로 약속되어 있다.
            return done(null, data[i], {
            message: 'Sucess login!!'
            });
        } else {
            console.log(i == (data.length - 1))
            console.log(is_checked);
            if(i == (data.length - 1) || is_checked) {
            // console.log(3);
            return done(null, false, {
            message: 'Incorrect password'
            });
            }
        }
        } else {
            if(i === (data.length - 1)) {
            // console.log(4);
            return done(null, false, {
                message: 'Incorrect email.'
            });
            }
        }
        i += 1;
    }
    });
    }
    ));

    return passport;
}

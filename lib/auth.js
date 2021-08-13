var connection = require('../lib/db');

module.exports = {
    isOwner: function(request, response) {
        // 만약 user객체가 배어있다면 로그인이 되어있지 않은것이고
        // user객체에 데이터가 들어있다면 로그인 되어있는 것이다.
        if(request.user) {
            return true;
        } else {
            return false;
        }
    },
    statusUI: function(request, response) {
        var authStateUI = `
        <div align="center" class="container">
            <a href="/auth/login">login</a> <a href="/auth/signup">signup</a>
        </div>
        <style>
            .container {
                border-bottom: solid 5px black;
                border-left: solid 3px black;
                border-right: solid 3px black;
                display: grid;
                grid-template-columns: 1fr 1fr;
            }
        </style>
        
        `
        if(this.isOwner(request, response)) {
            authStateUI = `
            <div id="all_container" align="center">
            <div style="border-right: 2px solid black">
                ${request.user.nickname}
            </div>
            <div style="border-right: 2px solid black">
                <a href="/auth/logout">logout</a>
            </div>
            <form action="/auth/withdrawl_process" method="post">
            
                <input type="submit" value="withdrawl">
            </form>
            </div>
            <style>
                #all_container {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    border-bottom: 5px solid black;
                    border-right: 3px solid black;
                    border-left: 3px solid black;
                    padding-right: 10px;
                    padding-bottom: 5px;
                    padding-left: 3px;
                }
            </style>
            `
        }
        return authStateUI
    }
}

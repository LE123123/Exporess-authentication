var connection = require('../lib/db');

module.exports = {
    isOwner: function(request, response) {
        if(request.session.is_logined) {
            console.log('its true')
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
            authStateUI = `${request.session.nickname} | <a href="/auth/logout">logout</a>`
        }
        return authStateUI
    }
}

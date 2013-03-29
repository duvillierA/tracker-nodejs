module.exports = {
    http_port: 3000,
    request_timeout: 100000,
    session_secret: "keyboard cat",
    log_requests: false,
    test: false,
    layout: { 
        default: 'layout',
        admin: 'layout_admin',
    },
    isDebug: true,
    mongo: {
        host: 'localhost',
        db: 'tracker',
        port : '27017',
        options : {
            db: {
                safe: true
            }/*,
            user : '',
            pass:  ''*/
        }
    }
};
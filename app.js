/**
 * Module dependencies.
 */

var express = require('express')
  , hbs = require('hbs')
  , mongoose = require('mongoose')
  , flash = require('connect-flash')
  , passport = require('passport')
  , routes = require('./config/routes')
  , http = require('http')
  , path = require('path')
  , auth = require('./middleware/auth')()
  , partials = require('./helpers/partials')
  , breadcrumb = require('./helpers/breadcrumb')
  ;

mongoose.connect('localhost', 'tracker');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.engine('html', require('hbs').__express);
  app.use(function(req, res, next){
    var isAdmin = /^\/admin*/.test(req.url);
    if(isAdmin) {
      app.set('view options', {
        layout: 'admin/layout_admin'
      });
    }
    next();
  });
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  // Give Views/Layouts direct access to session data.
  app.use(function(req, res, next){
    res.locals.session = req.session;
    if(req.user) {
      res.locals.session.user = req.user;
    }else{
      if(res.locals.session.user) delete res.locals.session.user;
    }
    next();
  });
  app.use(breadcrumb);
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
  partials(app);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

routes(app, passport);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

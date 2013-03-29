var 
	express = require('express'),
  	flash = require('connect-flash'),
  	passport = require('passport'),
  	path = require('path'),
  	auth = require('./auth'),
  	session = require('./session'),
  	layout = require('./layout'),
  	breadcrumb = require('./breadcrumb')
;

module.exports = function(app){

	auth();

	app.configure(function(){
	  app.set('port', process.env.PORT || 3000);

	  app.set('view engine', 'html');
	  app.engine('html', require('hbs').__express);
	  app.use(layout(app));

	  app.use(express.favicon());
	  app.use(express.logger('dev'));
	  app.use(express.bodyParser());
	  app.use(express.methodOverride());

	  app.use(express.cookieParser('keyboard cat'));
	  app.use(express.session({ secret: 'keyboard cat' }));
	  app.use(flash());
	  app.use(passport.initialize());
	  app.use(passport.session());
	  app.use(session.populateUser);

	  app.use(breadcrumb);
	  app.use(app.router);
	  app.use(require('less-middleware')({ src: __dirname + '/public' }));
	  app.use(express.static(path.join(__dirname, '../../public')));
	});

	app.configure('development', function(){
	  app.use(express.errorHandler());
	});

/*	partials(app);
	routes(app, passport);*/

};

var 
	express = require('express'),
  	flash = require('connect-flash'),
  	passport = require('passport'),
  	less = require('less-middleware'),
  	path = require('path'),
  	auth = require('./auth'),
  	session = require('./session'),
  	layout = require('./layout'),
  	breadcrumb = require('./breadcrumb'),
  	bootstrapPath = path.join(__dirname, '../../node_modules', 'bootstrap');
;

module.exports = function(app, helpers){

	auth(app);

	app.configure(function(){
	  app.set('port', process.env.PORT || 3000);

	  app.set('view engine', 'html');
	  app.engine('html', require('hbs').__express);
	  app.use(layout(app));

	  app.use(express.favicon());
	  app.use(express.logger('dev'));
	  app.use(express.bodyParser({ keepExtensions: true, uploadDir: path.join(__dirname, '../../public/uploads') }));
	  app.use(express.methodOverride());
      app.use('/img', express.static(path.join(bootstrapPath, 'img')));

	  app.use(express.cookieParser('keyboard cat'));
	  app.use(express.session({ secret: 'keyboard cat' }));
	  app.use(flash());
	  app.use(passport.initialize());
	  app.use(passport.session());
	  app.use(session.populateUser);
	  app.use(session.populateFlash);

	  app.use(breadcrumb);
	  app.use(app.router);
		app.use(less({
			src    : path.join(__dirname, '../../public/less'),
			dest   : path.join(__dirname, '../../public/stylesheets'),
			paths  : [path.join(bootstrapPath, 'less')],
			prefix : '/stylesheets'
		}));
	  app.use(express.static(path.join(__dirname, '../../public')));
		app.use(function(req, res, next){
		    if(res.locals.breadcrumb) delete res.locals.breadcrumb;
			return res.render('errors/404', {layout: 'layout'});
			next(null);
		});
	});

	app.configure('development', function(){
	  app.use(express.errorHandler());
	});

/*	partials(app);
	routes(app, passport);*/

};

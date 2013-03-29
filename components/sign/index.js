var user = require('../../controllers/user');

module.exports = function (map, passport) {
/*
  SIGN 	
*/
	map
	.get('/sign', function(req, res){
		res.render('sign/index', {});
	})
	.get('/register', function(req, res){
		res.render('sign/register', {});
	})
	.post('/register', user.create, function(req, res){
		if(res.errors){
			return res.render('sign/register', {
				field: res.field,
				errors : res.errors
			});
		};
		req.login(res.user, function(err) {
			if (err) { throw err; }
			req.flash('info', res.user.username+', you are now login.');
			res.redirect('/admin');
		});
	})
	.get('/login', function(req, res) {
		res.render('sign/login', {});
	})
	.post('/login', user.find, function(req, res, next) {
		if(res.errors){
			return res.render('sign/login', {
				field: res.field,
				errors : res.errors
			});
		};
		req.login(res.user, function(err) {
			if (err) { throw err; }
			req.flash('info', res.user.username+', you are now login.');
			res.redirect('/admin');
		});
	})
	.get('/logout', function(req, res){
		req.flash('info', 'you are now logout.');
		req.logout();
  		res.redirect('/admin');
	});
}
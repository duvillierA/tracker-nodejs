var 
	mongoose = require('mongoose'),
	async = require('async'),
	Users = require('../models/users.js')
;

exports.all = function(req, res, next){

};

exports.read = function(req, res, next){
	Users.findById(req.params.id,function(err, user){
		if (err) { return next(err); }
	 	res.user = user;
		next(null);
	});
};

exports.find = function(req, res, next){
	var 
		email = req.param('email'),
		password = req.param('password')
	;

	Users.authenticate(email, password, function (err, user) {
	 	if (err) {  return next(err)};
	 	if(!user) {
			res.errors = {
				emailAndPassword : {
					type : 'incorrect email or password'
				}
			}
		}
		res.field = {email:email};
		res.user = user;
		next(null);
	});
};

exports.create = function(req, res, next){
	var 
		username = req.param('username'),
		email = req.param('email'),
		password = req.param('password')
	;

	Users.create({
		username:username,
		email:email,
		password:password
	}, function(err, user){
		if (err) {
			res.field = {
				username: username,
				email: email
			};
			//duplicate key
			if (err.code === 11000) {
				// handle error
				res.errors = {
					email: {
						type : 'Email already exists'
					}
				}
			}// Model Validation Error
			else if(err.name =='ValidationError') {
				// handle error
				res.errors = err.errors;
			}else{
				return next(err);
			}
		}
		res.user = user;
		next(null);
	});
}

exports.update = function(req, res, next){}

exports.delete = function(req, res, next){
	Users.findByIdAndRemove(req.params.id,function(err, user){
		if (err) { return next(err); }
	 	res.user = user;
	 	next(null);
	});
}
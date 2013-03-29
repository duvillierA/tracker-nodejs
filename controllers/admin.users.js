var 
	mongoose = require('mongoose'),
	async = require('async'),
	Users = require('../models/users.js'),
	sanitize = require('validator').sanitize
;

exports.all = function(req, res, next){
	Users.find(function(err, users){
		if (err) { return next(err); }
		res.data = {users:users};
		next(null);
	});
}
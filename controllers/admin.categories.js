var 
	mongoose = require('mongoose'),
	async = require('async'),
	Categories = require('../models/categories.js'),
	sanitize = require('validator').sanitize
;

exports.all = function(req, res, next){
	Categories.find(function(err, categories){
		if (err) { return next(err); }
		if(!res.data) res.data = {};
		res.data.categories = categories;
		next(null);
	});
}

exports.create = function(req, res, next){
	Categories.create({
		name:req.param('name'),
		index: {
			visible : sanitize(req.param('index.visible')).toBoolean(),
			positon : sanitize(req.param('index.position')).toInt()
		}
	},function(err, category){
		if (err) { return next(err); }
		res.data = {category:category};
		next(null);
	});
}

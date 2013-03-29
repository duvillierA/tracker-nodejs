var 
	mongoose = require('mongoose'),
	async = require('async'),
	Sections = require('../models/sections.js')
;

exports.all = function(req, res, next){
	Sections.find()
	.populate('categories')
	.sort({categories:'asc', name:'asc'})
	.exec(function(err, sections){
		if (err) { return next(err); }
		res.data = {sections:sections};
		next(null);
	});
}

exports.create = function(req, res, next){
	Sections.create({
		name:req.param('name'),
		parent:req.param('categories')
	},function(err, section){
		if (err) { return next(err); }
		res.data = {section:section};
		next(null);
	});
}

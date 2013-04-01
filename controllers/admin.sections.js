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
		if(!res.data) res.data = {};
		res.data.sections = sections;
		next(null);
	});
}

exports.create = function(req, res, next){
	Sections.create({
		name:req.param('name'),
		type:req.param('type'),
		categories:req.param('categories')
	},function(err, section){
		if (err) { return next(err); }
		if(!res.data) res.data = {};
		res.data.section = section;
		next(null);
	});
}


exports.read = function(req, res, next){
	Sections.findById(req.params.id,function(err, section){
		if (err) { return next(err); }
		if(!res.data) res.data = {};
		res.data.section = section;
		next(null);
	});
}

exports.update = function(req, res, next){
	Sections.findOneAndUpdate(
		{
			_id:req.params.id
		},
		{
			name:req.param('name'),
			type:req.param('type'),
			categories:req.param('categories')
		}
		, function(err, section){
			if (err) { return next(err); }
			if(!res.data) res.data = {};
		 	res.data.section = section;
		 	next(null);
		}
	);
}


exports.delete = function(req, res, next){
	Sections.findByIdAndRemove(req.params.id, function(err, section){
		if (err) { return next(err); }
		if(!res.data) res.data = {};
	 	res.data.section = section;
	 	next(null);
	});
}
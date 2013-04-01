var 
	mongoose = require('mongoose'),
	async = require('async'),
	Sections = require('../models/sections.js'),
	FilesOptions = require('../models/files_options.js'),
	Categories = require('../models/categories.js')
;

exports.all = function(req, res, next){
	FilesOptions.find()
	.populate('categories')
	.sort({type:'asc', name:'asc'})
	.exec(function(err, files_options){
		if (err) { return next(err); }
		res.data = {files_options:files_options};
		next(null);
	});
}

exports.create = function(req, res, next){
	FilesOptions.create({
		name:req.param('name'),
		infos:req.param('infos'),
		type:req.param('type'),
		categories:req.param('categories')
	},function(err, options){
		if (err) { return next(err); }
		res.data = {options:options};
		next(null);
	});
}

exports.read = function(req, res, next){
	FilesOptions.findById(req.params.id,function(err, files_options){
		if (err) { return next(err); }
		if(!res.data) res.data = {};
		res.data.files_options = files_options;
		next(null);
	});
}

exports.update = function(req, res, next){
	FilesOptions.findOneAndUpdate(
		{
			_id:req.params.id
		},
		{
			name:req.param('name'),
			infos:req.param('infos'),
			type:req.param('type'),
			categories:req.param('categories')
		}
		, function(err, files_options){
			if (err) { return next(err); }
			if(!res.data) res.data = {};
		 	res.data.files_options = files_options;
		 	next(null);
		}
	);
}


exports.delete = function(req, res, next){
	next(null);
}


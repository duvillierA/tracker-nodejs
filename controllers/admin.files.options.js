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
	.exec(function(err, files_options){
		if (err) { return next(err); }
		res.data = {files_options:files_options};
		next(null);
	});
}

exports.create = function(req, res, next){
	var categories = [];
	async.waterfall([
	    function(next){
			FilesOptions.create({
				name:req.param('name'),
				infos:req.param('infos'),
				type:req.param('type'),
				categories:req.param('categories')
			},function(err, options){
				if (err) { return next(err); }
				next(null, options);
			});
	    }
	], function (err, options) {
		if (err) { return next(err); };
		res.data = {options:options};
		next(null);
	});

}

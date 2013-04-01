var 
	mongoose = require('mongoose'),
	async = require('async'),
	Files = require('../models/files.js'),
	FilesOptions = require('../models/files_options.js'),
	Sections = require('../models/sections.js'),
	Categories = require('../models/categories.js')
;

exports.all = function(req, res, next){
	async.parallel({
		categories : function (next) {
			Categories.find(function(err, categories){
				if (err) { return next(err); }
				next(null, categories);
			});
		},
		sections : function (next) {
			Sections.find()
			.populate('categories')
			.sort({categories:'asc', name:'asc'})
			.exec(function(err, sections){
				if (err) { return next(err); }
				next(null, sections);
			});
		},
		files_options : function (next) {
			FilesOptions.find()
			.populate('categories')
			.sort({type:'asc', name:'asc'})
			.exec(function(err, options){
				if (err) { return next(err); }
				next(null, options);
			});
		}
	}, function (err, result) {
	   res.data = result;
	   next(null);
	});
}
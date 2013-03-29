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
	    	var categories = [];
	    	async.each(req.param('categories'), function(category_id, next){
				Categories.findById(category_id, function(err, category){
					if (err) { return next(err); };
					categories.push(category);
					next(null);
				});
			}, function(err){
				if (err) { return next(err); };
				next(null, categories);
			    // if any of the saves produced an error, err would equal that error
			});
	    },
	    function(categories, next){
			FilesOptions.create({
				name:req.param('name'),
				infos:req.param('infos'),
				type:req.param('type'),
				categories:categories
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

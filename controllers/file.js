var 
	mongoose = require('mongoose'),
	async = require('async'),
	Categories = require('../models/categories.js'),
	Files = require('../models/files.js'),
	FilesOptions = require('../models/files_options.js'),
	Sections = require('../models/sections.js')
;

exports.all = function(req, res, next){
	Categories.find(function(err, categories){
		res.categories = [];
		async.eachSeries(categories, function(category, next){
			if(!category.hidden && category.index.visible){
	    		Files.find()
				.where('categories').elemMatch({ _id: category.id})
		    	.sort({created: 'desc'})
		    	.limit(10).exec(function(err, files){
					if (err) { return next(err); };
					res.categories.push({
						name : category.name,
						id : category.id,
						files : files
					});
					next(null);
				});
			}
		}, function(err){
			if (err) { return next(err); };
			next(null);
		    // if any of the saves produced an error, err would equal that error
		});
	})
}

exports.new = function(req, res, next){
	async.parallel({
		categories : function (next) {
			Categories.find(function(err, categories){
				if (err) { return next(err); }
				next(null, categories);
			});
		},
		sections : function (next) {
			Sections.find(function(err, sections){
				if (err) { return next(err); }
				next(null, sections);
			});
		},
		formats : function (next) {
			FilesOptions.find({type:'format'}, function(err, formats){
				if (err) { return next(err); }
				next(null, formats);
			});
		},
		qualities : function (next) {
			FilesOptions.find({type:'quality'}, function(err, qualities){
				if (err) { return next(err); }
				next(null, qualities);
			});
		}
	}, function (err, result) {
		if (err) { return next(err); }   
		res.data = result;
		next(null);
	});
}

exports.read = function(req, res, next){
	Files.findById(req.params.id,function(err, file){
		if (err) { return next(err);}
	 	res.file = file;
		next(null);	
	});
}

exports.create = function(req, res, next){

	var 
		_title = req.param('title'),
		_body = req.param('body'),
		_category = req.param('category'),
		_sections = req.param('sections'),
		_format = req.param('format'),
		_quality = req.param('quality')
	; 

	async.waterfall([
	    function(next){
			Files.create({
				title: _title,
				body: _body,
				category: _category,
				sections: _sections,
				format: _format,
				quality: _quality,
				createdAt: Date.now(),
				creator: req.user
			},function(err, file){
				if (err) { 
					if(err.name =='ValidationError') {
						// handle error
						res.field = {
							title: _title,
							body: _body,
							category: _category,
							sections: _sections,
							format: _format,
							quality: _quality
						};
						res.errors = err.errors;
					}else{
						return next(err);
					}
				 }

				next(null, file);
			});
	    }
	], function (err, file) {
		if (err) { return next(err); }  
		res.data = {file:file}; 
		next(null);
	});
}

exports.update = function(req, res, next){}

exports.delete = function(req, res, next){
	Files.findByIdAndRemove(req.params.id,function(err, file){
		if (err) { return next(err); }
	 	res.data = {file:file}; 
	 	next(null);
	});
}
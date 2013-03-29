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
	async.waterfall([
	    function(next){
			Categories.findById(req.param('categories'),function(err, category){
				if (err) { return next(err); }
				next(null, category);
			});
	    },
	    function(category, next){
			Files.create({
				title:req.param('title'),
				body:req.param('body'),
				categories:[category],
				createdAt:Date.now()
			},function(err, file){
				if (err) { return next(err); }
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
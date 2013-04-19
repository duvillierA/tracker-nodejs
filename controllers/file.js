var 
	mongoose = require('mongoose'),
	async = require('async'),
	Categories = require('../models/categories.js'),
	Files = require('../models/files.js'),
	FilesOptions = require('../models/files_options.js'),
	Sections = require('../models/sections.js'),
	fs = require('fs');
;

exports.latest = function(req, res, next){
	var category = req.params.category || undefined;
	if(category){
		Files.find()
		.where('category').equals(category)
		.populate('category gender system format quality subtitles languages')
		.sort({createdAt:'desc'})
		.limit(50)
		.exec(function(err, files){
			if(!res.data) res.data = {};
			res.data.files = files;
			next(null);
		})
	}else{
		Files.find()
		.populate('category gender system format quality subtitles languages')
		.sort({createdAt:'desc'})
		.limit(50)
		.exec(function(err, files){
			if(!res.data) res.data = {};
			res.data.files = files;
			next(null);
		})
	}
}

exports.all = function(req, res, next){
	next(null);
}


exports.new = function(req, res, next){
	
	var 
		category = req.param('category') || undefined;
	;

	async.parallel({
		categories : function (next) {
			Categories.find()
			.sort({name:'asc'})
			.exec(function(err, categories){
				if (err) { return next(err); }
				next(null, categories);
			});
		},
		gender : function (next) {
			if(!category) return next(null);

			Sections.find({type:'gender'})
			.where('categories').equals(category)
			.sort({name:'asc'})
			.exec(function(err, sections){
				if (err) { return next(err); }
				next(null, sections);
			});

		},
		system : function (next) {
			Sections.find({type:'system'})
			.where('categories').equals(category)
			.sort({name:'asc'})
			.exec(function(err, sections){
				if (err) { return next(err); }
				next(null, sections);
			});
		},
		formats : function (next) {
			FilesOptions.find({type:'format'})
			.where('categories').equals(category)			
			.sort({name:'asc'})
			.exec(function(err, formats){
				if (err) { return next(err); }
				next(null, formats);
			});
		},
		qualities : function (next) {
			FilesOptions.find({type:'quality'})
			.where('categories').equals(category)
			.sort({name:'asc'})
			.exec(function(err, qualities){
				if (err) { return next(err); }
				next(null, qualities);
			});
		},
		languages : function (next) {
			FilesOptions.find({type:'language'})
			.where('categories').equals(category)
			.sort({name:'asc'})
			.exec(function(err, languages){
				if (err) { return next(err); }
				next(null, languages);
			});
		},
		subtitles : function (next) {
			FilesOptions.find({type:'subtitle'})
			.where('categories').equals(category)
			.sort({name:'asc'})
			.exec(function(err, subtitles){
				if (err) { return next(err); }
				next(null, subtitles);
			});
		}
	}, function (err, result) {
		if (err) { return next(err); }   
		if(!res.data) res.data = {};
		for(var key in result){
			res.data[key] = result[key];	
		}
		res.data.category = category;
		next(null);
	});
}

exports.read = function(req, res, next){
	Files.findById(req.params.id,function(err, file){
		if (err) { return next(err);}
		Files.readnfo(file.nfo, function(err, data){
			if (err) { return next(err);}
			if (data) file.body = data;
		 	res.file = file;
			next(null);	
		})
	});
}

exports.create = function(req, res, next){

	var file = new Files();

	var fields = {
		title: req.param('title'),
		nfo : req.files && req.files.nfo  ? req.files.nfo : null,
		category: req.param('category'),
		sections: req.param('sections'),
		gender : req.param('gender'),
		system : req.param('system'),
		format: req.param('format'),
		quality: req.param('quality'),
		languages: req.param('languages'),
		subtitles: req.param('subtitles'),
		createdAt: Date.now(),
		creator: req.user
	};

	res.field = fields;

	for(var key in fields){
		var field = fields[key];
		if(field && field !="")
			file[key] = field;
	}

	async.waterfall([
	    function(next){
			file.save(function(err, file){
				if (err) { 
					if(err.name =='ValidationError') {
						// handle error
						console.log(err.errors);
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
		if(!res.data) res.data = {}; 
		res.data.file = file; 
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
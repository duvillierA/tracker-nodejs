var 
	mongoose = require('mongoose'),
	async = require('async'),
	Categories = require('../models/categories.js'),
	Files = require('../models/files.js'),
	FilesOptions = require('../models/files_options.js'),
	Sections = require('../models/sections.js')
;

exports.all = function(req, res, next){
	next(null);
}

exports.new = function(req, res, next){
	
	var 
		category = req.param('category') && req.param('category') !='' ? req.param('category'): undefined;
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
			if(category){
				Sections.find({type:'gender'})
				.where('categories').equals(category)
				.sort({name:'asc'})
				.exec(function(err, sections){
					if (err) { return next(err); }
					next(null, sections);
				});
			}else{
				next(null);
			}
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
		_gender = req.param('gender'),
		_system = req.param('system'),
		_format = req.param('format'),
		_quality = req.param('quality'),
		_languages = req.param('languages'),
		_subtitles = req.param('subtitles')
	; 

	var file = new Files();

	var fields = {
		title: _title,
		body: _body,
		category: _category,
		sections: _sections,
		gender : _gender,
		system : _system,
		format: _format,
		quality: _quality,
		languages: _languages,
		subtitles: _subtitles,
		createdAt: Date.now(),
		creator: req.user
	};

	for(var key in fields){
		var field = fields[key];
		if(field && field!="")
			file[key] = field;
	}

	async.waterfall([
	    function(next){
			file.save(function(err, file){
				if (err) { 
					if(err.name =='ValidationError') {
						// handle error
						res.field = fields;
						res.errors = err.errors;
						console.log(res.errors);
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
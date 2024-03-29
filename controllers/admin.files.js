var 
	mongoose = require('mongoose'),
	async = require('async'),
	Categories = require('../models/categories.js'),
	Files = require('../models/files.js'),
	FilesOptions = require('../models/files_options.js'),
	Sections = require('../models/sections.js')
;

exports.all = function(req, res, next){
	Files.find()
		.populate('category gender system format quality subtitles languages creator')
			.limit(50)
				.exec(function(err, files){
					if (err) { return next(err); };
					res.data = {files:files};
					next(null);
				});
}

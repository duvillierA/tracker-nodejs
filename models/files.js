var 
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	helpers = require('../lib/helpers'),

	Validator = require('validator').Validator,
	val = new Validator(),
	moment = require('moment'),
	fs = require('fs')
;

val.error = function(msg) {};

/*
FILES
*/

	var filesSchema = new Schema({
		category : { type: Schema.Types.ObjectId, ref: 'categories', required : true },
		gender : [{ type: Schema.Types.ObjectId, ref: 'sections' }],
		system : [{ type: Schema.Types.ObjectId, ref: 'sections' }],
		format : { type: Schema.Types.ObjectId, ref: 'files_options' },
		quality : { type: Schema.Types.ObjectId, ref: 'files_options' },
		languages : [{ type: Schema.Types.ObjectId, ref: 'files_options' }],
		subtitles : [{ type: Schema.Types.ObjectId, ref: 'files_options' }],
		creator : { type: Schema.Types.ObjectId, ref: 'users' },
		status : String,
		link : String,
		title : { type : String, trim: true, required : true },
		slug :  { type : String, lowercase: true, trim: true, set: helpers.slugify},
		body : String,
		nfo : { type : Schema.Types.Mixed, required : true },
		size: { type: Number, min: 0 },
		comments: [{ type: Schema.Types.ObjectId, ref: 'comments' }],
		meta: {
			greetz: { type: Number, min: 0},
			votes: { type: Number, min: 0, max : 5 },
			tags : [String],
			favs: Number
		},
		comments : String,
		createdAt : Date,
		modifiedAt : Date,
		hidden: {type : Boolean , default : true }
	}, { _id: true, collection: 'files', autoIndex: false });

	filesSchema.path('createdAt').get(function (createdAt) {
		if(createdAt) return moment(createdAt).format("L");
	});

	filesSchema.path('modifiedAt').get(function (modifiedAt) {
		if(modifiedAt) return moment(modifiedAt).format("L");
	});

	filesSchema
	.path('creator').validate(function(creator) {
		if (!creator) this.invalidate('creator', 'Creator is required');
	}, null);
	filesSchema
	.path('creator').set(function(creator) {
		if(creator) return creator.id;
	}, null);

	filesSchema
	.path('title').validate(function(title) {
		if (!title) return this.invalidate('title', 'Title cannot be blank.');
		if (!val.check(title).len(2)) this.invalidate('title', 'Title must be at least 2 characters.');
	}, null);

	filesSchema
	.path('nfo').validate(function(file) {
		if (helpers.getExtension(file.name) != "nfo" && helpers.getExtension(file.name) != "txt") {
			fs.unlinkSync(file.path);
			this.invalidate('nfo', '.nfo or .txt extension is expected.');
		}
	}, null);

	filesSchema.static('readnfo', function (nfo, next) {

		if(!nfo) return next(null, false);
		if(nfo.size == 0) return next(null, false);

		var path = nfo.path;
		fs.exists(path, function(exists) {
	  		if (!exists) return next(null, false);
			fs.stat(path, function(error, stats) {
			  fs.open(path, "r", function(error, fd) {
			    var buffer = new Buffer(stats.size);
			    fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
			      var data = buffer.toString("binary", 0, buffer.length);
			      fs.close(fd);
			      next(null, data);
			    });
			  });
			});
		});

	});

	filesSchema
	.path('body').validate(function(body) {
		if (!body) return this.invalidate('body', 'Content cannot be blank.');
		if (!val.check(body).len(10)) this.invalidate('body', 'Content must be at least 10 characters.');
	}, null);


	filesSchema
	.path('category').validate(function(category) {
		if (!category) this.invalidate('category', 'Category is required');
	}, null);

	/* 
		Optional fields :
		Check if the value is not empty
	*/

	filesSchema
	.path('gender').validate(function(gender) {
		if (gender && !gender.length) this.invalidate('gender', 'Gender is required');
	}, null);

	filesSchema
	.path('system').validate(function(system) {
		if (system && !system.length) this.invalidate('system', 'System is required');
	}, null);

	filesSchema
	.path('format').validate(function(format) {
		if (format && typeof(format) != 'object') this.invalidate('format', 'Format is required');
	}, null);

	filesSchema
	.path('quality').validate(function(quality) {
		if (quality && typeof(quality) != 'object') this.invalidate('quality', 'Quality is required');
	}, null);

	filesSchema
	.path('languages').validate(function(languages) {
		if (languages && !languages.length) this.invalidate('languages', 'Languages is required');
	}, null);

	filesSchema
	.path('subtitles').validate(function(subtitles) {
		if (subtitles && !subtitles.length) this.invalidate('subtitles', 'Subtitles is required');
	}, null);

// define & export collection
module.exports = mongoose.model('files', filesSchema);
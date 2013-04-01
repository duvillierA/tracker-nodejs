var 
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	helpers = require('../lib/helpers'),

	Validator = require('validator').Validator,
	val = new Validator(),
	moment = require('moment')
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
		body : { type : String, required : true },
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
	.path('body').validate(function(body) {
		if (!body) return this.invalidate('body', 'Content cannot be blank.');
		if (!val.check(body).len(10)) this.invalidate('body', 'Content must be at least 10 characters.');
	}, null);

	filesSchema
	.path('category').validate(function(category) {
		if (!category) this.invalidate('category', 'Category is required');
	}, null);

	filesSchema
	.path('gender').validate(function(gender) {
		console.lg
		if (!gender) this.invalidate('gender', 'Gender is required');
	}, null);

	filesSchema
	.path('system').validate(function(system) {
		if (!system) this.invalidate('system', 'System is required');
	}, null);

	filesSchema
	.path('format').validate(function(opts) {
		if (!opts) this.invalidate('format', 'Format is required');
	}, null);

	filesSchema
	.path('quality').validate(function(opts) {
		if (!opts) this.invalidate('quality', 'Quality is required');
	}, null);

// define & export collection
module.exports = mongoose.model('files', filesSchema);
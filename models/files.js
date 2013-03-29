var 
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	helpers = require('../lib/helpers'),

	categoriesSchema = require('./categories').schema,
	sectionsSchema = require('./sections').schema,
	filesOptionsSchema = require('./files_options').schema,
	usersSchema = require('./users').schema,

	moment = require('moment');
;
/*
FILES
*/

	var filesSchema = new Schema({
		categories : [categoriesSchema],
		sections : [sectionsSchema],
		opts : [filesOptionsSchema],
		creator : [usersSchema],
		status : String,
		link : String,
		languages : [String],
		title : { type : String, trim: true },
		slug :  { type : String, lowercase: true, trim: true, set: helpers.slugify},
		body : String,
		size: { type: Number, min: 0 },
		comments: [{
			title : { type : String, trim: true },
			body: String,
			date : { type: Date, default: Date.now },
			uid : Number 
		}],
		meta: {
			greetz: { type: Number, min: 0},
			votes: { type: Number, min: 0, max : 5 },
			tags : [String],
			favs: Number
		},
		createdAt : Date,
		modifiedAt : Date,
		hidden: {type : Boolean , default : true }
	}, { _id: true, collection: 'files', autoIndex: false });

	filesSchema.path('createdAt').get(function (createdAt) {
		return moment(createdAt).format("L");
	});

	filesSchema.path('modifiedAt').get(function (modifiedAt) {
		return moment(modifiedAt).format("L");
	});

// define & export collection
module.exports = mongoose.model('files', filesSchema);
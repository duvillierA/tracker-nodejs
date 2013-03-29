var 
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	helpers = require('../lib/helpers'),
	categoriesSchema = require('./categories').schema
;


/*
SECTIONS
*/

	var sectionsSchema = new Schema({
		parent : { type: Schema.Types.ObjectId, ref: 'categories' },
		name : { type : String, set : helpers.capitalize },
		slug :  { type : String, lowercase: true, trim: true},
		ancestors : [{ type: Schema.Types.ObjectId, ref: 'categories' }],
		hidden: {type : Boolean , default : false }
	}, { _id: true, collection: 'sections'});

	sectionsSchema.pre('save', function(next) {
		this.slug = helpers.slugify(this.name);
		next();
	});

// define & export collection
module.exports = mongoose.model('sections', sectionsSchema);
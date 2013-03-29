var 
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	helpers = require('../lib/helpers')
;

/*
FILES OPTIONS
*/

	var filesOptionsSchema = new Schema({
		categories : [{ type: Schema.Types.ObjectId, ref: 'categories' }],
		name : { type : String, set : helpers.capitalize },
		slug :  { type : String, lowercase: true, trim: true},
		infos : String,
		type :  { type : String, enum: ['format','language','quality','system','type']},
		ancestors : [{ type: Schema.Types.ObjectId, ref: 'categories' }],
		hidden: {type : Boolean , default : false }
	}, { _id: true, collection: 'files_options'});

	filesOptionsSchema.pre('save', function(next) {
		this.slug = helpers.slugify(this.name);
		next();
	});


// define & export collection
module.exports = mongoose.model('files_options', filesOptionsSchema);
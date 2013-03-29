var 
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	helpers = require('../lib/helpers')
;
/*
CATEGORIES
*/
	var categoriesSchema = new Schema({
		parent : Schema.Types.ObjectId,
		name : { type : String, set : helpers.capitalize, required: true },
		slug :  { type : String, lowercase: true, trim: true},
		ancestors : [categoriesSchema],
		index : {
			visible : {type : Boolean , default : false },
			position : {type : Number , default : 0 }
		},
		hidden: {type : Boolean , default : false }
	}, { _id: true, collection: 'categories'});

	categoriesSchema.pre('save', function(next) {
		this.slug = helpers.slugify(this.name);
		next();
	});

// define & export collection
module.exports = mongoose.model('categories', categoriesSchema);
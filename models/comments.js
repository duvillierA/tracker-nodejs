var 
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	helpers = require('../lib/helpers')
;

/*
COMMENTS
*/

	var commentsSchema = new Schema({
		creator : { type: Schema.Types.ObjectId, ref: 'users' },
		file : { type: Schema.Types.ObjectId, ref: 'files' },
		body : String,
		hidden: {type : Boolean , default : false }
	}, { _id: true, collection: 'sections'});

// define & export collection
module.exports = mongoose.model('comments', commentsSchema);
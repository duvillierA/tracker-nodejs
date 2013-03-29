var mongoose = require('mongoose');

module.exports = function(app){
	var 
		config = app.get('config'),
		host = config.mongo.host,
		db = config.mongo.db,
		options = config.mongo.options
	;
	mongoose.connect('mongodb://'+host+'/'+db, options);
}
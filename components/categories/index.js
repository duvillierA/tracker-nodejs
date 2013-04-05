var file = require('../../controllers/file');

module.exports = function (map, passport) {
	/*
	 Category MAPPING 	
	*/
	map.get('/category/:category', file.latest, function(req, res){
		res.render('files/all', {
			categories:{
				test: {
					files:res.data.files
				}
			}
		});
	});
}
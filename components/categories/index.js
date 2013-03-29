module.exports = function (map, passport) {
	/*
	 Category MAPPING 	
	*/
	map.get('/category/:id', function(req, res){
		res.render('category/show', {category:res.category});
	});
}
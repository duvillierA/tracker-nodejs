module.exports = function (map, passport) {

	map
	.get('*', function(req, res){
		res.render('errors/404', {});
	})

}
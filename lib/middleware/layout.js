module.exports = function(app){
	return function (req, res, next) {
		var isAdmin = /^\/admin*/.test(req.url);
		if(isAdmin) {
			app.set('view options', {layout: 'admin/layout'});
		}else{
			app.set('view options', {layout: 'layout'});
		}
		next();
	};
};
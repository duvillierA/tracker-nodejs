module.exports = function(app){
	return function (req, res, next) {
		var isAdmin = /^\/admin*/.test(req.url);
		if(isAdmin) {
		  app.set('view options', {
		    layout: 'admin/layout_admin'
		  });
		}
		next();
	};
};
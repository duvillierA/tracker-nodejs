exports.populateUser = function(req, res, next){
	if(!req.session) return next(null);
	if(!res.locals.session) res.locals.session = req.session;
	if(!req.user && res.locals.session.user) delete res.locals.session.user; 
	if(req.user) res.locals.session.user = req.user;
	next(null);
};
exports.populateFlash = function(req, res, next){
	res.locals.flash = {
		success : req.flash('success'),
		info : req.flash('info'),
		error : req.flash('error')
	}
	next(null);
};
exports.populateUser = function(req, res, next){
	if(req.session) res.locals.session = req.session;
	if(req.user) {
	  res.locals.session.user = req.user;
	}else{
	  if(res.locals.session.user) delete res.locals.session.user;
	}
	next();
};
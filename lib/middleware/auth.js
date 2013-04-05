var 
  passport = require('passport'),
  mongoose = require('mongoose')
;

module.exports = function (app) {

  passport.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated())  return next();
    req.flash('info', 'Please log in to the application.');
    return res.redirect("/sign");
  };

  passport.ensureAdminAuthenticated = function(req, res, next) {
    if (req.isAuthenticated() && req.user.role == 'admin')  return next();
    req.flash('info', 'You are not authorized.');
    app.set('view options', {layout: 'layout'});
    if(res.locals.breadcrumb) delete res.locals.breadcrumb;
    res.format({
      text: function(){
        res.send('401 : not authorized');
      },
      
      html: function(){
        res.render('errors/401', {});
      },
      json: function(){
        res.send({ message: '401 : not authorized' });
      }
    });
  };

  passport.serializeUser(function(user, next) {
    next(null, user.id);
  });

  passport.deserializeUser(function(id, next) {
    mongoose.model('users')
    .findById(id,function(err, user){
      next(err, user);
    });
  });

}
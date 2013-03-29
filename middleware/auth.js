var 
  passport = require('passport'),
  mongoose = require('mongoose'),
  schemas = require('../config/schemas.js') // define collections
;

module.exports = function () {

  passport.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error', 'Please log in to the application.');
    return res.redirect("/sign");
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
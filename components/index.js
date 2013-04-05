var 
	fs = require('fs'),
	path = require('path'),
	passport = require('passport')
;

/*
 * Define all routes inside components dir
 */

module.exports = function (app, helpers) {

	fs.readdir(__dirname, function(err, files){
        
        var len = files.length;
        
        while(len--){
            (function(){
                var reference = path.join(__dirname, files[len]);
                fs.stat(reference, function(err, stats){
                    if (stats.isDirectory()) require(reference)(app, passport, helpers);
                });
            }());
        }
    });


};
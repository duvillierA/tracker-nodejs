var express = require('express');

// Globals
/*_ = require('underscore');*/

// Base libs
var config = require('./lib/config');
var middleware = require('./lib/middleware');
var mongoose = require('./lib/mongoose');
var hbs = require('./lib/hbs');
var helpers = require('./lib/helpers');
var components = require('./components');

function createApp(config) {
    var app = express();

    app.set('config', config);
    app.set('views', __dirname + '/views');
    // NoSql DB
    mongoose(app);
    /* Cookie && session && herror handler...*/
    middleware(app, helpers);
    /* Partials && view helpers*/
    hbs(app);
    components(app, helpers)

    return app;
}

// Expose the app
var app = module.exports = createApp(config);

app.listen(config.http_port);
console.log("Listening on", config.http_port);
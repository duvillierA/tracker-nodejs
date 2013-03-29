var 
	url = require('url'),
	helpers = require('./helpers.js');
;


module.exports = function (req, res, next) {
	var 
		items = req.url.split('/'),
		breadcrumb = [],
		url = ""
	;
	for(var i=0,l=items.length;i<l;i++){
		if(items[i] !== ''){
			var 
				isLastItem = i == l-1 || items[i+1] == '',
				title = helpers.capitalize(helpers.unslugify(items[i]))
			;
			url += "/"+items[i];
			breadcrumb.push({
				title: title,
				url: url,
				last : isLastItem
			});
		}
	};
	if(breadcrumb.length>0) res.locals.breadcrumb = breadcrumb;
	next();
}


var 
	url = require('url'),
	helpers = require('../helpers');
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
				title = helpers.capitalize(helpers.unslugify(items[i])).split('?')[0]
			;
			url += "/"+items[i];
			breadcrumb.push({
				title: title,
				url: url,
				last : isLastItem
			});
		}
	};
	if(breadcrumb.length>1) res.locals.breadcrumb = breadcrumb;
	next();
}


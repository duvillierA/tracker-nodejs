var  
	fs = require('fs'),
	hbs = require('hbs')
;

module.exports = function(app) {

	hbs.registerHelper('extend', function(name, context) {
	    var block = blocks[name];
	    if (!block) {
	        block = blocks[name] = [];
	    }

	    block.push(context.fn(this));
	});

	hbs.registerHelper('block', function(name) {
	    var val = (blocks[name] || []).join('\n');

	    // clear the block
	    blocks[name] = [];
	    return val;
	});

	hbs.registerHelper('equal', function(lvalue, rvalue, options) {
	    if (arguments.length < 3)
	        throw new Error("Handlebars Helper equal needs 2 parameters");
	    if( lvalue!=rvalue ) {
	        return options.inverse(this);
	    } else {
	        return options.fn(this);
	    }
	});

	/*{{#equal unicorns ponies }}
	That's amazing, unicorns are actually undercover ponies
	{{/equal}}*/

	hbs.registerHelper('compare', function(lvalue, rvalue, options) {

	    if (arguments.length < 3)
	        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

	    operator = options.hash.operator || "==";

	    var operators = {
	        '==':       function(l,r) { return l == r; },
	        '===':      function(l,r) { return l === r; },
	        '!=':       function(l,r) { return l != r; },
	        '<':        function(l,r) { return l < r; },
	        '>':        function(l,r) { return l > r; },
	        '<=':       function(l,r) { return l <= r; },
	        '>=':       function(l,r) { return l >= r; },
	        'typeof':   function(l,r) { return typeof l == r; }
	    }

	    if (!operators[operator])
	        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

	    var result = operators[operator](lvalue,rvalue);

	    if( result ) {
	        return options.fn(this);
	    } else {
	        return options.inverse(this);
	    }

	});

	
	var partials = [
		{
			name:'header',
			html: fs.readFileSync(app.get('views') + '/header.html', 'utf8')
		},
		{
			name:'footer',
			html: fs.readFileSync(app.get('views') + '/footer.html', 'utf8')
		},
		{
			name:'breadcrumb',
			html: fs.readFileSync(app.get('views') + '/breadcrumb.html', 'utf8')
		},
		{
			name:'flash',
			html: fs.readFileSync(app.get('views') + '/flash.html', 'utf8')
		},
		{
			name:'header_admin',
			html: fs.readFileSync(app.get('views') + '/admin/header.html', 'utf8')
		},
		{
			name:'footer_admin',
			html: fs.readFileSync(app.get('views') + '/admin/footer.html', 'utf8')
		},
		{
			name:'breadcrumb_admin',
			html: fs.readFileSync(app.get('views') + '/admin/breadcrumb.html', 'utf8')
		},
		{
			name:'login',
			html: fs.readFileSync(app.get('views') + '/sign/login.html', 'utf8')
		},
		{
			name:'register',
			html: fs.readFileSync(app.get('views') + '/sign/register.html', 'utf8')
		},
		{
			name:'admin_categories',
			html: fs.readFileSync(app.get('views') + '/admin/categories/all.html', 'utf8')
		},
		{
			name:'admin_sections',
			html: fs.readFileSync(app.get('views') + '/admin/sections/all.html', 'utf8')
		},
		{
			name:'admin_files_options',
			html: fs.readFileSync(app.get('views') + '/admin/files/options/all.html', 'utf8')
		}
	];

	for(var i in partials){
		var partial = partials[i];
		hbs.registerPartial(partial.name, partial.html); 
	};


}
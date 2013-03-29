var  
	fs = require('fs'),
	hbs = require('hbs')
;

hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});

/**
 * If Equals
 * if_eq this compare=that
 */
hbs.registerHelper('if_eq', function(context, options) {
    if (context == options.hash.compare)
        return options.fn(this);
    return options.inverse(this);
});

module.exports = function(app) {
	var partials = [
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
			name:'flash',
			html: fs.readFileSync(app.get('views') + '/flash.html', 'utf8')
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
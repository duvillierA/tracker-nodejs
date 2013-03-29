var admin = require('../../controllers/admin');
var admin_categories = require('../../controllers/admin.categories');
var admin_files = require('../../controllers/admin.files');
var admin_files_options = require('../../controllers/admin.files.options');
var admin_sections = require('../../controllers/admin.sections');
var admin_users = require('../../controllers/admin.users');

module.exports = function (map, passport) {
/*
 Admin MAPPING 	
*/

	map.get('/admin', admin.all, function(req, res){
		res.render('admin/index',{
			categories: res.data.categories,
			sections : res.data.sections,
			files : res.data.files,
			files_options : res.data.files_options,
			users : res.data.users,
			flash : {
				success : req.flash('success'),
				info : req.flash('info'),
				error : req.flash('error')
			}
		});
	});

	/*
	  Categories 	
	*/

	map
	.get('/admin/categories', admin_categories.all , function(req, res){
		res.render('admin/categories/all',{
			categories:res.data.categories
		});
	})
	map
	.get('/admin/categories/new', admin_categories.all , function(req, res){
		res.render('admin/categories/new',{
			categories:res.data.categories,
			flash : {
				success : req.flash('success'),
				info : req.flash('info'),
				error : req.flash('error')
			}
		});
	})
	.post('/admin/categories/new', admin_categories.create , function(req, res){
		req.flash('success', res.data.category.name+', is now created!');
		res.redirect('/admin/categories/new');
	});

	/*
	  Sections 	
	*/

	map
	.get('/admin/sections', admin_sections.all , function(req, res){
		res.render('admin/sections/all',{
			sections:res.data.sections
		});
	})
	.get('/admin/sections/new', admin_categories.all , function(req, res){
		res.render('admin/sections/new',{
			categories:res.data.categories,
			flash : {
				success : req.flash('success'),
				info : req.flash('info'),
				error : req.flash('error')
			}
		});
	})
	.post('/admin/sections/new', admin_sections.create , function(req, res){
		req.flash('success', res.data.section.name+', is now created!');
		res.redirect('/admin/sections/new');
	});

	/*
	  Files 	
	*/
	map
	.get('/admin/files', admin_files.all , function(req, res){
		res.render('admin/files/all',{
			files:res.data.files
		});
	})

	/*
	  Files options 	
	*/
	map
	.get('/admin/files/options', admin_files_options.all , function(req, res){
		res.render('admin/files/options/all',{
			files_options:res.data.files_options
		});
	})
	map
	.get('/admin/files/options/new', admin_categories.all , function(req, res){
		res.render('admin/files/options/new',{
			categories:res.data.categories,
			flash : {
				success : req.flash('success'),
				info : req.flash('info'),
				error : req.flash('error')
			}
		});
	})
	.post('/admin/files/options/new', admin_files_options.create , function(req, res){
		req.flash('success', res.data.options.name+', is now created!');
		res.redirect('/admin/files/options/new')
	});


	/*
	  Users	
	*/
	map
	.get('/admin/users', admin_users.all , function(req, res){
		res.render('admin/users/all',{
			users:res.data.users
		});
	})
}
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

	map.get('/admin', passport.ensureAdminAuthenticated, admin.all, function(req, res){
		res.render('admin/index',{
			categories: res.data.categories,
			sections : res.data.sections,
			files : res.data.files,
			files_options : res.data.files_options,
			users : res.data.users
		});
	});

	/*
	  Categories 	
	*/

	map
	.get('/admin/categories', passport.ensureAdminAuthenticated, admin_categories.all , function(req, res){
		res.render('admin/categories/all',{
			categories:res.data.categories
		});
	})
	map
	.get('/admin/categories/new', passport.ensureAdminAuthenticated, admin_categories.all , function(req, res){
		res.render('admin/categories/new',{
			categories:res.data.categories
		});
	})
	.post('/admin/categories/new', passport.ensureAdminAuthenticated, admin_categories.create , function(req, res){
		req.flash('success', res.data.category.name+', is now created!');
		res.redirect('/admin/categories/new');
	});

	/*
	  Sections 	
	*/

	map
	.get('/admin/sections', passport.ensureAdminAuthenticated, admin_sections.all , function(req, res){
		res.render('admin/sections/all',{
			sections:res.data.sections
		});
	})
	.get('/admin/sections/new', passport.ensureAdminAuthenticated, admin_categories.all , function(req, res){
		res.render('admin/sections/new',{
			categories:res.data.categories
		});
	})
	.post('/admin/sections/new', passport.ensureAdminAuthenticated, admin_sections.create , function(req, res){
		req.flash('success', res.data.section.name+', is now created!');
		res.redirect('/admin/sections/new');
	});

	map.get('/admin/sections/:id', passport.ensureAdminAuthenticated, admin_sections.read, admin_categories.all, function(req, res){
		res.render('admin/sections/new',{
			id: req.params.id,
			section: res.data.section,
			categories: res.data.categories
		});
	});
	map.post('/admin/sections/:id/update', passport.ensureAdminAuthenticated, admin_sections.update, function(req, res){
		req.flash('success', res.data.section.name+', is now updated!');
		res.redirect('/admin/sections');
	});
	map.get('/admin/sections/:id/delete', passport.ensureAdminAuthenticated, admin_sections.delete, function(req, res){
		req.flash('success', res.data.section.name+', is now deleted!');
		res.redirect('/admin/sections');
	});

	/*
	  Files 	
	*/
	map
	.get('/admin/files', passport.ensureAdminAuthenticated, admin_files.all , function(req, res){
		console.log("routes", res.data.files);
		res.render('admin/files/all',{
			files:res.data.files
		});
	})

	/*
	  Files options 	
	*/
	map
	.get('/admin/files/options', passport.ensureAdminAuthenticated, admin_files_options.all , function(req, res){
		res.render('admin/files/options/all',{
			files_options:res.data.files_options
		});
	})
	.get('/admin/files/options/new', passport.ensureAdminAuthenticated, admin_categories.all , function(req, res){
		res.render('admin/files/options/new',{
			categories:res.data.categories,
			flash : {
				success : req.flash('success'),
				info : req.flash('info'),
				error : req.flash('error')
			}
		});
	})
	.post('/admin/files/options/new', passport.ensureAdminAuthenticated, admin_files_options.create , function(req, res){
		req.flash('success', res.data.options.name+', is now created!');
		res.redirect('/admin/files/options/new')
	})
	map
	.get('/admin/files/options/:id', passport.ensureAdminAuthenticated, admin_files_options.read, admin_categories.all, function(req, res){
		res.render('admin/files/options/update',{
			id : req.params.id,
			categories:res.data.categories,
			files_options:res.data.files_options,
			flash : {
				success : req.flash('success'),
				info : req.flash('info'),
				error : req.flash('error')
			}
		});
	});
	map.post('/admin/files/options/:id/update', passport.ensureAdminAuthenticated, admin_files_options.update, function(req, res){
		req.flash('success', res.data.files_options.name+', is now updated!');
		res.redirect('/admin/files/options/'+req.params.id);
	});
	map.post('/admin/files/options/:id/delete', passport.ensureAdminAuthenticated, admin_files_options.delete, function(req, res){
		req.flash('success', res.data.files_options.name+', is now deleted!');
		res.redirect('/admin');
	});
	map.put('/admin/files/options/:id', passport.ensureAdminAuthenticated, admin_files_options.update, function(req, res){
		res.json({data:res.data.files_options});
	});
	map.delete('/admin/files/options/:id', passport.ensureAdminAuthenticated, admin_files_options.delete, function(req, res){
		res.json({data:res.data.files_options});
	});

	/*
	  Users	
	*/
	map
	.get('/admin/users', passport.ensureAdminAuthenticated, admin_users.all , function(req, res){
		res.render('admin/users/all',{
			users:res.data.users
		});
	})
}
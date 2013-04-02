var file = require('../../controllers/file');

module.exports = function (map, passport) {
	/*
	 Files MAPPING 	
	*/
	map.get('/', file.all, function(req, res){
		res.render('files/all', {categories:res.categories});
	});
	map.get('/files/new', file.new, function(req, res){
		res.render('files/new', res.data);
	});
	map.post('/files/new', file.new, file.create, function(req, res){
		if(res.errors){
/*			req.flash('errors', res.errors);
			req.flash('field', res.field);
			return res.redirect('/files/new');*/
			res.data.errors = res.errors;
			res.data.field = res.field;
			return res.render('files/new', res.data);
		};
		req.flash('success', res.data.file.title+', is now created!');
		res.redirect('/');
	});
	map.get('/files/:id', file.read, function(req, res){
		res.render('files/show', {file:res.file});
	});
	map.put('/files/:id', file.update, function(req, res){
		req.flash('success', res.data.file.title+', is now updated!');
		res.render('files/show', {file:res.data});
	});
	map.delete('/files/:id', file.delete, function(req, res){
		req.flash('success', res.data.file.title+', is now deleted!');
		res.redirect('/');
	});
}
var file = require('../../controllers/file');

module.exports = function (map, passport) {
	/*
	 Files MAPPING 	
	*/
	map.get('/', file.all, function(req, res){
		res.render('torrent/all', {categories:res.categories});
	});
	map.get('/files/new', file.new, function(req, res){
		res.render('torrent/new', {
			categories: res.data.categories,
			sections: res.data.sections
		});
	});
	map.post('/files/new', file.create, function(req, res){
		req.flash('success', res.data.file.title+', is now created!');
		res.redirect('/');
	});
	map.get('/files/:id', file.read, function(req, res){
		res.render('torrent/show', {file:res.file});
	});
	map.put('/files/:id', file.update, function(req, res){
		req.flash('success', res.data.file.title+', is now updated!');
		res.render('torrent/show', {file:res.data});
	});
	map.delete('/files/:id', file.delete, function(req, res){
		req.flash('success', res.data.file.title+', is now deleted!');
		res.redirect('/');
	});
}
exports.slugify = function(str) {
	str = str.replace(/^\s+|\s+$/g, ''); // trim
	str = str.toLowerCase();
	// remove accents, swap ñ for n, etc
	var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
	var to   = "aaaaaeeeeeiiiiooooouuuunc------";
	for (var i=0, l=from.length ; i<l ; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	}
	str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
	.replace(/\s+/g, '-') // collapse whitespace and replace by -
	.replace(/-+/g, '-'); // collapse dashes

	return str;
};

exports.unslugify = function(str) {
	if ('string' != typeof str) str = '';
	while (/-/.test(str)) {
		str = str.replace(/-/, ' '); 
	}
	return str;
}

exports.capitalize = function(val) {
	if ('string' != typeof val) val = '';
	return val.charAt(0).toUpperCase() + val.substring(1);
}

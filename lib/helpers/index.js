var 
	path = require('path')
;

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

exports.getExtension = function (filename) {
    var ext = path.extname(filename||'').split('.');
    return ext[ext.length - 1];
};

exports.getEncoding = function (buffer) {
    var contentStartBinary = buffer.toString('binary',0,24);
    var contentStartUTF8 = buffer.toString('utf8',0,24);
    var encoding = 'utf8';

    for (var i, l=contentStartUTF8.length;i<l;i++){
        var charCode = contentStartUTF8.charCodeAt(i);
        if (charCode == 65533 || charCode <= 8){
            // 8 and below are control characters (e.g. backspace, null, eof, etc.)
           	// 65533 is the unknown character
           	console.log('binary')
            encoding = 'binary'
            break;
        }
    }
    return encoding
}

function jsonResponse() {

	this.status = 'error';
	this.data = {};
	this.errors = {};

	return this;
}

jsonResponse.prototype.setStatus = function (status) {
	if(status === 'success' || status === 'fail' || status === 'error')
		this.status = status;
	return this;
};
jsonResponse.prototype.setData = function (data) {
	this.data = data;
	return this;
};
jsonResponse.prototype.setErrors = function (errors) {
	this.errors = errors;
	return this;
}

exports.jsonResponse = jsonResponse;
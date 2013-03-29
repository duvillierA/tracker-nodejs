var 
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs'),
	Validator = require('validator').Validator,
	val = new Validator(),
	moment = require('moment')
;

val.error = function(msg) {};
Validator.prototype.isUsername = function() {
	return /^[a-zA-Z0-9]+[_.-]{0,1}[a-zA-Z0-9]+$/m.test(this.str);
}

/*
USERS
*/

	var usersSchema = new Schema({
		role: {type: String, enum: ['user', 'admin'], default: 'user', required: true},
		username: {type: String, required: true},
		email: {type: String, lowercase:true, required: true, index: { unique: true }},
		passwordHash: {type: String, required: true},
		joinedAt : Date

	}, { _id: true, collection: 'users'});

	usersSchema.path('joinedAt').get(function (joinedAt) {
		return moment(joinedAt).format("L");
	});

	usersSchema.virtual('password').get(function () {
		return this._password;
	}).set(function (password) {
		this._password = password;
		this.passwordHash = bcrypt.hashSync(password);
	});

	usersSchema
	.path('passwordHash').validate(function() {
		var password = this._password;
		if (!password || !val.check(password).len(6)) {
			this.invalidate('password', 'Password must be at least 6 characters.');
		}
	}, null);

	usersSchema
	.path('email').validate(function(v) {
		if (!val.check(v).isEmail()) {
			this.invalidate('email', 'Doesn\'t look like a valid Email.');
		}
	}, null);

	usersSchema
	.path('username').validate(function(v) {
		if (!val.check(v).len(2)) {
			this.invalidate('username', 'Username must be at least 2 characters.');
		}else if(!val.check(v).len(2, 20)) {
			this.invalidate('username', 'Username must be shorter. 20 characters max.');
		}else if (!val.check(v).isUsername()){
			this.invalidate('username', 'Doesn\'t look like a valid Username.');
		}
	}, null)
	;

	usersSchema.method('checkPassword', function (password) {
		if(!password || password == "") return false;
		return bcrypt.compareSync(password, this.passwordHash);
	});

	usersSchema.static('authenticate', function (email, password, next) {
		this.findOne({ email: email }, function(err, user) {
			if (err) return next(err);
			if (!user || !user.checkPassword(password)) return next(null, false);
			return next(null, user);
		});
	});

// define & export collection
module.exports = mongoose.model('users', usersSchema);
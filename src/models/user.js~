'use strict'

let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

let UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: String,
	username: String,
	firstName: String,
	lastName: String
});

let User = mongoose.model('User', UserSchema);
module.exports = User;

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(newUser.password, salt, function(err, hash){
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}

module.exports.getUserByUsername = function(username, callback){
	let query = {username: username};
	User.findOne(query, callback);
}

module.exports.comparePassword = function(password, hash, callback){
	bcrypt.compare(password, hash, function(err, isMatch){
		if(err) throw err;
		callback(null, isMatch);
	});
}
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

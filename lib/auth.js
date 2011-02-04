var User = require('./user');
var bcrypt = require('bcrypt');
var redis = require('redis');
exports = module.exports = Auth = function() {
	var pub = {};
	
	pub.init = function(_client) {
		client = _client;
		client.on("error", function (err) {
		    console.log("Error " + err);
		});
	};
	
	pub.create = function(email, password, callback) {
		//should.
		if (password.length < 8) {
			throw new Error('password should be at least 8 characters');
		}
		if(!callback) {
			throw new Error('callback missing');
		}
		client.sadd('users', email, function(err, reply) {
			var salt = bcrypt.gen_salt(10);  
			var hash = bcrypt.hashpw(password, salt);
			client.set('user:' + email, hash);
			callback(reply);
		});
	};
	
	pub.login = function(email, password, callback) {
		if (!callback) {
			throw new Error('no callback provided');
		}
		client.get('user:' + email, function(err, reply) {
			var result = false;
			if (reply) {
				result = bcrypt.compare(password, reply);
			}
			callback(result);
		});
	};
	
	return pub;
}();
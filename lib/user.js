var User = function(redis) {
	this.redis = redis;
};

User.prototype.getHash = function() {
	
};

User.prototype.getEmail = function() {
	
};

module.exports.create = function(redis) {
	return new User(redis);
};

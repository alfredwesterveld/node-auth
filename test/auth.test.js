/**
 * Module dependencies.
 */

var testCase = require('nodeunit').testCase;
var redis = require("redis");
var client = redis.createClient();
var async = require('async');
var should = require('should');
var auth = require('auth');

module.exports = testCase( {
	setUp : function(callback) {
		auth.init(client);
		this.auth = auth;
		client.flushdb();
		callback();
	},
	tearDown : function(callback) {
		// clean up
		callback();
	},
	testTryingToCreateTooShortUsername : function(test) {
		//auth.create("alfredwesterveld@gmail.com", "ab");
		//should.fail("");
		console.log(this.auth);
		test.done();
	},
	testCreateUserWhichDoesNotExist : function(test) {
		this.auth.create("alfredwesterveld@gmail.com", "dada1981", function(result) {
			test.equals(result, true);
			test.done();
		});
	},
	testCreateUserWhichDoesExist : function(test) {
		var auth = this.auth;
		var createUserWhichDoesNotExist = function(callback) {
			console.log(this.auth);
			auth.create("alfredwesterveld@gmail.com", "dada1981", function(
					result) {
				test.equals(result, true);
				callback();
			});
		};

		var createSameUserAgain = function(callback) {
			auth.create("alfredwesterveld@gmail.com", "dada1981", function(
					result) {
				test.equals(result, false);
				callback();
			});
		};

		async.series( [ createUserWhichDoesNotExist, createSameUserAgain ],
				function() {
					test.done();
				});
	},
	testLoginUserWhichDoesNotExist : function(test) {
		this.auth.login("alfredwesterveld@gmail.com", "dada1981", function(result) {
			test.equals(result, false);
			test.done();
		});
	},
	testLoginUserWhichHasBeenCreatedWithCorrectPassword : function(test) {
		var auth = this.auth;
		async.series( [
				function(callback) {
					auth.create("alfredwesterveld@gmail.com", "dada1981",
							function(result) {
								callback();
							});
				},
				function(callback) {
					auth.login("alfredwesterveld@gmail.com", "dada1981",
							function(result) {
								test.equals(result, true);
								callback();
							});
				} ], function(result) {
			test.done();
		});
	},
	testLoginUserWhichHasBeenCreatedWithIncorrectPassword : function(test) {
		var auth = this.auth;
		async.series( [
				function(callback) {
					auth.create("alfredwesterveld@gmail.com", "dada1981",
							function(result) {
								callback();
							});
				},
				function(callback) {
					auth.login("alfredwesterveld@gmail.com", "xyz", function(
							result) {
						test.equals(result, false);
						callback();
					});
				} ], function(result) {
			test.done();
		});
	}
});

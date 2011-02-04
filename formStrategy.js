var express = require('express');
var url = require('url');
var auth = require('auth');

module.exports = function(options) {
	options = options || {};
	var that = {};
	var my = {};
	that.name = options.name || "form";
	function failed_validation(request, response, uri) {
		response.writeHead(303, {
			'Location' : "/auth/form_callback"
		});
		response.end('');
	}

	function validate_credentials(executionScope, request, response, callback) {
		if (request.body && request.body.user && request.body.password) {
			auth.login(request.body.user, request.body.password, function(
					result) {
				if (result) {
					executionScope.success( {
						name : request.body.user
					}, callback);
				} else {
					executionScope.fail(callback);
				}

			});
		} else {
			failed_validation(request, response);
		}
	}

	that.authenticate = function(request, response, callback) {
		if (request.body && request.body.user && request.body.password) {
			validate_credentials(this, request, response, callback);
		} else {
			failed_validation(request, response, request.url);
		}
	};

	that.setupRoutes = function(server) {
		server.use('/', express.router(function routes(app) {
			app.post('/auth/form_callback', function(request, response) {
				request.authenticate( [ that.name ], function(error,
						authenticated) {
					response.writeHead(303, {
						'Location' : "/"
					});
					response.end('');
				});
			});

			app.get('/auth/form_callback', function(request, response) {
				response.render('auth/form.jade', {
					locals : {
						title : 'Login user',
						url : '/auth/form_callback'
					}
				});
			});

			app.post('/auth/create', function(request, response) {
				var user = request.body.user;
				var password = request.body.password;
				if (user && password) {
					auth.create(user, password, function(result) {
						if (result) {
							response.render('auth/create_success.jade', {
								locals : {
									title : 'succesfully created user'
								}
							});
						} else {
							response.render('auth/create_fail.jade');
						}
					});
				} else {
					response.render('auth/create_fail.jade');
				}
			});

			app.get('/auth/create', function(request, response) {
				response.render('auth/form.jade', {
					locals : {
						title : 'Create user',
						url : '/auth/create'
					}
				});
			});
		}));
	};
	return that;
};

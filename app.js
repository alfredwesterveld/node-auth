var express = require('express');
var auth = require('connect-auth');
var FormStrategy = require('./formStrategy');
var app = express.createServer();
var RedisStore = require('connect-redis');

app.configure(function() {
	app.use(express.bodyDecoder());
	app.use(express.cookieDecoder());
	app.use(express.logger());
	app.use(express.session( {
		key : "123",
		secret : "123",
		store : new RedisStore( {
			maxAge : 10080000
		})
	}));
	app.use(auth( [ FormStrategy() ]));
});

app.get('/logout', function(req, res, params) {
	req.logout();
	res.writeHead(303, {
		'Location' : "/"
	});
	res.end('');
});

app.get('/auth/create', function(req, res) {
});

app.post('/auth/create', function(req, res) {
});

app.get('/', function(req, res, params) {
	req.authenticate( [ 'form' ], function(error, authenticated) {
		if (authenticated) {
			res.send("<html><h1>Hello user:" + 
					JSON.stringify(req.getAuthDetails()) + ".</h1></html>");
		} else {
			res.send("<html><h1>authentication failed :( </h1></html>");
		}
	});
});

app.listen(3333, 'localhost');

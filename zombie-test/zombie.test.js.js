var zombie = require("zombie");
var assert = require("assert");
var redis = require("redis");
var client = redis.createClient();
client.flushdb();

// Load the page from localhost
zombie.visit("http://localhost:3333/auth/create", {
	debug : false
}, function(err, browser, status) {
		if (err) {
			console.log('here');
			browser.dump();
			throw (err.message);
		}

		
		// Fill email, password and submit form
		browser
			.fill("user", "alfredwesterveld@gmail.com")
			.fill("password",
			"dada1981").pressButton("Submit",
				function(err, browser, status) {
					// Form submitted, new page loaded.
					if (err) {
						throw (err.message);
					}
					assert.equal(browser.text("title"), "succesfully created user");
					process.exit();
				});

	});

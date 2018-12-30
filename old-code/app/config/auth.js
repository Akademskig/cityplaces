'use strict';

module.exports = {
	'githubAuth': {
		'clientID': process.env.GITHUB_KEY,
		'clientSecret': process.env.GITHUB_SECRET,
		'callbackURL': process.env.APP_URL + 'auth/github/callback'
	},
	'fbAuth':{
		'clientID': process.env.FBKEY,
		'clientSecret': process.env.FBSECRET,
		'callbackURL': process.env.APP_URL +'fbLogin/callback'
	}
	
};

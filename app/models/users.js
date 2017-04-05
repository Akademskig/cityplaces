'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	github: {
		id: String,
		displayName: String,
		username: String
	},
	facebook:{
	    id: String,
	    name: String,
	},
   local:{
       id:Number,
       username: String,
       password: String
   }
});

module.exports = mongoose.model('User', User);


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserPlaces = new Schema({
    user: String,
    places: {type: Array,default:[]}
})


module.exports = mongoose.model('UserPlaces', UserPlaces);
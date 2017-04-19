var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Going = new Schema({
    numberOfPpl:Number,
    placeName: String,
    placeID: String,
    users:{type:Array, default:[]}
});

module.exports = mongoose.model('Going', Going);

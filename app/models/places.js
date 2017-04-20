var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Place = new Schema({
    id:Number,
    cityName:String,
    placeName: String,
	address:String,
    keyword:Array,
    addInfo: String,
    user: String
});

module.exports = mongoose.model('Place', Place);
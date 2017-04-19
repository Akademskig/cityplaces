var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Place = new Schema({
    id:Number,
    cityName:String,
    placeName: String,
	placeId:String,
	address:String,
    keyword:Array,
    addInfo: String
});

module.exports = mongoose.model('Place', Place);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Place = new Schema({
    id:Number,
    city: String,
	cityID:Number,
	cityName:String,
	placeId:String,
	coordinates:{lat:Number,long:Number},
	address:String,
	placeName: String,
    photoRef:String,
    keyword:Array,
    attributions:Array
});

module.exports = mongoose.model('Place', Place);
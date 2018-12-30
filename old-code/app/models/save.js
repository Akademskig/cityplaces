var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Save = new Schema({
    notes:[String],
    placeName: String,
    placeID: String,
    users:{type:Array, default:[]}
});

module.exports = mongoose.model('Save', Save);

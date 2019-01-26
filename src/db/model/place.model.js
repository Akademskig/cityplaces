import * as mongoose from 'mongoose'
const PlaceSchema = new mongoose.Schema({
    place_id: {
        type: String,
        trim: true,
        required: 'Place ID is required'
    },
    user_id: {
        type: String,
        trim: true,
        required: "User ID is required"
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
})


export default mongoose.model('place', PlaceSchema)
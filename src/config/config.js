
import dotenv from 'dotenv'
dotenv.load()
const config = {
        env: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 5000,
        jwtSecret: process.env.JWT_SECRET || 'YOUR_secret_key',
        mongoUri: process.env.MONGODB_URI ||
                process.env.MONGO_HOST ||
                'mongodb://' + (process.env.IP || 'localhost') + ':' +
                (process.env.MONGO_PORT || '27017') +
                '/cityplaces',
        googleApi: {
                nearbySearchUrl: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?',
                photoSearchUrl: 'https://maps.googleapis.com/maps/api/place/photo?',
                detailsUrl: 'https://maps.googleapis.com/maps/api/place/details/json?',
                mapsUrl: 'https://maps.googleapis.com/maps/api/js?',
                key: process.env.GOOGLE_KEY || 'AIzaSyA_h5tnlq-qjVqJVDT8NrusM8eJJ_YTF6s'
        }
}

export default config

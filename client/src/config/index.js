export const googleApi = {
    nearbySearchUrl: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?",
    geocodeUrl: "https://maps.googleapis.com/maps/api/geocode/json?",
    photosUrl: "https://maps.googleapis.com/maps/api/place/photo?",
    mapsUrl: "https://maps.googleapis.com/maps/api/js?",
    apiKey: "AIzaSyA_h5tnlq-qjVqJVDT8NrusM8eJJ_YTF6s"
}
const url = window.location.protocol + "//" + window.location.hostname + ":" + process.env.REACT_APP_PORT + "/api"
export const localApi = {
    loginUrl: `${url}/auth/signIn`,
    registerUrl: `${url}/users`,
    placesUrl: `${url}/user/places`,
    googleApiNearby: `${url}/google-api/nearby-search`,
    googleApiDetails: `${url}/google-api/details-search`
}
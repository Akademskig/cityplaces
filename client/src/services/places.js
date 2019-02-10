import axios from 'axios'
import { googleApi, localApi } from '../config'
export default class PlacesApi {
    latitude
    longitude
    location
    constructor() {
        this.init()
    }
    async init() {
        await this.getCurrentPosition()
    }
    async getCurrentPosition(reset) {
        if (!reset && this.location) {
            return this.location
        }
        if (navigator.geolocation) {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    this.location = await this.getByCurrentLocation()
                    resolve({ location: this.location, lat: this.latitude, lng: this.longitude })
                })
            })
        }
    }
    async getByCurrentLocation() {
        const url = `${googleApi.geocodeUrl}latlng=${this.latitude},${this.longitude}&result_type=locality|country&key=${googleApi.apiKey}`
        const data = await axios.get(url, {
            dataType: "application/json"
        })
        return data.data.results[0].formatted_address
    }

    async getPlaces(radius, keyword, center) {
        let lat, lng
        if (center) {
            lat = center.lat
            lng = center.lng
        }
        else {
            lat = this.latitude
            lng = this.longitude
        }
        let url = `${localApi.googleApiNearby}?lat=${lat}&lng=${lng}&rankby=distance&keyword=${keyword}&key=${googleApi.apiKey}`
        if (radius && keyword)
            url = `${localApi.googleApiNearby}?lat=${lat}&lng=${lng}&radius=${radius}&keyword=${keyword}&key=${googleApi.apiKey}`
        return axios.get(url, {
            dataType: "application/json"
        })
    }
    async getDetails(placeId, fields) {
        const url = `${localApi.googleApiDetails}?place_id=${placeId}&fields=${fields}`
        return await axios.get(url, {
            dataType: "application/json"
        })
    }
    async savePlace(data) {
        await axios.post(
            localApi.placesUrl,
            data,
            {
                dataType: "application/json"
            })
    }

    async removePlace(userId, placeId) {
        await axios.delete(`${localApi.placesUrl}/${userId}/${placeId}`, {
            dataType: "application/json"
        })
    }

    async getPlacesForUser(userId) {
        return axios.get(`${localApi.placesUrl}/${userId}`, { dataType: "application/json" })
    }
}
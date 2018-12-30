import axios from 'axios'
import { googleApi } from '../config'

export default class GoogleMapsApi {
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
                navigator.geolocation.getCurrentPosition((position) => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    this.location = this.getByCurrentLocation()
                    resolve(this.location)
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

    async getPlaces(radius, keyword) {
        const url = `http://localhost:5000/api/google-api/nearby-search?lat=${this.latitude}&lng=${this.longitude}&radius=${radius}&keyword=${keyword}&key=${googleApi.apiKey}`
        const data = await axios.get(url, {
            dataType: "application/json"
        })
        return data
    }
}
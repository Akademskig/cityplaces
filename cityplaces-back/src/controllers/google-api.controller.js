import User from '../db/model/user.model'
import _ from 'lodash'
import request from 'request'
import config from '../config/config';

export default class GoogleApiCtrl {
    constructor() { }

    async getNearbyPlaces(req, res) {
        const lat = req.query.lat
        const lng = req.query.lng
        const radius = req.query.radius
        const keyword = req.query.keyword
        const url = `${config.googleApi.nearbySearchUrl}location=${lat},${lng}&radius=${radius}&keyword=${keyword}&key=${config.googleApi.key}`
        request.get(url, {
            dataType: "application/json"
        }, (err, resp, body) => {
            if (err) {
                return res.status(400).json({ error: err })
            }
            res.status(200).json({
                data: JSON.parse(body).results
            })
        })
    }

    async getPhotos(req, res) {
        const maxwidth = req.query.maxwidth
        const photoreference = req.query.photoreference
        const url = `${config.googleApi.photoSearchUrl}maxwidth=${maxwidth}&photoreference=${photoreference}`
        request.get(url, {
            dataType: "application/json"
        }, (err, resp, body) => {
            if (err) {
                return res.status(400).json({ error: err })
            }
            res.status(200).json({
                data: JSON.parse(body).results
            })
        })
    }

    async getDetails(req, res) {
        const url = `${config.googleApi.detailsUrl}place_id=${req.query.place_id}&fields=${req.query.fields}&key=${config.googleApi.key}`
        request.get(url, {
            dataType: "application/json"
        }, (err, resp, body) => {
            if (err) {
                return res.status(400).json({ error: err })
            }
            console.log(body.result)
            res.status(200).json({
                data: JSON.parse(body).result
            })
        })
    }
}

// https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=CmRaAAAAKKB_K4EK1zMiEsLjX_cOiNL-yQHJq9Y098vGsQFpYVAa5mFDvdkMt_t8AzpGSOfxPIZLdsWYj1rG5vrV07--b_HKV90ILNHmzLkLxzPLqS0KMeZRwgN-vBdlhbBUFHfzEhAzC4-vumHcztBw_3xoFWerGhTq06ZZ4ru5gNtreDdkZRnCKrbELA&key=AIzaSyBXLMrmKqkc4CJijlW73FHU3hoAsGOyws0
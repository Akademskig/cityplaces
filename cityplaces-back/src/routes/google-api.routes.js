import express from 'express'
import GoogleApiCtrl from '../controllers/google-api.controller'

const router = express.Router()
const googleApiCtrl = new GoogleApiCtrl()
router.route('/google-api/nearby-search')
    .get(googleApiCtrl.getNearbyPlaces)


export default router
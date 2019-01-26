import express from 'express'
import placeCtrl from '../controllers/place.controller'

const router = express.Router()

router.route('/user/places')
    .post(placeCtrl.create)
router.route('/user/places/:user_id/:place_id')
    .get(placeCtrl.getForUser)
    .delete(placeCtrl.deleteForUser)

router.route('/user/places/:user_id')
    .get(placeCtrl.getForUser)

export default router
import Place from '../db/model/place.model'
import _ from 'lodash'
import errorHandler from '../db/errorHandler'

const create = (req, res, next) => {
    const place = new Place(req.body)
    try {
        place.save()
        res.status(200).json({
            message: 'Place saved.'
        })
    }
    catch (err) {
        res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getForUser = (req, res, next) => {
    Place.find({ user_id: req.params.user_id }, (err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.status(200).json({
            data: data
        })
    })
}

const deleteForUser = (req, res, next) => {
    Place.deleteOne({ user_id: req.params.user_id, place_id: req.params.place_id }, (err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.status(200).json({
            data: data
        })
    })
}

export default { create, getForUser, deleteForUser }

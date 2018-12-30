import User from '../db/model/user.model'
import _ from 'lodash'
import errorHandler from '../db/errorHandler'

export class UserCtrl {
	constructor() { }

	async create(req, res, next) {

		const user = new User(req.body)
		try {
			await user.save()
			res.status(200).json({
				message: 'Successfully signed up!'
			})

		}
		catch (err) {
			res.status(400).json({
				error: errorHandler.getErrorMessage(err)
			})
		}
	}

	async list(req, res, next) {
		User.find((err, users) => {
			if (err) {
				return res.status(400).json({
					error: errorHandler.getErrorMessage(err)
				})
			}
			res.json(users)
		}).select('name email updated created')
	}
	getById(req, res, next) {

	}
	read(req, res, next) {

	}
	update(req, res, next) {

	}
	remove(req, res, next) {

	}
}
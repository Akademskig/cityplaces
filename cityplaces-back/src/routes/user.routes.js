import express from 'express'

import UserCtrl from '../controllers/user.controller'

const router = express.Router()
const userCtrl = new UserCtrl()
router.route('/users')
	.get(userCtrl.list)
	.post(userCtrl.create)

router.route('/users/:userId')
	.get(userCtrl.getOne)
	.put(userCtrl.update)
	.delete(userCtrl.delete)

router.param('userId', userCtrl.userByID)

export default router
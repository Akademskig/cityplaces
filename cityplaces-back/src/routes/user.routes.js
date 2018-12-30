import express from 'express'

import userCtrl from '../controllers/user.controller'

const router = express.router()

router.route('/api/users')
	.get(userCtrl.list)
	.post(userCtrl.create)

router.route('/api/users/:userId')
	.get(userCtrl.get)
	.put(userCtrl.update)
	.delete(userCtrl.update)

router.param('userId', userCtrl.userByID)

export default router
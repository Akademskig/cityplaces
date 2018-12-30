import '@babel/polyfill'

import { ColorConsole } from './utils/color-console'
import { WebServer } from './web-server'
import { Db } from './db/mongodb'
import config from './config/config'
import GoogleApi from './controllers/google-api.controller'

const log = new ColorConsole()

async function init(callback) {
	const webServer = new WebServer(log, config)
	const mongoDb = new Db(log, config)
	await webServer.init()
	await mongoDb.init()

	callback()
}

try {
	init(() => {
		log.blue('App started.')
	})
} catch (err) {
	log.red(err)
}



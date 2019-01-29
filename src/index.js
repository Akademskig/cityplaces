import '@babel/polyfill'

import { ColorConsole } from './utils/color-console'
import { WebServer } from './web-server'
import { Db } from './db/mongodb'
import config from './config/config'



const log = new ColorConsole()

async function init() {
	const webServer = new WebServer(log, config)
	const mongoDb = new Db(log, config)

	await webServer.init()
	await mongoDb.init()
}

init()
	.then(() => log.blue('App started.'))
	.catch(err => log.red(err))




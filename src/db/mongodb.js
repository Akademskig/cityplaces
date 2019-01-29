import mongoose from 'mongoose'

mongoose.Promise = global.Promise
export class Db {

	constructor(log, config) {
		this.log = log
		this.config = config
	}

	async init() {
		const db = await mongoose.connect(this.config.mongoUri, {
			useNewUrlParser: true
		})
		this.log.purple(`Connected to mongo on url ${this.config.mongoUri}`)
		db.connection.on('error', () => {
			this.log.red('Unable to connect to the database.')
		})
	}
}

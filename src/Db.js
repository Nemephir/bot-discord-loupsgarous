const mongoose = require( 'mongoose' )

class Db {

	constructor() {
		this.connect()
		this.loadSchemas()
	}

	async connect() {
		await mongoose.connect( process.env.MONGO_URL, {
			"auth": {
				"authSource": "admin"
			},
			"user": process.env.MONGO_USER,
			"pass": process.env.MONGO_PSWD,
			useNewUrlParser   : true,
			useUnifiedTopology: true,
			useFindAndModify  : false,
			useCreateIndex    : true
		} )
	}

	async loadSchemas() {
		global.Model = {
			Server: require( './../Schema/ServerSchema' )
		}

	}

}

module.exports = Db
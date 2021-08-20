const mongoose = require( 'mongoose' )
const Schema   = mongoose.Schema
const ObjectId = Schema.ObjectId

const Server = new Schema( {
	id               : String,
	name             : String,
	enabled          : Boolean,
	defaultGamesRoles: Array,
	hallChannel      : String
} )

module.exports = mongoose.model('Server', Server);
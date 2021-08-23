const Server              = require( './Server' )
const ButtonManager       = require( './Discord/ButtonManager' )
const { Client, Intents } = require( 'discord.js' )
const client              = new Client( { intents: [ Intents.FLAGS.GUILDS ] } )

class Discord {

	client  = client
	servers = {}
	buttonManager

	constructor() {
		this.buttonManager = new ButtonManager()
		this.defineConstants()
		this.init()
	}

	defineConstants() {
	}

	async init() {
		client.on( 'ready', async () => {
			await this.getServers()
		} )

		client.on( 'message', msg => {
			console.log( msg )
		} )

		client.login( process.env.DISCORD_APP_TOKEN )
	}

	async getServersWhitelist() {
		return ( await Model.Server.find( { enabled: true } ) )
			.map( v => v.id )
	}

	async getServers() {
		let whitelist     = await this.getServersWhitelist()
		let guilds        = await client.guilds.fetch()
		let pendingGuilds = []

		guilds.each( guild => {
			if( whitelist.indexOf( guild.id ) > -1 ) {
				pendingGuilds.push( guild.fetch() )
			}
		} )

		await Promise.all( pendingGuilds ).then( guilds => {
			for( let guild of guilds ) {
				this.servers[guild.id] = new Server( guild )
			}
		} )
	}

	isMe( userId ) {
		return userId.toString() === client.user.id.toString()
	}
}

module.exports = Discord
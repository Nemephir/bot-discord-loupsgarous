const Channel     = require( './Channel' )
const HallChannel = require( './Channel/HallChannel' )
const Game        = require( './Game' )

class Server {

	guild
	data
	channels = {}
	hall

	constructor( guild ) {
		this.guild = guild
		this.init()
	}

	async init() {
		this.data = await this.loadData()
		await this.clean()
		await this.getChannels()
	}

	async clean() {
		let prefix = this.data.prefix;
		// Delete channels
		let channels = await this.guild.channels.fetch()
		channels.each( async channel => {
			try {
				if( channel.name.substr( 0, prefix.length ) === prefix ) {
					await channel.delete()
				}
			}
			catch( e ) {
				console.log( e.getMessage().red )
			}
		} )

		// Delete roles
		let roles = await this.guild.roles.fetch()
		roles.each( async role => {
			try {
				if( role.name.substr( 0, prefix.length ) === prefix ) {
					await role.delete()
				}
			}
			catch( e ) {
				console.log( e.getMessage().red )
			}
		} )
	}

	async loadData() {
		return ( await Model.Server.findOne( { id: this.guild.id } ) ).toObject()
	}

	async getChannels() {
		let channels = await this.guild.channels.fetch()
		channels.each( async channelFetch => {
			let channel = new Channel( channelFetch, this )
			if( channel.isValid() ) {

				this.channels[channel.id] = channel

				if( channel.id === this.data.hallChannel ) {
					channel   = new HallChannel( channelFetch, this )
					this.hall = channel
				}
			}
		} )

		if( this.hall !== undefined ) {
			this.hall.manageMainMessage()
		}
	}

	async createGame( message ) {
		new Game( message, this )
	}

	async createChannel( identifier, type, options = {} ) {
		return await this.guild.channels.create(
			this.getGameName( identifier ),
			Object.assign( {
				parent: this.data.category,
				type  : type ?? 'GUILD_TEXT'
			}, options )
		)
	}

	async createRole( identifier ) {
		return await this.guild.roles.create( {
			name: this.getGameName( identifier )
		} )
	}

	getGameName( identifier ) {
		return this.data.prefix + identifier
	}

}

module.exports = Server
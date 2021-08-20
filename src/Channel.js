const { TextChannel } = require( 'discord.js' )
const { MessageActionRow, MessageButton, MessageEmbed } = require( 'discord.js' )

class Channel {

	channel
	server

	constructor( channel , server ) {
		this.channel = channel
		this.server  = server
		this.init()
	}

	get( key ) { return this.channel[key] }
	get id()   { return this.get('id') }
	get name() { return this.get('name') }

	async init() {
	}

	isValid() {
		return ! this.channel.deleted
	}

	parseType(channel) {
		switch( this.channel.type ) {
			case 'GUILD_CATEGORY': return 'Category'
			case 'GUILD_TEXT'    : return 'Text'
			case 'GUILD_VOICE'   : return 'Voice'
			default              : channel.type
		}
	}

	async send( msg ) {

		return await this.channel.send( msg )
	}

}

module.exports = Channel
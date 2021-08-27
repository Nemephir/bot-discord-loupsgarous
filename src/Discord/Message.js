const Embed = require( './Embed' )

class Message {

	defaultEmbed
	id
	content
	embeds  = []
	buttons = []
	message

	constructor() {
		this.defaultEmbed = new Embed()
	}

	setContent( value ) {
		this.content = value
		return this
	}

	setTitle( value ) {
		this.defaultEmbed.setTitle( value )
		return this
	}

	setAuthorName( value ) {
		this.defaultEmbed.setAuthorName( value )
		return this
	}

	setAuthorIcon( value ) {
		this.defaultEmbed.setAuthorIcon( value )
		return this
	}

	setAuthorUrl( value ) {
		this.defaultEmbed.setAuthorUrl( value )
		return this
	}

	setField( name, value, inline = false ) {
		this.defaultEmbed.setField( name , value , inline )
	}

	addEmbed( embedContent ) {
		this.embeds.push( embedContent )
		return this
	}

	cleanEmbeds() {
		this.embeds = []
		return this
	}

	addButton( buttonContent ) {
		this.buttons.push( buttonContent )
		return this
	}

	cleanButtons() {
		this.buttons = []
		return this
	}

	async getMessageData() {
		let data = {
			embeds    : [],
			components: []
		}

		// Content
		if( this.content !== undefined )
			data.content = this.content

		// Embeds
		if( ! this.defaultEmbed.isEmpty() )
			data.embeds.push( this.defaultEmbed.getEmbed() )
		if( this.embeds.length > 0 )
			data.embeds = data.embeds.concat( this.embeds )

		// Butons
		if( this.buttons.length > 0 )
			data.components.push( {
				type      : 1,
				components: this.buttons
			} )

		return data
	}

	async send( channel ) {
		this.message = await channel.send( await this.getMessageData() )
		this.id      = this.message.id
		return this
	}

	async update() {
		await this.message.edit( await this.getMessageData() )
		return this
	}

}

module.exports = Message
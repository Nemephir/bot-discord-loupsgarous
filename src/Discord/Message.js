class Message {

	id
	content
	embeds  = []
	buttons = []
	message

	constructor() {}

	setContent( value ) {
		this.content = value
		return this
	}

	addButton( button ) {
		this.buttons.push( button );
		return this
	}

	async send( channel ) {
		let data = {
			components: []
		}

		if( this.content !== undefined )
			data.content = this.content

		if( this.embeds.length > 0 )
			data.embeds = this.embeds

		if( this.buttons.length > 0 )
			data.components.push({
				type: 1,
				components: this.buttons
			})

		this.message = await channel.send( data )
		this.id = this.message.id
		return this
	}

}

module.exports = Message
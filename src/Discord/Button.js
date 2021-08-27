const Interaction = require( './Interaction' )
const uniquid     = require( 'uniquid' )

class Button {

	id
	text     = ''
	enabled  = true
	style    = 1
	data     = ''
	creationDate
	keepAlive
	response = ( channel, user ) => {}

	constructor( keepAlive = false ) {
		this.creationDate = new Date()
		this.keepAlive    = keepAlive
		this.id           = uniquid()
		discord.buttonManager.add( this )
	}

	getButton() {
		return {
			'type'     : 2,
			'label'    : this.text,
			'disabled' : ! this.enabled,
			'style'    : this.style,
			'custom_id': this.id + ':' + this.data
		}
	}

	enable() {
		this.enabled = true
		return this
	}

	disable() {
		this.enabled = false
		return this
	}

	setStyle( value ) {
		this.style = value
		return this
	}

	setText( value ) {
		this.text = value
		return this
	}

	setData( value ) {
		this.data = value
		return this
	}

	setCallable( callable ) {
		this.response = callable
		return this
	}

	async call( interaction, params ) {
		interaction.replyPrivate = async function( msg ) {
			await this.reply( {
				content  : msg,
				ephemeral: true,
				// "components": [
				// 	{
				// 		"type": 1,
				// 		"components": [
				// 			{
				// 				"type": 2,
				// 				"label": "Click me!",
				// 				"style": 1,
				// 				"custom_id": "click_one"
				// 			}
				// 		]
				//
				// 	}
				// ]
			} )
		}
		interaction.defer = async function( msg ) {
			await this.deferReply( {
				ephemeral: true
			} )
		}
		interaction.edit = async function( msg ) {
			await this.editReply( {
				content  : msg,
				ephemeral: true
			} )
		}
		return await this.response( interaction, params )
	}

}

module.exports = Button
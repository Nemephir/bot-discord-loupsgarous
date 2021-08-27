const { MessageActionRow, MessageButton, MessageEmbed } = require( 'discord.js' )
const Channel                                           = require( './../Channel' )
const Message                                           = require( './../Discord/Message' )
const Button                                            = require( './../Discord/Button' )

class HallChannel extends Channel {

	mainMessage

	async init() {
		super.init()
	}

	async generateMainMessageContent() {
		let rst = lang.get( 'hall_main_message' )

		// https://discord.com/developers/docs/interactions/message-components#action-rows
		return new Message()
			.setContent( rst )
			.addButton(
				new Button()
					.setText( lang.get( 'game.create' ) )
					.setCallable( async ( interaction, params ) => {
						let game = await this.server.createGame( interaction.user.id )
						interaction.replyPrivate( `Partie créée : ${this.server.getGameName( game.id )}` )
					} )
					.getButton()
			)
	}

	async manageMessages() {
		let message      = await this.generateMainMessageContent()
		this.mainMessage = await message.send( this.channel )
		await this.mainMessage.message.pin()
		await this.removeTooManyMessages()
	}

	async removeTooManyMessages() {
		let messages = await this.channel.messages.fetch()
		await messages.each( async ( message ) => {
			if( ! this.isMainMessage( message ) ) {
				await message.delete()
			}
		} )
	}

	isMainMessage( message ) {
		return message.id === this.mainMessage.id
	}

}

module.exports = HallChannel
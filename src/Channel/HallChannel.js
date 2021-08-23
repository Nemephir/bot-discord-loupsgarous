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
		let rst = lang.fr.hall_main_message
		// rst += '\n\n' + lang.fr.waiting_games
		// rst += '\n\n' + lang.fr.running_games

		let exampleEmbed = {
			color      : 0x0099ff,
			title      : 'Some title',
			url        : 'https://discord.js.org',
			author     : {
				name    : 'Some name',
				icon_url: 'https://i.imgur.com/AfFp7pu.png',
				url     : 'https://discord.js.org'
			},
			description: 'Some description here',
			thumbnail  : {
				url: 'https://i.imgur.com/AfFp7pu.png'
			}
		}

		// https://discord.com/developers/docs/interactions/message-components#action-rows
		return new Message()
			.setContent( rst )
			.addButton(
				new Button()
					.setText( lang.fr.game.create )
					.setData( 'game:create' )
					.setCallable( async ( interaction, params ) => {
						let game = await this.server.createGame( interaction.user.id )
						interaction.replyPrivate(`Partie créée : ${this.server.getGameName(game.id)}`)
					} )
					.getButton()
			)
	}

	async manageMessages() {
		let message = await this.generateMainMessageContent();
		this.mainMessage = await message.send( this.channel );
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
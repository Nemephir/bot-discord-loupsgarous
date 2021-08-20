const { MessageActionRow, MessageButton, MessageEmbed } = require( 'discord.js' )
const Channel                                           = require( './../Channel' )

class HallChannel extends Channel {

	mainMessage

	async init() {
		super.init()

		await this.manageNewMessages()
	}

	async manageNewMessages() {
		setTimeout( async () => {
			let messages = await this.channel.messages.fetch()
			await messages.each( async message => {
				if( ! this.isMainMessage( message ) ) {
					if( message.content.startsWith( '!create' ) ) {
						await this.server.createGame( message )
					}

					await message.delete()
				}
			} )

			this.manageNewMessages()
		}, 5000 )
	}

	async generateMainMessageContent() {
		let rst = lang.fr.hall_main_message
		// rst += '\n\n' + lang.fr.waiting_games
		// rst += '\n\n' + lang.fr.running_games

		let exampleEmbed = {
			color: 0x0099ff,
			title: 'Some title',
			url: 'https://discord.js.org',
			author: {
				name: 'Some name',
				icon_url: 'https://i.imgur.com/AfFp7pu.png',
				url: 'https://discord.js.org',
			},
			description: 'Some description here',
			thumbnail: {
				url: 'https://i.imgur.com/AfFp7pu.png',
			}
		};

		let button = new MessageButton()
			.setLabel('My First Button!') //default: NO_LABEL_PROVIDED

		// https://discord.com/developers/docs/interactions/message-components#action-rows
		return {
			content: rst ,
			embeds: [exampleEmbed] ,
			"components": [
				{
					"type": 1,
					"components": [
						{
							"type": 2,
							"label": "Rejoindre",
							"style": 1,
							"custom_id": "join:xxxxxxx"
						},
						{
							"type": 2,
							"label": "Regarder",
							"style": 2,
							"custom_id": "view:xxxxxxx"
						},
					]

				}
			]
		}
	}

	async updateMainMessage() {
		if( this.mainMessage !== undefined ) {
			let content = await this.generateMainMessageContent()
			if( this.mainMessage.content !== content ) {
				await this.mainMessage.edit( content )
			}
		}
	}

	async manageMainMessage() {
		this.mainMessage = await this.findMainMessage()

		if( ! this.mainMessage ) {
			this.mainMessage = await this.send( await this.generateMainMessageContent() )
			await this.mainMessage.pin()
		}
		else {
			this.updateMainMessage()
		}

		await this.removeTooManyMessages()
	}

	async findMainMessage() {
		return new Promise( async resolve => {
			let messages = await this.channel.messages.fetch()
			messages.each( ( message ) => {
				if( this.isMainMessage( message ) ) {
					resolve( message )
				}
			} )

			resolve( false )
		} )
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
		return message.pinned
			&& discord.isMe( message.author.id )
	}

}

module.exports = HallChannel
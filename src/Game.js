const { Permissions, GuildMemberRoleManager, UserManager } = require( 'discord.js' )
const uniquid                                              = require( 'uniquid' )
const Message                                              = require( './Discord/Message' )
const Button                                               = require( './Discord/Button' )

class Game {

	id
	name
	owner
	server
	textChannel
	voiceChannel
	role
	message
	players = {}

	constructor( ownerId, server ) {
		this.id     = uniquid()
		this.owner  = ownerId
		this.server = server
		this.init()
	}

	async init() {
		await this.createRole()
		await this.createTextChannel()
		await this.createVoiceChannel()
		await this.assignRole( this.owner )
		await this.sendMessage()
	}

	async createRole() {
		this.role = await this.server.createRole( this.id )
	}

	async createTextChannel() {
		this.textChannel = await this.server.createChannel( this.id, 'GUILD_TEXT', {
			permissionOverwrites: await this.getChannelPermissions()
		} )
	}

	async createVoiceChannel() {
		this.voiceChannel = await this.server.createChannel( this.id, 'GUILD_VOICE', {
			permissionOverwrites: await this.getChannelPermissions()
		} )
	}

	async getUser( userId ) {
		return await this.server.guild.members.fetch( userId !== undefined ? userId : this.owner )
	}

	async assignRole( userId , isOwner = false ) {
		let user = await this.getUser( userId )
		await user.roles.add( this.role.id )

		let message = await new Message()
			.setContent( lang.get('game.join', {userId:user.id}) )
			.send( this.textChannel )

		this.players[user.id] = {
			user     : user,
			owner    : isOwner,
			joinedMsg: message
		}
	}

	async playerInGame( userId ) {
		return new Promise( async resolve => {
			let user = await this.getUser( userId )
			user.roles.cache.each( v => {
				if( v.name.indexOf( this.server.data.prefix ) === 0 )
					resolve(true)
			})

			resolve( false )
		})
	}

	async sendMessage() {
		this.message = await new Message()
			.setContent( 'Nouvelle partie' )
			.addButton( new Button()
				.setText( 'Rejoindre' )
				.setCallable( async ( interaction, params ) => {
					await interaction.defer()
					if( await this.playerInGame( interaction.user.id ) ) {
						await interaction.edit( 'Vous êtes déjà en jeu' )
					}
					else {
						await this.assignRole( interaction.user.id )
						await interaction.edit( 'Vous avez rejoins la partie' )
					}
				} )
				.getButton()
			)
			.send( this.server.hall.channel )
	}

	async getChannelPermissions() {
		let permissions = [
			// Masquer le canal à tout le monde
			{
				id  : this.server.guild.roles.everyone,
				deny: [ 'VIEW_CHANNEL' ]
			},
			// Ouverture du canal au role associé
			{
				id   : this.role.id,
				allow: [ 'VIEW_CHANNEL' ]
			}
		]

		// Ajout des rôles staff
		for( let role of this.server.data.defaultGamesRoles ) {
			permissions.push( {
				id   : role.id,
				allow: [ 'VIEW_CHANNEL' ]
			} )
		}

		return permissions
	}

}

module.exports = Game
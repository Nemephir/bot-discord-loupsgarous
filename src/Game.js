const { Permissions, GuildMemberRoleManager, UserManager } = require( 'discord.js' )
const uniquid                                              = require( 'uniquid' )
const Message                                              = require( './Discord/Message' )
const Embed                                                = require( './Discord/Embed' )
const Button                                               = require( './Discord/Button' )
const GameRules                                            = require( './Game/GameRules' )

class Game {

	id
	name
	owner
	ownerId
	ownerIcon
	server
	textChannel
	voiceChannel
	role
	hallMessage
	hostMainMessage
	rules
	players = {}

	constructor( ownerId, server ) {
		this.id      = uniquid()
		this.ownerId = ownerId
		this.server  = server
		this.rules   = new GameRules( this )
		this.init()
	}

	async init() {
		this.owner     = await this.getUser( this.ownerId )
		this.ownerIcon = await this.owner.user.avatarURL()
		await this.createRole()
		await this.createTextChannel()
		await this.createVoiceChannel()
		await this.assignRole( this.owner, true )
		await this.sendMessageInHall()
	}

	/***********************************************************************
	 ****************************  GAME CREATION  **************************
	 ***********************************************************************/

	/**
	 * Crée un nouveau rôle lié à la partie de jeu
	 * @returns {Promise<void>}
	 */
	async createRole() {
		this.role = await this.server.createRole( this.id )
	}

	/**
	 * Crée un canal textuel lié à la partie de jeu.
	 * @returns {Promise<void>}
	 */
	async createTextChannel() {
		this.textChannel = await this.server.createChannel( this.id, 'GUILD_TEXT', {
			permissionOverwrites: await this.getChannelPermissions()
		} )
	}

	/**
	 * Crée un canal vocal lié à la partie de jeu
	 * @returns {Promise<void>}
	 */
	async createVoiceChannel() {
		this.voiceChannel = await this.server.createChannel( this.id, 'GUILD_VOICE', {
			permissionOverwrites: await this.getChannelPermissions()
		} )
	}

	/**
	 * Retourne la liste et les règles liés au rôle et aux canaux
	 * @returns {Promise<[{deny: string[], id: boolean | Role}, {allow: string[], id}]>}
	 */
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

	/***********************************************************************
	 **************************  PLAYER MANAGEMENT  ************************
	 ***********************************************************************/

	/**
	 * Charge un utilisateur, soit par rapport à l'id indiqué ou l'hôte de la partie
	 * @param userId
	 * @returns {Promise<*|*>}
	 */
	async getUser( userId ) {
		return userId !== undefined
			? await this.server.guild.members.fetch( userId )
			: this.owner
	}

	/**
	 * Assigne le rôle lié à la partie à l'utilisateur indiqué
	 * @param userId
	 * @param isHost
	 * @returns {Promise<void>}
	 */
	async assignRole( userId, isHost = false ) {
		let user = await this.getUser( userId )
		await user.roles.add( this.role.id )

		this.players[user.id] = {
			user     : user,
			owner    : isHost,
			ready    : isHost, // Si c'est l'hôte, il est forcément prêt
			joinedMsg: undefined
		}

		if( isHost ) {
			this.hostMainMessage = await this.sendMessage_gameMain_host( this.players[user.id] )
		}
		else {
			this.players[user.id].joinedMsg = await this.sendMessage_gameMain_player( this.players[user.id] )
		}
	}

	/**
	 * Indique si un utilisateur est déjà dans une partie
	 * @param userId
	 * @returns {Promise<boolean>}
	 */
	async playerInGame( userId ) {
		return new Promise( async resolve => {
			let user = await this.getUser( userId )
			user.roles.cache.each( v => {
				if( v.name.indexOf( this.server.data.prefix ) === 0 )
					resolve( true )
			} )

			resolve( false )
		} )
	}

	/**
	 * Ajoute un utilisateur à la partie
	 * @param user
	 * @returns {Promise<void>}
	 */
	async playerJoin( user ) {
		// Attribution du rôle à l'utilisateur
		await this.assignRole( user.id )
		// Mise à jour du message dans le hall
		await this.refreshMessageInHall()
		// Mise à jour du message principal dans le canal de la partie
		await this.refreshMessage_gameMain_host()
	}

	/***********************************************************************
	 *************************  MESSAGE MANAGEMENT  ************************
	 ***********************************************************************/

	/**
	 * Envoie un nouveau message lié à partie dans le hall
	 * @returns {Promise<void>}
	 */
	async sendMessageInHall() {
		this.hallMessage = new Message()
			.setContent( lang.get( 'game.created' ) )
			.setAuthorName( lang.get( 'game.host_prefix' ) + this.owner.user.username )
			.setAuthorIcon( this.ownerIcon )
			.addButton( this.getButton_Join() )

		for( let v of this.rules.exportFields() ) {
			this.hallMessage.setField( v.name, v.value, v.inline )
		}

		await this.hallMessage.send( this.server.hall.channel )
	}

	/**
	 * Met à jour le message lié à la partie dans le hall
	 * @returns {Promise<void>}
	 */
	async refreshMessageInHall() {
		this.hallMessage
			.setTitle( 'hébergement en cours' )

		for( let v of this.rules.exportFields() ) {
			this.hallMessage.setField( v.name, v.value, v.inline )
		}

		await this.hallMessage.update()
	}

	/***********************************************************************
	 ******************************  MESSAGES  *****************************
	 ***********************************************************************/

	async sendMessage_gameMain_host( user ) {
		let message = new Message()
			.setContent( lang.get( 'game.joined_host', { userId: user.user.id } ) )
			.addButton( this.getButton_Host_Start() )

		message = await this.helperMessage_gameMain_host_readyList( message )

		return message.send( this.textChannel )
	}

	async refreshMessage_gameMain_host() {
		// Mise à jour de la liste des joueurs prêts
		this.hostMainMessage = await this.helperMessage_gameMain_host_readyList( this.hostMainMessage )

		// Mise à jour du message
		await this.hostMainMessage.update()
	}

	async helperMessage_gameMain_host_readyList( message ) {
		let userEmbeds = []

		for( let p of Object.values( this.players ) ) {
			if( p.ready ) {
				userEmbeds.push(
					new Embed()
						.setAuthorName( p.user.user.username )
						.setAuthorIcon( await p.user.user.avatarURL() )
						.getEmbed()
				)
			}
		}

		let translate = lang.get( 'game.readies', {
			count: userEmbeds.length,
			max  : Object.keys( this.players ).length
		} )

		message
			.cleanEmbeds()
			.addEmbed( new Embed().setTitle( translate ).getEmbed() )

		for( let e of userEmbeds ) {
			message.addEmbed( e )
		}

		return message
	}

	async sendMessage_gameMain_player( user ) {
		return await new Message()
			.setContent( lang.get( 'game.joined', { userId: user.user.id } ) )
			.addButton( this.getButton_Player_Ready( user ) )
			.send( this.textChannel )
	}

	/***********************************************************************
	 ******************************  BUTTONS  ******************************
	 ***********************************************************************/

	/**
	 * Bouton qui permet de rejoindre une partie
	 * @returns {{custom_id: string, disabled, style: number, label: string, type: number}}
	 */
	getButton_Join() {
		return new Button()
			.setText( lang.get( 'game.join' ) )
			.setCallable( async ( interaction, params ) => {
				await interaction.defer()
				if( await this.playerInGame( interaction.user.id ) ) {
					await interaction.edit( 'Vous êtes déjà en jeu' )
				}
				else {
					await this.playerJoin( interaction.user )
					await interaction.edit( 'Vous avez rejoins la partie' )
				}
			} )
			.getButton()
	}

	/**
	 * Bouton qui permet à l'hôte de démarrer la partie
	 * @returns {{custom_id: string, disabled, style: number, label: string, type: number}}
	 */
	getButton_Host_Start() {
		return new Button()
			.setText( lang.get( 'game.start' ) )
			.setCallable( async ( interaction, params ) => {
				await interaction.defer()
				// TODO : la suite ici ...
			} )
			.getButton()
	}

	/**
	 * Bouton pour que l'utilisateur confirme qu'il est prêt à jouer
	 * @returns {{custom_id: string, disabled, style: number, label: string, type: number}}
	 */
	getButton_Player_Ready( player ) {
		return new Button()
			.setText( lang.get( 'game.ready', { username: player.user.user.username } ) )
			.setCallable( async ( interaction, params ) => {
				// Mise en attente de réponse
				await interaction.defer()

				// Vérification que l'utilisateur qui a cliqué est le bon
				if( player.user.id === interaction.user.id ) {
					// Le joueur est prêt
					player.ready = true
					// Mise à jour du message principal du canal
					await this.refreshMessage_gameMain_host()
					// Réponse à l'intéraction
					await interaction.edit( lang.get( 'game.readyReplySuccess' ) )
					// Supression du bouton
					await player.joinedMsg.cleanButtons().update()
				}
				else {
					await interaction.edit( lang.get( 'game.readyReplyUnauthorized' ) )
				}
			} )
			.getButton()
	}

}

module.exports = Game
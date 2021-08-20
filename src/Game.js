const { Permissions, GuildMemberRoleManager, UserManager } = require( 'discord.js' )

class Game {

	id
	name
	owner
	server
	role

	constructor( originalMessage, server ) {
		this.id     = originalMessage.id
		this.owner  = originalMessage.author
		this.server = server
		this.init()
	}

	async init() {
		await this.createRole()
		await this.createTextChannel()
		await this.createVoiceChannel()
		await this.assignRole( this.owner )
	}

	async createRole() {
		this.role = await this.server.createRole( this.id )
	}

	async createTextChannel() {
		await this.server.createChannel( this.id, 'GUILD_TEXT', {
			permissionOverwrites: await this.getChannelPermissions()
		} )
	}

	async createVoiceChannel() {
		await this.server.createChannel( this.id, 'GUILD_VOICE', {
			permissionOverwrites: await this.getChannelPermissions()
		} )
	}

	async assignRole() {
		let user = await this.server.guild.members.fetch( this.owner.id );
		await user.roles.add( this.role.id )
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
			permissions.push({
				id   : role.id,
				allow: [ 'VIEW_CHANNEL' ]
			})
		}

		return permissions
	}

}

module.exports = Game
class GameRules {

	game
	minPlayer = 4
	maxPlayer = 18

	constructor( game ) {
		this.game = game
	}

	exportFields() {
		return [
			// Host
			// {
			// 	name  : lang.get( 'game.rules.host' ),
			// 	value : this.game.owner.user.username,
			// 	inline: true
			// },
			// Empty
			// { name: '\u200B', value: '\u200B', inline: true },
			// Host
			{
				name  : lang.get( 'game.rules.id' ),
				value : this.game.id,
				inline: false
			},
			// Player min
			{
				name  : lang.get( 'game.rules.player_ingame' ),
				value : Object.keys( this.game.players ).length,
				inline: true
			},
			// Player min
			{
				name  : lang.get( 'game.rules.min_player' ),
				value : this.minPlayer,
				inline: true
			},
			// Player max
			{
				name  : lang.get( 'game.rules.max_player' ),
				value : this.maxPlayer,
				inline: true
			}
		]
	}

}

module.exports = GameRules
module.exports = {
	hall_main_message: 'Bonjour,\n!create',

	game: {
		create: "Créer une partie",
		join: [
			'<@{userId}> a rejoint la partie',
			'Faites place à <@{userId}>',
			'<@{userId}> fait parti du village',
			'<@{userId}> a rejoint la chasse aux loups garous',
		]
	},

	discord_character_full: '**{icon} {prefix} {character}**',

	character: {
		cupidon   : 'Cupidon',
		fortune   : 'voyante',
		hunter    : 'chasseur',
		littlegirl: 'petite fille',
		mayor     : 'maire',
		thief     : 'voleur',
		village   : 'villageois',
		werewolf  : 'loup garou',
		witch     : 'sorcière',

		prefix: {
			cupidon   : '',
			fortune   : 'une',
			hunter    : 'un',
			littlegirl: 'une',
			mayor     : 'un',
			thief     : 'un',
			village   : 'un',
			werewolf  : 'un',
			witch     : 'une'
		},
		icon  : {
			discord: {
				cupidon   : ':lg_cupidon:',
				fortune   : ':lg_voyante:',
				hunter    : ':lg_chasseur:',
				littlegirl: ':lg_petitefille:',
				mayor     : ':lg_maire:',
				thief     : ':lg_voleur:',
				village   : ':lg_villageoi:',
				werewolf  : ':lg_loupgarou:',
				witch     : ':lg_sorciere:'
			}
		}
	}
}
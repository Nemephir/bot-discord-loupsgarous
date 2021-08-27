module.exports = {
	hall_main_message: 'Bonjour,\n!create',

	game: {
		create                : 'Créer une partie',
		created               : 'Nouvelle partie',
		join                  : 'Rejoindre',
		start                 : 'Commencer la partie',
		ready                 : 'Je suis prêt(e) (réservé à {username})',
		readies               : 'Joueurs prêt(e)s ({count}/{max}) :',
		readyReplySuccess     : 'En attente du lancement de la partie par l\'hôte',
		readyReplyUnauthorized: 'Ce bouton n\'est pas fait pour vous',
		joined                : [
			'<@{userId}> a rejoint la partie',
			'Faites de la place pour <@{userId}>',
			'<@{userId}> fait parti du village',
			'<@{userId}> a rejoint la chasse aux loups garous'
		],
		joined_host           : [
			'<@{userId}> a créé la partie'
		],
		host_prefix           : 'Hôte: ',
		rules                 : {
			host         : 'Hôte',
			id           : 'Identifiant partie',
			player_ingame: 'Participants',
			min_player   : 'Joueurs min',
			max_player   : 'Joueurs max'
		}
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
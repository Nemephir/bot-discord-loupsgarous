class Character {

	game;
	alive = true;

	constructor( game ) {
		this.game = game;
	}

	giveRole() {}

	async start() {
		await this.hookAfterStart()
	}

	async hookAfterStart() {}

	async turn() {}

	async hookTurn() {}

	async endOfTurn() {}

	async die() {
		await this.hookBeforeDie()
		await this.hookAfterDie()
	}

	async hookBeforeDie() {}
	async hookAfterDie() {}

}

module.exports = Character
class ButtonManager {

	buttons = {}

	add( button ) {
		this.buttons[button.id] = button
	}

	get( id ) {
		return this.buttons[id]
	}

	remove( id ) {
		delete this.buttons[id]
	}

}

module.exports = ButtonManager
class Embed {

	data = {}
	fields = {}

	setTitle( value ) {
		try {
			this.data.title = value.toString()
		}
		catch( e ) {}
		return this
	}

	useAuthor() {
		if( this.data.author === undefined )
			this.data.author = {}
	}

	setAuthorName( value ) {
		try {
			this.useAuthor()
			this.data.author.name = value.toString()
		}
		catch( e ) {}
		return this
	}

	setAuthorIcon( value ) {
		try {
			this.useAuthor()
			this.data.author.icon_url = value.toString()
		}
		catch( e ) {}
		return this
	}

	setAuthorUrl( value ) {
		try {
			this.useAuthor()
			this.data.author.url = value.toString()
		}
		catch( e ) {}
		return this
	}

	setField( name, value, inline = false ) {
		try {
			value = value.toString().trim()
		}
		catch( e ) {
			value = '-'
		}

		this.fields[name] = { name, value, inline }

		return this
	}

	isEmpty() {
		return Object.keys( this.data ).length === 0
	}

	getEmbed() {
		let data = Object.assign( {} , this.data )

		// Si l'instance contient des champs
		if( Object.keys(this.fields).length > 0 ) {
			// Préparation de data pour recevoir les champs
			data.fields = []
			// Ajout de tous les champs
			for( let field of Object.values(this.fields) ) {
				data.fields.push( field )
			}
		}

		return data
	}
}

module.exports = Embed
class Lang {

	translations

	constructor() {
		this.translations = require('./lang/fr')
	}

	get( key , params = {} ) {
		let rst = eval( 'this.translations.' + key );
		if( rst ) {
			if( rst.constructor.name === 'Array' ) {
				rst = rst[ Math.floor( Math.random() * rst.length ) ]
			}

			return this.parse(rst, params);
		}
		else {
			return `##${key}##`
		}
	}

	parse( str , params ) {
		for( let [key,content] of Object.entries(params) ) {
			key = `{${key}}`
			while( str.indexOf(key) > -1 ) {
				str = str.replace(key, content)
			}
		}

		return str;
	}

}

module.exports = Lang
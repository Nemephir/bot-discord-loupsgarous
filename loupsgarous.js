require( 'dotenv' ).config()

global.db      = new ( require( './src/Db' ) )
global.discord = new ( require( './src/Discord' ) )

global.lang = {
	fr: require( './src/lang/fr' )
}

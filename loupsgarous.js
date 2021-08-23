require( 'dotenv' ).config()

global.db      = new ( require( './src/Db' ) )
global.lang    = new ( require( './src/Lang' ) )
global.discord = new ( require( './src/Discord' ) )

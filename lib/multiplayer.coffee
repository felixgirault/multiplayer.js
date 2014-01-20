#
#	@author Félix Girault <felix.girault@gmail.com>
#	@license FreeBSD License (http://opensource.org/licenses/BSD-2-Clause)
#

#Q = require( 'Q' )



# builds the appropriate player for the given URL
multiplayer = ( url, options ) ->
	# Default services detectors
	@DETECTORS =
		dailymotion: /dailymotion\.com\/(?:embed\/)?video\/([a-z0-9]+)/i
		vimeo: /vimeo\.com\/(?:video\/)?([0-9]+)/i
		youtube: /(?:v=|v\/|embed\/|youtu\.be\/)([a-z0-9_-]+)/i

	# Default options to be passed to the player
	@DEFAULTS =
		id: 'multiplayer'
		width: 425
		height: 356
		version: 9
		swfUrl: null
		flashVars: null
		attributes: null
		params:
			allowScriptAccess: 'always'

	# merging given options with defaults
	options[ key ] = value for key, value of @DEFAULTS when key not of options

	for name, detector of @DETECTORS
		if matches = detector.exec( url )
			module = require( "players/#{name}" )
			player = new module( matches[ 1 ], options )
			return player.ready( )

	return Q.defer( ).reject( 'No suitable player found' ).promise



module.exports = multiplayer

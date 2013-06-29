/**
 *	@author Félix Girault <felix.girault@gmail.com>
 *	@license FreeBSD License (http://opensource.org/licenses/BSD-2-Clause)
 */



/**
 *	Builds and returns the appropriate player for the given URL.
 */

var multiplayer = function( url, options ) {

	_( options ).defaults( multiplayer.DEFAULTS );

	for ( var name in multiplayer.DETECTORS ) {
		var matches = multiplayer.DETECTORS[ name ].exec( url );

		if ( matches ) {
			var module = require( name );
			return new module( matches[ 1 ], options );
		}
	}

	return null;
};



/**
 *	Default services detectors.
 */

multiplayer.DETECTORS = {
	'dailymotion': /dailymotion\.com\/(?:embed\/)?video\/([a-z0-9]+)/i,
	'vimeo': /vimeo\.com\/(?:video\/)?([0-9]+)/i,
	'youtube': /(?:v=|v\/|embed\/|youtu\.be\/)([a-z0-9_-]+)/i
};



/**
 *	Default options to be passed to the player.
 */

multiplayer.DEFAULTS = {
	'id': 'multiplayer',
	'width': '425',
	'height': '356',
	'version': '9',
	'swfUrl': null,
	'flashVars': null,
	'params': {
		'allowScriptAccess': 'always'
	},
	'attributes': null
};



module.exports = multiplayer;

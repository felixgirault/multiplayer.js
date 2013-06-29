/**
 *	@author Félix Girault <felix.girault@gmail.com>
 *	@license FreeBSD License (http://opensource.org/licenses/BSD-2-Clause)
 */



/**
 *	Basic interface for a player.
 */

var Player = function( id, options ) { };



_( Player.prototype ).extend({

	/**
	 *	Loading.
	 */

	load: function( ) { },
	clear: function( ) { },



	/**
	 *	Flow control.
	 */

	play: function( ) { },
	isPlaying: function( ) { },
	pause: function( ) { },
	isPaused: function( ) { },
	stop: function( ) { },
	isStopped: function( ) { },



	/**
	 *	Timing.
	 */

	duration: function( ) { },
	currentTime: function( ) { },
	seek: function( seconds ) { },



	/**
	 *	Sound.
	 */

	volume: function( ) { },
	setVolume: function( volume ) { },
	mute: function( ) { },
	unMute: function( ) { },
	isMuted: function( ) { },



	/**
	 *	Events.
	 */

	on: function( event, callback ) { }
});



module.exports = Player;

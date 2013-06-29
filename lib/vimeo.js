/**
 *	@author Félix Girault <felix.girault@gmail.com>
 *	@license FreeBSD License (http://opensource.org/licenses/BSD-2-Clause)
 */

var Player = require( 'player' );



/**
 *	Basic interface for a player.
 */

var Vimeo = function( id, options ) {

	var playerId = 'dailymotion-video-' + id;
	var url = 'http://player.vimeo.com/video/' + id + '?api=1&player_id' + playerId;

	this.$el = $( '<iframe/>', {
		'id': playerId,
		'src': url
	});

	this.$el.appendTo( $( '#' + options.id ));

	swfobject.embedSWF(
		url,
		playerId,
		options.width,
		options.height,
		options.version,
		options.swfUrl,
		options.flashVars,
		options.params,
		options.attributes
	);

	this._player = $f( this.$el[ 0 ]);
	this._volume = this.volume( );
};



_( Vimeo.prototype ).extend( Player.prototype, {

	/**
	 *	Loading.
	 */

	load: function( ) {


	},

	clear: function( ) {

		this._player.api( 'unload' );
	},



	/**
	 *	Flow control.
	 */

	play: function( ) {

		this._player.api( 'play' );
	},

	isPlaying: function( ) {

		return !this.isPaused( );
	},

	pause: function( ) {

		this._player.api( 'pause' );
	},

	isPaused: function( ) {

		this._player.api( 'paused' );
	},

	stop: function( ) {

		this.pause( );
		this.seek( 0 );
	},

	isStopped: function( ) {

		return this.isPaused( );
	},



	/**
	 *	Timing.
	 */

	duration: function( ) {

		this._player.api( 'getDuration' );
	},

	currentTime: function( ) {

		this._player.api( 'getCurrentTime' );
	},

	seek: function( seconds ) {

		this._player.api( 'seekTo', seconds );
	},



	/**
	 *	Sound.
	 */

	volume: function( ) {

		this._player.api( 'getVolume' );
	},

	setVolume: function( volume ) {

		this._volume = volume / 100;
		this._player.api( 'setVolume', this._volume );
	},

	mute: function( ) {

		this._player.api( 'setVolume', 0 );
	},

	unMute: function( ) {

		this._player.api( 'setVolume', this._volume );
	},

	isMuted: function( ) {

		return ( this._player.api( 'volume' ) === 0 );
	},



	/**
	 *	Events.
	 */

	on: function( event, callback ) {

		this._player.api( 'addEvent', event, callback );
	}
});



module.exports = Vimeo;

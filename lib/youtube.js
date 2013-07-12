/**
 *	@author Félix Girault <felix.girault@gmail.com>
 *	@license FreeBSD License (http://opensource.org/licenses/BSD-2-Clause)
 */

var Player = require( 'player' );



/**
 *
 */

var Youtube = function( id, options ) {

	var playerId = 'youtube-video-' + id;
	var url = 'http://www.youtube.com/swf/' + id + '?enablejsapi=1&playerapiid=' + playerId;

	$( '#' + options.id ).append(
		$( '<div/>', {
			'id': playerId
		})
	);

	this._player = undefined;

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

	var _this = this;

	$( window ).on( 'youtubePlayerReady', function( readyPlayerId ) {
		if ( readyPlayerId === playerId ) {
			_this._player = document.getElementById( readyPlayerId );
		}
	});
};



/**
 *	Player states.
 */

Youtube.UNSTARTED = -1;
Youtube.ENDED = 0;
Youtube.PLAYING = 1;
Youtube.PAUSED = 2;



/**
 *
 */

window.onYoutubePlayerReady = function( id ) {

	$( window ).trigger( 'youtubePlayerReady', id );
};



_( Youtube.prototype ).extend( Player.prototype, {

	/**
	 *	Loading.
	 */

	load: function( id ) {

		this._player && this._player.loadVideo( id );
	},

	clear: function( ) {

		this._player && this._player.clearVideo( );
	},



	/**
	 *	Flow control.
	 */

	play: function( ) {

		this._player && this._player.playVideo( );
	},

	isPlaying: function( ) {

		if ( !this._player ) {
			return false;
		}

		return ( this._player.getPlayerState( ) === Youtube.PLAYING );
	},

	pause: function( ) {

		this._player && this._player.pauseVideo( );
	},

	isPaused: function( ) {

		if ( !this._player ) {
			return true;
		}

		return ( this._player.getPlayerState( ) === Youtube.PAUSED );
	},

	stop: function( ) {

		this._player && this._player.stopVideo( );
	},

	isStopped: function( ) {

		if ( !this._player ) {
			return true;
		}

		var state = this._player.getPlayerState( );

		return (( state === Youtube.UNSTARTED ) || ( state === Youtube.ENDED ));
	},



	/**
	 *	Timing.
	 */

	duration: function( ) {

		this._player && this._player.getDuration( );
	},

	currentTime: function( ) {

		this._player && this._player.getCurrentTime( );
	},

	seek: function( seconds ) {

		this._player && this._player.seekTo( seconds );
	},



	/**
	 *	Sound.
	 */

	volume: function( ) {

		this._player && this._player.getVolume( );
	},

	setVolume: function( volume ) {

		this._player && this._player.setVolume( volume );
	},

	mute: function( ) {

		this._player && this._player.mute( );
	},

	unMute: function( ) {

		this._player && this._player.unMute( );
	},

	isMuted: function( ) {

		this._player && this._player.isMuted( );
	},



	/**
	 *	Events.
	 */

	on: function( event, callback ) {

		this._player.addEventListener( event, callback );
	}
});



module.exports = Youtube;

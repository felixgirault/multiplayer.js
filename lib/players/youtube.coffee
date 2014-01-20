#
#	@author Félix Girault <felix.girault@gmail.com>
#	@license FreeBSD License (http://opensource.org/licenses/BSD-2-Clause)
#

Player = require( 'player' )
Util = require( 'util' )



class Youtube extends Player

	API: 'https://www.youtube.com/iframe_api'

	UNSTARTED: -1
	ENDED: 0
	PLAYING: 1
	PAUSED: 2



	_loaded = false
	_queue = [ ]

	constructor: ( id, options ) ->
		super( id, options )

		player = document.createElement( 'div' )
		player.setAttribute( 'id', @domId )
		@container.appendChild( player )

		if !window.onYouTubeIframeAPIReady
			window.onYouTubeIframeAPIReady = ( id ) ->
				callback( ) for callback in _queue
				_loaded = true

			Util.load( @API )

		setup = ( ) =>
			new YT.Player( @domId,
				height: '390',
				width: '640',
				videoId: @id,
				events:
					onReady: ( event ) =>
						@player = event.target
						@dfd.resolve( this )
			)

		if _loaded then setup( ) else _queue.push( setup )



	load: ( id ) ->
		@player.loadVideo( id )

	clear: ( ) ->
		@player.clearVideo( )



	play: ( ) ->
		@player.playVideo( )

	isPlaying: ( ) ->
		@player.getPlayerState( ) is @PLAYING

	pause: ( ) ->
		@player.pauseVideo( )

	isPaused: ( ) ->
		@player.getPlayerState( ) is @PAUSED

	stop: ( ) ->
		@player.stopVideo( )
		@player.seek( 0 )

	isStopped: ( ) ->
		@player.getPlayerState( ) in [ @UNSTARTED, @ENDED ]



	duration: ( ) ->
		@player.getDuration( )

	currentTime: ( ) ->
		@player.getCurrentTime( )

	seek: ( seconds ) ->
		@player.seekTo( seconds )



	volume: ( ) ->
		@player.getVolume( )

	setVolume: ( volume ) ->
		@player.setVolume( volume )

	mute: ( ) ->
		@player.mute( )

	unMute: ( ) ->
		@player.unMute( )

	isMuted: ( ) ->
		@player.isMuted( )



	on: ( event, callback ) ->
		@player.addEventListener( event, callback )



module.exports = Youtube

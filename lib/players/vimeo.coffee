#
#	@author Félix Girault <felix.girault@gmail.com>
#	@license FreeBSD License (http://opensource.org/licenses/BSD-2-Clause)
#

Player = require( 'player' )
Util = require( 'util' )



class Vimeo extends Player

	API: 'http://a.vimeocdn.com/js/froogaloop2.min.js'



	_loaded = false
	_loading = false
	_queue = [ ]

	constructor: ( id, options ) ->
		super( id, options )

		el = document.createElement( 'iframe' )
		el.setAttribute( 'id', @domId )
		el.setAttribute(
			'src',
			"http://player.vimeo.com/video/#{@id}?api=1&player_id=#{@domId}"
		)
		el.setAttribute( 'webkitAllowFullScreen', 'webkitAllowFullScreen' )
		el.setAttribute( 'mozallowfullscreen', 'mozallowfullscreen' )
		el.setAttribute( 'allowFullScreen', 'allowFullScreen' )

		el.setAttribute( 'width', options.width ) if 'width' of options
		el.setAttribute( 'height', options.height ) if 'height' of options

		@container.appendChild( el )

		if !_loading
			_loading = true
			Util.load( @API ).then(( ) ->
				callback( ) for callback in _queue
				_loaded = true
			)

		setup = ( ) =>
			@player = Froogaloop( el )
			@player.addEvent( 'ready', ( ) =>
				@vol = this.volume( )
				@dfd.resolve( this )
			)

		if _loaded then setup( ) else _queue.push( setup )



	load: ( ) ->

	clear: ( ) ->
		@player.api( 'unload' )



	play: ( ) ->
		@player.api( 'play' )

	isPlaying: ( ) ->
		!this.isPaused( )

	pause: ( ) ->
		@player.api( 'pause' )

	isPaused: ( ) ->
		@player.api( 'paused' )

	stop: ( ) ->
		this.pause( )
		this.seek( 0 )

	isStopped: ( ) ->
		this.isPaused( )



	duration: ( ) ->
		@player.api( 'getDuration' )

	currentTime: ( ) ->
		@player.api( 'getCurrentTime' )

	seek: ( seconds ) ->
		@player.api( 'seekTo', seconds )



	volume: ( ) ->
		@player.api( 'getVolume' ) * 100

	setVolume: ( volume ) ->
		@vol = volume / 100
		@player.api( 'setVolume', @vol )

	mute: ( ) ->
		@player.api( 'setVolume', 0 )

	unMute: ( ) ->
		@player.api( 'setVolume', @vol )

	isMuted: ( ) ->
		@player.api( 'volume' )?



	on: ( event, callback ) ->
		@player.api( 'addEvent', event, callback )



module.exports = Vimeo

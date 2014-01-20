#
#	@author Félix Girault <felix.girault@gmail.com>
#	@license FreeBSD License (http://opensource.org/licenses/BSD-2-Clause)
#

Player = require( 'player' )



class Vimeo extends Player

	@_froogaloopLoaded = false



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

		if !@_froogaloopLoaded
			Util.loadScript( 'http://a.vimeocdn.com/js/froogaloop2.min.js' )
			@_froogaloopLoaded = true

		setTimeout(( ) =>
			@player = Froogaloop( el ).addEvent( 'ready', ( ) =>
				@vol = this.volume( )
				@dfd.resolve( this )
			)
		)



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
		@player.api( 'getVolume' )

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

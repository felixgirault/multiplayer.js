#
#	@author Félix Girault <felix.girault@gmail.com>
#	@license FreeBSD License (http://opensource.org/licenses/BSD-2-Clause)
#

#Q = require( 'Q' )



class Player

	constructor: ( @id, @options ) ->
		@domId = "multiplayer-#{@id}"
		@container = document.getElementById( options.id )
		@dfd = Q.defer( )



	ready: ( ) ->
		@dfd.promise



	load: ( ) ->
	clear: ( ) ->



	play: ( ) ->
	isPlaying: ( ) ->
	pause: ( ) ->
	isPaused: ( ) ->
	stop: ( ) ->
	isStopped: ( ) ->



	duration: ( ) ->
	currentTime: ( ) ->
	seek: ( seconds ) ->



	volume: ( ) ->
	setVolume: ( volume ) ->
	mute: ( ) ->
	unMute: ( ) ->
	isMuted: ( ) ->



	on: ( event, callback ) ->



module.exports = Player

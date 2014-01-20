#
#	@author Félix Girault <felix.girault@gmail.com>
#	@license FreeBSD License (http://opensource.org/licenses/BSD-2-Clause)
#

#Q = require( 'Q' )



class Util

	# from http://api.jquery.com/jQuery.getScript/
	@load: ( url ) ->
		dfd = Q.defer( )
		head = document.getElementsByTagName( 'head' )[ 0 ] || document.documentElement
		script = document.createElement( 'script' )
		script.src = url
		done = false

		script.onload = script.onreadystatechange = ( ) ->
			if !done && ( !@readyState || @readyState in [ 'loaded', 'complete' ])
				script.onload = script.onreadystatechange = null
				done = true
				head.removeChild( script ) if head and script.parentNode
				dfd.resolve( )

		head.insertBefore( script, head.firstChild );
		dfd.promise



module.exports = Util

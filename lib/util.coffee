#
#	@author Félix Girault <felix.girault@gmail.com>
#	@license FreeBSD License (http://opensource.org/licenses/BSD-2-Clause)
#



class Util

	@loadScript: ( url ) ->
		script = document.createElement( 'script' )
		script.setAttribute( 'src', url )
		firstScript = document.getElementsByTagName( 'script' )[ 0 ]
		firstScript.parentNode.insertBefore( script, firstScript )



module.exports = Util

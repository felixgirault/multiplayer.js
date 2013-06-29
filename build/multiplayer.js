(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("dailymotion", function(exports, require, module) {
  /**
   *	@author Félix Girault <felix.girault@gmail.com>
   *	@license FreeBSD License (http://opensource.org/licenses/BSD-2-Clause)
   */

  var Player = require( 'player' );



  /**
   *
   */

  var Dailymotion = function( id, options ) {

  	var playerId = 'dailymotion-video-' + id;
  	var url = 'http://www.dailymotion.com/swf/' + id + '?enableApi=1&playerapiid=' + playerId;

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

  	$( window ).on( 'dailymotionPlayerReady', function( readyPlayerId ) {
  		if ( readyPlayerId === playerId ) {
  			_this._player = document.getElementById( readyPlayerId );
  		}
  	});
  };



  /**
   *	Player states.
   */

  Dailymotion.UNSTARTED = -1;
  Dailymotion.ENDED = 0;
  Dailymotion.PLAYING = 1;
  Dailymotion.PAUSED = 2;



  /**
   *
   */

  window.onDailymotionPlayerReady = function( id ) {

  	$( window ).trigger( 'dailymotionPlayerReady', id );
  }



  _( Dailymotion.prototype ).extend( Player.prototype, {

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

  		return ( this._player.getPlayerState( ) === Dailymotion.PLAYING );
  	},

  	pause: function( ) {

  		this._player && this._player.pauseVideo( );
  	},

  	isPaused: function( ) {

  		if ( !this._player ) {
  			return true;
  		}

  		return ( this._player.getPlayerState( ) === Dailymotion.PAUSED );
  	},

  	stop: function( ) {

  		this._player && this._player.stopVideo( );
  	},

  	isStopped: function( ) {

  		if ( !this._player ) {
  			return true;
  		}

  		var state = this._player.getPlayerState( );

  		return (( state === Dailymotion.UNSTARTED ) || ( state === Dailymotion.ENDED ));
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



  module.exports = Dailymotion;
  
});
window.require.register("multiplayer", function(exports, require, module) {
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
  
});
window.require.register("player", function(exports, require, module) {
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
  
});
window.require.register("vimeo", function(exports, require, module) {
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
  
});
window.require.register("youtube", function(exports, require, module) {
  /**
   *	@author Félix Girault <felix.girault@gmail.com>
   *	@license FreeBSD License (http://opensource.org/licenses/BSD-2-Clause)
   */



  
});

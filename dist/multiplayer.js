require.register('multiplayer', function(exports, require, module) {
var multiplayer;

multiplayer = function(url, options) {
  var detector, key, matches, module, name, player, value, _ref, _ref1;
  this.DETECTORS = {
    dailymotion: /dailymotion\.com\/(?:embed\/)?video\/([a-z0-9]+)/i,
    vimeo: /vimeo\.com\/(?:video\/)?([0-9]+)/i,
    youtube: /(?:v=|v\/|embed\/|youtu\.be\/)([a-z0-9_-]+)/i
  };
  this.DEFAULTS = {
    id: 'multiplayer',
    width: 425,
    height: 356,
    version: 9,
    swfUrl: null,
    flashVars: null,
    attributes: null,
    params: {
      allowScriptAccess: 'always'
    }
  };
  _ref = this.DEFAULTS;
  for (key in _ref) {
    value = _ref[key];
    if (!(key in options)) {
      options[key] = value;
    }
  }
  _ref1 = this.DETECTORS;
  for (name in _ref1) {
    detector = _ref1[name];
    if (matches = detector.exec(url)) {
      module = require("players/" + name);
      player = new module(matches[1], options);
      return player.ready();
    }
  }
  return Q.defer().reject("No suitable player found").promise;
};

module.exports = multiplayer;

});
require.register('player', function(exports, require, module) {
var Player;

Player = (function() {
  function Player(id, options) {
    this.id = id;
    this.options = options;
    this.domId = "multiplayer-" + this.id;
    this.container = document.getElementById(options.id);
    this.dfd = Q.defer();
  }

  Player.prototype.ready = function() {
    return this.dfd.promise;
  };

  Player.prototype.load = function() {};

  Player.prototype.clear = function() {};

  Player.prototype.play = function() {};

  Player.prototype.isPlaying = function() {};

  Player.prototype.pause = function() {};

  Player.prototype.isPaused = function() {};

  Player.prototype.stop = function() {};

  Player.prototype.isStopped = function() {};

  Player.prototype.duration = function() {};

  Player.prototype.currentTime = function() {};

  Player.prototype.seek = function(seconds) {};

  Player.prototype.volume = function() {};

  Player.prototype.setVolume = function(volume) {};

  Player.prototype.mute = function() {};

  Player.prototype.unMute = function() {};

  Player.prototype.isMuted = function() {};

  Player.prototype.on = function(event, callback) {};

  return Player;

})();

module.exports = Player;

});
require.register('util', function(exports, require, module) {
var Util;

Util = (function() {
  function Util() {}

  Util.loadScript = function(url) {
    var firstScript, script;
    script = document.createElement('script');
    script.setAttribute('src', url);
    firstScript = document.getElementsByTagName('script')[0];
    return firstScript.parentNode.insertBefore(script, firstScript);
  };

  return Util;

})();

module.exports = Util;

});
require.register('players/dailymotion', function(exports, require, module) {
var Dailymotion, Player,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Player = require('player');

Dailymotion = (function(_super) {
  __extends(Dailymotion, _super);

  Dailymotion.prototype.UNSTARTED = -1;

  Dailymotion.prototype.ENDED = 0;

  Dailymotion.prototype.PLAYING = 1;

  Dailymotion.prototype.PAUSED = 2;

  function Dailymotion(id, options) {
    var _this = this;
    Dailymotion.__super__.constructor.call(this, id, options);
    this.player = document.createElement('div');
    this.player.setAttribute('id', this.domId);
    this.container.appendChild(this.player);
    if (!window.onDailymotionPlayerReady) {
      window._dmdfd = [];
      window.onDailymotionPlayerReady = function(id) {
        var dfd, domId, _ref, _results;
        _ref = window._dmdfd;
        _results = [];
        for (domId in _ref) {
          dfd = _ref[domId];
          if (id === domId) {
            _results.push(dfd.resolve());
          }
        }
        return _results;
      };
    }
    window._dmdfd[this.domId] = function() {
      return _this.dfd.resolve(_this);
    };
    swfobject.embedSWF("http://www.dailymotion.com/swf/" + this.id + "?enableApi=1&playerapiid=" + this.domId, this.domId, options.width, options.height, options.version, options.swfUrl, options.flashVars, options.params, options.attributes);
  }

  Dailymotion.prototype.load = function(id) {
    return this.player.loadVideo(id);
  };

  Dailymotion.prototype.clear = function() {
    return this.player.clearVideo();
  };

  Dailymotion.prototype.play = function() {
    return this.player.playVideo();
  };

  Dailymotion.prototype.isPlaying = function() {
    return this.player.getPlayerState() === this.PLAYING;
  };

  Dailymotion.prototype.pause = function() {
    return this.player.pauseVideo();
  };

  Dailymotion.prototype.isPaused = function() {
    return this.player.getPlayerState() === this.PAUSED;
  };

  Dailymotion.prototype.stop = function() {
    return this.player.stopVideo();
  };

  Dailymotion.prototype.isStopped = function() {
    var _ref;
    return (_ref = this.player.getPlayerState()) === this.UNSTARTED || _ref === this.ENDED;
  };

  Dailymotion.prototype.duration = function() {
    return this.player.getDuration();
  };

  Dailymotion.prototype.currentTime = function() {
    return this.player.getCurrentTime();
  };

  Dailymotion.prototype.seek = function(seconds) {
    return this.player.seekTo(seconds);
  };

  Dailymotion.prototype.volume = function() {
    return this.player.getVolume();
  };

  Dailymotion.prototype.setVolume = function(volume) {
    return this.player.setVolume(volume);
  };

  Dailymotion.prototype.mute = function() {
    return this.player.mute();
  };

  Dailymotion.prototype.unMute = function() {
    return this.player.unMute();
  };

  Dailymotion.prototype.isMuted = function() {
    return this.player.isMuted();
  };

  Dailymotion.prototype.on = function(event, callback) {
    return this.player.addEventListener(event, callback);
  };

  return Dailymotion;

})(Player);

module.exports = Dailymotion;

});
require.register('players/vimeo', function(exports, require, module) {
var Player, Vimeo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Player = require('player');

Vimeo = (function(_super) {
  __extends(Vimeo, _super);

  Vimeo._froogaloopLoaded = false;

  function Vimeo(id, options) {
    var el,
      _this = this;
    Vimeo.__super__.constructor.call(this, id, options);
    el = document.createElement('iframe');
    el.setAttribute('id', this.domId);
    el.setAttribute('src', "http://player.vimeo.com/video/" + this.id + "?api=1&player_id=" + this.domId);
    console.log("http://player.vimeo.com/video/" + this.id + "?api=1&player_id=" + this.domId);
    el.setAttribute('webkitAllowFullScreen', 'webkitAllowFullScreen');
    el.setAttribute('mozallowfullscreen', 'mozallowfullscreen');
    el.setAttribute('allowFullScreen', 'allowFullScreen');
    if ('width' in options) {
      el.setAttribute('width', options.width);
    }
    if ('height' in options) {
      el.setAttribute('height', options.height);
    }
    this.container.appendChild(el);
    if (!this._froogaloopLoaded) {
      Util.loadScript('http://a.vimeocdn.com/js/froogaloop2.min.js');
      this._froogaloopLoaded = true;
    }
    setTimeout(function() {
      return _this.player = Froogaloop(el).addEvent('ready', function() {
        console.log('ready');
        _this.vol = _this.volume();
        return _this.dfd.resolve(_this);
      });
    });
  }

  Vimeo.prototype.load = function() {};

  Vimeo.prototype.clear = function() {
    return this.player.api('unload');
  };

  Vimeo.prototype.play = function() {
    return this.player.api('play');
  };

  Vimeo.prototype.isPlaying = function() {
    return !this.isPaused();
  };

  Vimeo.prototype.pause = function() {
    return this.player.api('pause');
  };

  Vimeo.prototype.isPaused = function() {
    return this.player.api('paused');
  };

  Vimeo.prototype.stop = function() {
    this.pause();
    return this.seek(0);
  };

  Vimeo.prototype.isStopped = function() {
    return this.isPaused();
  };

  Vimeo.prototype.duration = function() {
    return this.player.api('getDuration');
  };

  Vimeo.prototype.currentTime = function() {
    return this.player.api('getCurrentTime');
  };

  Vimeo.prototype.seek = function(seconds) {
    return this.player.api('seekTo', seconds);
  };

  Vimeo.prototype.volume = function() {
    return this.player.api('getVolume');
  };

  Vimeo.prototype.setVolume = function(volume) {
    this.vol = volume / 100;
    return this.player.api('setVolume', this.vol);
  };

  Vimeo.prototype.mute = function() {
    return this.player.api('setVolume', 0);
  };

  Vimeo.prototype.unMute = function() {
    return this.player.api('setVolume', this.vol);
  };

  Vimeo.prototype.isMuted = function() {
    return this.player.api('volume') != null;
  };

  Vimeo.prototype.on = function(event, callback) {
    return this.player.api('addEvent', event, callback);
  };

  return Vimeo;

})(Player);

module.exports = Vimeo;

});
require.register('players/youtube', function(exports, require, module) {
var Player, Util, Youtube,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Player = require('player');

Util = require('util');

Youtube = (function(_super) {
  __extends(Youtube, _super);

  Youtube.prototype.UNSTARTED = -1;

  Youtube.prototype.ENDED = 0;

  Youtube.prototype.PLAYING = 1;

  Youtube.prototype.PAUSED = 2;

  function Youtube(id, options) {
    var player, setup,
      _this = this;
    Youtube.__super__.constructor.call(this, id, options);
    player = document.createElement('div');
    player.setAttribute('id', this.domId);
    this.container.appendChild(player);
    if (!window.onYouTubeIframeAPIReady) {
      Util.loadScript('https://www.youtube.com/iframe_api');
      window._youtubeLoaded = false;
      window._youtubeQueue = [];
      window.onYouTubeIframeAPIReady = function(id) {
        var callback, _i, _len, _ref, _results;
        window._youtubeLoaded = true;
        _ref = window._youtubeQueue;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          callback = _ref[_i];
          _results.push(callback());
        }
        return _results;
      };
    }
    setup = function(event) {
      return new YT.Player(_this.domId, {
        height: '390',
        width: '640',
        videoId: _this.id,
        events: {
          onReady: function(event) {
            _this.player = event.target;
            return _this.dfd.resolve(_this);
          }
        }
      });
    };
    if (window._youtubeLoaded) {
      setup();
    } else {
      window._youtubeQueue.push(setup);
    }
  }

  Youtube.prototype.load = function(id) {
    return this.player.loadVideo(id);
  };

  Youtube.prototype.clear = function() {
    return this.player.clearVideo();
  };

  Youtube.prototype.play = function() {
    return this.player.playVideo();
  };

  Youtube.prototype.isPlaying = function() {
    return this.player.getPlayerState() === this.PLAYING;
  };

  Youtube.prototype.pause = function() {
    return this.player.pauseVideo();
  };

  Youtube.prototype.isPaused = function() {
    return this.player.getPlayerState() === this.PAUSED;
  };

  Youtube.prototype.stop = function() {
    return this.player.stopVideo();
  };

  Youtube.prototype.isStopped = function() {
    var _ref;
    return (_ref = this.player.getPlayerState()) === this.UNSTARTED || _ref === this.ENDED;
  };

  Youtube.prototype.duration = function() {
    return this.player.getDuration();
  };

  Youtube.prototype.currentTime = function() {
    return this.player.getCurrentTime();
  };

  Youtube.prototype.seek = function(seconds) {
    return this.player.seekTo(seconds);
  };

  Youtube.prototype.volume = function() {
    return this.player.getVolume();
  };

  Youtube.prototype.setVolume = function(volume) {
    return this.player.setVolume(volume);
  };

  Youtube.prototype.mute = function() {
    return this.player.mute();
  };

  Youtube.prototype.unMute = function() {
    return this.player.unMute();
  };

  Youtube.prototype.isMuted = function() {
    return this.player.isMuted();
  };

  Youtube.prototype.on = function(event, callback) {
    return this.player.addEventListener(event, callback);
  };

  return Youtube;

})(Player);

module.exports = Youtube;

});
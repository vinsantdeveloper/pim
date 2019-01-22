/*

	var exec = require("cordova/exec");

	function VideoPlayer() {
		this.url = null;
	}

	VideoPlayer.prototype.play = function(url) {
		exec(null, null, "VideoPlayer", "playVideo", [url]);
	};

	var videoPlayer = new VideoPlayer();
	module.exports = videoPlayer;
	*/
	
	function VideoPlayer() {
	};

	/**
	 * Starts the video player intent
	 *
	 * @param url           The url to play
	 */
	VideoPlayer.prototype.play = function(url) {
	    cordova.exec(null, null, "VideoPlayer", "playVideo", [url]);
	};

	/**
	 * Load VideoPlayer
	
	cordova.addConstructor(function() {
	    cordova.addPlugin("VideoPlayer", new VideoPlayer());
	});
	 */
	cordova.addConstructor(function() {
	    if (!window.plugins) {
	      window.plugins = {};
	    }

	    if (!window.plugins.VideoPlayer) {
	      window.plugins.VideoPlayer = new VideoPlayer();
	    }
	  });


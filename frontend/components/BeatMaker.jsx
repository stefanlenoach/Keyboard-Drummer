var React = require('react')
var SongsApiUtil = require('../util/songs_api_util')
var YouTubePlayer = require('youtube-player')

module.exports = React.createClass({
  getInitialState: function () {
    return {
      localTime: 0,
      ytTime: 0,
      nextBeat: 0
    }
  },

  componentDidMount: function () {
    $(document.body).on('keydown', this.keyDownHandler);
    this.enableIframeApi();
  },

  componentWillUnmount: function () {
    $(document.body).off('keydown', this.keyDownHandler);
  },

  keyDownHandler: function (e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.which === 32) {
      if (this.getPlayer().getPlayerState() !== 1) {
        this.getPlayer().playVideo();
        this.startTime = window.Date.now();
      } else {
        this.getPlayer().pauseVideo();
      }
    } else if (e.which >= 65 || e.which <= 90) {
      var beatTime = window.Date.now() - this.startTime;
      var data = { time: beatTime, song_id: 2, key: e.key.toString() };
      SongsApiUtil.createBeat(data);
    }
  },

  playerTimeInterval: function () {
    var ytTime = this.getPlayer().getCurrentTime();
    if (ytTime === this.state.ytTime) {
      this.setState({ localTime: this.state.localTime + .010 });
    } else {
      this.setState({ localTime: ytTime, ytTime: ytTime });
    }
  },

  enableIframeApi: function () {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;
    var youtubeId = this.props.youtubeId;
    onYouTubeIframeAPIReady = function () {
      player = new YT.Player('song-container', {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        videoId: 'siwpn14IE7E',
        wmode: "transparent"
      });
    }
    onYouTubeIframeAPIReady();

    this.getPlayer = function () {
      return player;
    }
  },

  render: function () {
    return (
      <container className="song-container" id="song-container"></container>
    );
  }
});

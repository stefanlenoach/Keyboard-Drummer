var React = require('react')
var SongsApiUtil = require('../util/songs_api_util')
var YouTubePlayer = require('youtube-player')

module.exports = React.createClass({
  getInitialState: function () {
    return {
      localTime: 0,
      videoTime: 0,
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
      if (this.player().getPlayerState && this.player().getPlayerState() !== 1) {
        this.togglePlay();
      } else {
        this.player().pauseVideo();
      }
    } else if (e.which >= 65 || e.which <= 90) {
      var beatTime = this.state.localTime;
      var data = { time: beatTime, song_id: 1, key: e.key.toString() };
      SongsApiUtil.createBeat(data);
    }
  },

  togglePlay: function () {
    if (this.player().getPlayerState && this.player().getPlayerState() !== 1) {
      this.player().playVideo();
      this.intervalVar = setInterval(this.playerTimeInterval, 10);

      this.setState({ playing: true, localTime: this.state.videoTime });
    } else {
      this.player().pauseVideo();
      clearInterval(this.intervalVar);
      this.setState({ playing: false, lastStop: this.state.localTime });
    }
  },

  playerTimeInterval: function () {
    var videoTime = this.player().getCurrentTime();
    if (videoTime === this.state.videoTime) {
      this.setState({ localTime: this.state.localTime + .010 });
    } else {
      this.setState({ localTime: videoTime, videoTime: videoTime });
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
        videoId: '0J2QdDbelmY',
        wmode: "transparent"
      });
    }
    onYouTubeIframeAPIReady();

    this.player = function () {
      return player;
    }
  },

  render: function () {
    return (
      <container className="song-container" id="song-container"></container>
    );
  }
});

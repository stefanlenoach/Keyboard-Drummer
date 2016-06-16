var React = require('react')
var SongsApiUtil = require('../util/songs_api_util')
var YouTubePlayer = require('youtube-player')
var YoutubeApiUtil = require('../util/youtube_api_util')

module.exports = React.createClass({
  getInitialState: function () {
    return {
      localTime: 0,
      ytTime: 0,
      nextBeat: 0,
      score: 0,
      playing: false,
      lastStop: 0
    }
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  componentDidMount: function () {
    YoutubeApiUtil.loadIframePlayer()
    $(document.body).on('keydown', this.keyDown);
    SongsApiUtil.getSong(this.props.params.id, this.setup)
  },

  componentWillUnmount: function () {
    $(document.body).off('keydown', this.keyDown);
  },

  setup: function (song) {
    this.player = YoutubeApiUtil.createIframe(song.youtube_id, this.onPlayerStateChange);
  },

  keyDown: function (e) {
    e.preventDefault();
    if (e.which === 32) {
      this.togglePlay();
    }
  },

  togglePlay: function () {
  if (this.state.playing === false) {
    this.player.playVideo();
    this.intervalVar = setInterval(this.playerTimeInterval, 10);
    this.setState({ playing: true, localTime: this.state.ytTime });
  } else {
    this.player.pauseVideo();
    clearInterval(this.intervalVar);
    this.setState({ playing: false, lastStop: this.state.localTime });
  }
},

checkVideoOver: function () {
  if (this.player.getPlayerState() === 0) {
    clearInterval(this.intervalVar);
    this.context.router.push("/track-list");
  }
},

// no animation on video start in sliding-letter mode
checkVideoStart: function () {
  if (this.player.getPlayerState() === 1) {
  }
},

onPlayerStateChange: function () {
  this.checkVideoOver();
  this.checkVideoStart();
},


  render: function () {
    return (
      <div>

      </div>
    );
  }
});

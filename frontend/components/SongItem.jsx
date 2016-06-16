var React = require('react')
var SongsApiUtil = require('../util/songs_api_util')
var YouTubePlayer = require('youtube-player')
var YoutubeApiUtil = require('../util/youtube_api_util')

module.exports = React.createClass({
  getInitialState: function () {
    return {
      playing: false,
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
      this.play();
    }
  },

  play: function () {
  if (this.state.playing === false) {
    debugger
    this.player.playVideo();
  } else {
    this.player.pauseVideo();
  }
},

checkVideoOver: function () {
  if (this.player.getPlayerState() === 0) {
    this.context.router.push("/SongsIndex");
  }
},

// no animation on video start in sliding-letter mode
checkVideoStart: function () {
  if (this.player.getPlayerState() === 1) {
    console.log("video start")
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

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

  componentDidMount: function () {
    $(document.body).on('keydown', this.keyDownHandler);
    SongsApiUtil.getSong(this.props.params.id, this.saveSongData);
  },

  componentWillUnmount: function () {
    $(document.body).off('keydown', this.keyDownHandler);
  },

  saveSongData: function (song) {
  this.beats = song.beats
  this.songId = song.id
  this.youtubeId = song.youtube_id;
  this.enableIframeApi();
},


keyDownHandler: function (e) {
  e.stopPropagation();
  e.preventDefault();
  if (e.which === 32) {
    if (this.getPlayer().getPlayerState() !== 1) {
      this.getPlayer().playVideo();
      this.renderBeats();
      this.startTime = window.Date.now();
    } else {
      this.getPlayer().pauseVideo();
    }
  } else if (e.which >= 65 || e.which <= 90) {
    var hitTime = window.Date.now() - this.startTime;

  }
},

renderBeats: function () {
  var allBeats = this.beats;
  var i = 0;
  var j = 30;
  var that = this;
  this.loadedBeats = this.beats.slice(i, j)
  loadBeats = function () {
    debugger
    if (this.loadedBeats.length <= 20){
      i = j;
      j += 10;
      this.loadedBeats = that.beats.slice(i, j)
    }
  };
  setTimeout(loadBeats(), 250)
},

  enableIframeApi: function () {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;
    var youtubeId = this.youtubeId;
    onYouTubeIframeAPIReady = function () {
      player = new YT.Player('song-container', {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        videoId: youtubeId,
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
      <div>
        <div className="game-layer" id="game-layer">
          <ul className="group beat-letters">
            <div className="selected-before"></div>

            <div className="selected-after"></div>
          </ul>
          <section className="scoreboard">
            <h1>Score</h1>
            <h2>{this.state.score}</h2>
          </section>
        </div>
        <container className="song-container" id="song-container">
        </container>
      </div>
    );
  }
});

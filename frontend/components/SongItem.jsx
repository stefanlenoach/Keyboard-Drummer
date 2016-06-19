var React = require('react')
var SongsApiUtil = require('../util/songs_api_util')
var YouTubePlayer = require('youtube-player')
var YoutubeApiUtil = require('../util/youtube_api_util')
var Beat = require('./Beat');
module.exports = React.createClass({

    getInitialState: function () {
      return {
        startTime: 0,
        readyBeats: [],
        ytTime: 0,
        score: 0,
        playing: false,
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
      this.getBeats();
      this.setState({ startTime: window.Date.now() });
    } else {
      this.getPlayer().pauseVideo();
    }
  } else if (e.which >= 65 || e.which <= 90) {
    var hitTime = window.Date.now() - this.state.startTime;

  }
},

getBeats: function () {
  var allBeats = this.beats;
  var i = 0;
  var j = 30;
  var that = this;
  this.loadedBeats = this.beats.slice(i, j)
  var newBeats = [];

  showBeats = function () {
    if (that.loadedBeats.length <= 10){
      i += 20 ;
      j += 20;
      that.loadedBeats = that.beats.slice(i, j)
    }
    timeNow = window.Date.now();

    for (var i = 0; i < that.loadedBeats.length; i++) {
      if (timeNow - that.state.startTime + 2000 >= that.loadedBeats[i].time){
        newBeats.push(that.loadedBeats[i]);
      }
    }
    var count = 0;
    for (var i = 0; i < newBeats.length; i++) {
      if (newBeats[i].time <= timeNow - that.state.startTime - 1000){
       count += 1;
      }
    }
    newBeats = newBeats.slice(count);
    that.loadedBeats = that.loadedBeats.slice(newBeats.length);
    that.setState({ readyBeats: newBeats});
    setTimeout(showBeats, 1)
  }

  showBeats();
},

displayBeats: function () {
  var displayedBeats = [];
  if (this.state.readyBeats) {
    this.state.readyBeats.forEach(function(beat){

      displayedBeats.push(this.renderBeat(beat))
    }.bind(this));
  }
  console.log(displayedBeats.length);
  return displayedBeats;
},

renderBeat: function (beat) {
  if (beat) {
    return(<Beat letter={beat.key}/>);
  } else {
    return (<div></div>);
  }
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
            {this.displayBeats()}
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

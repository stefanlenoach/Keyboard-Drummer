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
        score: 0,
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
    debugger
  }
},

getBeats: function () {
  var that = this;

  var i = 0
  var newBeats = [];
  showBeats = function () {

    timeNow = window.Date.now();

    if ((timeNow - that.state.startTime + 1000 <= that.beats[i].time) && (timeNow - that.state.startTime + 2000 >= that.beats[i].time)){
      newBeats.push(that.beats[i]);
      i += 1;
    }


    that.setState({ readyBeats: newBeats });
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

  // for (var i = this.state.readyBeats.length-1; i < this.state.readyBeats.length; i++) {
  //   displayedBeats.push(this.renderBeat(his.state.readyBeats[i]));
  //
  // }

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
            {this.displayBeats()}
          </ul>

        </div>
        <container className="song-container" id="song-container">
        </container>
      </div>
    );
  }
});

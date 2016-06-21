var React = require('react')
var SongsApiUtil = require('../util/songs_api_util')
var YouTubePlayer = require('youtube-player')
var YoutubeApiUtil = require('../util/youtube_api_util')
var Beat = require('./Beat');
module.exports = React.createClass({

    getInitialState: function () {
      return {
        startTime: 0,
        videoTime: 0,
        localTime: 0,
        currentBeat: 0,
        readyBeats: [],
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
  this.beats = song.beats;
  this.songId = song.id;
  this.youtubeId = song.youtube_id;
  this.enableIframeApi();
},


keyDownHandler: function (e) {
  e.stopPropagation();
  e.preventDefault();
  if (e.which === 32) {
    if (this.player().getPlayerState && this.player().getPlayerState() !== 1) {
      this.togglePlay();
    }
  } else if (e.which >= 65 || e.which <= 90) {
    var hitTime = window.Date.now() - this.state.startTime;
    this.beats.forEach( function (beat){
      if ((hitTime < beat.time + 100 && hitTime > beat.time - 100) && (beat.key === e.key)){
        console.log("HIT BASS");
      }
    });
  }
},

togglePlay: function () {
  if (this.player().getPlayerState && this.player().getPlayerState() !== 1) {
    this.player().playVideo();
    this.intervalVar = setInterval(this.playerTimeInterval, 10);
    this.setState({ playing: true, localTime: this.state.ytTime });
  } else {
    this.player().pauseVideo();
    clearInterval(this.intervalVar);
    this.setState({ playing: false, lastStop: this.state.localTime });
  }
},

playerTimeInterval: function () {
  if (this.player().getPlayerState() !== 1) {return;}

  var videoTime = this.player().getCurrentTime();
  if (videoTime === this.state.videoTime) {
    this.setState({ localTime: this.state.localTime + .01 });
  } else {
    this.setState({ localTime: videoTime, videoTime: videoTime });
  }
  this.incrementBeat();
},

incrementBeat: function () {
  if (this.beats[this.state.currentBeat + 1].time < this.state.localTime + 0.15) {
    var currentBeat = this.state.currentBeat + 1;
    this.setState({
      currentBeat: currentBeat
    });

  }
},

renderOneBeat: function (i) {
  if (this.beats[i]) {
   return (<Beat
      letter={this.beats ? this.beats[i].letter : null}
      key={i + this.beats[i].letter}
      score={this.beats[i].score}
    />);
  } else {
    return (<Beat
      letter={null}
      key={i}
    />);
  }
},

renderBeats: function () {
  if (!this.beats) { return null } 
  if (!this.state.playing) {
    return this.renderPauseMessage();
  }

  var currentBeat = this.state.currentBeat;
  var beatArr = [];
  for (var i = (currentBeat - 10 > 0 ? currentBeat - 10 : 0); i < this.beats.length && i < currentBeat + 10; i++) {
    // to display, beat must be within 1.7s of localTime AND at time after last video pause
    if (Math.abs(this.beats[i].time - this.state.localTime) < 1.3 && this.beats[i].time > this.state.lastStop + 1.0) {
      beatArr.push(this.renderOneBeat(i));
    }
  }

  return beatArr;
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
        wmode: "transparent",
        playerVars: {
          'autoplay': 0,
          'controls': 0,
          modestBranding: 1,
          showinfo: 0,
          fs: 0,
          disablekb: 0,
          rel:0,
          iv_load_policy: 3
        },
      });
    }
    onYouTubeIframeAPIReady();

    this.player = function () {
      return player;
    }
  },

  render: function () {
    return (
      <div>
        <div className="game-layer" id="game-layer">
          <ul className="group beat-letters">
            {this.renderBeats()}
          </ul>

        </div>
        <container className="song-container" id="song-container">
        </container>
      </div>
    );
  }
});

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
        score: 0,
        currentBeat: 0,
        beats: [],
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
  this.setState({beats: song.beats});
  this.songId = song.id;
  this.youtubeId = song.youtube_id;
  this.enableIframeApi();
},


keyDownHandler: function (e) {
  e.stopPropagation();
  e.preventDefault();
  if (e.which === 32) {
      this.play();
  } else if (e.which >= 65 || e.which <= 90) {
    var hitTime = this.state.localTime;
      var i = this.state.currentBeat;
      var score = this.state.score
      if ((hitTime < this.state.beats[i].time + .1 && hitTime > this.state.beats[i].time - .1) && (this.state.beats[i].key === e.key)){
        this.setState({ score: score + 10 })
        return
      } else {
        this.setState({ score: score - 20 })
      }

  }
},

play: function () {
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
  if (this.state.beats[this.state.currentBeat + 1].time < this.state.localTime + 0.15) {
    var currentBeat = this.state.currentBeat + 1;
    this.setState({
      currentBeat: currentBeat
    });

  }
},

renderOneBeat: function (i) {
  if (this.state.beats[i]) {
   return (<Beat
      letter={this.state.beats[i].key}
      key={this.state.beats[i].id}
    />);
  }
},

renderBeats: function () {
  if (!this.state.beats) { return null }
  if (!this.state.playing) {
  }
  var currentBeat = this.state.currentBeat;
  var beatArr = [];
  for (var i = 0; i < this.state.beats.length; i++) {

    if (Math.abs(this.state.beats[i].time - this.state.localTime) < 1.3 && this.state.beats[i].time > this.state.lastStop + 1.0) {
      beatArr.push(this.renderOneBeat(i));
    }
  }

  return beatArr;
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
          <section className="scoreboard">
            <h1>SCORE: {this.state.score}</h1>

          </section>

        </div>
        <container className="song-container" id="song-container">
        </container>
      </div>
    );
  }
});

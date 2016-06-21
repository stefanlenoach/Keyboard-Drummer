var React = require('react')
var SongsApiUtil = require('../util/songs_api_util');
var YoutubeApiUtil = require('../util/youtube_api_util')

module.exports = React.createClass({

  getInitialState: function () {
    return { songs: [] };
  },

  componentDidMount: function () {
    $(document.body).on('keydown', this.onKeyDown);
    SongsApiUtil.getSongs(this.setSongs);
    YoutubeApiUtil.loadIframePlayer();
  },

  componentWillUnmount: function () {
    $(document.body).off('keydown', this.onKeyDown);
  },

  setSongs: function (sngs) {
    this.setState({ songs: sngs, index: 0})
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  onKeyDown: function (event) {
    event.preventDefault();
    var currentVal = 0;
    if (event.which === 13) {
      var songId = this.state.songs[this.state.index].id
      this.context.router.push("/songs/" + songId);
    }
    if (event.which === 38){
      if (this.state.index > 0){
        currentVal = this.state.index - 1
        this.setState({index: currentVal})
      }
    }
    if (event.which === 40){
      if (this.state.index < this.state.songs.length - 1){
        currentVal = this.state.index + 1
        this.setState({index: currentVal})
      }
    }
  },


  allSongs: function () {
    var arr = [];
    var songs = this.state.songs;
    var i = this.state.index;
    var selected = '';
    this.state.songs.forEach(function (song) {
      if (song === songs[i]){
        selected = "selected";
      } else {
        selected = "false";
      }
      arr.push(
        <li key={song.id} className={selected}>
          <div >
            {song.name}
          </div>
        </li>
      );
    });
    return arr;
  },

  render: function () {
    return (
      <div className="songs-index">
        <h2>Songs:</h2>

        <div className="songs">
          <ul>
            {this.allSongs()}
          </ul>
        </div>
        Press Enter
      </div>
    )
  }
});

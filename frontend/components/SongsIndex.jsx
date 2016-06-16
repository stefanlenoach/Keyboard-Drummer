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
    if (event.which === 13) {
      var songId = this.state.songs[this.state.index].id
      this.context.router.push("/songs/" + songId);
    }
  },

  allSongs: function () {
    var arr = [];
    var i = 0;
    var that = this;
    this.state.songs.forEach(function (song) {
      arr.push(
        <li key={song.song_id}>
          <div className={that.state.index === i ? "selected" : null}>
            {song.name}
          </div>
        </li>
      );
      i++;
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

      </div>
    )
  }
});

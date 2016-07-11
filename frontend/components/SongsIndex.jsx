var React = require('react')
var SongsApiUtil = require('../util/songs_api_util');

module.exports = React.createClass({

  getInitialState: function () {
    return { songs: [] };
  },

  componentDidMount: function () {
    $(document.body).on('keydown', this.onKeyDown);
    SongsApiUtil.getSongs(this.setSongs);
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
          </div><br/>
        </li>
      );
    });
    return arr;
  },

  render: function () {
    return (
      <div className="songs-index">
        <h1>Welcome to Keyboard Drummer!</h1><br></br>
        <div className='instructions'>
          <div className='instruct-text'>
            <p>1. Choose a song from the list below and press Enter.</p><br/>
            <p>2. Press Enter to start the game.</p><br/>
            <p>3. Hit the right keys as they reach center screen.</p><br/>
            <p>4. Have fun!</p><br></br>
          </div>
        </div><br></br><br></br>
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

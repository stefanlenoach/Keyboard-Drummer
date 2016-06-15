var React = require('react')
var SongsIndex = require('./SongsIndex');
var YoutubeApiUtil = require('../util/youtube_api_util');

module.exports = React.createClass({

  componentDidMount: function () {
    $(document.body).on('keydown', this.onChange);
    YoutubeApiUtil.loadIframePlayer();
  },

  componentWillUnmount: function () {
    $(document.body).off('keydown', this.onChange);
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  onChange: function (e) {
    event.preventDefault();
    if (e.which === 32) {
      this.context.router.push("/songs");
    }
  },

  render: function () {
    return (
      <div>HEEEEEEERe
      </div>
    );
  }
});

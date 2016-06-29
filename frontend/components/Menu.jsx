var React = require('react')
var SongsIndex = require('./SongsIndex');


module.exports = React.createClass({

  componentDidMount: function () {
    $(document.body).on('keydown', this.onChange);
    
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
      <div className='menu'><h1>Keyboard Drummer</h1> <br/> Press Space
      </div>
    );
  }
});

var React = require('react');

module.exports = React.createClass({
  render: function () {
    return (<li className={this.props.letter}>
              {this.props.letter}
            </li>);
  }
});

var React = require('react');

module.exports = React.createClass({
  render: function () {
    return <li
        className={this.props.selected ? "selected" : null}
        data-score={this.props.score}
      >
        {this.props.key ? this.props.key : "🎧"}
      </li>;
  }
});

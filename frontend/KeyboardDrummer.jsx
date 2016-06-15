var React = require('react')
var ReactDOM = require('react-dom')

var ReactRouter = require('react-router')
var Router = ReactRouter.Router
var Route = ReactRouter.Route
var hashHistory = ReactRouter.hashHistory;

var Menu = require('./components/menu')


var router = (
  <Router history={hashHistory}>
    <Route path="/" component={Menu} />
  </Router>
);


$(document).on('ready', function () {
  ReactDOM.render(
    router, $('.entry')[0]
  );
});

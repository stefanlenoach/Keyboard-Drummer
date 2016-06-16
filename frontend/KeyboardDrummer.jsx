var React = require('react')
var ReactDOM = require('react-dom')

var ReactRouter = require('react-router')
var Router = ReactRouter.Router
var Route = ReactRouter.Route
var hashHistory = ReactRouter.hashHistory;

var Menu = require('./components/Menu')
var SongsIndex = require('./components/SongsIndex')
var SongItem = require('./components/SongItem')

var router = (
  <Router history={hashHistory}>
    <Route path="/" component={Menu} />
    <Route path="/songs" component={SongsIndex} />
    <Route path='/songs/:id' component={SongItem}/>
  </Router>
);


$(document).on('ready', function () {
  ReactDOM.render(
    router, $('.entry')[0]
  );
});

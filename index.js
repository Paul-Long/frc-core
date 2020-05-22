module.exports = require('./lib');
var connect = require('react-redux').connect;
module.exports.connect = connect;
var fetch = require('isomorphic-fetch');
module.exports.fetch = fetch;
const {
  BrowserRouter,
  HashRouter,
  Switch,
  Route,
  Link,
  match,
  NavLink,
  Redirect
} = require('react-router-dom');
module.exports.BrowserRouter = BrowserRouter;
module.exports.HashRouter = HashRouter;
module.exports.Switch = Switch;
module.exports.Route = Route;
module.exports.Link = Link;
module.exports.match = match;
module.exports.NavLink = NavLink;
module.exports.Redirect = Redirect;
module.exports.QbService = require('./lib/qb-service');


/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var config = require("./config/config.json");

var routes = require('./routes');
var logs = require('./routes/logs');
var user = require('./routes/user');
var sources = require('./routes/sources');
var sourcesPages = require("./routes/sourcesPages");
var dashboard = require("./routes/dashboard");
var help = require("./routes/help");

var app = require("./app");
var server = http.createServer(app);
var io = require("./lib/socket")(server);

mongoose.connect(config.mongodburi);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/**
 * Routes
 */
app.get('/', routes.index);
app.get('/users', user.list);

app.get('/api/logs', logs.index);
app.get('/api/logs/:id', logs.getLog);
app.post('/api/logs', logs.postLog);

app.get('/api/sources', sources.index);
app.get('/api/sources/:name', sources.getSource);
app.post('/api/sources', sources.postSource);
app.delete('/api/sources/:id', sources.deleteSource);

app.get("/dashboard", dashboard.index);
app.get("/sources", sourcesPages.getSources);

app.get("/help/api", help.api);


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var ask = require('./routes/ask');
var allquestions = require('./routes/allquestions');
var moderate = require('./routes/moderate');
var http = require('http');
var path = require('path');
var faye = require('faye');
var app = express();
var bayeux = new faye.NodeAdapter({mount: '/faye'});
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require('./models/db.js');


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/ask', ask.show);
app.get('/allquestions', allquestions.show);
app.get('/updatequestions', allquestions.updateQuestions);
app.get('/moderate', moderate.show);
app.post('/ask', ask.question);
app.post('/allquestions', allquestions.addVote);
app.post('/addVote', allquestions.addVote);
app.post('/moderate', moderate.delete);




/*Questions.findOne({ 'name': 'Jacky' }, function (err, question) {
  if (err) return handleError(err);
  //console.log(question.name, question.votes, question.question)
})*/


var server = http.createServer(app);
server.listen(app.get('port'));
bayeux.attach(server);
mongoose.connect("mongodb://localhost/ask");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('[MONGODB] Connection successful');
});

//Test to see if publishing questions works:
//bayeux.on('publish', function(clientId, channel, data) {
  // event listener logic
    //console.log(clientId + " " + channel + " " + data.question);
//})
bayeux.on('subscribe', function(clientId, channel, data) {
  // event listener logic
    console.log(clientId + " " + channel + " " + data.question);
})

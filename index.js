require('dotenv').config();
var express = require('express');
var server = express();
var cors = require('cors');
var google = require('googleapis');
var GoogleAuth = require('google-auth-library');
var authFactory = new GoogleAuth();
var calendarConfig = require('./config');
var port = process.env.PORT || 3000;

var authClient;

authFactory.getApplicationDefault(function(err, authClient) {
  if (err) {
    console.log('Authentication failed because of ', err);
    return;
  }
  if (authClient.createScopedRequired && authClient.createScopedRequired()) {
    var scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.readonly'
    ];
    authClient = authClient.createScoped(scopes);
  }

  var calendar = google.calendar({
    version: 'v3',
    auth: authClient
  })

  server.get('/', function(req, res) {
    getEvents(calendar, authClient);
    res.send('MADE IT')
  })

  server.listen(port, function() {
    console.log('NOW LISTENING ON PORT...', port);
  })

});

function getEvents(calendar, authClient) {
  calendar.events.list({
    auth: authClient,
    calendarId: calendarConfig.calendarId
  }, function( err, events ) {
    if(err) {
      console.log('ERROR IN GETTING EVENTS', err);
    }
    console.log('EVENTS IN GET EVENTS', events.items);
  })
}

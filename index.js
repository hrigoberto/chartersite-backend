require('dotenv').config();
var express = require('express');
var server = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var google = require('googleapis');
var GoogleAuth = require('google-auth-library');
var authFactory = new GoogleAuth();
var dns = google.dns('v1');
var config = require('./client_id');
var calendarConfig = require('./config');
// var OAuth2 = google.auth.OAuth2;
var port = process.env.PORT || 3000;
//


var oauth2Client

authFactory.getApplicationDefault(function(err, authClient) {
  if (err) {
    console.log('Authentication failed because of ', err);
    return;
  }
  if (authClient.createScopedRequired && authClient.createScopedRequired()) {
    var scopes = ['https://www.googleapis.com/auth/calendar'];
    authClient = authClient.createScoped(scopes);
  }
  oauth2Client = authClient;

});

var calendar = google.calendar({
  version: 'v3',
  auth: oauth2Client
})

function getEvents() {
  calendar.events.list({
    auth: oauth2Client,
    calendarId: calendarConfig.calendarId
  }, function( err, events ) {
    if(err) {
      console.log('ERROR IN GETTING EVENTS', err);
    }
    console.log('EVENTS IN GET EVENTS', events);
  })
}

server.listen(port, function() {
  console.log('NOW LISTENING ON PORT...', port);
  console.log('Google api', getEvents());
  // console.log('OAUTH2CLIENT:', authFactory, 'GOOGLE:',  google);
})

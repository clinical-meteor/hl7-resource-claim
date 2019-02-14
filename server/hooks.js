import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';

import { Claims } from '../lib/Claims';
import { get } from 'lodash';

Claims.after.insert(function (userId, doc) {

  // // HIPAA Audit Log
  // HipaaLogger.logEvent({eventType: "create", userId: userId, userName: '', collectionName: "Claims"});

  // RELAY/SEND FUNCTIONALITY
  // interface needs to be active in order to send the messages
  if (get(Meteor, 'settings.public.interfaces.default.status') === "active") {
    HTTP.put(get(Meteor, 'settings.public.interfaces.default.channel.endpoint') + '/Claim', {
      data: doc
    }, function(error, result){
      if (error) {
        console.log("POST /Claim", error);
      }
      if (result) {
        console.log("POST /Claim", result);
      }
    });
  }
});
Claims.after.update(function (userId, doc) {

  // // HIPAA Audit Log
  // HipaaLogger.logEvent({eventType: "update", userId: userId, userName: '', collectionName: "Claims"});

  // interface needs to be active in order to send the messages
  if (get(Meteor, 'settings.public.interfaces.default.status') === "active") {
    HTTP.put(get(Meteor, 'settings.public.interfaces.default.channel.endpoint') + '/Claim', {
      data: doc
    }, function(error, result){
      if (error) {
        console.log("POST /Claim", error);
      }
      if (result) {
        console.log("POST /Claim", result);
      }
    });
  }
});
Claims.after.remove(function (userId, doc) {
  // ...
});

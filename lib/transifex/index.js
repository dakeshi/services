/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";
var util = require('util');

function configMessage(msg, progressStatus, resourceName, projectName, languageCode) {
  var reportingMessage = util.format('Transifex report: %s is completed by %d %%, resource: %s in %s(%s)', msg, progressStatus, resourceName, projectName, languageCode);

  return reportingMessage
}

// headers and body are from transifex, settings is from gitter
var parse = function(headers, body, settings) {

  // map of events that the user has picked
  // e.g { translation_completed: true, review_completed: true, proofread_completed: false, fillup_completed: false }
  var events = settings.events;
  // match POST request fields of transifex  
  // project name
  var projectName = body.project;
  // resource name(=translated file name)
  var resourceName = body.resource;
  // language code of translation
  var languageCode = body.language;

  var translationProgression, reviewProgression, proofreadProgression  = -1;
  translationProgression = body.translated;
  reviewProgression = body.reviewed;
  proofreadProgression = body.proofread;

  var reportingMessage = '';
  
  // events[id] will be true or false
  // Only send a message for user selected events
  if (!events[body.event] && !events["translated"] && !events["reviewed"] && !events["proofread"]) return;
  
  if (events[body.event]) {
    reportingMessage = util.format('Transifex report: %s, resource: %s in %s(%s)', body.event, resourceName, projectName, languageCode);

    return {
      message: reportingMessage,
      icon: 'logo',
      errorLevel: "normal"
    };
    
  } else {
    // handling progression status
    // completion progression for particluar resource per particular language
    // represented by an integer(percentage)
    if (events["translated"] && body.translated >= 0) {
      reportingMessage = configMessage("translation", body.translated, resourceName, projectName, languageCode);
    } else if (events["reviewed"] && body.reviewed >= 0) {
      reportingMessage = configMessage("review", body.reviewed, resourceName, projectName, languageCode);
    } else if (events["proofread"] && body.proofread >= 0) {
      reportingMessage = configMessage("proofreading", body.proofread, resourceName, projectName, languageCode);
    } else {
      return; // ex) review is enabled, translation completion event
    }

    return {
      message: reportingMessage,
      icon: 'logo',
      errorLevel: "normal"
    };
  }

  return false;
};

module.exports = {
  apiVersion: 1,
  name: 'Transifex',
  parse: parse
};
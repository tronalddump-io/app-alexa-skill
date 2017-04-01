const Alexa = require('alexa-sdk');
const https = require('https');

const welcomeMessage = "Welcome to Tronald Dump. A collection of quotes our 45th president has said. You can ask for a random quote. Would you like to hear one now?"
const stopSkillMessage = "See you at Mar-a-Lago."

const handlers = {
  'LaunchRequest': function() {
    console.log("welcome");
    this.emit(":ask", welcomeMessage)
  }
  'AMAZON.HelpIntent': function () {
    this.emit(':ask', HelpMessage, HelpMessage);
  },
  'AMAZON.StopIntent': function () {
    this.shouldEndSession = true;
    this.emit(':tell', stopSkillMessage, stopSkillMessage);
  },
  'AMAZON.CancelIntent': function () {
    this.shouldEndSession = true;
    this.emit(':tell', stopSkillMessage, stopSkillMessage);
  },
}

exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
}

const Alexa = require('alexa-sdk');
const https = require('https');

const welcomeMessage = "Welcome to Tronald Dump. A collection of quotes our 45th president has said. You can ask for a random quote or meme. Which one would you like?";
const stopSkillMessage = "See you at Mar-a-Lago.";
const helpMessage = "How about asking for random quote or meme? We don't have alternative facts here.";

function getRandomQuote(cb) {
  const options = {
    host: 'api.tronalddump.io',
    path: '/random/quote',
    method: 'GET',
    headers: {
      'user-agent': 'Tronald Dump Alexa',
      'accept': 'application/hal+json'
    }
  }
  return https.get(options, (res) => {
    res.on('data', (d) => {
      resp = JSON.parse(d)
      cb(resp);
    });
  })
}

const handlers = {
  'LaunchRequest': function() {
    console.log("welcome");
    this.emit(":ask", welcomeMessage, welcomeMessage);
  },
  'GetRandomQuote': function() {
    getRandomQuote((quote) => { this.emit(":tell", quote) });
  },
  'AMAZON.HelpIntent': function () {
    this.emit(':ask', helpMessage, helpMessage);
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

const Alexa = require('alexa-sdk'),
      https = require('https'),
      welcomeMessage = 'Welcome to Tronald Dump. A collection of quotes our 45th president has said. You can ask for a random quote or meme. Which one would you like?',
      stopSkillMessage = 'See you at Mar-a-Lago.',
      helpMessage = 'How about asking for random quote or meme? We don\'t have alternative facts here.';

function getRandomQuote(cb) {
  const options = {
    host    : 'api.tronalddump.io',
    path    : '/random/quote',
    method  : 'GET',
    headers : {
      'user-agent' : 'Tronald Dump Alexa',
      accept       : 'application/hal+json'
    }
  };
  return https.get(options, (res) => {
    res.on('data', (d) => {
      cb(JSON.parse(d));
    });
  });
}

const handlers = {
  LaunchRequest() {
    this.emit(':ask', welcomeMessage, welcomeMessage);
  },
  GetRandomQuote() {
    getRandomQuote((resp) => {
      const quote = resp.value,
            source = resp._embedded.source[0],
            cardMessage = `${quote}\n\nYou can find the source of this rant here: ${source.url}`;

      this.emit(':tellWithCard', quote, 'Quote Source', cardMessage);
    });
  },
  GetRandomMeme() {
    // TODO: This intent has been disabled since the Alexa app displays this image as not found
    const url = 'https://api.tronalddump.io/random/meme',
          imgObj = {
            smallImageUrl : url,
            largeImageUrl : url
          };

    this.emit(':tellWithCard', 'Check the alexa app to see your meme.', 'Tronald Dump', 'Enjoy your meme!', imgObj);
  },
  'AMAZON.HelpIntent' : function () {
    this.emit(':ask', helpMessage, helpMessage);
  },
  'AMAZON.StopIntent' : function () {
    this.shouldEndSession = true;
    this.emit(':tell', stopSkillMessage, stopSkillMessage);
  },
  'AMAZON.CancelIntent' : function () {
    this.shouldEndSession = true;
    this.emit(':tell', stopSkillMessage, stopSkillMessage);
  }
};

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

'use strict';

// import the needed node_modules.
const express = require('express');
const morgan = require('morgan');

let askingJoke = false;
const commonGreetings = ['hi', 'hello', 'howdy'];
const commonGoodbyes = ['bye', 'goodbye', 'see you', 'adios'];
const jokes = ['Why do we tell actors to break a leg?\ Because every play has a cast.',
              "A woman in labour suddenly shouted, Shouldn’t! Wouldn’t! Couldn’t! Didn’t! Can’t\
              Don’t worry, said the doctor. Those are just contractions.",
              "Did you hear about the claustrophobic astronaut?\
              He just needed a little space.",
              "What sits at the bottom of the sea and twitches?\
              A nervous wreck.",
              'How does Moses make tea?\
              He brews.']

express()
  // Below are methods that are included in express(). We chain them for convenience.
  // --------------------------------------------------------------------------------

  // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
  .use(morgan('tiny'))

  // Any requests for static files will go into the public folder
  .use(express.static('public'))

  // Nothing to modify above this line
  // ---------------------------------
  // add new endpoints here 👇
  .get('/cat-message', (req, res) => {
    const message = { author: 'cat', text: 'Meow' };
    const randomTime = Math.floor(Math.random() * 3000);
    setTimeout(() => {
    res.status(200).json({status: 200, message });
  }, randomTime);
  })

  .get('/monkey-message', (req, res) => {
    const messages = [
      'Don’t monkey around with me.',
      'If you pay peanuts, you get monkeys.',
      'I fling 💩 at you!',
      '🙊',
      '🙈',
      '🙉',
    ];

    const randomMessage = Math.floor(Math.random() * messages.length);
    const message = { author: 'monkey', text: messages[randomMessage] };
    
    const randomTime = Math.floor(Math.random() * 3000);
    setTimeout(() => {
      res.status(200).json({ status: 200, message });
    }, randomTime);

  })

  .get("/parrot-message", (req, res) => {

    console.log(req.query);
    const pollyAnswer = req.query.text;
    const message = { author: "parrot", text: pollyAnswer };

    const randomTime = Math.floor(Math.random() * 3000);
    setTimeout(() => {
    res.status(200).json({status: 200, message });
  }, randomTime);
  })

  .get('/bot-message', (req, res) => {
    const messageIncludes = (matches, text) => {
      let words = text.split(' ');
      return matches.some(match => words.includes(match));
    }

    const tellJoke = () => {
      const randomJoke = Math.floor(Math.random() * jokes.length);
      return jokes[randomJoke];
    }

    const getBotMessage = text => {
      const robotPrefix = 'Bzzt'
      let botMsg = '';
      text = text.toLowerCase();

      const isGreeting = messageIncludes(commonGreetings, text);
      const isGoodbye = messageIncludes(commonGoodbyes, text);

      if (askingJoke) {
        if (text.includes('yes') || text === 'y') {
          botMsg = tellJoke();
        }
        if (text.includes('no') || text === 'no') {
          botMsg = `${robotPrefix} Boring!`
        }
        askingJoke = false;
      }
      else if (isGreeting) botMsg = 'Hello!'
      else if (isGoodbye) botMsg = 'Shutting down!'
      else if (text.includes('something funny')) {
        botMsg = 'Do you want to hear a joke?';
        askingJoke = true;
      }
      else botMsg = `${robotPrefix} ${req.query.message}`;

      return botMsg;
    };

    const message = { author: 'bot', text: getBotMessage(req.query.message) };
    const randomTime = Math.floor(Math.random() * 3000);

    setTimeout(() => {
      res.status(200).json({ status: 200, message });
    }, randomTime);
  })

  // add new endpoints here ☝️
  // ---------------------------------
  // Nothing to modify below this line

  // this serves up the homepage
  .get('/', (req, res) => {
    res
      .status(200)
      .json({ status: 200, message: "This is the homepage... it's empty :(" });
  })

  // this is our catch all endpoint. If a user navigates to any endpoint that is not
  // defined above, they get to see our 404 page.
  .get('*', (req, res) => {
    res
      .status(404)
      .json({
        status: 404,
        message: 'This is obviously not the page you are looking for.',
      });
  })

  // Node spins up our server and sets it to listen on port 8000.
  .listen(8000, () => console.log(`Listening on port 8000`));

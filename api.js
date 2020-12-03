var express = require('express');
var router = express.Router();

const crypto = require('crypto');

const secrets = require('./secrets');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// define the home page route
router.get('/', function (req, res) {
  res.send('Birds home page');
});

// Generates a code challenge and code verifier for authentication
router.post('/start-auth', function(req, res) {
  const buf = Buffer.alloc(256);
  const longRandomString = crypto.randomFillSync(buf).toString('hex');
  const chunk = longRandomString.substring(Math.random * longRandomString.length - 129, 128);

  let data = {
    pkceChunk: chunk,
    clientId: secrets.client_id
  };

  res.send(data);
});

// define the about route
router.get('/about', function (req, res) {
  res.send('About birds');
});

module.exports = router;

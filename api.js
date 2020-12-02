var express = require('express');
var router = express.Router();

const crypto = require('crypto');

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
router.get('/pkce', function(req, res) {
  const buf = Buffer.alloc(256);
  const longRandomString = crypto.randomFillSync(buf).toString('hex');
  const chunk = longRandomString.substring(Math.random * longRandomString.length - 129, 128);

  res.send(chunk);
});

// define the about route
router.get('/about', function (req, res) {
  res.send('About birds');
});

module.exports = router;

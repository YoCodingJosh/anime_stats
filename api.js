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
  const buf = Buffer.alloc(64);
  const longRandomString = crypto.randomFillSync(buf).toString('hex');

  let data = {
    pkce: longRandomString,
    clientId: secrets.client_id
  };

  res.send(data);
});

// This really should be a POST, but oh well. C'mon MAL.
router.get("/redirect", function(req, res) {
  console.log(req);

  // If we get an error, display it to the user.
  if (req.query.error !== undefined && req.query.error !== null) {
    let errorData = {
      message: "",
      title: "",
      httpCode: -1
    };

    if (req.query.error === "access_denied") {
      errorData.title = "Access Denied";
      errorData.httpCode = 403;
    } else {
      // If we don't know, we just infer it from the response and call it 500.
      errorData.title = req.query.error;
      errorData.httpCode = 500;
    }

    errorData.message = req.query.message;

    // Interpolate the hint into the error message.
    if (req.query.hint !== undefined && req.query.hint !== null) {
      errorData.message = `${errorData.message} Hint: ${req.query.hint}`;
    }

    res.status(errorData.httpCode);

    res.render("auth_error.ejs", {errorData});
  }

  res.render("auth_complete.ejs", {code: req.query.code});
});

// define the about route
router.get('/about', function (req, res) {
  res.send('About birds');
});

module.exports = router;

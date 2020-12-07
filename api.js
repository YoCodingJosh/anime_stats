var express = require('express');
var router = express.Router();

const crypto = require('crypto');

const secrets = require('./secrets');

const {dictionary} = require('./data.json');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

function buildPKCE() {
  const buf = Buffer.alloc(64);

  return crypto.randomFillSync(buf).toString('hex');
}

function buildState() {
  let word = dictionary[Math.floor(Math.random() * dictionary.length)];

  let randomDigit = function() {
    return Math.floor(Math.random() * 10);
  };

  let randomLetter = function() {
    let dict = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmopqrstuvwxyz";

    return dict.charAt(Math.floor(Math.random() * dict.length));
  }

  let randomLetterOrDigit = function() {
    let dict = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmopqrstuvwxyz0123456789";

    return dict.charAt(Math.floor(Math.random() * dict.length));
  }

  return `${word}-${randomDigit()}${randomDigit()}${randomDigit()}${randomLetter()}${randomDigit()}${randomLetter()}${randomLetterOrDigit()}`;
}

// Generates a code challenge and code verifier for authentication
router.post('/start-auth', function(req, res) {
  let data = {
    pkce: buildPKCE(),
    clientId: secrets.client_id,
    state: buildState()
  };

  req.session.pkce = data.pkce;
  req.session.state = data.state;

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
    errorData.state = req.query.state;

    // Interpolate the hint into the error message.
    if (req.query.hint !== undefined && req.query.hint !== null) {
      errorData.message = `${errorData.message} Hint: ${req.query.hint}`;
    }

    req.session.errorData = errorData;

    res.redirect("/auth-error");

    return;
  }

  // If we don't get a code, then we reject the request and say 400.
  if (req.query.code === undefined || req.query.code === null) {
    let errorData = {
      message: "The request from MyAnimeList was invalid, please retry authorization.",
      title: "Bad Request",
      httpCode: 400,
      state: req.query.state
    };

    req.session.errorData = errorData;

    res.redirect("/auth-error");

    return;
  }

  req.session.code = req.query.code;

  res.redirect("/main");

  return;
});

module.exports = router;

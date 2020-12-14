var express = require('express');
var router = express.Router();

const crypto = require('crypto');

const secrets = require('./secrets');

const { dictionary } = require('./data.json');

const axios = require('axios').default;
const qs = require('qs');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

function buildPKCE() {
  const buf = Buffer.alloc(64);

  return crypto.randomFillSync(buf).toString('hex');
}

function buildState() {
  let word = dictionary[Math.floor(Math.random() * dictionary.length)];

  let randomDigit = function () {
    return Math.floor(Math.random() * 10);
  };

  let randomLetter = function () {
    let dict = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmopqrstuvwxyz";

    return dict.charAt(Math.floor(Math.random() * dict.length));
  }

  let randomLetterOrDigit = function () {
    let dict = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmopqrstuvwxyz0123456789";

    return dict.charAt(Math.floor(Math.random() * dict.length));
  }

  let randomSpecialCharacter = function() {
    let dict = "&$!#?.+%=";

    return dict.charAt(Math.floor(Math.random() * dict.length));
  }

  let randomCharacter = function() {
    let dict = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmopqrstuvwxyz0123456789&$!#?.+%=";

    return dict.charAt(Math.floor(Math.random() * dict.length));
  }

  // # of possible states = 3.5780442048E15
  // thats about 3.5 quadrillion
  // there's only 7.8 billion people on earth. :)
  return `${word}-${randomDigit()}${randomDigit()}${randomDigit()}${randomLetter()}${randomDigit()}${randomLetter()}${randomLetterOrDigit()}${randomDigit()}${randomCharacter()}${randomSpecialCharacter()}`;
}

// Generates a code challenge and code verifier for authentication
router.post('/start-auth', function (req, res) {
  // If we already auth with MAL, then we may still have a valid session.
  // if we have a valid session, then "we good".
  let weGood = req.body.session !== '' && req.body.state !== '';

  // So far, we good. But we have to verify that the session hasn't expired and the state is valid.
  if (weGood) {
    weGood = req.body.session === req.sessionID && req.session.state === req.session.state;

    if (weGood) {
      // So we validated the session, so now let's see if this session has a valid authorization.
      weGood = req.session.tokenData !== undefined && req.session.tokenData.expirationDate > Date.now();
    }
  }

  let data = {
    pkce: buildPKCE(),
    clientId: secrets.client_id,
    state: buildState(),
    sessionId: req.sessionID,
    weGood
  };

  req.session.pkce = data.pkce;
  req.session.state = data.state;

  res.send(data);
});

router.get("/redirect", function (req, res) {
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

    res.redirect(303, "/auth-error");

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

    res.redirect(303, "/auth-error");

    return;
  }

  // Turn auth code into tokens
  let tokenUrl = "https://myanimelist.net/v1/oauth2/token";

  axios({
    method: "POST",
    url: tokenUrl,
    data: qs.stringify({
      client_id: secrets.client_id,
      client_secret: secrets.client_secret,
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: `${secrets.application_url}/api/redirect`,
      code_verifier: req.session.pkce,
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }).then(function (response) {
    req.session.tokenData = response.data;

    req.session.tokenData.expirationDate = Date.now() + req.session.tokenData.expires_in;

    res.redirect(302, "/main");

    return;
  });
});

module.exports = router;

const express = require("express");
const path = require("path");
const app = express();

var api = require('./api');

const bodyParser = require('body-parser');

const sqlite3 = require('sqlite3');
const session = require('express-session');
const sqliteFactory = require('express-session-sqlite');

// Elastic Beanstalk assumes that Node.js apps run on port 3000.
const APP_PORT = 3000;

// Parse URL-Encoded and JSON POST bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Install EJS as the view engine.
app.set("view engine", "ejs");

// Serve the static content 
app.use("/static", express.static(path.join(__dirname, "static")));

// Set up the session store to use SQLite3 in-memory database.
// Reasons why we use sqlite in-memory is:
//  * We don't really use the session that much,
//  * and I'm too cheap for a proper database.
const SqliteStore = sqliteFactory.default(session);
var sess = {
  secret: 'Watashi wa ookina oppai ga sukidesu.',
  resave: true,
  saveUninitialized: true,
  cookie: {},
  store: new SqliteStore({
    // Database library to use. Any library is fine as long as the API is compatible
    // with sqlite3, such as sqlite3-offline
    driver: sqlite3.Database,
    // for in-memory database
    // path: ':memory:'
    path: ':memory:',
    // Session TTL in milliseconds
    ttl: 60 * 60 * 1000, // 1 hour, so we don't have to keep reauth and fill up the session store.
    // (optional) Session id prefix. Default is no prefix.
    prefix: 'muda:',
    // (optional) Adjusts the cleanup timer in milliseconds for deleting expired session rows.
    // Default is 5 minutes.
    cleanupInterval: 900000, // 900000 ms = 15 minutes
  }),
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess));

// Index route
app.get('/', (req, res) => {
  res.render('index');
});

// Main app page
app.get('/main', (req, res) => {
  if (req.session.tokenData === undefined) {
    req.session.errorData = {
      title: "Unauthorized",
      httpCode: 401,
      message: "You need to login before performing this action.",
      state: req.session.state === undefined ? "NULL": req.session.state
    };

    res.redirect(303, "/auth-error");

    return;
  }

  res.render('main.ejs');
});

// API router
app.use('/api', api);

// Authorization error destination (redirect from /api/redirect)
app.get('/auth-error', (req, res) => {
  if (req.session.errorData === undefined) {
    req.session.errorData = {
      title: "Bad Request",
      httpCode: 400,
      message: "The request was malformed.",
      state: "NULL"
    }
  }

  var errorData = req.session.errorData;

  // Destroy the session, and then render the error page.
  req.session.destroy(function () {
    res.status(errorData.httpCode);

    res.render("auth_error.ejs", {errorData: errorData});
  })
});

// Let 'er rip!
app.listen(APP_PORT, () => {
  console.log("CodingJosh's Anime Stats for MyAnimeList - (C) 2020-2021 CodingJosh")
  console.log(`Running in ${process.env.NODE_ENV} mode`);
  console.log(`Server started on port ${APP_PORT}`);
});

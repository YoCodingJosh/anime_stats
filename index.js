const express = require("express");
const path = require("path");
const app = express();

var api = require('./api');

// Elastic Beanstalk assumes that Node.js apps run on port 3000.
const APP_PORT = 3000;

// Install EJS as the view engine.
app.set("view engine", "ejs");

// Serve the static content 
app.use("/static", express.static(path.join(__dirname, "static")));

// Index route
app.get('/', (req, res) => {
  res.render('index');
});

// API router
app.use('/api', api)

app.listen(APP_PORT, () => {
  console.log(`Server started on port ${APP_PORT}`);
});

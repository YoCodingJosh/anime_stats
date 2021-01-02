// Don't check your real secrets.js file into version control!

let client_id = 'CLIENT ID GOES HERE!';
let client_secret = 'CLIENT SECRET GOES HERE!';
let development_url = 'http://localhost:3000';
let production_url = 'PRODUCTION URL GOES HERE';
let application_environment = "DEV, STAGING, or PROD";
const resolved_url = process.env.NODE_ENV !== 'production' ? development_url : production_url;

// you can also set environment variables
// MAL_CLIENT_ID = client_id
// MAL_CLIENT_SECRET = client_secret
// APP_URL = production_url or development_url depending on where you're running it
// APP_ENV = application_environment

module.exports = {
  client_id,
  client_secret,
  application_environment,
  application_url: resolved_url
};

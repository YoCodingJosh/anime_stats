// Don't check your real secrets.js file into version control!

let client_id = 'CLIENT ID GOES HERE!';
let client_secret = 'CLIENT SECRET GOES HERE!';
let development_url = 'http://localhost:3000';
let production_url = 'PRODUCTION URL GOES HERE';
const resolved_url = process.env.NODE_ENV !== 'production' ? development_url : production_url;

module.exports = {
  client_id,
  client_secret,
  application_url: resolved_url
};

function getAuthUrl() {
  var challenge = window.localStorage.getItem("pkce");
  var clientId = window.localStorage.getItem("clientId");
  var redirect = `${window.location.protocol}//${window.location.host}/api/redirect`;

  // TODO: Implement state to prevent CSRF lmao

  return `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${clientId}&code_challenge=${challenge}&code_challenge_method=plain&redirect_uri=${redirect}`;
}

function startAuth() {
  $.ajax("/api/start-auth", {
    method: "POST"
  }).done(function(data) {
    window.localStorage.setItem("pkce", data.pkceChunk);
    window.localStorage.setItem("clientId", data.clientId);

    let malAuthUrl = getAuthUrl();
    window.location.href = malAuthUrl;
  });
}

$("#loginButton").click(function() {
  startAuth();
});

function getAuthUrl(pkce, clientId) {
  var challenge = pkce;
  var clientId = clientId;
  var state = window.localStorage.getItem("state");
  var redirect = `${window.location.protocol}//${window.location.host}/api/redirect`;

  return `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${clientId}&code_challenge=${challenge}&code_challenge_method=plain&redirect_uri=${redirect}&state=${state}`;
}

function startAuth() {
  $("#loginButton").text("Loading...");
  $("#loginButton").prop("disabled", true);

  $.ajax("/api/start-auth", {
    method: "POST"
  }).done(function(data) {
    window.localStorage.setItem("state", data.state);

    let malAuthUrl = getAuthUrl(data.pkce, data.clientId);
    window.location.href = malAuthUrl;
  });
}

$("#loginButton").click(function() {
  startAuth();
});

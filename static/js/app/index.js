// Internet Explorer detection script since we use ES6 stuff.
if (window.document.documentMode) {
  $("#ieDetectionText").text("Warning! This application may not work correctly with Internet Explorer. Consider switching to a modern browser like Google Chrome or Mozilla Firefox.");
}

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

  // Just in case the API messes up or MAL is down (most likely the latter lmao)
  setTimeout(function () {
    $("#errorText").text("Looks like this is taking longer than expected. Please try refreshing the page!");
    $("#errorText").append("<br/>");
  }, 5000);

  $.ajax("/api/start-auth", {
    method: "POST",
    xhrFields: {
      withCredentials: true
    },
    data: {
      session: window.localStorage.getItem("session"),
      state: window.localStorage.getItem("state")
    }
  }).done(function (data) {
    if (!data.weGood) {
      window.localStorage.setItem("state", data.state);
      window.localStorage.setItem("session", data.sessionId);

      var malAuthUrl = getAuthUrl(data.pkce, data.clientId);
      window.location.href = malAuthUrl;
    } else {
      // Since we have an existing session that's valid, just go to the app.
      window.location.href = "/main";
    }
  });
}

$("#loginButton").click(function () {
  startAuth();
});

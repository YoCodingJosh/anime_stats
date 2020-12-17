async function fetchBasicInfo() {
  var data = await $.ajax("/api/basic-info", {
    method: "POST",
    data: {
      session: window.localStorage.getItem("session"),
      state: window.localStorage.getItem("state")
    }
  });

  // Set the values for the user's info.
  $("#welcomeText").text(`Welcome ${data.name}!`);
  $("#avatarImage").prop("src", data.picture);
  $("#userPanel").css("display", "block");

  // Change the text to something a bit more meaningful.
  // TODO: Make this randomly change while processing.
  $("#loadingText").text("Crunching the numbers...");
}

async function startProcessing() {
  await $.ajax("/api/get-stats", {
    method: "POST",
    data: {
      session: window.localStorage.getItem("session"),
      state: window.localStorage.getItem("state")
    }
  });
}

async function main() {
  sleep(fetchBasicInfo, 750);
  sleep(startProcessing, 1000);
}

$(document).ready(function () {
  main();
});

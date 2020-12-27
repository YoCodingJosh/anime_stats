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
}

async function startProcessing() {
  // Set the initial text.
  $("#loadingText").text(getRandomLoadingText());

  // Randomly set it to a random string.
  let textUpdateInterval = setInterval(function() {
    // Only do it sometimes.
    if (Math.floor(Math.random() * 100) % 2 === 0) {
      $("#loadingText").text(getRandomLoadingText());
    }
  }, 600);

  var data = await $.ajax("/api/get-stats", {
    method: "POST",
    data: {
      session: window.localStorage.getItem("session"),
      state: window.localStorage.getItem("state")
    }
  });

  console.log(data);

  // Once we have the data, we can start doing some client side calculations and rendering.
}

async function main() {
  sleep(startProcessing, 750);
}

$(document).ready(function () {
  // Set random anime gif for loading
  $("#loadingImage").prop("src", getRandomLoadingGif());

  // Prefetch the user's name and profile picture
  fetchBasicInfo();

  // Delay the main function call just a bit
  setTimeout(function() {
    main();
  }, 500);
});

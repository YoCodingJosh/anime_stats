// this is where all the magic happens

const axios = require('axios').default;

async function start(tokenData) {
  // Get the watchlist info.
  // We have to break it up into watching and completed.

  let watching = [];
  let completed = [];

  var watchingList = await axios({
    method: "GET",
    url: "https://api.myanimelist.net/v2/users/@me/animelist?status=watching&limit=1000",
    headers: {
      "Authorization": `Bearer ${tokenData.access_token}`
    }
  });

  watching.push(...watchingList.data.data);

  while (watchingList.data.paging.next !== undefined) {
    watchingList = await axios({
      method: "GET",
      url: watchingList.data.paging.next,
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`
      }
    });

    watching.push(...watchingList.data.data);
  }

  var completedList = await axios({
    method: "GET",
    url: "https://api.myanimelist.net/v2/users/@me/animelist?status=watching&limit=1000",
    headers: {
      "Authorization": `Bearer ${tokenData.access_token}`
    }
  });

  watching.push(...completedList.data.data);

  while (completedList.data.paging.next !== undefined) {
    completedList = await axios({
      method: "GET",
      url: completedList.data.paging.next,
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`
      }
    });

    watching.push(...completedList.data.data);
  }

  return {
    watching,
    completed
  };
}

module.exports = {
  startProcessing: start
};
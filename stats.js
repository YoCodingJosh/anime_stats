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
    url: "https://api.myanimelist.net/v2/users/@me/animelist?status=completed&limit=1000",
    headers: {
      "Authorization": `Bearer ${tokenData.access_token}`
    }
  });

  completed.push(...completedList.data.data);

  while (completedList.data.paging.next !== undefined) {
    completedList = await axios({
      method: "GET",
      url: completedList.data.paging.next,
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`
      }
    });

    completed.push(...completedList.data.data);
  }

  // Get the detailed anime data

  let watchingDataPromises = [];
  for (let i = 0; i < watching.length; i++) {
    watchingDataPromises.push(axios({
      method: "GET",
      url: `https://api.myanimelist.net/v2/anime/${watching[i].node.id}?fields=id,title,main_picture,start_date,end_date,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,source,average_episode_duration,rating,pictures,related_anime,studios,statistics`,
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`
      }
    }));
  }

  let watchingData = await Promise.all(watchingDataPromises);

  for (let i = 0; i < watching.length; i++) {
    watching[i].node.data = watchingData[i].data;
  }

  let completedDataPromises = [];
  for (let i = 0; i < completed.length; i++) {
    completedDataPromises.push(axios({
      method: "GET",
      url: `https://api.myanimelist.net/v2/anime/${completed[i].node.id}?fields=id,title,main_picture,start_date,end_date,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,source,average_episode_duration,rating,pictures,related_anime,studios,statistics`,
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`
      }
    }));
  }

  let completedData = await Promise.all(completedDataPromises);

  for (let i = 0; i < completed.length; i++) {
    completed[i].node.data = completedData[i].data;
  }

  return {
    watching,
    completed
  };
}

function calculateAverageScores(data) {
  let averages = {};

  // Calculate completed average score.
  let eligibleCompletedCount = 0;
  let eligibleCompletedSum = 0;
  for (let i = 0; i < data.completed.length; i++) {
    let score = data.completed[i].node.data.my_list_status.score;

    // if it's 0, we mark as ineligible because the score interval is [1,10]
    if (score == 0) {
      continue;
    }

    eligibleCompletedCount++;
    eligibleCompletedSum += score;
  }

  averages.completed = eligibleCompletedSum / eligibleCompletedCount;

  // Calculate watching average score.
  let eligibleWatchingCount = 0;
  let eligibleWatchingSum = 0;
  for (let i = 0; i < data.watching.length; i++) {
    let score = data.watching[i].node.data.my_list_status.score;

    // if it's 0, we mark as ineligible because the score interval is [1,10]
    if (score == 0) {
      continue;
    }

    eligibleWatchingCount++;
    eligibleWatchingSum += score;
  }

  averages.watching = eligibleWatchingSum / eligibleWatchingCount;

  // Does not include on hold / dropped
  averages.combined = (eligibleWatchingSum + eligibleCompletedSum) / (eligibleWatchingCount + eligibleCompletedCount);
  
  return averages;
}

function animeTypeCounts(data) {
  let types = {
    completed: {
      tv: 0,
      tv_episodes: 0,
      ova: 0,
      ova_episodes: 0,
      movies: 0,
      ona: 0,
      ona_episodes: 0,
      special: 0,
      special_episodes: 0
    },
    watching: {
      tv: 0,
      tv_episodes_watched: 0,
      tv_episodes_total: 0,
      ova: 0,
      ova_episodes_watched: 0,
      ova_episodes_total: 0,
      movies: 0,
      ona: 0,
      ona_episodes_watched: 0,
      ona_episodes_total: 0,
      special: 0,
      special_episodes_watched: 0,
      special_episodes_total: 0
    },
  };

  for (let i = 0; i < data.completed.length; i++) {
    let anime = data.completed[i].node.data;

    switch (anime.media_type) {
      case "movie":
        // Since movies are only 1 "episode", we just increment movies.
        types.completed.movies++;
        break;
      case "ova":
        types.completed.ova++;
        types.completed.ova_episodes += anime.num_episodes;
        break;
      case "tv":
        types.completed.tv++;
        types.completed.tv_episodes += anime.num_episodes;
        break;
      case "special":
        types.completed.special++;
        types.completed.special_episodes += anime.num_episodes;
        break;
      case "ona":
        types.completed.ona++;
        types.completed.ona_episodes += anime.num_episodes;
        break;
    }
  }

  for (let i = 0; i < data.watching.length; i++) {
    let anime = data.watching[i].node.data;

    switch (anime.media_type) {
      case "movie":
        // Since movies are only 1 "episode", we just increment movies.
        types.watching.movies++;
        break;
      case "ova":
        types.watching.ova++;
        types.watching.ova_episodes_watched += anime.my_list_status.num_episodes_watched;
        types.watching.ova_episodes_total += anime.num_episodes;
        break;
      case "tv":
        types.watching.tv++;
        types.watching.tv_episodes_watched += anime.my_list_status.num_episodes_watched;
        types.watching.tv_episodes_total += anime.num_episodes;
        break;
      case "special":
        types.watching.special++;
        types.watching.special_episodes_watched += anime.my_list_status.num_episodes_watched;
        types.watching.special_episodes_total += anime.num_episodes;
        break;
      case "ona":
        types.watching.ona++;
        types.watching.ona_episodes_watched += anime.my_list_status.num_episodes_watched;
        types.watching.ona_episodes_total += anime.num_episodes;
        break;
    }
  }

  return types;
}

function mostWatchedStudios(data) {
  // Since there's no difference between watched and completed, we merge them to make my life easier. :)
  let mergedData = data.completed.concat(data.watching);

  let studios = [];

  for (let i = 0; i < mergedData.length; i++) {
    let anime = mergedData[i].node.data;

    // There can be more than one studio per anime, ie: Franxx has A-1, Trigger, and Cloverworks
    for (let j = 0; j < anime.studios.length; j++) {
      let studio = anime.studios[j];

      // The reason I do it this way, is so I don't have to do a O(N) lookup every insert
      if (studios[studio.id] == undefined) {
        studios[studio.id] = {};
        studios[studio.id].name = studio.name;
        studios[studio.id].count = 1;
        studios[studio.id].id = studio.id; // so we can still do stuff client side
      }
      else {
        studios[studio.id].count++;
      } 
    }
  }

  studios.sort((a, b) => (a.count > b.count) ? -1 : 1);

  var filtered = studios.filter(function (el) {
    return el != null;
  });

  return filtered;
}

function calculateTimeWatched(data) {
  let totalWatchTime = 0;

  let mergedData = data.completed.concat(data.watching);

  for (let i = 0; i < mergedData.length; i++) {
    let anime = mergedData[i].node.data;

    totalWatchTime += anime.my_list_status.num_episodes_watched * anime.average_episode_duration;

    switch (anime.media_type) {
      case "movie":
        break;
      case "ova":
        break;
      case "tv":
        break;
      case "special":
        break;
      case "ona":
        break;
    }
  }

  return {
    totalWatchTime,
  };
}

module.exports = {
  // Fetches all of the relevant data.
  startProcessing: start,
  
  // Calculates the average scores for completed, watching, and combined.
  calculateAverageScores,

  // The number of TV anime, OVA, specials, movies, etc. and the number of episodes of each.
  animeTypeCounts,

  // Most watched studios (ie: A-1 Pictures, KyoAni, J.C. Staff, Sunrise, etc)
  mostWatchedStudios,

  // Calculates average episode length, movie length, and total anime watch time.
  calculateTimeWatched,
};

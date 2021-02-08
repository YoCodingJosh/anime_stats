// this is where all the magic happens

// TODO: Split into a ./stats/ route and break apart into different modules.

const axios = require('axios').default;

async function start(tokenData) {
  // Get the watchlist info.
  // We have to break it up into watching and completed.

  let watching = [];
  let completed = [];

  // We won't do much with these besides count the watched episodes.
  let on_hold = [];
  let dropped = [];

  // Just for completeness
  let plan_to_watch = [];

  var watchingList = await axios({
    method: "GET",
    url: "https://api.myanimelist.net/v2/users/@me/animelist?status=watching&limit=1000&nsfw=1",
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
    url: "https://api.myanimelist.net/v2/users/@me/animelist?status=completed&limit=1000&nsfw=1",
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

  var onHoldList = await axios({
    method: "GET",
    url: "https://api.myanimelist.net/v2/users/@me/animelist?status=on_hold&limit=1000&nsfw=1",
    headers: {
      "Authorization": `Bearer ${tokenData.access_token}`
    }
  });

  on_hold.push(...onHoldList.data.data);

  while (onHoldList.data.paging.next !== undefined) {
    onHoldList = await axios({
      method: "GET",
      url: onHoldList.data.paging.next,
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`
      }
    });

    on_hold.push(...onHoldList.data.data);
  }

  var droppedList = await axios({
    method: "GET",
    url: "https://api.myanimelist.net/v2/users/@me/animelist?status=dropped&limit=1000&nsfw=1",
    headers: {
      "Authorization": `Bearer ${tokenData.access_token}`
    }
  });

  dropped.push(...droppedList.data.data);

  while (droppedList.data.paging.next !== undefined) {
    droppedList = await axios({
      method: "GET",
      url: droppedList.data.paging.next,
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`
      }
    });

    dropped.push(...droppedList.data.data);
  }

  var planList = await axios({
    method: "GET",
    url: "https://api.myanimelist.net/v2/users/@me/animelist?status=plan_to_watch&limit=1000&nsfw=1",
    headers: {
      "Authorization": `Bearer ${tokenData.access_token}`
    }
  });

  plan_to_watch.push(...planList.data.data);

  while (planList.data.paging.next !== undefined) {
    planList = await axios({
      method: "GET",
      url: planList.data.paging.next,
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`
      }
    });

    plan_to_watch.push(...planList.data.data);
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

  let onHoldDataPromises = [];
  for (let i = 0; i < on_hold.length; i++) {
    onHoldDataPromises.push(axios({
      method: "GET",
      url: `https://api.myanimelist.net/v2/anime/${on_hold[i].node.id}?fields=id,title,main_picture,start_date,end_date,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,source,average_episode_duration,rating,pictures,related_anime,studios,statistics`,
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`
      }
    }));
  }

  let onHoldData = await Promise.all(onHoldDataPromises);

  for (let i = 0; i < on_hold.length; i++) {
    on_hold[i].node.data = onHoldData[i].data;
  }

  let droppedDataPromises = [];
  for (let i = 0; i < dropped.length; i++) {
    droppedDataPromises.push(axios({
      method: "GET",
      url: `https://api.myanimelist.net/v2/anime/${dropped[i].node.id}?fields=id,title,main_picture,start_date,end_date,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,source,average_episode_duration,rating,pictures,related_anime,studios,statistics`,
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`
      }
    }));
  }

  let droppedData = await Promise.all(droppedDataPromises);

  for (let i = 0; i < dropped.length; i++) {
    dropped[i].node.data = droppedData[i].data;
  }

  let planDataPromises = [];
  for (let i = 0; i < plan_to_watch.length; i++) {
    planDataPromises.push(axios({
      method: "GET",
      url: `https://api.myanimelist.net/v2/anime/${plan_to_watch[i].node.id}?fields=id,title,main_picture,start_date,end_date,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,source,average_episode_duration,rating,pictures,related_anime,studios,statistics`,
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`
      }
    }));
  }

  let planData = await Promise.all(planDataPromises);

  for (let i = 0; i < plan_to_watch.length; i++) {
    plan_to_watch[i].node.data = planData[i].data;
  }

  return {
    watching,
    completed,
    on_hold,
    dropped,
    plan_to_watch
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

  // Calculate on hold average score.
  let eligibleOnHoldCount = 0;
  let eligibleOnHoldSum = 0;
  for (let i = 0; i < data.on_hold.length; i++) {
    let score = data.on_hold[i].node.data.my_list_status.score;

    // if it's 0, we mark as ineligible because the score interval is [1,10]
    if (score == 0) {
      continue;
    }

    eligibleOnHoldCount++;
    eligibleOnHoldSum += score;
  }

  averages.on_hold = eligibleOnHoldSum / eligibleOnHoldCount;


  // Calculate dropped average score.
  let eligibleDroppedCount = 0;
  let eligibleDroppedSum = 0;
  for (let i = 0; i < data.dropped.length; i++) {
    let score = data.dropped[i].node.data.my_list_status.score;

    // if it's 0, we mark as ineligible because the score interval is [1,10]
    if (score == 0) {
      continue;
    }

    eligibleDroppedCount++;
    eligibleDroppedSum += score;
  }

  averages.dropped = eligibleDroppedSum / eligibleDroppedCount;

  averages.combined = (eligibleWatchingSum + eligibleCompletedSum + eligibleOnHoldSum + eligibleDroppedSum) / (eligibleWatchingCount + eligibleCompletedCount + eligibleOnHoldCount + eligibleDroppedCount);

  return averages;
}

function animeTypeCounts(data) {
  let types = {
    total_watched: 0,
    completed: {
      tv: 0,
      tv_episodes: 0,
      ova: 0,
      ova_episodes: 0,
      movies: 0,
      movie_episodes: 0,
      ona: 0,
      ona_episodes: 0,
      special: 0,
      special_episodes: 0,
      music: 0,
      music_episodes: 0,
    },
    watching: {
      tv: 0,
      tv_episodes_watched: 0,
      tv_episodes_total: 0,
      ova: 0,
      ova_episodes_watched: 0,
      ova_episodes_total: 0,
      movies: 0,
      movie_episodes_total: 0,
      movies_watched: 0,
      ona: 0,
      ona_episodes_watched: 0,
      ona_episodes_total: 0,
      special: 0,
      special_episodes_watched: 0,
      special_episodes_total: 0,
      music: 0,
      music_episodes_watched: 0,
      music_episodes_total: 0,
    },
    on_hold: {
      tv: 0,
      tv_episodes_watched: 0,
      tv_episodes_total: 0,
      ova: 0,
      ova_episodes_watched: 0,
      ova_episodes_total: 0,
      movies: 0,
      movie_episodes_total: 0,
      movies_watched: 0,
      ona: 0,
      ona_episodes_watched: 0,
      ona_episodes_total: 0,
      special: 0,
      special_episodes_watched: 0,
      special_episodes_total: 0,
      music: 0,
      music_episodes_watched: 0,
      music_episodes_total: 0,
    },
    dropped: {
      tv: 0,
      tv_episodes_watched: 0,
      tv_episodes_total: 0,
      ova: 0,
      ova_episodes_watched: 0,
      ova_episodes_total: 0,
      movies: 0,
      movie_episodes_total: 0,
      movies_watched: 0,
      ona: 0,
      ona_episodes_watched: 0,
      ona_episodes_total: 0,
      special: 0,
      special_episodes_watched: 0,
      special_episodes_total: 0,
      music: 0,
      music_episodes_watched: 0,
      music_episodes_total: 0,
    },
    plan_to_watch: {
      tv: 0,
      ova: 0,
      movies: 0,
      ona: 0,
      special: 0,
      music: 0,
    }
  };

  for (let i = 0; i < data.completed.length; i++) {
    let anime = data.completed[i].node.data;

    switch (anime.media_type) {
      case "movie":
        // You would think that movies would be 1 episode...
        // but Zoku Owarimonogatari is listed as a movie with 6 episodes.
        types.completed.movies++;
        types.completed.movie_episodes += anime.num_episodes;
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
      case "music":
        types.completed.music++;
        types.completed.music_episodes += anime.num_episodes;
        break;
    }
  }

  for (let i = 0; i < data.watching.length; i++) {
    let anime = data.watching[i].node.data;

    switch (anime.media_type) {
      case "movie":
        types.watching.movies++;
        types.watching.movies_watched += anime.my_list_status.num_episodes_watched;
        types.watching.movie_episodes_total += anime.num_episodes;
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
      case "music":
        types.watching.music++;
        types.watching.music_episodes_watched += anime.my_list_status.num_episodes_watched;
        types.watching.music_episodes_total += anime.num_episodes;
        break;
    }
  }

  for (let i = 0; i < data.on_hold.length; i++) {
    let anime = data.on_hold[i].node.data;

    switch (anime.media_type) {
      case "movie":
        types.on_hold.movies++;
        types.on_hold.movies_watched += anime.my_list_status.num_episodes_watched;
        types.on_hold.movie_episodes_total += anime.num_episodes;
        break;
      case "ova":
        types.on_hold.ova++;
        types.on_hold.ova_episodes_watched += anime.my_list_status.num_episodes_watched;
        types.on_hold.ova_episodes_total += anime.num_episodes;
        break;
      case "tv":
        types.on_hold.tv++;
        types.on_hold.tv_episodes_watched += anime.my_list_status.num_episodes_watched;
        types.on_hold.tv_episodes_total += anime.num_episodes;
        break;
      case "special":
        types.on_hold.special++;
        types.on_hold.special_episodes_watched += anime.my_list_status.num_episodes_watched;
        types.on_hold.special_episodes_total += anime.num_episodes;
        break;
      case "ona":
        types.on_hold.ona++;
        types.on_hold.ona_episodes_watched += anime.my_list_status.num_episodes_watched;
        types.on_hold.ona_episodes_total += anime.num_episodes;
        break;
      case "music":
        types.on_hold.music++;
        types.on_hold.music_episodes_watched += anime.my_list_status.num_episodes_watched;
        types.on_hold.music_episodes_total += anime.num_episodes;
        break;
    }
  }

  for (let i = 0; i < data.dropped.length; i++) {
    let anime = data.dropped[i].node.data;

    switch (anime.media_type) {
      case "movie":
        types.dropped.movies++;
        types.dropped.movies_watched += anime.my_list_status.num_episodes_watched;
        types.dropped.movie_episodes_total += anime.num_episodes;
        break;
      case "ova":
        types.dropped.ova++;
        types.dropped.ova_episodes_watched += anime.my_list_status.num_episodes_watched;
        types.dropped.ova_episodes_total += anime.num_episodes;
        break;
      case "tv":
        types.dropped.tv++;
        types.dropped.tv_episodes_watched += anime.my_list_status.num_episodes_watched;
        types.dropped.tv_episodes_total += anime.num_episodes;
        break;
      case "special":
        types.dropped.special++;
        types.dropped.special_episodes_watched += anime.my_list_status.num_episodes_watched;
        types.dropped.special_episodes_total += anime.num_episodes;
        break;
      case "ona":
        types.dropped.ona++;
        types.dropped.ona_episodes_watched += anime.my_list_status.num_episodes_watched;
        types.dropped.ona_episodes_total += anime.num_episodes;
        break;
      case "music":
        types.dropped.music++;
        types.dropped.music_episodes_watched += anime.my_list_status.num_episodes_watched;
        types.dropped.music_episodes_total += anime.num_episodes;
        break;
    }
  }

  for (let i = 0; i < data.plan_to_watch.length; i++) {
    let anime = data.plan_to_watch[i].node.data;

    switch (anime.media_type) {
      case "movie":
        types.plan_to_watch.movies++;
        break;
      case "ova":
        types.plan_to_watch.ova++;
        break;
      case "tv":
        types.plan_to_watch.tv++;
        break;
      case "special":
        types.plan_to_watch.special++;
        break;
      case "ona":
        types.plan_to_watch.ona++;
        break;
      case "music":
        types.plan_to_watch.music++;
        break;
    }
  }

  // oh lord this is tedious...
  types.total_watched = types.completed.tv_episodes + types.completed.special_episodes + types.completed.ona_episodes + types.completed.ova_episodes
    + types.completed.movie_episodes + types.completed.music_episodes + types.watching.tv_episodes_watched + types.watching.special_episodes_watched
    + types.watching.movies_watched + types.watching.ona_episodes_watched + types.watching.ova_episodes_watched + types.watching.music_episodes_watched
    + types.on_hold.tv_episodes_watched + types.on_hold.special_episodes_watched + types.on_hold.ona_episodes_watched + types.on_hold.ova_episodes_watched
    + types.on_hold.movies_watched + types.on_hold.music_episodes_watched + types.dropped.tv_episodes_watched + types.dropped.special_episodes_watched
    + types.dropped.ona_episodes_watched + types.dropped.ova_episodes_watched + types.dropped.movies_watched + types.on_hold.music_episodes_watched;

  return types;
}

function mostWatchedStudios(data) {
  // Since there's no difference between watched and completed, we merge them to make my life easier. :)
  let mergedData = data.completed.concat(data.watching).concat(data.dropped).concat(data.on_hold);

  let studios = [];

  for (let i = 0; i < mergedData.length; i++) {
    let anime = mergedData[i].node.data;

    let animeWatchedTotal = anime.my_list_status.num_episodes_watched * anime.average_episode_duration;

    // There can be more than one studio per anime, ie: Franxx has A-1, Trigger, and CloverWorks
    for (let j = 0; j < anime.studios.length; j++) {
      let studio = anime.studios[j];

      // The reason I do it this way, is so I don't have to do a O(N) lookup every insert
      if (studios[studio.id] === undefined) {
        studios[studio.id] = {};

        studios[studio.id].scoreCount = 0;
        studios[studio.id].scoreSum = 0;
        studios[studio.id].scoreAverage = 0;

        studios[studio.id].scoreCount += anime.my_list_status.score !== 0 ? 1 : 0;
        studios[studio.id].scoreSum += anime.my_list_status.score !== 0 ? anime.my_list_status.score : 0;
        studios[studio.id].scoreAverage = anime.my_list_status.score; // the first for this studio and in case this is the only anime for studio

        studios[studio.id].name = studio.name;
        studios[studio.id].count = 1;

        studios[studio.id].id = studio.id; // so we can still do stuff client side

        studios[studio.id].watchTime = animeWatchedTotal;
      }
      else {
        studios[studio.id].count++;

        // If it's not scored, we ignore calculating the average studio score.
        if (anime.my_list_status.score !== 0) {
          studios[studio.id].scoreCount++;
          studios[studio.id].scoreSum += anime.my_list_status.score;

          // Calculate the average as we go, so that way we don't have to iterate through the studio list.
          studios[studio.id].scoreAverage = studios[studio.id].scoreSum / studios[studio.id].scoreCount;

          studios[studio.id].watchTime += animeWatchedTotal;
        }
      }
    }
  }

  studios.sort((a, b) => (a.scoreCount > b.scoreCount) ? -1 : 1);

  var filtered = studios.filter(function (el) {
    // We don't want empty filler between studio ids and N/A scores (not scored yet)
    return el !== null && el.scoreAverage !== 0;
  });

  return filtered;
}

function calculateTimeWatched(data, types) {
  let watchTypes = {
    tv: 0,
    average_tv: 0,
    ova: 0,
    average_ova: 0,
    movies: 0,
    average_movie: 0,
    ona: 0,
    average_ona: 0,
    special: 0,
    average_special: 0,
    music: 0,
    average_music: 0,
  };

  let totalWatchTime = 0;

  let mergedData = data.completed.concat(data.watching).concat(data.on_hold).concat(data.dropped);

  for (let i = 0; i < mergedData.length; i++) {
    let anime = mergedData[i].node.data;

    let animeWatchedTotal = anime.my_list_status.num_episodes_watched * anime.average_episode_duration;

    totalWatchTime += animeWatchedTotal;

    switch (anime.media_type) {
      case "movie":
        watchTypes.movies += animeWatchedTotal;
        break;
      case "ova":
        watchTypes.ova += animeWatchedTotal;
        break;
      case "tv":
        watchTypes.tv += animeWatchedTotal;
        break;
      case "special":
        watchTypes.special += animeWatchedTotal;
        break;
      case "ona":
        watchTypes.ona += animeWatchedTotal;
        break;
      case "music":
        watchTypes.music += animeWatchedTotal;
        break;
    }
  }

  // I love tedious shit like this... :|
  watchTypes.average_movie = watchTypes.movies / (types.completed.movies + types.dropped.movies_watched + types.on_hold.movies_watched + types.watching.movies_watched);
  watchTypes.average_ova = watchTypes.ova / (types.completed.ova_episodes + types.dropped.ova_episodes_watched + types.on_hold.ova_episodes_watched + types.watching.ova_episodes_watched);
  watchTypes.average_tv = watchTypes.tv / (types.completed.tv_episodes + types.dropped.tv_episodes_watched + types.on_hold.tv_episodes_watched + types.watching.tv_episodes_watched);
  watchTypes.average_special = watchTypes.special / (types.completed.special_episodes + types.dropped.special_episodes_watched + types.on_hold.special_episodes_watched + types.watching.special_episodes_watched);
  watchTypes.average_ona = watchTypes.ona / (types.completed.ona_episodes + types.dropped.ona_episodes_watched + types.on_hold.ona_episodes_watched + types.watching.ona_episodes_watched);
  watchTypes.average_music = watchTypes.music / (types.completed.music_episodes + types.dropped.music_episodes_watched + types.on_hold.music_episodes_watched + types.watching.music_episodes_watched)

  return {
    totalWatchTime,
    averageDuration: totalWatchTime / types.total_watched,
    watchTypes,
  };
}

function mostObscureAnime(data) {
  let mergedData = data.completed.concat(data.watching).concat(data.on_hold).concat(data.dropped);

  let obscureList = [];

  for (let i = 0; i < mergedData.length; i++) {
    let anime = mergedData[i].node.data;

    obscureList.push({
      id: anime.id,
      num_users: anime.statistics.num_list_users
    });
  }

  obscureList.sort((a, b) => (a.num_users > b.num_users) ? 1 : -1);

  return obscureList;
}

function controversialOpinions(data) {
  // I'm thinking abs(floor(avg_score) - user_score) or abs(ceil(avg_score) - user_score) >= 2 is controversial
  // my way of thinking is every odd grade between good bad masterpiece etc is an "intermediate" step
  // and 2 or more steps is a "big" deviation from the consensus

  let mergedData = data.completed.concat(data.watching).concat(data.on_hold).concat(data.dropped);

  let opinions = [];

  for (let i = 0; i < mergedData.length; i++) {
    let anime = mergedData[i].node.data;

    if (anime.my_list_status.score !== 0) {
      // Since the score is represented as a decimal, it'd be fair to evaluate both floor/ceil.
      var deviationFloor = Math.abs(Math.floor(anime.mean) - anime.my_list_status.score);
      var deviationCeil = Math.abs(Math.ceil(anime.mean) - anime.my_list_status.score);

      if (deviationFloor >= 2 || deviationCeil >= 2) {
        opinions.push({
          id: anime.id,
          deviation: deviationFloor > deviationCeil ? deviationFloor : deviationCeil,
          mean_score: anime.mean,
          user_score: anime.my_list_status.score
        });
      }
    }
  }

  opinions.sort((a, b) => (Math.abs(a.user_score - a.mean_score) > Math.abs(b.user_score - b.mean_score)) ? -1 : 1);

  return opinions;
}

function genreInfo(data) {
  let mergedData = data.completed.concat(data.watching).concat(data.dropped).concat(data.on_hold);

  let genres = [];

  for (let i = 0; i < mergedData.length; i++) {
    let anime = mergedData[i].node.data;

    let animeWatchedTotal = anime.my_list_status.num_episodes_watched * anime.average_episode_duration;

    // There can be more than one genre per anime, ie: Eromanga Sensei has Comedy, Drama, Ecchi, and Romance
    for (let j = 0; j < anime.genres.length; j++) {
      let genre = anime.genres[j];

      // The reason I do it this way, is so I don't have to do a O(N) lookup every insert
      if (genres[genre.id] === undefined) {
        genres[genre.id] = {};

        genres[genre.id].scoreCount = 0;
        genres[genre.id].scoreSum = 0;
        genres[genre.id].scoreAverage = 0;

        genres[genre.id].scoreCount += anime.my_list_status.score !== 0 ? 1 : 0;
        genres[genre.id].scoreSum += anime.my_list_status.score !== 0 ? anime.my_list_status.score : 0;
        genres[genre.id].scoreAverage = anime.my_list_status.score;

        genres[genre.id].name = genre.name;
        genres[genre.id].count = 1;

        genres[genre.id].watch_time = animeWatchedTotal;

        genres[genre.id].id = genre.id; // so we can still do stuff client side
      }
      else {
        genres[genre.id].count++;

        // If it's not scored, we ignore calculating the average studio score.
        if (anime.my_list_status.score !== 0) {
          genres[genre.id].scoreCount++;
          genres[genre.id].scoreSum += anime.my_list_status.score;

          genres[genre.id].watch_time += animeWatchedTotal;

          // Calculate the average as we go, so that way we don't have to iterate through the studio list.
          genres[genre.id].scoreAverage = genres[genre.id].scoreSum / genres[genre.id].scoreCount;
        }
      }
    }
  }

  genres.sort((a, b) => (a.count > b.count) ? -1 : 1);

  var filtered = genres.filter(function (el) {
    return el != null;
  });

  return filtered;
}

module.exports = {
  // Fetches all of the relevant data.
  startProcessing: start,

  // Calculates the average scores for completed, watching, and combined.
  calculateAverageScores,

  // The number of TV anime, OVA, specials, movies, etc. and the number of episodes of each.
  animeTypeCounts,

  // Most watched studios (ie: A-1 Pictures, KyoAni, J.C.Staff, Sunrise, etc) and their average scores
  mostWatchedStudios,

  // Calculates average episode length, movie length, and total anime watch time.
  calculateTimeWatched,

  // Shows the anime with the least number of members on MAL.
  mostObscureAnime,

  // Shows anime with scores that go against the grain
  controversialOpinions,

  // Most watched genres (ie: Action, Drama, Comedy, Slice of Life, etc)
  genreInfo,
};

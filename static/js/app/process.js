// just to keep the code clean

function buildBasicInfo(data) {
  var watching = data.rawData.watching.length;
  var completed = data.rawData.completed.length;
  var dropped = data.rawData.dropped.length;
  var onHold = data.rawData.on_hold.length;
  var planToWatch = data.rawData.plan_to_watch.length;

  $("#amountPerCategory").text(`Watching: ${watching} - Completed: ${completed} - Dropped: ${dropped} - On Hold: ${onHold} - Plan to Watch: ${planToWatch}`)

  var chart = c3.generate({
    bindto: "#basicStats",
    data: {
      type: "donut",
      columns: [
        ["Watching", data.rawData.watching.length],
        ["Completed", data.rawData.completed.length],
        ["Dropped", data.rawData.dropped.length],
        ["On Hold", data.rawData.on_hold.length],
        ["Plan to Watch", data.rawData.plan_to_watch.length]
      ]
    },
    color: {
      pattern: [
        "#2db039",
        "#26448f",
        "#a12f31",
        "#f9d457",
        "#c3c3c3"
      ]
    },
    donut: {
      title: "Anime List Ratio",
    },
  });
}

function buildAnimeWatchTime(data) {
  var watchSeconds = data.stats.watchTimes.totalWatchTime;

  $("#grandTotalText").text(`${watchSeconds}`);

  const YEAR_IN_SECONDS = 31536000;
  const MONTH_IN_SECONDS = 2628000;
  const WEEK_IN_SECONDS = 604800;
  const DAY_IN_SECONDS = 86400;
  const HOUR_IN_SECONDS = 3600
  const HOUR_IN_MINUTES = 60; // really....
  const DAY_IN_HOURS = 24; // smh my head...
  const MINUTE_IN_SECONDS = 60; // do i really need this one? lmao

  var noYears = false;
  var noMonths = false;
  var noWeeks = false;
  var noDays = false;
  var noHours = false;

  // Remove the non-applicable time spans.
  if (watchSeconds < YEAR_IN_SECONDS) {
    $("#yearsSpan").remove();
    noYears = true;
  }

  if (watchSeconds < MONTH_IN_SECONDS) {
    $("#monthsSpan").remove();
    noMonths = true;
  }

  if (watchSeconds < WEEK_IN_SECONDS) {
    $("#weeksSpan").remove();
    noWeeks = true;
  }

  if (watchSeconds < DAY_IN_SECONDS) {
    $("#daysSpan").remove();
    $("#daysCombinedSpan").remove();
    noDays = true;
  }

  if (watchSeconds < HOUR_IN_SECONDS) {
    $("#hoursSpan").remove();
    noHours = true;
  }

  var remainder = watchSeconds;

  var numYears = 0;
  var numMonths = 0;
  var numWeeks = 0;
  var numDays = 0;
  var numHours = 0;
  var numMinutes = 0;

  // TODO: Tabulate

  while (remainder > HOUR_IN_MINUTES) {
    if (!noYears && remainder - YEAR_IN_SECONDS >= MONTH_IN_SECONDS) {
      remainder -= YEAR_IN_SECONDS;
      numYears++;
    } else if (!noMonths && remainder - MONTH_IN_SECONDS >= WEEK_IN_SECONDS) {
      remainder -= MONTH_IN_SECONDS;
      numMonths++;
    } else if (!noWeeks && remainder - WEEK_IN_SECONDS >= DAY_IN_SECONDS) {
      remainder -= WEEK_IN_SECONDS;
      numWeeks++;
    } else if (!noDays && remainder - DAY_IN_SECONDS >= HOUR_IN_SECONDS) {
      remainder -= DAY_IN_SECONDS;
      numDays++;
    } else if (!noHours && remainder - HOUR_IN_SECONDS >= HOUR_IN_MINUTES) {
      remainder -= HOUR_IN_SECONDS;
      numHours++;
    } else {
      break;
    }
  }

  numMinutes = Math.trunc(remainder / MINUTE_IN_SECONDS);
  remainder = remainder % HOUR_IN_MINUTES;

  $("#secondsText").text(`${remainder}`);
  $("#secondsLabel").text(`second${remainder === 1 ? "" : "s"}`);

  $("#minutesText").text(`${numMinutes}`);
  $("#minutesLabel").text(`minute${numMinutes === 1 ? "" : "s"}`);

  if (!noYears) {
    $("#yearsText").text(`${numYears}`);
    $("#yearsLabel").text(`year${numYears === 1 ? "" : "s"}`);
  }

  if (!noMonths) {
    $("#monthsText").text(`${numMonths}`);
    $("#monthsLabel").text(`month${numMonths === 1 ? "" : "s"}`);
  }

  if (!noWeeks) {
    $("#weeksText").text(`${numWeeks}`);
    $("#weeksLabel").text(`week${numWeeks === 1 ? "" : "s"}`);
  }

  if (!noDays) {
    $("#daysText").text(`${numDays}`);
    $("#daysLabel").text(`day${numDays === 1 ? "" : "s"}`);

    $("#daysCombinedText").text(`${(watchSeconds / MINUTE_IN_SECONDS / HOUR_IN_MINUTES / DAY_IN_HOURS).toFixed(3)}`);
    $("#daysCombinedLabel").text(`day${numDays === 1 ? "" : "s"}`);
  }

  if (!noHours) {
    $("#hoursText").text(`${numHours}`);
    $("#hoursLabel").text(`hour${numHours === 1 ? "" : "s"}`);
  }
}

function buildAnimeTypes(data) {
  var watching = data.stats.animeTypes.watching;
  var completed = data.stats.animeTypes.completed;
  var dropped = data.stats.animeTypes.dropped;
  var onHold = data.stats.animeTypes.on_hold;
  var planToWatch = data.stats.animeTypes.plan_to_watch;

  var chart = c3.generate({
    bindto: "#animeTypesChart",
    data: {
      x: 'x',
      columns: [
        ["x", "TV", "OVA", "ONA", "Movie", "Special"],
        ['Watching', watching.tv, watching.ova, watching.ona, watching.movies, watching.special],
        ['Completed', completed.tv, completed.ova, completed.ona, completed.movies, completed.special],
        ['Dropped', dropped.tv, dropped.ova, dropped.ona, dropped.movies, dropped.special],
        ['On Hold', onHold.tv, onHold.ova, onHold.ona, onHold.movies, onHold.special],
        ['Plan to Watch', planToWatch.tv, planToWatch.ova, planToWatch.ona, planToWatch.movies, planToWatch.special],
      ],
      type: 'bar',
      groups: [
        ['Watching', 'Completed', 'Dropped', 'On Hold', 'Plan to Watch']
      ]
    },
    color: {
      pattern: [
        "#2db039",
        "#26448f",
        "#a12f31",
        "#f9d457",
        "#c3c3c3"
      ]
    },
    axis: {
      rotated: true,
      x: {
        type: 'category'
      }
    },
  });
}

function finishProcessing(data) {
  buildBasicInfo(data);
  buildAnimeWatchTime(data);
  buildAnimeTypes(data);
}

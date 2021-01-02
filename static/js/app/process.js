// just to keep the code clean

function buildBasicInfo(data) {
  var total = data.rawData.watching.length + data.rawData.completed.length + data.rawData.dropped.length + data.rawData.on_hold.length + data.rawData.plan_to_watch.length;

  var watchingPercentage = ((data.rawData.watching.length / total) * 100).toFixed(3);
  var completedPercentage = ((data.rawData.completed.length / total) * 100).toFixed(3);
  var droppedPercentage = ((data.rawData.dropped.length / total) * 100).toFixed(3);
  var onHoldPercentage = ((data.rawData.on_hold.length / total) * 100).toFixed(3);
  var planPercentage = ((data.rawData.plan_to_watch.length / total) * 100).toFixed(3);

  $("#amountPerCategory").text(`Watching: ${watchingPercentage}% - Completed: ${completedPercentage}% - Dropped: ${droppedPercentage}% - On Hold: ${onHoldPercentage}% - Plan to Watch: ${planPercentage}%`)
  
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
      title: "Basic Stats",
      label: {
        format: function (value, ratio, id) {
          return d3.format('')(value);
        }
      }
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

  numMinutes = Math.trunc(remainder / HOUR_IN_MINUTES);
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
  }

  if (!noHours) {
    $("#hoursText").text(`${numHours}`);
    $("#hoursLabel").text(`hour${numHours === 1 ? "" : "s"}`);
  }
}

function finishProcessing(data) {
  buildBasicInfo(data);
  buildAnimeWatchTime(data);
}

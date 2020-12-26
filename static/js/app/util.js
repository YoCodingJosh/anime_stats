function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep(fn, time, ...args) {
  await timeout(time);
  return fn(...args);
}

function getRandomErrorGif() {
  var gifs = [
    "https://cdn.codingjosh.com/anime_stats/error/aqua_crying.gif",
    "https://cdn.codingjosh.com/anime_stats/error/chika_worried.gif",
    "https://cdn.codingjosh.com/anime_stats/error/hakase_scared.gif",
    "https://cdn.codingjosh.com/anime_stats/error/hitoribocchi_panic.gif",
    "https://cdn.codingjosh.com/anime_stats/error/kaguya_panicing.gif",
    "https://cdn.codingjosh.com/anime_stats/error/mahiru_punch.gif",
    "https://cdn.codingjosh.com/anime_stats/error/roko_mad.gif",
    "https://cdn.codingjosh.com/anime_stats/error/sagiri_closing_door.gif",
    "https://cdn.codingjosh.com/anime_stats/error/sagiri_phone.gif",
    "https://cdn.codingjosh.com/anime_stats/error/satania_crying.gif",
    "https://cdn.codingjosh.com/anime_stats/error/satania.gif",
    "https://cdn.codingjosh.com/anime_stats/error/shamiko_angry.gif",
    "https://cdn.codingjosh.com/anime_stats/error/shamiko_confused.gif",
    "https://cdn.codingjosh.com/anime_stats/error/suya_mad.gif",
    "https://cdn.codingjosh.com/anime_stats/error/suya_panic.gif",
    "https://cdn.codingjosh.com/anime_stats/error/umaru_cartridge.gif",
  ];

  return gifs[Math.floor(Math.random() * gifs.length)];
}

function getRandomLoadingGif() {
  var gifs = [
    "https://cdn.codingjosh.com/anime_stats/loading/akari_sleepy.gif",
    "https://cdn.codingjosh.com/anime_stats/loading/bell_hestia_teeth_brushing.gif",
    "https://cdn.codingjosh.com/anime_stats/loading/chika_dancing.gif",
    "https://cdn.codingjosh.com/anime_stats/loading/chika_loading.gif",
    "https://cdn.codingjosh.com/anime_stats/loading/hakase_popcorn.gif",
    "https://cdn.codingjosh.com/anime_stats/loading/konosuba.gif",
    "https://cdn.codingjosh.com/anime_stats/loading/nichijou.gif",
    "https://cdn.codingjosh.com/anime_stats/loading/niconiconii.gif",
    "https://cdn.codingjosh.com/anime_stats/loading/rikka_finger_spin.gif",
    "https://cdn.codingjosh.com/anime_stats/loading/sagiri_dancing.gif",
    "https://cdn.codingjosh.com/anime_stats/loading/shamiko_confused_2.gif",
    "https://cdn.codingjosh.com/anime_stats/loading/shamiko_ganbare.gif",
    "https://cdn.codingjosh.com/anime_stats/loading/shamiko_shake.gif",
    "https://cdn.codingjosh.com/anime_stats/loading/tohru.gif",
    "https://cdn.codingjosh.com/anime_stats/loading/tohru_kanna.gif",
    "https://cdn.codingjosh.com/anime_stats/loading/umaru.gif",
  ];

  return gifs[Math.floor(Math.random() * gifs.length)];
}

function getRandomLoadingText() {
  var texts = [
    "Crunching the numbers...",
    "Doing my math homework...",
    "Totally *not* watching anime...",
    "Analyzing NASA's landing speeds...",
    "Loading...",
    "Massaging the data...",
    "Taking a lunch break...",
    "Totally *not* watching hentai...",
    "Processing...",
    "Working on getting the data to you...",
    `Trying to figure out ${Math.floor(Math.random() * 9)}+${Math.floor(Math.random() * 9)}...`,
    "Thinking...",
    "Taking a quick nap...",
    "Running to school with toast in my mouth...",
    "Trying not to get isekai'd by a truck...",
    "Doing the math...",
    "Peeking at my classmate's homework...",
    "This shouldn't take too long...",
    "Loading...",
    "Jamming to anime OP's...",
    "Working...",
    "Doing something...",
    "Working at Wagnaria...",
  ];

  return texts[Math.floor(Math.random() * texts.length)];
}

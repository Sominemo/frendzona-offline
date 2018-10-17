var CACHE_NAME = 'FZ::Offline';
// v9

var cacheUrls = [
  '/frendzona-offline',
  '/frendzona-offline/index.php',
  '/frendzona-offline/style.css',
  '/frendzona-offline/auth.js',
  '/frendzona-offline/common.js',
  '/frendzona-offline/connect.js',
  '/frendzona-offline/debug.js',
  '/frendzona-offline/dialogs.js',
  '/frendzona-offline/engines.js',
  '/frendzona-offline/events.js',
  '/frendzona-offline/friends.js',
  '/frendzona-offline/im.js',
  '/frendzona-offline/language.js',
  '/frendzona-offline/linkThinker.js',
  '/frendzona-offline/frendzona-offline.js',
  '/frendzona-offline/profile.js',
  '/frendzona-offline/report.js',
  '/frendzona-offline/settings.js',
  '/frendzona-offline/ui_elements.js',
  '/frendzona-offline/updater.js',
  '/frendzona-offline/ui.js',
  '/frendzona-offline/ua.json',
  '/frendzona-offline/ru.json',

  '/frendzona-offline/res/fonts/fonts.css',
  '/frendzona-offline/res/images/alert.png',
  '/frendzona-offline/res/images/picture_text.png',
  '/frendzona-offline/res/images/pro_feature.png',
  '/frendzona-offline/res/images/security_problem.png',
  '/frendzona-offline/res/images/update_header.png',
  '/frendzona-offline/res/images/remove_alert.png',
  '/frendzona-offline/res/images/undefined_error.png',
  '/frendzona-offline/res/images/settings_error.png',

  '/frendzona-offline/player/player.js',
  '/frendzona-offline/player/player.css',

  '/frendzona-offline/mobile.css',
  '/frendzona-offline/night.css'
];

self.addEventListener("install", function(event) {
// console.log('WORKER: install event in progress.');
event.waitUntil(
caches
  .open(CACHE_NAME)
  .then(function(cache) {
    return cache.addAll(cacheUrls);
  })
  .then(function() {
    // console.log('WORKER: install completed');
  })
);
self.skipWaiting();
});


self.addEventListener("fetch", function(event) {
// console.log('WORKER: fetch event in progress.');
if (event.request.method !== 'GET') {
// console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
return;
}
event.respondWith(
caches
  .match(event.request)
  .then(function(cached) {
    var networked = fetch(event.request)
      .then(fetchedFromNetwork, unableToResolve)
      .catch(unableToResolve);
    // console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url);
    return cached || networked;

    function fetchedFromNetwork(response) {
      var cacheCopy = response.clone();

      // console.log('WORKER: fetch response from network.', event.request.url);

      caches
        .open(CACHE_NAME)
        .then(function add(cache) {
          cache.put(event.request, cacheCopy);
        })
        .then(function() {
          // console.log('WORKER: fetch response stored in cache.', event.request.url);
        });

      return response;
    }
    function unableToResolve () {

     // console.log('WORKER: fetch request failed in both cache and network.');
      return new Response('<h1>Service Unavailable</h1>', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'text/html'
        })
      });
    }
  })
);
});

/*self.addEventListener('message', function(event){
  if (event.data == 'update') return caches.delete('FZ::Offline');
  // console.log(event, 'I have a message');
});*/

self.addEventListener('message', event => { 
  if (event.data == 'update') {
    caches.delete('FZ::Offline');
    // console.log('[SW] Update message got');
  }
});

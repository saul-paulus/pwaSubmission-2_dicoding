const CACHE_NAME = "PL_PWA";
const urlsToCache = [
  "/",
  "nav.html",
  "index.html",
  "detailsTeam.html",
  "manifest.json",
  "push.js",
  "pages/favTeam.html",
  "pages/home.html",
  "pages/match.html",
  "assets/images/logo/brandPL.png",
  "assets/images/icons/favicon.ico",
  "assets/images/icons/icon-72x72.png",
  "assets/images/icons/icon-96x96.png",
  "assets/images/icons/icon-128x128.png",
  "assets/images/icons/icon-144x144.png",
  "assets/images/icons/icon-152x152.png",
  "assets/images/icons/icon-192x192.png",
  "assets/images/icons/icon-384x384.png",
  "assets/images/icons/icon-512x512.png",
  "assets/css/customizeStyle.css",
  "assets/css/materialize-icon.css",
  "assets/css/materialize.min.css",
  "assets/js/materialize.min.js",
  "assets/js/footballAPI.js",
  "assets/js/register.js",
  "assets/js/db.js",
  "assets/js/cardsHtml.js",
  "assets/js/idb.js",
  "assets/js/details.js",
  "assets/js/index.js",
  "assets/js/swRegister.js",
  "assets/components/nav.js",
];

self.addEventListener("install", (event) => {
  console.log("Servoce worker terinstall....");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  var base_url = "https://api.football-data.org/v2/";

  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch(event.request).then((response) => {
          if (response) {
            console.log(
              "ServiceWorker: Gunakan aset dari cache: ",
              response.url
            );
            cache.put(event.request.url, response.clone());
            return response;
          }
          console.log(
            "ServiceWorker: Memuat aset dari server: ",
            event.request.url
          );
          return fetch(event.request);
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName != CACHE_NAME) {
            console.log("serviceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Kode untuk event push agar service worker dapat menerima push notification.
self.addEventListener("push", (event) => {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }
  var options = {
    body: body,
    icon: "assets/images/icons/icon-128x128.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  event.waitUntil(
    clients.matchAll().then((c) => {
      console.log(c);
      if (c.length === 0) {
        // Show notification
        self.registration.showNotification("Push Notification", options);
      } else {
        // Send a message to the page to update the UI
        console.log("Application is already open!");
      }
    })
  );
});

const CACHE_NAME = "encodify-offline-v3";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./script.js",
  "./assets/css/style.css",
  "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap",
  "https://buttons.github.io/buttons.js"
];

// نصب سرویس‌ورکر و کش کردن فایل‌ها
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// فعال‌سازی و پاک کردن کش‌های قدیمی
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// پاسخ به درخواست‌ها (اول کش، اگر نبود اینترنت)
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
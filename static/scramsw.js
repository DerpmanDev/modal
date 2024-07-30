importScripts(
    "/scramjet/scramjet.codecs.js",
    "/scramjet/scramjet.config.js",
    "/scramjet/scramjet.shared.js",
    "/scramjet/scramjet.worker.js"
);
const scramjet = new ScramjetServiceWorker();
async function handleRequest(event) {
    if (scramjet.route(event)) {
        return scramjet.fetch(event);
    }

    return await fetch(event.request)
}

self.addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event));
});
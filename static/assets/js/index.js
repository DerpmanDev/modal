const form = document.querySelector("form");
const input = document.querySelector("input");
const stockSW = "/sw.js";
const allowedHostnames = ["localhost", "127.0.0.1"];
var proxyType = localStorage.getItem('proxyType');

if (proxyType === 'uv') {
async function registerSW() {
  if (!navigator.serviceWorker) {
    if (
      location.protocol !== "https:" &&
      !swAllowedHostnames.includes(location.hostname)
    )
      throw new Error("Service workers cannot be registered without https.");

    throw new Error("Your browser doesn't support service workers.");
  }

  await navigator.serviceWorker.register(stockSW);

  let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
    await BareMux.SetTransport("EpxMod.EpoxyClient", { wisp: wispUrl });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await registerSW();
  } catch (err) {
    throw new Error(err)
  }
  let url = input.value.trim();
  if (!isUrl(url)) url = "https://www.google.com/search?q=" + url;
  else if (!(url.startsWith("https://") || url.startsWith("http://"))) url = "http://" + url;
  addHistory(url);
  localStorage.setItem("encodedUrl", __uv$config.encodeUrl(url));
  location.href = "/loader.html";
});
}
else if (proxyType === 'dyn') {
  console.log('Proxy Type: Dynamic\n\nUsing Bare server');
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      window.navigator.serviceWorker.register("/dysw.js", {
        scope: "/search/",
      })
    } catch (err) {
      throw new Error(err)
    }
    let url = input.value.trim();
    if (!isUrl(url)) url = "https://www.google.com/search?q=" + url;
    else if (!(url.startsWith("https://") || url.startsWith("http://"))) url = "http://" + url;
    addHistory(url);
    localStorage.setItem("encodedUrl", __uv$config.encodeUrl(url));
    location.href = '/search/route?url=' + url;
  });
}

function isUrl(val = "") {
  if (/^http(s?):\/\//.test(val) || (val.includes(".") && val.substr(0, 1) !== " ")) return true;
  return false;
}

function addHistory(input) {
  let history = localStorage.getItem('history');
  let historyArray = history ? JSON.parse(history) : [];
  historyArray.push(input);
  localStorage.setItem('history', JSON.stringify(historyArray));
}
let devToolsLoaded = 0;
const searchBar = document.querySelector(".input");
const frame = document.getElementById('siteurl');
searchBar.value = Ultraviolet.codec.xor.decode(localStorage.getItem('encodedUrl'));
const stockSW = "/sw.js";

lucide.createIcons();

searchBar.addEventListener("keydown", function () {
  if (event.key === 'Enter') {
    var inputUrl = searchBar.value.trim();
    if (/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(inputUrl)) {
        addHistory(inputUrl);
        document.getElementById('siteurl').src = '/service/' + Ultraviolet.codec.xor.encode(inputUrl);
    } else {
        addHistory(inputUrl.includes('.') ? 'https://' + inputUrl : 'https://www.google.com/search?q=' + encodeURIComponent(inputUrl));
        document.getElementById('siteurl').src = '/service/' + Ultraviolet.codec.xor.encode(inputUrl.includes('.') ? 'https://' + inputUrl : 'https://www.google.com/search?q=' + encodeURIComponent(inputUrl));
    }
}});

function checkForError() {
  if (document.getElementById('siteurl')) {
    try {
      var iframe = document.getElementById('siteurl');
      var iframeContent = iframe.contentDocument || iframe.contentWindow.document;
      if (iframeContent.body.innerText.includes('Ultraviolet v3.1.1')) {
        var link = iframeContent.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/daisyui@1.14.0/dist/full.css';
        iframeContent.head.appendChild(link);
        var style = iframeContent.createElement('style');
        style.textContent = `
          :root {
            --theme-primary: #F6AD55;
            --theme-secondary: #F6E9D7;
            --theme-accent: #FF6F61;
            --theme-base: #FFFAF0;
            --theme-neutral: #2D3748;
            --theme-base-100: #FFF9F5;
          }
          body {
            background-color: var(--theme-base);
          }
          .card {
            background-color: var(--theme-base-100);
            color: var(--theme-neutral);
          }
          .btn-primary {
            background-color: var(--theme-primary);
            color: #FFF;
          }
          .btn-ghost {
            background-color: var(--theme-accent);
            color: #FFF;
          }
        `;
        iframeContent.head.appendChild(style);

        var menuHTML = `
          <div class="card bg-neutral text-neutral-content w-96">
            <div class="card-body items-center text-center">
              <h2 class="card-title">Dang it!</h2>
              <p>Modal has encountered an error. Make sure your URL is valid and is reachable.</p>
            </div>
          </div>
        `;
        iframeContent.body.innerHTML = menuHTML;
      }
    } catch (e) {
      console.error("Error accessing iframe content: ", e);
    }
  } else {
    console.error("Iframe with id 'siteurl' not found.");
  }

  setTimeout(checkForError, 900);
}

checkForError();

setTimeout(function() {
  localStorage.setItem('encodedUrl', Ultraviolet.codec.xor.encode(document.getElementById('searchBar').value));
}, 60000);
// Save URL every 60 seconds

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

var proxyType = localStorage.getItem('proxyType');

if (!proxyType || proxyType === 'uv') {
  setTimeout(registerSW, 30000);
  // Prevents websocket disconnection
}

  function forward() {
    frame.contentWindow.history.go(1);
  }

  function back() {
    frame.contentWindow.history.go(-1);

    setTimeout(() => {
      const currentSrc = frame.contentWindow.location.pathname;
      if (currentSrc === '/loading.html') {
        forward();
      }
    }, 500);
  }

  function reload() {
    frame.contentWindow.location.reload();
  }


function eruda() {
  var siteIframe = document.getElementById('siteurl');
  if (siteIframe) {
    var innerDoc = siteIframe.contentDocument || siteIframe.contentWindow.document;
    var eruda = innerDoc.getElementById('eruda');

    if (!devToolsLoaded) {
      if (!eruda) {
        var erudaScript = document.createElement('script');
        erudaScript.src = "//cdn.jsdelivr.net/npm/eruda";
        erudaScript.onload = function() {
          var initScript = document.createElement('script');
          initScript.innerHTML = "eruda.init();eruda.show();";
          innerDoc.head.appendChild(initScript);
        };

        innerDoc.head.appendChild(erudaScript);
      }
    } else {
      if (eruda) {
        eruda.remove();
      }
    }
    devToolsLoaded = !devToolsLoaded;
  }
}

function decode(url) {
  if (url === 'about:blank') {
      return ''
  }
  
  var uvPrefix = localStorage.getItem("uvPrefix");

  const uvIndex = url.indexOf(uvPrefix);
  const encodedPart = uvIndex !== -1 ? url.substring(uvIndex + uvPrefix.length) : url;
  
  try {
      const decodedPart = Ultraviolet.codec.xor.decode(encodedPart);
      return decodedPart;
  } catch (error) {
      console.error('Error decoding the URL part:', error);
      return null;
  }
}

function updateSearch() {
  var url = decode(document.getElementById('siteurl').src);
  document.querySelector('.searchBar').value = url;
}

function startInterval() {
  let intervalId;

  function startLoop() {
    intervalId = setInterval(() => {
      searchBar.value = decode(document.getElementById("siteurl").contentWindow.location.href);
    }, 1000);
  }
  
  function stopLoop() {
    clearInterval(intervalId);
  }
  
  searchBar.addEventListener('focus', stopLoop);
  searchBar.addEventListener('blur', startLoop);

  startLoop();
}

function addHistory(input) {
  let history = localStorage.getItem('history');
  let historyArray = history ? JSON.parse(history) : [];
  historyArray.push(input);
  localStorage.setItem('history', JSON.stringify(historyArray));
}

function updateHistory() {
  addHistory(document.getElementById('searchBar').value);
}
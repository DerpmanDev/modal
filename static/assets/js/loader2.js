let devToolsLoaded = 0;
const searchBar = document.querySelector(".input");
const frame = document.getElementById('siteurl');
const loader = document.getElementById("loader")
searchBar.value = Ultraviolet.codec.xor.decode(localStorage.getItem('encodedUrl'));

lucide.createIcons();
frame.addEventListener("load", function () {
  loader.setAttribute("style", "z-index:-9999;opacity:0");
  frame.removeAttribute("style");
});

searchBar.addEventListener("keydown", function () {
  if (event.key === 'Enter') {
    var inputUrl = searchBar.value.trim();
    if (/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(inputUrl)) {
      frame.setAttribute("style", "opacity: 0")
      setTimeout(function () {
        loader.setAttribute("style", "z-index: 5;opacity:1");
      }, 200)
      try {
        frame.src = '/service/' + Ultraviolet.codec.xor.encode(inputUrl);
      } catch (e) {
        frame.src = "notsupported.html";
        loader.setAttribute("style", "z-index:-9999;opacity:0");
      }
      
    } else {
      frame.setAttribute("style", "opacity: 0");
      setTimeout(function () {
        loader.setAttribute("style", "z-index: 5;opacity:1");
      }, 200)
      try {
        frame.src = '/service/' + Ultraviolet.codec.xor.encode(inputUrl.includes('.') ? 'https://' + inputUrl : 'https://www.google.com/search?q=' + encodeURIComponent(inputUrl));
      } catch (e) {
        frame.src = "notsupported.html";
        loader.setAttribute("style", "z-index:-9999;opacity:0");
      }
     
    }
  }
});

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
  }, 100);
}

function reload() {
  frame.contentWindow.location.reload();
}

function eruda() {
  var siteIframe = frame;
  if (siteIframe) {
    var innerDoc = siteIframe.contentDocument || siteIframe.contentWindow.document;
    var eruda = innerDoc.getElementById('eruda');

    if (!devToolsLoaded) {
      if (!eruda) {
        var erudaScript = document.createElement('script');
        erudaScript.src = "//cdn.jsdelivr.net/npm/eruda";
        erudaScript.onload = function () {
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
  const decodedPart = url.split("/service/")[1];
  return decodedPart ? Ultraviolet.codec.xor.decode(decodedPart.replace(/\?/g, '=')) : null;
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
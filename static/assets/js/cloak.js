    if (localStorage.getItem('blanker') === 'on') {
      let inFrame;
      try {
        inFrame = window !== top;
      } catch (e) {
        inFrame = true;
      }
      if (!inFrame && !navigator.userAgent.includes("Firefox")) {
        const popup = open("about:blank", "_blank");
        if (!popup || popup.closed) {
          alert("Please allow popups and redirects for about:blank cloak to work.");
        } else {
          const doc = popup.document;
          const iframe = doc.createElement("iframe");
          const style = iframe.style;
          const link = doc.createElement("link");
          const icon = "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png";
          doc.title = 'My Drive - Google Drive';
          link.rel = "icon";
          link.href = icon;
          iframe.src = location.href;
          style.position = "fixed";
          style.top = style.bottom = style.left = style.right = 0;
          style.border = style.outline = "none";
          style.width = style.height = "100%";
          doc.head.appendChild(link);
          doc.body.appendChild(iframe);
          location.replace("https://classroom.google.com");
        }
      }
    }


    function checkCloak() {
        var title = localStorage.getItem('cloakTitle');
        var icon = localStorage.getItem('cloakIcon');
        
        if (title) {
          document.title = title;
        } else {
          document.title = 'Modal';
        }
        if (icon) {
          document.querySelector("link[rel~='icon']").href = icon;
        } else {
          document.querySelector("link[rel~='icon']").href = '/assets/img/favicon.png';
        }
      }

      checkCloak();
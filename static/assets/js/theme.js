var savedTheme = localStorage.getItem("selectedTheme");

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("selectedTheme", theme);
  }
  
  document.querySelectorAll(".theme-controller").forEach(function (element) {
    element.addEventListener("change", function () {
      applyTheme(this.value);
    });
  });
    
  if (savedTheme) {
    applyTheme(savedTheme);
    document.querySelector('.theme-controller[value="' + savedTheme + '"]',).checked = true;
  } else {
    applyTheme('sunset');
    document.querySelector('.theme-controller[value="' + "sunset" + '"]',).checked = true;
  }
  
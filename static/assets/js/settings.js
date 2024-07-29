var save = document.getElementById('saveBtn');


const proxy = localStorage.getItem('proxyType');

let checkBox;

if (!proxy || proxy === 'uv') {
  checkBox = 'uv';
} else if (proxy === 'dyn') {
  checkBox = 'dyn';
} else if (proxy === 'uvold') {
  checkBox = 'uvold';
}

if (checkBox) {
  const element = document.getElementById(checkBox);
  if (element) {
    element.setAttribute('checked', 'checked');
  }
}

if (localStorage.getItem('cloakTitle')) {
  document.getElementById('cloakTitle').value = localStorage.getItem('cloakTitle');
}
if (localStorage.getItem('cloakIcon')) {
  document.getElementById('cloakIcon').value = localStorage.getItem('cloakIcon');
}

save.addEventListener('click', function() {
  var cloakTitle = document.getElementById('cloakTitle');
  var cloakIcon = document.getElementById('cloakIcon');

    if (cloakTitle.value.trim() === '' && cloakIcon.value.trim() === '') {
      console.log('Using default site icon & title');
    } else {
      if (cloakTitle.value.trim() !== '') {
        localStorage.setItem('cloakTitle', cloakTitle.value.trim());
      }

      if (cloakIcon.value.trim() !== '') {
        var iconValue = cloakIcon.value.trim();

        if (!iconValue.startsWith('https://')) {
          iconValue = 'https://' + iconValue;
          localStorage.setItem('cloakIcon', iconValue);
        } else {
            localStorage.setItem('cloakIcon', cloakIcon.value.trim());
        }
      }
    }
    location.reload(true);
  });

document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('dropdown');
    const dropdownMenu = document.querySelector('.dropdown-content');
    
    if (dropdown.contains(event.target)) {
        // Toggle dropdown visibility when clicking the summary
        if (event.target.matches('summary')) {
            dropdownMenu.classList.toggle('hidden');
        }
    } else {
        // Hide dropdown if clicking outside
        dropdownMenu.classList.add('hidden');
    }
});

function cloak(cloak) {
    if (cloak === 'google') {
        localStorage.setItem('cloakTitle', 'Home');
        localStorage.setItem('cloakIcon', '/assets/img/classroom.png');        
    }
    if (cloak === 'drive') {
        localStorage.setItem('cloakTitle', 'My Drive - Google Drive');
        localStorage.setItem('cloakIcon', 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png');
    }
    if (cloak === 'schoology') {
        localStorage.setItem('cloakTitle', 'Home | Schoology');
        localStorage.setItem('cloakIcon', 'https://asset-cdn.schoology.com/sites/all/themes/schoology_theme/favicon.ico');
    }
    if (cloak === 'wikipedia') {
        localStorage.setItem('cloakTitle', 'Wikipedia');
        localStorage.setItem('cloakIcon', 'https://www.wikipedia.org/static/favicon/wikipedia.ico');
    }
}

function resetCloak() {
    localStorage.removeItem('cloakTitle');
    localStorage.removeItem('cloakIcon');

    document.title = 'Modal';
    document.querySelector("link[rel~='icon']").href = '/assets/img/favicon.ico';

    document.getElementById('cloakTitle').value = 'Modal';
    document.getElementById('cloakIcon').value = location.href + 'assets/img/favicon.ico';
}

function setProxy(type) {
  localStorage.setItem('proxyType', type);
}

const toggle = document.getElementById('toggleBlanker');

const blanker = localStorage.getItem('blanker');

if (blanker === 'on') {
  toggle.checked = true;
} else {
  toggle.checked = false;
}

toggle.addEventListener('change', () => {
  if (toggle.checked) {
    localStorage.setItem('blanker', 'on');
  } else {
    localStorage.setItem('blanker', 'off');
    toggle.ariaChecked = 'false';
  }
});
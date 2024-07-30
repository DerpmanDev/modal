const bookmarkForm = document.getElementById('bookmarkForm');
const bookmarksContainer = document.getElementById('bookmarks');
const searchBookmarks = document.getElementById('searchBookmarks');

function createBookmark() {
    const name = document.getElementById('name').value || "Website";
    const urlInput = document.getElementById('url');
    const url = urlInput.value;
    const iconInput = document.getElementById('icon');
    let icon = iconInput.value ||`${location.href}assets/img/bookmark.png`;
  
    if (!isValidUrl(url)) {
      event.preventDefault();
      urlInput.style.transition = '.2s';
      urlInput.style.borderColor = 'red';
      setTimeout(() => {
        urlInput.style.borderColor = '';
      }, 500);
      return;
    }
  
    if (!/^https?:\/\//i.test(icon)) {
      icon = 'https://' + icon;
    }
  
    const bookmark = { name, url, icon };
    addBookmark(bookmark);
    saveBookmark(bookmark);
    bookmarkForm.reset();
  }
  
  function isValidUrl(url) {
    const regex = /^(https?:\/\/)?([^\s$.?#].[^\s]*)$/i;
    return regex.test(url);
  }

  

function addBookmark({ name, url, icon }) {
  const bookmarkDiv = document.createElement('div');
  bookmarkDiv.className = 'bookmark bg-white p-4 rounded-lg shadow-md flex items-center';
  bookmarkDiv.onclick = () => window.open(location.href + '?go=' + url, '_blank');
  bookmarkDiv.dataset.name = name.toLowerCase();
  bookmarkDiv.dataset.url = url.toLowerCase();

  const img = document.createElement('img');
  img.src = icon;
  img.alt = name;
  img.style.borderRadius = '4px';

  const nameDiv = document.createElement('div');
  nameDiv.style.overflow = 'hidden';
  nameDiv.style.textOverflow = 'ellipsis';
  nameDiv.style.whiteSpace = 'nowrap';
  nameDiv.innerHTML = `<strong>${name}</strong><br><a href="${location.href}?go=${url}" target="_blank" class="text-blue-500">${url}</a>`;

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button ml-4';
  deleteButton.innerHTML = `<i data-lucide="trash-2" style="width:20px;margin-right:10px"></i>`;
  deleteButton.onclick = (event) => {
    event.stopPropagation();
    deleteBookmark(url);
    bookmarkDiv.remove();
  };

  bookmarkDiv.appendChild(img);
  bookmarkDiv.appendChild(nameDiv);
  bookmarkDiv.appendChild(deleteButton);

  // New bookmarks go on top
  bookmarksContainer.prepend(bookmarkDiv);
}

function saveBookmark(bookmark) {
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  bookmarks.push(bookmark);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  lucide.createIcons();
}

function deleteBookmark(url) {
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  bookmarks = bookmarks.filter(bookmark => bookmark.url !== url);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function loadBookmarks() {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  bookmarks.forEach(addBookmark);
}

function filterBookmarks(query) {
  const bookmarks = document.querySelectorAll('#bookmarks .bookmark');
  bookmarks.forEach(bookmark => {
    const name = bookmark.dataset.name;
    const url = bookmark.dataset.url;
    if (name.includes(query.toLowerCase()) || url.includes(query.toLowerCase())) {
      bookmark.style.display = '';
    } else {
      bookmark.style.display = 'none';
    }
  });
}

searchBookmarks.addEventListener('input', (event) => {
  filterBookmarks(event.target.value);
});

loadBookmarks();
lucide.createIcons();
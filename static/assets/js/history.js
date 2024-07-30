window.onload = function() {
    checkCloak();
    displayHistory(); // Display history on page load
    handleSearchInput(); // Set up search bar functionality
};

function loadAll() {
    let history = localStorage.getItem('history');
    let historyArray = history ? JSON.parse(history) : [];
    return historyArray;
}

function deleteHistoryItem(item) {
    let historyArray = loadAll();
    historyArray = historyArray.filter(historyItem => historyItem !== item);
    localStorage.setItem('history', JSON.stringify(historyArray));
    displayHistory(); // Refresh the display
}

function displayHistory(searchQuery = '') {
    let historyArray = loadAll();
    let historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '';

    if (historyArray.length < 1) {
        let message = document.createElement('ul');
        let messageText = document.createElement('p');
        message.className = 'menu bg-base-200 rounded-box w-700';
        message.style.width = '700px';
        message.style.minHeight = '200px';

        messageText.innerText = 'Browse the web to see history here!';
        messageText.style.fontSize = '19px';
        messageText.style.textAlign = 'center';
        messageText.style.margin = 'auto';
        historyDiv.appendChild(message);
        message.appendChild(messageText);
        return;
    }

    // Filter historyArray based on search query
    if (searchQuery) {
        historyArray = historyArray.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    let currentUrl = window.location.href.split('?')[0];

    // Reverse the historyArray to display the latest saved items first
    historyArray.reverse();

    // Create the <ul> element with the specified classes
    let ul = document.createElement('ul');
    ul.className = 'menu bg-base-200 rounded-box w-700';
    ul.style.width = '700px';

    historyArray.forEach(item => {
        let li = document.createElement('li');
        li.style.display = 'flex'; 
        li.style.alignItems = 'center'; 
        li.style.justifyContent = 'space-between'; 
        li.style.padding = '0.5em'; 

        let linkContainer = document.createElement('div');
        linkContainer.style.display = 'flex';
        linkContainer.style.alignItems = 'left';
        linkContainer.style.width = '670px';

        let link = document.createElement('a');
        link.href = `/?go=${item}`;
        link.target = '_blank';
        link.innerText = item;
        link.style.display = 'inline-block';
        link.style.textDecoration = 'none'; 
        link.style.color = 'inherit'; 
        link.style.whiteSpace = 'nowrap'; 
        link.style.overflow = 'hidden'; 
        link.style.textOverflow = 'ellipsis'; 
        link.style.flexGrow = '1';

        let deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-sm btn-ghost btn-circle';
        deleteButton.style.width = '30px';
        deleteButton.style.height = '30px';
        deleteButton.style.marginLeft = '8px';
        deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:20px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        `;
        deleteButton.onclick = function(event) {
            event.preventDefault(); 
            event.stopPropagation(); 
            deleteHistoryItem(item);
        };

        linkContainer.appendChild(link);
        linkContainer.appendChild(deleteButton);
        li.appendChild(linkContainer);
        ul.appendChild(li);
    });

    historyDiv.appendChild(ul);
}

function handleSearchInput() {
    let searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', function() {
        let searchQuery = searchBar.value;
        displayHistory(searchQuery);
    });
}

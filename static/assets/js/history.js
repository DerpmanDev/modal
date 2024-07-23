function getQueryParam(param) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function loadAll() {
    let history = localStorage.getItem('history');
    let historyArray = history ? JSON.parse(history) : [];
    return historyArray;
}

function deleteHistoryItem(item) {
    let historyArray = loadAll();
    historyArray = historyArray.filter(historyItem => historyItem !== item);
    localStorage.setItem('history', JSON.stringify(historyArray));
    displayHistory(); // refresh history
}

function displayHistory() {
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
        messageText.style.fontSize = '21px';
        messageText.style.textAlign = 'center';
        messageText.style.margin = 'auto';
        historyDiv.appendChild(message);
        message.appendChild(messageText);
        return;
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
        li.style.display = 'flex'; // Use flexbox for horizontal alignment
        li.style.alignItems = 'center'; // Center the items vertically
        li.style.justifyContent = 'space-between'; // Space between link and button
        li.style.padding = '0.5em'; // Optional: add some padding for better spacing

        let linkContainer = document.createElement('div');
        linkContainer.style.display = 'flex';
        linkContainer.style.alignItems = 'left';
        linkContainer.style.width = '670px';

        let link = document.createElement('a');
        link.href = `${currentUrl}?go=${item}`;
        link.target = '_blank';
        link.innerText = item;
        link.style.display = 'inline-block';
        link.style.textDecoration = 'none'; // Optional: remove underline
        link.style.color = 'inherit'; // Optional: inherit text color
        link.style.whiteSpace = 'nowrap'; // Ensure the text does not wrap
        link.style.overflow = 'hidden'; // Hide the overflow text
        link.style.textOverflow = 'ellipsis'; // Add "..." at the end of overflow text
        link.style.flexGrow = '1';

        // Create the delete button
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
            event.preventDefault(); // Prevent the link from being followed
            event.stopPropagation(); // Stop the click event from propagating
            deleteHistoryItem(item);
        };

        linkContainer.appendChild(link);
        linkContainer.appendChild(deleteButton);
        li.appendChild(linkContainer);
        ul.appendChild(li);
    });

    // Append the <ul> element to the historyDiv
    historyDiv.appendChild(ul);
}

window.onload = function() {
    displayHistory();

    let goParam = getQueryParam('go');
    if (goParam) {
        localStorage.setItem("encodedUrl", __uv$config.encodeUrl(goParam));
        location.href = '/loader.html';
    }
};

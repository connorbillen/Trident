// Instantiate socket to locally hosted web application backend
var socket = io();

// element selectors
var contentArea     = document.getElementById('content');
var search          = document.getElementById('search');

// various HMTL DOM element actions
search.onkeypress = function searchOnEnter(event) { 
    if (event.keyCode != 13)
        return;
    
    var dropdown    = document.getElementById("search-type");
    var type        = dropdown.options[dropdown.selectedIndex].value;

    socket.emit('query', { 'cmd': 'search', 'options': { 'type': type, 'data': search.value } });
}

function expand(e) {
    console.log(e.children);
}

function download(type, url, title) {
    socket.emit('query', { 'cmd': 'download', 'options': { 'type': type, 'data': { 'id': url, 'title': title } } });
}

// Socket event handlers
socket.on('response', function(html) {
    if (html)
        contentArea.innerHTML = html;
});

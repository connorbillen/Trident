// Instantiate socket to locally hosted web application backend
var socket = io();

// element selectors
var contentArea     = document.getElementById('content');
var search          = document.getElementById('search');
var tabs            = document.getElementsByClassName('header-tab');

// various HMTL DOM element actions
for (var i = 0; i < tabs.length; i++) {
    tabs[i].onclick = function changeType(event) {
        for (var i = 0; i < tabs.length; i++)
            tabs[i].className = 'header-tab';
        
        event.target.className = 'header-tab is-active'; 
    };
};

search.onkeypress = function searchOnEnter(event) { 
    if (event.keyCode != 13)
        return;
    
    var type = document.getElementsByClassName('header-tab is-active')[0].innerText;

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

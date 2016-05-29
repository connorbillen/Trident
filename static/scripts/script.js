// Instantiate socket to locally hosted web application backend
var socket = io();

// element selectors
var contentArea     = document.getElementById('content');
var search          = document.getElementById('search');
var refresh         = document.getElementById('refresh');
var tabs            = document.getElementsByClassName('header-tab');

function changeType(event) {
    for (var i = 0; i < tabs.length; i++)
        tabs[i].className = 'header-tab';
    
    event.target.className = 'header-tab is-active';

    //socket.emit('list', event.target.innerText);
    socket.emit('view', event.target.innerText);
}

// various HMTL DOM element actions
for (var i = 0; i < tabs.length; i++) {
    tabs[i].onclick = changeType;
}

search.onkeypress = function searchOnEnter(event) { 
    if (event.keyCode != 13)
        return;
    
    var type = document.getElementsByClassName('header-tab is-active')[0].innerText;

    socket.emit('query', { 'cmd': 'search', 'options': { 'type': type, 'data': search.value } });
};

refresh.onclick = function refreshDB(event) {
    var type = document.getElementsByClassName('header-tab is-active')[0].innerText;

    console.log('REFRESHING: ' + type);

    socket.emit('list', type);
};

function expand(e) {
    console.log(e.children);
}

function download(type, url, title) {
    socket.emit('query', { 'cmd': 'download', 'options': { 'type': type, 'data': { 'id': url, 'title': title } } });
}

function play(type, path) {
    socket.emit('play', { 'type': type, 'path': path }); 
}

// Socket event handlers
socket.on('response', function(html) {
    if (html)
        contentArea.innerHTML = html;
});

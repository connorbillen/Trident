// Instantiate socket to locally hosted web application backend
var socket = io();

// element selectors
var searchButton = document.getElementById('search');

// various HMTL DOM element actions
searchButton.onclick = function searchButton() {
    console.log('clicked');
    socket.emit('searchForMovie', 'Avengers');
}

//function called when a searchForMovie update is received -- render the results
socket.on('searchForMovie', function (data) {
    data = JSON.parse(data);
    console.log(data);
});

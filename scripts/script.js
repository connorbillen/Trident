// Instantiate socket to locally hosted web application backend
var socket = io();

// element selectors
var contentArea     = document.getElementById('content');
var search          = document.getElementById('search');
// various HMTL DOM element actions
search.onkeypress = function searchOnEnter(event) { if (event.keyCode == 13) socket.emit('searchForMovie', encodeURI(search.value)); } 

function addMovie(title, imdb) {
    socket.emit('addMovie', { 'title': title, 'identifier': imdb });
}

socket.on('addMovie', function(data) {
    console.log(data);
});

//function called when a searchForMovie update is received -- render the results
socket.on('searchForMovie', function (data) {
    var html = '';
        data = JSON.parse(data);

    console.log(data);

    data.movies.forEach(function procesMovies(movie) {
        var poster = movie.images.poster[movie.images.poster.length - 1];
        
        html += '<div class="movie">';
        html += '<div class="poster-container"><img class="poster" src="' 
             + (poster ? poster : "http://placehold.it/178x250")
             + '" alt="Movie Poster"></div>';
        html += '<div class="information-container">';
        html += '<div class="information-header">';
        html += '<span id="title" class="title">' + movie.original_title + '</span>';
        html += '<span class="rating">' + (movie.mpaa ? movie.mpaa : 'Not Rated')  + '</span>';
        html += '</div>';
        html += '<div class="information-body">';
        html += '<span class="description">' + (movie.plot ? movie.plot : 'No description available.') + '</span>';
        html += '<span class="date">Released<br>' + (movie.year ? movie.year : 'Release year unkown') + '</span>';
        html += '<span class="actors">Actors<ul>';
        movie.actors.forEach(function (actor) {
            html += '<li class="actor">' + actor + '</li>';
        });
        html += '</ul></span>';
        html += '<span class="download" onclick="addMovie(\'' + movie.original_title + '\', \'' + movie.imdb  + '\'); ">Download</span>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
    });

    contentArea.innerHTML = html;
});

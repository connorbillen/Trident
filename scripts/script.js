// Instantiate socket to locally hosted web application backend
var socket = io();

// element selectors
var contentArea     = document.getElementById('content');
var searchButton    = document.getElementById('search');

// various HMTL DOM element actions
searchButton.onclick = function searchButton() {
    console.log('clicked');
    socket.emit('searchForMovie', 'Avengers');
}

//function called when a searchForMovie update is received -- render the results
socket.on('searchForMovie', function (data) {
    var html = '';
        data = JSON.parse(data);

    console.log(data);

    data.movies.forEach(function procesMovies(movie) {
        html += '<div class="movie">';
        html += '<div class="poster-container"><img class="poster" src="' 
             + movie.images.poster[movie.images.poster.length - 1] 
             + '" alt="Movie Poster"></div>';
        html += '<div class="information-container">';
        html += '<div class="information-header">';
        html += '<span class="title">' + movie.original_title + '</span>';
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
        html += '</div>';
        html += '</div>';
        html += '</div>';
    });

    contentArea.innerHTML = html;
});

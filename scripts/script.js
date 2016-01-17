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

    socket.emit('searchFor' + type, encodeURI(search.value)); 
}


// Utility socket emitters and sensors
// Movie functions
function addMovie(title, imdb) {
    socket.emit('addMovie', { 'title': title, 'identifier': imdb });
}

socket.on('addMovie', function(data) {
    console.log(data);
});

// Music functions
function addAlbum(guid) {
    socket.emit('addAlbum', guid);
}

socket.on('addAlbum', function(album) {
    console.log(album);
});

function addArtist(guid) {
    socket.emit('addArtist', guid);
}

socket.on('addArtist', function(artist) {
    var html    = '';
        artist  = JSON.parse(artist);    

    html += '<div id="artist-info">';
    artist.albums.forEach(function renderAlbums(album) { 
        html += '<div class="music">';
        html += '<span class="album-name">' + album.AlbumTitle + '</span>';
        html += '<div class="add-album" onclick="addAlbum(\'' + album.AlbumID  + '\'); ">Download Album</div>';
        html += '</div>';
    });
    
    html += '</div>';

    contentArea.innerHTML = html;
});

// Socket emitters and sensors for search functions
socket.on('searchForTVShow', function (data) {
    var html = '';
        data = JSON.parse(data);
    console.log(data)

    contentArea.innerHTML = html;
});

socket.on('searchForMusic', function (data) {
    var html = '';
        data = JSON.parse(data);

    for (var artist in data) {
        html += '<div class="music">';
        html += '<div onclick="addArtist(\'' + data[artist].id + '\'); " class="artist-name">' + data[artist].uniquename + '</div>';
        html += '</div>';
    }

    contentArea.innerHTML = html;
});

socket.on('searchForMovie', function (data) {
    var html = '';
        data = JSON.parse(data);

    data.movies.forEach(function processMovies(movie) {
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

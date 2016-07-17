// This is the test js script for minification and lint
'use strict';

// External modules
var request = require('request');
var SearchModel = require('./models/SearchModel');
var TorrentModel = require('./models/TorrentModel');

/* Attach DOM elements to Javascript variables */
var body = document.getElementById('app');
var contentContainer = document.getElementById('contentContainer');
var contentArea = document.getElementById('contentArea');
var resultsArea = document.getElementById('resultsArea');
var search = document.getElementById('search');
var types = document.getElementsByClassName('type-nav');
/* End attaching elements to variables */

function setMaxBodyHeight(event) {
  contentContainer.style.maxHeight = window.innerHeight - 72 + 'px';
  contentArea.style.maxHeight = window.innerHeight - 72 + 'px';
}

function searchOnEnter(event) {
  if (event.keyCode !== 13)
    return;

  contentArea.className = 'container has-text-centered';
  contentArea.innerHTML = '';

  var searching = document.createElement('div');
  searching.innerText = 'Searching...';
  contentArea.appendChild(searching);

  var type = document.getElementById('active-type').text;
  var request = new XMLHttpRequest();
  request.open('POST', 'http://localhost:3000/search', true);
  request.setRequestHeader('Content-Type', 'application/json');

  request.onload = handleSearchResults.bind(request, type);
  request.onerror = handleSearchError.bind(request);

  request.send(JSON.stringify({ 'type': type, 'query': search.value }));
}

function setActiveType(event) {
  document.getElementById('active-type').id = '';
  event.target.id = 'active-type';
}

function handleSearchResults(type) {
  if (this.status >= 200 && this.status < 400) {
    parseResults(type, JSON.parse(this.response));
  } else {
    console.log('error: ' + JSON.stringify(this));
  }
}

function handleSearchError() {
  console.log('error: ' + JSON.stringify(this));
}

function parseResults(type, results) {
  contentArea.className = 'container has-text-centered columns is-multiline';
  contentArea.innerHTML = '';
  var searchResults = [];
  var torrents = [];

  console.log('type', type);

  for (var index in results) {
    let result = results[index];

    console.log(result);

    if (type === 'Music') {
      // Parse out torrents and create appropriate associations in information
      result.torrents.forEach( (torrent) => {
        torrents.push(new TorrentModel({
          size: 0,
          format: torrent.format,
          media: torrent.media,
          torrent_id: torrent.id
        }));
      });

      // Create the representative search models
      searchResults.push(new SearchModel({
        title: result.name,
        image: result.image,
        artist: result.artist,
        torrents: torrents,
        template: 'AlbumResult',
        el: contentArea
      }));

      // Render each model
      searchResults[searchResults.length - 1].render();
    } else if (type == 'Movies') {
      // Parse out torrents and create appropriate associations in information
      result.torrents.forEach( (torrent) => {

      });

      searchResults.push(new SearchModel({
        title: result.title,
        image: result.poster,
        torrents: torrents,
        template: 'MovieResult',
        el: contentArea
      }));

      searchResults[searchResults.length - 1].render();
    } else if (type == 'TV Shows') {
      searchResults.push(new SearchModel({
        image: 'https://' + result.Poster,
        torrents: torrents,
        template: 'TVShowResult',
        el: contentArea
      }));

      searchResults[searchResults.length - 1].render();
    }
  }

  console.log(searchResults);
}

/* Attach necessary javascript events to DOM elements */
document.addEventListener('DOMContentLoaded', function() { setMaxBodyHeight(); });
window.onresize = setMaxBodyHeight;
search.onkeypress = searchOnEnter;

for (let i = 0; i < types.length; i++) {
  types[i].onclick = setActiveType;
}
/* End attaching javscript events to DOM elements */

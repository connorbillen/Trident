// General settings to be used by Trident
// The finished download paths
exports.moviespath  = '';
exports.tvpath      = '';
exports.musicpath   = '';

// Set which source is being used for which category of media
exports.tvshows = 'BroadcasTheNet';
exports.music   = 'WhatCD';
exports.movies  = 'PassThePopcorn';

// Settings that are used for various Trident info fetching; these don't 
// need to be changed, but should be
// Movie stuff
exports.discogs = {
    token   : 'jahFHCcNxAKokqaIJHgwlbcwqbKtlLyaWyeYwXvb',
    host    : 'https://api.discogs.com/database/search?',
    port    : 443
};

// TV stuff
exports.tvdb = {
    host        : 'https://api-beta.thetvdb.com',
    path        : '/',
    key         : '90B742B7D662649C'
};

// Options for each module that is used for obtaining files
// BroadcasTheNet
exports.BroadcasTheNet = {
    key         : '',
    host        : 'http://api.btnapps.net',
    path        : '/',
    port        : 80,
    resolutions : ['720p', '1080p'],
    sources     : ['WEB', 'Bluray', 'BRRip', 'HDTV', 'TVRip'],
    watch_dir   : ''
};

// WhatCD
exports.WhatCD = {
    username    : '',
    password    : '',
    key         : '', 
    auth        : '',
    host        : 'https://what.cd',
    path        : '/',
    port        : 443, 
    formats     : ['FLAC'],
    sources     : ['WEB', 'CD'],
    watch_dir   : ''
};

// PassThePopcorn
exports.PassThePopcorn = {
    username    : '',
    password    : '',
    key         : '', 
    auth        : '',
    host        : 'https://tls.passthepopcorn.me',
    path        : '/',
    port        : 443, 
    resolutions : ['1080p', '720p'],
    sources     : ['Blu-ray', 'DVD'],
    watch_dir   : ''
};

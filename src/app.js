// Libraries
var nio = require('niojs');

// Visualization
var gauge = require('./gauge');

// Initialize Sources
var source = nio.source.socketio(
  'http://brand.nioinstances.com',
  ['count_by_network'],
  60
);

// Intermediary Sources
var sources = {
  twitter: source
    .pipe(nio.is('type', 'twitter'))
    .pipe(nio.get('count_per_sec')),
  instagram: source
    .pipe(nio.is('type', 'instagram'))
    .pipe(nio.get('count_per_sec'))
};

var size = 150;

// Create Gauges
var twitterGauge = gauge({
  sel: '#twitter-gauge',
  width: size, height: size,
  thickness: size/6, emptyThickness: size/10
});

var instagramGauge = gauge({
  sel: '#instagram-gauge',
  width: size, height: size,
  thickness: size/6, emptyThickness: size/10
});

// Wire stream into renderer
sources.twitter.pipe(nio.func(twitterGauge));
sources.instagram.pipe(nio.func(instagramGauge));

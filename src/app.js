// Libraries
var nio = require('niojs');

// View Models
var historicalVM = require('./historical-vm');

// Visualization
var gauge = require('./gauge');
var spark = require('./spark');

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

// Create Historical Sparklines
var twitterSpark = spark({
  sel:'#twitter-spark',
  height: size/6,
  width: size
});

var instagramSpark = spark({
  sel:'#instagram-spark',
  height: size/6,
  width: size
});

// Wire stream into renderer
sources.twitter.pipe(historicalVM()).pipe(nio.func(twitterSpark));
sources.instagram.pipe(historicalVM()).pipe(nio.func(instagramSpark));

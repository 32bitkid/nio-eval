// Libraries
var nio = require('niojs');

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

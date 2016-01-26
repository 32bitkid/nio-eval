// Libraries
var nio = require('niojs');

// Initialize Sources
var source = nio.source.socketio(
  'http://brand.nioinstances.com',
  ['count_by_network'],
  60
);
